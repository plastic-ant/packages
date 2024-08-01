import { CreateNodes, CreateNodesV2, CreateNodesContext, createNodesFromFiles } from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile, logger } from "@nx/devkit";
import { dirname, join } from "path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readdirSync } from "fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";

export interface CdkAwsPluginOptions {
  synthTargetName?: string;
  deployTargetName?: string;
  bootstrapTargetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: CdkAwsPluginOptions | undefined) {
  options ??= {};
  options.synthTargetName ??= "cdk-synth";
  options.deployTargetName ??= "cdk-deploy";
  options.bootstrapTargetName ??= "cdk-bootstrap";
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<CdkAwsPluginOptions> = [
  "**/cdk.json",
  async (configFiles, options, context) => {
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-cdk-${optionsHash}.hash`);
    const targetsCache = readTargetsCache(cachePath);

    try {
      return await createNodesFromFiles(
        (configFile, options, context) => createNodesInternal(configFile, options, context, targetsCache),
        configFiles,
        options,
        context,
      );
    } finally {
      writeTargetsToCache(cachePath, targetsCache);
    }
  },
];

/**
 * @deprecated This is replaced with {@link createNodesV2}. Update your plugin to export its own `createNodesV2` function that wraps this one instead.
 * This function will change to the v2 function in Nx 20.
 */
export const createNodes: CreateNodes<CdkAwsPluginOptions> = [
  "**/cdk.json",
  (...args) => {
    logger.warn(
      "`createNodes` is deprecated. Update your plugin to utilize createNodesV2 instead. In Nx 20, this will change to the createNodesV2 API.",
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
  options: CdkAwsPluginOptions,
  context: CreateNodesContext,
) {
  //const absoluteConfigFilePath = joinPathFragments(context.workspaceRoot, configFilePath);

  const { buildOutputs } = getOutputs(context.workspaceRoot, projectRoot);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.synthTargetName) {
    targets[options.synthTargetName] = synthTarget(options, namedInputs, buildOutputs, projectRoot);
  }

  if (options.deployTargetName) {
    targets[options.deployTargetName] = deployTarget(options, projectRoot);
  }

  if (options.bootstrapTargetName) {
    targets[options.bootstrapTargetName] = bootstrapTarget(projectRoot);
  }

  return { targets };
}

function synthTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk synth`,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      { externalDependencies: ["aws-cdk"] },
    ],
    outputs,
  };
}

function deployTarget(options: CdkAwsPluginOptions, projectRoot: string): TargetConfiguration {
  return {
    command: `cdk deploy`,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [{ externalDependencies: ["aws-cdk"] }],
  };
}

function bootstrapTarget(projectRoot: string): TargetConfiguration {
  return {
    command: `cdk bootstrap`,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [{ externalDependencies: ["aws-cdk"] }],
  };
}

// cdk bootstrap aws://${options.account}/${options.region} --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess

function getOutputs(_workspaceRoot: string, _projectRoot: string) {
  const buildOutputs: string[] = [];
  return {
    buildOutputs,
  };
}
