import {
  CreateNodesV2,
  CreateNodesContext,
  createNodesFromFiles,
  getPackageManagerCommand,
  CreateNodesResult,
} from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs.js";
import { existsSync, readdirSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes.js";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory.js";
import { InputDefinition } from "nx/src/config/workspace-json-project-json.js";
import { hashObject } from "nx/src/hasher/file-hasher.js";
import { pathToFileURL } from "node:url";
import { AssetPackConfig } from "@assetpack/core";

const pmc = getPackageManagerCommand();

export interface AssetPackPluginOptions {
  targetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: AssetPackPluginOptions | undefined) {
  options ??= {};
  options.targetName ??= "assetpack";
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<AssetPackPluginOptions> = [
  "**/.assetpack.js",
  async (configFiles, opts, context) => {
    const options = normalizeOptions(opts);
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-pixi-asset-pack-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        (configFile, options, context) =>
          createNodesInternal(configFile, normalizeOptions(options), context, targetsCache),
        configFiles,
        options,
        context,
      );
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

async function createNodesInternal(
  configFilePath: string,
  options: AssetPackPluginOptions,
  context: CreateNodesContext,
  targetsCache: Record<string, Record<string, TargetConfiguration>>,
): Promise<CreateNodesResult> {
  const projectRoot = dirname(configFilePath);
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));

  if (!siblingFiles.includes("package.json") && !siblingFiles.includes("project.json")) {
    return {};
  }

  const hash = await calculateHashForCreateNodes(projectRoot, options, context);
  targetsCache[hash] ??= await buildTargets(configFilePath, projectRoot, options, context);

  const targets = targetsCache[hash];

  return {
    projects: {
      [projectRoot]: {
        root: projectRoot,
        targets,
      },
    },
  };
}

async function buildTargets(
  configPath: string,
  projectRoot: string,
  options: AssetPackPluginOptions,
  context: CreateNodesContext,
) {
  const configOutputs = await getOutputs(context.workspaceRoot, projectRoot, configPath);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.targetName) {
    targets[options.targetName] = target(options, namedInputs, configOutputs, projectRoot);
  }

  return targets;
}

function target(
  options: AssetPackPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `${pmc.exec} assetpack`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["@assetpack/core"],
      },
    ],
    outputs,
  };
}

let importFresh: typeof import("import-fresh");

export const loadJsSync = function loadJsSync(filepath: string) {
  if (importFresh === undefined) {
    importFresh = require("import-fresh");
  }

  return importFresh(filepath);
};

export const loadJs = async function loadJs(filepath: string) {
  try {
    const { href } = pathToFileURL(filepath);
    return (await import(href)).default;
  } catch (error) {
    try {
      return loadJsSync(filepath);
    } catch (requireError: any) {
      if (
        requireError.code === "ERR_REQUIRE_ESM" ||
        (requireError instanceof SyntaxError &&
          requireError.toString().includes("Cannot use import statement outside a module"))
      ) {
        throw error;
      }

      throw requireError;
    }
  }
};

async function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  //const config = (await import(resolve(configPath))).default;
  const config = (await loadJs(configPath)) as AssetPackConfig;
  return [config.output ?? "{projectRoot}/public", config.cacheLocation ?? "{projectRoot}/.assetpack"];
}
