import {
  CreateDependencies,
  CreateNodes,
  CreateNodesContext,
  detectPackageManager,
  joinPathFragments,
  readJsonFile,
  TargetConfiguration,
  writeJsonFile,
} from "@nx/devkit";
import { dirname, join } from "path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readdirSync } from "fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { getLockFileName } from "@nx/js";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";

const cachePath = join(workspaceDataDirectory, "cdk-aws.hash");
const targetsCache = existsSync(cachePath) ? readTargetsCache() : {};
const calculatedTargets: Record<string, Record<string, TargetConfiguration>> = {};

export interface CdkAwsPluginOptions {
  synthTargetName?: string;
  deployTargetName?: string;
  bootstrapTargetName?: string;
}

/**
 *
 * @param options
 * @returns
 */
function normalizeOptions(options: CdkAwsPluginOptions | undefined): CdkAwsPluginOptions {
  options ??= {};
  options.synthTargetName ??= "cdk-synth";
  options.deployTargetName ??= "cdk-deploy";
  options.bootstrapTargetName ??= "cdk-bootstrap";
  return options;
}

function readTargetsCache(): Record<string, Record<string, TargetConfiguration>> {
  return readJsonFile(cachePath);
}

function writeTargetsToCache(targets: Record<string, Record<string, TargetConfiguration>>) {
  writeJsonFile(cachePath, targets);
}

export const createDependencies: CreateDependencies = () => {
  writeTargetsToCache(calculatedTargets);
  return [];
};

/**
 *
 */
export const createNodes: CreateNodes<CdkAwsPluginOptions> = [
  "**/cdk.json",
  async (configFilePath, options, context) => {
    const projectRoot = dirname(configFilePath);
    const siblingFiles = readdirSync(join(context.workspaceRoot, projectRoot));

    if (!siblingFiles.includes("package.json") && !siblingFiles.includes("project.json")) {
      return {};
    }

    options = normalizeOptions(options);

    const hash = await calculateHashForCreateNodes(projectRoot, options, context, [
      getLockFileName(detectPackageManager(context.workspaceRoot)),
      //join(context.workspaceRoot, projectRoot, "cdk.json"),
    ]);

    const targets = targetsCache[hash]
      ? targetsCache[hash]
      : await buildTargets(configFilePath, projectRoot, options, context);

    calculatedTargets[hash] = targets;

    return {
      projects: {
        [projectRoot]: {
          root: projectRoot,
          targets,
        },
      },
    };
  },
];

/**
 *
 * @param configFilePath
 * @param projectRoot
 * @param options
 * @param context
 * @returns
 */
async function buildTargets(
  configFilePath: string,
  projectRoot: string,
  options: CdkAwsPluginOptions,
  context: CreateNodesContext
) {
  //const absoluteConfigFilePath = joinPathFragments(context.workspaceRoot, configFilePath);

  const { buildOutputs } = getOutputs(context.workspaceRoot, projectRoot);

  const namedInputs = getNamedInputs(projectRoot, context);

  const targets: Record<string, TargetConfiguration> = {};

  if (options.synthTargetName) {
    targets[options.synthTargetName] = await synthTarget(options, namedInputs, buildOutputs, projectRoot);
  }

  if (options.deployTargetName) {
    targets[options.deployTargetName] = deployTarget(options, projectRoot);
  }

  if (options.bootstrapTargetName) {
    targets[options.bootstrapTargetName] = bootstrapTarget(projectRoot);
  }

  return targets;
}

/**
 *
 * @param options
 * @param namedInputs
 * @param outputs
 * @param projectRoot
 * @returns
 */
async function synthTarget(
  options: CdkAwsPluginOptions,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string
): Promise<TargetConfiguration> {
  return {
    command: `cdk synth`,
    options: { cwd: joinPathFragments(projectRoot) },
    dependsOn: ["build", `^${options.synthTargetName}`],
    inputs: [
      ...("production" in namedInputs ? ["production", "^production"] : ["default", "^default"]),
      { externalDependencies: ["aws-cdk"] },
    ],
    outputs,
  };
}

/**
 *
 * @param options
 * @param projectRoot
 * @returns
 */
function deployTarget(options: CdkAwsPluginOptions, projectRoot: string): TargetConfiguration {
  return {
    command: `cdk deploy`,
    options: { cwd: joinPathFragments(projectRoot) },
    //dependsOn: [options.synthTargetName ?? "synth", `^${options.deployTargetName}`],
    inputs: [{ externalDependencies: ["aws-cdk"] }],
  };
}

/**
 *
 * @param projectRoot
 * @returns
 */
function bootstrapTarget(projectRoot: string): TargetConfiguration {
  return {
    command: `cdk bootstrap`,
    options: { cwd: joinPathFragments(projectRoot) },
    inputs: [{ externalDependencies: ["aws-cdk"] }],
  };
}

// cdk bootstrap aws://${options.account}/${options.region} --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess

/**
 *
 * @param projectRoot
 * @returns
 */
function getOutputs(workspaceRoot: string, projectRoot: string) {
  const buildOutputs: string[] = [];
  //const strapi = normalizeOutputPath(".strapi", projectRoot, ".strapi");
  //const dist = normalizeOutputPath("dist", projectRoot, "dist");
  return {
    buildOutputs,
  };
}

/**
 *
 * @param outputPath
 * @param projectRoot
 * @param path
 * @returns
 */
// function normalizeOutputPath(
//   outputPath: string | undefined,
//   projectRoot: string,
//   path: ".strapi" | "dist",
// ): string | undefined {
//   if (!outputPath) {
//     if (projectRoot === ".") {
//       return `{projectRoot}/${path}`;
//     } else {
//       return `{workspaceRoot}/${path}/{projectRoot}`;
//     }
//   } else {
//     if (isAbsolute(outputPath)) {
//       return `{workspaceRoot}/${relative(workspaceRoot, outputPath)}`;
//     } else {
//       if (outputPath.startsWith("..")) {
//         return join("{workspaceRoot}", join(projectRoot, outputPath));
//       } else {
//         return join("{projectRoot}", outputPath);
//       }
//     }
//   }
// }
