import { CreateNodes, CreateNodesV2, CreateNodesContext, createNodesFromFiles } from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile, logger } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";

export interface MSBuildPluginOptions {
  msbuildPath?: string;
  targetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: MSBuildPluginOptions | undefined) {
  options ??= {};
  options.targetName ??= "msbuild";
  options.msbuildPath ??= `"C:/Program Files (x86)/Microsoft Visual Studio/2022/BuildTools/MSBuild/Current/Bin/MSBuild.exe"`;
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<MSBuildPluginOptions> = [
  "**/*.{vcxproj,sln}",
  async (configFiles, options, context) => {
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-msbuild-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        (configFile, options, context) => createNodesInternal(configFile, options, context, targetsCache),
        configFiles,
        options,
        context
      );
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

export const createNodes: CreateNodes<MSBuildPluginOptions> = [
  "**/*.{vcxproj,sln}",
  (...args) => {
    logger.warn(
      "`createNodes` is deprecated. Update your plugin to utilize createNodesV2 instead. In Nx 20, this will change to the createNodesV2 API."
    );
    return createNodesInternal(...args, {});
  },
];

async function createNodesInternal(configFilePath, options, context, targetsCache) {
  const projectRoot = dirname(configFilePath);
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));

  if (!siblingFiles.includes("package.json") && !siblingFiles.includes("project.json")) {
    return {};
  }

  options = normalizeOptions(options);

  const hash = await calculateHashForCreateNodes(projectRoot, options, context);
  targetsCache[hash] ??= buildTargets(configFilePath, projectRoot, options, context);

  const { targets, metadata } = targetsCache[hash];

  return {
    projects: {
      [projectRoot]: {
        root: projectRoot,
        targets,
        metadata,
      },
    },
  };
}

function buildTargets(
  configPath: string,
  projectRoot: string,
  options: MSBuildPluginOptions,
  context: CreateNodesContext
) {
  const configOutputs = getOutputs(context.workspaceRoot, projectRoot, configPath);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.targetName) {
    targets[options.targetName] = buildTarget(options, namedInputs, configOutputs, projectRoot);
  }

  return { targets };
}

function buildTarget(
  options: MSBuildPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): TargetConfiguration {
  return {
    command: options.msbuildPath,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["msbuild"],
      help: {
        command: `msbuild --help`,
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
        externalDependencies: ["msbuild"],
      },
    ],
    outputs,
  };
}

function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  // const cdkConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  //const outputs: string[] = [];
  return []; //outputs.concat([join("{projectRoot}", cdkConfig.output ?? "cdk.out")]);
}
