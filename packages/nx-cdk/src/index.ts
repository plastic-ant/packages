import {
  CreateNodesV2,
  CreateNodesContextV2,
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
import { paramCase } from "change-case";
import { BootstrapExecutorOptions } from "./executors/bootstrap/schema";
import { DeployExecutorOptions } from "./executors/deploy/schema";
import { SynthExecutorOptions } from "./executors/synth/schema";

const pmc = getPackageManagerCommand();

export function variableReplace(value: string, vars: typeof process.env | Record<string, string>): string;
export function variableReplace<T>(value: object, vars: typeof process.env | Record<string, string>): T;

/**
 * Replace variables in an object or string
 * @param {object | string} value
 * @param {Record<string, string> | Record<string, string>} vars - ${}, $, {} are accepted.
 * @return {string | object}
 */
export function variableReplace<T>(value: T | string, vars: typeof process.env | Record<string, string>): string | T {
  if (typeof value === "string") {
    return value
      .replace(/\$(\w+)/g, (_, key) => vars[key] || "")
      .replace(/\${(\w+)}/g, (_, key) => vars[key] || "")
      .replace(/\{(\w+)}/g, (_, key) => vars[key] || "");
    //   .replace(/'/g, '"');
  }

  return JSON.parse(
    JSON.stringify(value)
      .replace(/\$(\w+)/g, (_, key) => vars[key] || "")
      .replace(/\${(\w+)}/g, (_, key) => vars[key] || "")
      .replace(/\{(\w+)}/g, (_, key) => vars[key] || ""),
    //  .replace(/'/g, '"')
  ) as T;
}

export function makeOptionsString(
  options: BootstrapExecutorOptions | Omit<DeployExecutorOptions | SynthExecutorOptions, "stacks">,
  stacks?: string[],
) {
  options = variableReplace(options, process.env);

  const str = Object.entries(options)
    .filter(([k]) => k != "postTargets" && k != "stacks")
    .map(([k, v]) => `--${paramCase(k)}=${v.toString()}`);

  if (stacks?.length) {
    str.push(stacks.join(" "));
  } else {
    str.push(`--all`);
  }

  return str.join(" ");
}

export interface CdkAwsPluginOptions {
  synthTargetName?: string;
  deployTargetName?: string;
  bootstrapTargetName?: string;
  destroyTargetName?: string;
  diffTargetName?: string;
  listTargetName?: string;
  flagsTargetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: CdkAwsPluginOptions | undefined) {
  options ??= {};
  options.synthTargetName ??= "cdk-synth";
  options.deployTargetName ??= "cdk-deploy";
  options.bootstrapTargetName ??= "cdk-bootstrap";
  options.destroyTargetName ??= "cdk-destroy";
  options.diffTargetName ??= "cdk-diff";
  options.listTargetName ??= "cdk-list";
  options.flagsTargetName ??= "cdk-flags";
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

// export const createNodes: CreateNodes<CdkAwsPluginOptions> = [
//   "**/cdk.json",
//   (...args) => {
//     logger.warn(
//       "`createNodes` is deprecated. Update your plugin to utilize createNodesV2 instead. In Nx 20, this will change to the createNodesV2 API."
//     );
//     return createNodesInternal(...args, {});
//   },
// ];

async function createNodesInternal(
  configFilePath: string,
  options: CdkAwsPluginOptions,
  context: CreateNodesContextV2,
  targetsCache: Record<string, Record<string, TargetConfiguration>>,
): Promise<CreateNodesResult> {
  const projectRoot = dirname(configFilePath);
  const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));

  if (!siblingFiles.includes("package.json") && !siblingFiles.includes("project.json")) {
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
  options: CdkAwsPluginOptions,
  context: CreateNodesContextV2,
) {
  const configOutputs = getOutputs(context.workspaceRoot, projectRoot, configPath);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.synthTargetName) {
    targets[options.synthTargetName] = synthTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.deployTargetName) {
    targets[options.deployTargetName] = deployTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.bootstrapTargetName) {
    targets[options.bootstrapTargetName] = bootstrapTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.destroyTargetName) {
    targets[options.destroyTargetName] = destroyTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.diffTargetName) {
    targets[options.diffTargetName] = diffTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.listTargetName) {
    targets[options.listTargetName] = listTarget(options, namedInputs, configOutputs, projectRoot);
  }

  if (options.flagsTargetName) {
    targets[options.flagsTargetName] = flagsTarget(options, namedInputs, configOutputs, projectRoot);
  }

  return targets;
}

function synthTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk synth`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdk"],
      help: {
        command: `${pmc.exec} cdk synth --help`,
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
        externalDependencies: ["aws-cdk"],
      },
    ],
    outputs,
  };
}

function deployTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk deploy`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdk"],
      help: {
        command: `${pmc.exec} cdk deploy --help`,
        example: {
          options: {
            "require-approval": "never",
          },
        },
      },
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["aws-cdk"],
      },
    ],
    outputs,
  };
}

function bootstrapTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk bootstrap`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdk"],
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["aws-cdk"],
      },
    ],
    outputs,
  };
}

function destroyTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk destroy`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdk"],
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["aws-cdk"],
      },
    ],
    outputs,
  };
}

function diffTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk diff`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdk"],
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["aws-cdk"],
      },
    ],
    outputs,
  };
}

function listTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk list`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdk"],
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["aws-cdk"],
      },
    ],
    outputs,
  };
}

function flagsTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    command: `cdk flags`,
    cache: true,
    options: { cwd: joinPathFragments(projectRoot) },
    metadata: {
      technologies: ["cdk"],
    },
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      {
        externalDependencies: ["aws-cdk"],
      },
    ],
    outputs,
  };
}

function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  const cdkConfig = JSON.parse(readFileSync(configPath, "utf-8"));
  const outputs: string[] = [];
  return outputs.concat([join("{projectRoot}", cdkConfig.output ?? "cdk.out")]);
}
