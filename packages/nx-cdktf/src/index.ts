import { CreateNodesResult, getPackageManagerCommand } from "@nx/devkit";
import { CreateNodes, CreateNodesV2, CreateNodesContext, createNodesFromFiles } from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile, logger } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";

const pmc = getPackageManagerCommand();

export interface CdktfPluginOptions {
  synthTargetName?: string;
  deployTargetName?: string;
  getTargetName?: string;
  bootstrapTargetName?: string;
}

function normalizeOptions(options: CdktfPluginOptions | undefined) {
  options ??= {};
  options.synthTargetName ??= "cdktf-synth";
  options.deployTargetName ??= "cdktf-deploy";
  options.getTargetName ??= "cdktf-get";
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Record<string, TargetConfiguration<CdktfPluginOptions>>> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(
  cachePath: string,
  targetsCache: Record<string, Record<string, TargetConfiguration<CdktfPluginOptions>>>
) {
  const oldCache = readTargetsCache(cachePath);
  writeJsonFile(cachePath, {
    ...oldCache,
    targetsCache,
  });
}

export const createNodesV2: CreateNodesV2<CdktfPluginOptions> = [
  "**/cdktf.json",
  async (configFiles, options, context) => {
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-cdktf-${optionsHash}.hash`);
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

export const createNodes: CreateNodes<CdktfPluginOptions> = [
  "**/cdktf.json",
  async (configFilePath, options, context) => {
    logger.warn(
      "`createNodes` is deprecated. Update your plugin to utilize createNodesV2 instead. In Nx 20, this will change to the createNodesV2 API."
    );

    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `expo-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    return createNodesInternal(configFilePath, options, context, targetsCache);
  },
];

async function createNodesInternal(
  configFilePath: string,
  options: CdktfPluginOptions,
  context: CreateNodesContext,
  targetsCache: Record<string, Record<string, TargetConfiguration<CdktfPluginOptions>>>
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
        targets,
      },
    },
  };
}

function buildTargets(
  configPath: string,
  projectRoot: string,
  options: CdktfPluginOptions,
  context: CreateNodesContext
) {
  //const absoluteConfigFilePath = joinPathFragments(context.workspaceRoot, configFilePath);

  const configOutputs = getOutputs(context.workspaceRoot, projectRoot, configPath);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.synthTargetName) {
    targets[options.synthTargetName] = synthTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.deployTargetName) {
    targets[options.deployTargetName] = deployTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.getTargetName) {
    targets[options.getTargetName] = getTarget(options, namedInputs, projectRoot);
  }

  return targets;
}

function synthTarget(
  options: CdktfPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): TargetConfiguration {
  return {
    cache: true,
    command: `cdktf synth`,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdktf"],
      help: {
        command: `${pmc.exec} cdktf synth --help`,
        example: {
          options: {
            output: "cdktf.custom.out",
          },
        },
      },
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      { externalDependencies: ["cdktf-cli"] },
    ],
    outputs,
  };
}

function deployTarget(
  options: CdktfPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): TargetConfiguration {
  return {
    cache: true,
    command: `cdktf deploy`,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      { externalDependencies: ["cdktf-cli"] },
    ],
    outputs,
  };
}

function getTarget(
  options: CdktfPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  projectRoot: string
): TargetConfiguration {
  return {
    cache: false,
    command: `cdktf get`,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      { externalDependencies: ["cdktf-cli"] },
    ],
  };
}

function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  const cdkConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  const outputs: string[] = [];
  return outputs.concat([join("{projectRoot}", cdkConfig.output ?? "cdktf.out")]);
}
