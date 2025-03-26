import {
  CreateNodesV2,
  CreateNodesContext,
  createNodesFromFiles,
  getPackageManagerCommand,
  CreateNodesResult,
} from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";
import { createConfigLoader } from "@react-router/dev/config";

const pmc = getPackageManagerCommand();

export interface ReactRouterPluginOptions {
  buildTargetName?: string;
  startTargetName?: string;
  devTargetName?: string;
  typegenTargetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: ReactRouterPluginOptions | undefined) {
  options ??= {};
  options.buildTargetName ??= "rr-build";
  options.devTargetName ??= "rr-dev";
  options.startTargetName ??= "rr-start";
  options.typegenTargetName ??= "rr-typegen";
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<ReactRouterPluginOptions> = [
  "**/react-router.config.ts",
  async (configFiles, opts, context) => {
    const options = normalizeOptions(opts);
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-react-router-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        (configFile, options, context) =>
          createNodesInternal(configFile, normalizeOptions(options), context, targetsCache),
        configFiles,
        options,
        context
      );
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

async function createNodesInternal(
  configFilePath: string,
  options: ReactRouterPluginOptions,
  context: CreateNodesContext,
  targetsCache: Record<string, Record<string, TargetConfiguration>>
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
  options: ReactRouterPluginOptions,
  context: CreateNodesContext
) {
  const configOutputs = await getOutputs(context.workspaceRoot, projectRoot, configPath);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.buildTargetName) {
    targets[options.buildTargetName] = buildTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.typegenTargetName) {
    targets[options.typegenTargetName] = typegenTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.devTargetName) {
    targets[options.devTargetName] = devTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.startTargetName) {
    targets[options.startTargetName] = startTarget(options, namedInputs, configOutputs, projectRoot);
  }

  //   if (options.devTargetName) {
  //     targets[options.devTargetName] = devTarget(options, namedInputs, configOutputs, projectRoot);
  //   }

  //   if (options.bootstrapTargetName) {
  //     targets[options.bootstrapTargetName] = bootstrapTarget(options, namedInputs, configOutputs, projectRoot);
  //   }

  return targets;
}

function startTarget(
  options: ReactRouterPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): TargetConfiguration {
  return {
    command: `react-router start`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["react-router"],
      help: {
        command: `${pmc.exec} react-router --help`,
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
        externalDependencies: ["react-router"],
      },
    ],
    outputs,
  };
}

function devTarget(
  options: ReactRouterPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): TargetConfiguration {
  return {
    command: `react-router dev`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["react-router"],
      help: {
        command: `${pmc.exec} react-router --help`,
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
        externalDependencies: ["react-router"],
      },
    ],
    outputs,
  };
}

function typegenTarget(
  options: ReactRouterPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): TargetConfiguration {
  return {
    command: `react-router typegen`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["react-router"],
      help: {
        command: `${pmc.exec} react-router --help`,
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
        externalDependencies: ["react-router"],
      },
    ],
    outputs,
  };
}

function buildTarget(
  options: ReactRouterPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): TargetConfiguration {
  return {
    command: `react-router build`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    //dependsOn: options.typeCheckTargetName ? [options.typeCheckTargetName] : [],
    metadata: {
      technologies: ["react-router"],
      help: {
        command: `${pmc.exec} react-router --help`,
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
        externalDependencies: ["react-router"],
      },
    ],
    outputs,
  };
}

async function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  //const cdkConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  const outputs: string[] = [];

  const loader = await createConfigLoader();

  return outputs.concat([join("{projectRoot}", ".react-router")]);
}
