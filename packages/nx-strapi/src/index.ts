import { CreateNodesV2, CreateNodesContextV2, createNodesFromFiles, CreateNodesResult } from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile } from "@nx/devkit";
import { getPackageManagerCommand } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readFileSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";

const pmc = getPackageManagerCommand();

export interface StrapiPluginOptions {
  buildTargetName?: string;
  startTargetName?: string;
  developTargetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: StrapiPluginOptions | undefined) {
  options ??= {};
  options.buildTargetName ??= "strapi-build";
  options.startTargetName ??= "strapi-start";
  options.developTargetName ??= "strapi-develop";
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<StrapiPluginOptions> = [
  "**/package.json",
  async (configFiles, opts, context) => {
    const options = normalizeOptions(opts);
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-cdk-${optionsHash}.hash`);
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
  options: StrapiPluginOptions,
  context: CreateNodesContextV2,
  targetsCache: Record<string, Record<string, TargetConfiguration>>,
): Promise<CreateNodesResult> {
  const projectRoot = dirname(configFilePath);
  options = normalizeOptions(options);

  const packageJson = JSON.parse(readFileSync(configFilePath, "utf-8"));
  if (!packageJson.strapi?.uuid) {
    return {};
  }

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
  options: StrapiPluginOptions,
  context: CreateNodesContextV2,
) {
  const configOutputs = getOutputs(context.workspaceRoot, projectRoot, configPath);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.buildTargetName) {
    targets[options.buildTargetName] = buildTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.startTargetName) {
    targets[options.startTargetName] = startTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.developTargetName) {
    targets[options.developTargetName] = developTarget(options, namedInputs, configOutputs, projectRoot);
  }

  return targets;
}

function buildTarget(
  options: StrapiPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `strapi build`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["strapi"],
      help: {
        command: `${pmc.exec} strapi build --help`,
        example: {
          options: {
            strict: true,
          },
        },
      },
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["@strapi/strapi"],
      },
    ],
    outputs,
  };
}

function developTarget(
  options: StrapiPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `strapi develop`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["strapi"],
      help: {
        command: `${pmc.exec} strapi develop --help`,
        example: {
          options: {
            debug: true,
          },
        },
      },
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["@strapi/strapi"],
      },
    ],
    outputs,
  };
}

function startTarget(
  options: StrapiPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `strapi start`,
    cache: false,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["@strapi/strapi"],
      },
    ],
    outputs,
  };
}

function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  return [join("{projectRoot}", "dist"), join("{projectRoot}", ".strapi")];
}
