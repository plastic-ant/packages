import { CreateNodesResult, getPackageManagerCommand } from "@nx/devkit";
import { CreateNodesV2, CreateNodesContextV2, createNodesFromFiles } from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";
import { SynthExecutorOptions } from "./executors/synth/schema";
import { paramCase } from "change-case";

const pmc = getPackageManagerCommand();

export function makeOptionsString(options: Omit<SynthExecutorOptions, "stacks">, stacks?: string[]) {
  const str = Object.entries(options)
    .filter(([k]) => k != "postTargets" && k != "stacks")
    .map(([k, v]) => `--${paramCase(k)}=${v.toString()}`);

  if (stacks?.length) {
    str.push(stacks.join(" "));
  } //else {
  //str.push(`--all`);
  // }

  return str.join(" ");
}

export interface CdktfPluginOptions {
  synthTargetName?: string;
  deployTargetName?: string;
  getTargetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: CdktfPluginOptions | undefined) {
  options ??= {};
  options.synthTargetName ??= "cdktf-synth";
  options.deployTargetName ??= "cdktf-deploy";
  options.getTargetName ??= "cdktf-get";
  return options;
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<CdktfPluginOptions> = [
  "**/cdktf.json",
  async (configFiles, opts, context) => {
    const options = normalizeOptions(opts);
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `pas-nx-cdktf-${optionsHash}.hash`);
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
  options: CdktfPluginOptions,
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
  options: CdktfPluginOptions,
  context: CreateNodesContextV2,
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
  projectRoot: string,
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
  projectRoot: string,
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
  projectRoot: string,
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
