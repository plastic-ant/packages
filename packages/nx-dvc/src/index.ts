import { CreateNodesV2, CreateNodesContextV2, createNodesFromFiles, CreateNodesResult } from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readdirSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";

export interface DVCPluginOptions {
  reproTargetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: DVCPluginOptions | undefined) {
  options ??= {};
  options.reproTargetName ??= "dvc-repro";
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<DVCPluginOptions> = [
  "**/dvc.yaml",
  async (configFiles, opts, context) => {
    const options = normalizeOptions(opts);
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-msbuild-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        (configFile, options, context) =>
          createNodesInternal(configFile, normalizeOptions(options), context, targetsCache),
        configFiles,
        options,
        context,
      );
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

async function createNodesInternal(
  configFilePath: string,
  options: DVCPluginOptions,
  context: CreateNodesContextV2,
  targetsCache: Record<string, Record<string, TargetConfiguration>>,
): Promise<CreateNodesResult> {
  const projectRoot = dirname(configFilePath);
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));

  if (!siblingFiles.includes("package.json") && !siblingFiles.includes("project.json")) {
    return {};
  }

  options = normalizeOptions(options);

  const hash = await calculateHashForCreateNodes(projectRoot, options, context);
  targetsCache[hash] ??= buildTargets(configFilePath, projectRoot, options, context);

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

function buildTargets(
  configPath: string,
  projectRoot: string,
  options: DVCPluginOptions,
  context: CreateNodesContextV2,
) {
  const configOutputs = getOutputs(context.workspaceRoot, projectRoot, configPath);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.reproTargetName) {
    targets[options.reproTargetName] = buildTarget(options, namedInputs, configOutputs, projectRoot);
  }

  return targets;
}

function buildTarget(
  options: DVCPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `dvc repro`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"])],
    outputs,
  };
}

function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  // const cdkConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  //const outputs: string[] = [];
  return []; //outputs.concat([join("{projectRoot}", cdkConfig.output ?? "cdk.out")]);
}
