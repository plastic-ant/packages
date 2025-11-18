import { CreateNodesV2, CreateNodesContextV2, createNodesFromFiles, CreateNodesResult } from "@nx/devkit";
import { joinPathFragments, readJsonFile, TargetConfiguration, writeJsonFile } from "@nx/devkit";
import { dirname, join } from "node:path";
import { getNamedInputs } from "@nx/devkit/src/utils/get-named-inputs";
import { existsSync, readFileSync } from "node:fs";
import { calculateHashForCreateNodes } from "@nx/devkit/src/utils/calculate-hash-for-create-nodes";
import { workspaceDataDirectory } from "nx/src/utils/cache-directory";
import { InputDefinition } from "nx/src/config/workspace-json-project-json";
import { hashObject } from "nx/src/hasher/file-hasher";

export interface VersionPluginOptions {
  versionTargetName?: string;
}

type Targets = Awaited<ReturnType<typeof buildTargets>>;

function normalizeOptions(options: VersionPluginOptions | undefined): Required<VersionPluginOptions> {
  return {
    versionTargetName: options?.versionTargetName ?? "version",
  };
}

function readTargetsCache(cachePath: string): Record<string, Targets> {
  return existsSync(cachePath) ? readJsonFile(cachePath) : {};
}

function writeTargetsToCache(cachePath: string, results: Record<string, Targets>) {
  writeJsonFile(cachePath, results);
}

export const createNodesV2: CreateNodesV2<VersionPluginOptions> = [
  "**/package.json",
  async (configFiles, opts, context) => {
    const options = normalizeOptions(opts);
    const optionsHash = hashObject(options);
    const cachePath = join(workspaceDataDirectory, `infogr8-nx-version-${optionsHash}.hash`);
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
  opts: VersionPluginOptions,
  context: CreateNodesContextV2,
  targetsCache: Record<string, Record<string, TargetConfiguration>>,
): Promise<CreateNodesResult> {
  const projectRoot = dirname(configFilePath);
  const options = normalizeOptions(opts);

  const packageJson = JSON.parse(readFileSync(configFilePath, "utf-8"));
  if (!packageJson.publishConfig) {
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
  options: Required<VersionPluginOptions>,
  context: CreateNodesContextV2,
) {
  const configOutputs = getOutputs(context.workspaceRoot, projectRoot, configPath);
  const namedInputs = getNamedInputs(projectRoot, context);
  const targets: Record<string, TargetConfiguration> = {};

  targets[options.versionTargetName] = versionTarget(options, namedInputs, configOutputs, projectRoot);
  targets[`${options.versionTargetName}-github`] = gitHubTarget(options, namedInputs, configOutputs, projectRoot);
  targets[`${options.versionTargetName}-npm`] = npmTarget(options, namedInputs, configOutputs, projectRoot);

  return targets;
}

function versionTarget(
  options: Required<VersionPluginOptions>,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    executor: "@jscutlery/semver:version",
    cache: false,
    parallelism: false,
    options: {
      push: true,
      preset: "conventionalcommits",
      baseBranch: "main",
      tagPrefix: "{projectName}@",
      commitMessageFormat: "chore({projectName}): release version {version} [skip ci]",
      postTargets: ["build", `${options.versionTargetName}-npm`, `${options.versionTargetName}-github`],
    },
  };
}

function gitHubTarget(
  options: Required<VersionPluginOptions>,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  return {
    executor: "@jscutlery/semver:github",
    options: {
      tag: "{tag}",
      notes: "{notes}",
      //files: [`${projectRoot}/dist`, `${projectRoot}/package.json`],
    },
  };
}

function npmTarget(
  options: Required<VersionPluginOptions>,
  namedInputs: { [inputName: string]: (string | InputDefinition)[] },
  outputs: string[],
  projectRoot: string,
): TargetConfiguration {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf-8"));
  return {
    executor: "ngx-deploy-npm:deploy",
    options: {
      access: packageJson.publishConfig?.access ?? "private",
      scope: packageJson.publishConfig?.scope,
      distFolderPath: `${projectRoot}`,
    },
  };
}

function getOutputs(workspaceRoot: string, projectRoot: string, configPath: string) {
  return [];
}
