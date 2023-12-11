import { SynthExecutorOptions } from "./schema";
import { ExecutorContext, logger, runExecutor } from "@nx/devkit";
import { kebabCase } from "change-case";
import { default as runCommands } from "nx/src/executors/run-commands/run-commands.impl";
import * as path from "node:path";

export default async function (options: SynthExecutorOptions, context: ExecutorContext) {
  if (context.workspace && context.projectName) {
    const projectDir = context.workspace.projects[context.projectName].root;

    if (options.app) {
      const project = options.tsConfig ? `--project ${options.tsConfig}` : "";
      const reg = "node_modules/tsconfig-paths/register";
      options.app = `"ts-node ${project} --prefer-ts-exts -r ${reg} ${options.app}"`;
    }

    const newOptions: Record<string, string | number | boolean | symbol> = {};

    Object.keys(options)
      .filter((key) => key !== "postTargets" && key !== "tsConfig" && key !== "envFile")
      .forEach((key) => {
        const newKey = kebabCase(key);
        Object.assign(newOptions, { [newKey]: options[key] });
      });

    const optionsString = Object.entries(newOptions)
      .map(([k, v]) => `--${k}=${v.toString()}`)
      .join(" ");

    const result = await runCommands(
      {
        envFile: options.envFile,
        cwd: path.join(context.root, projectDir),
        color: true,
        command: `cdk synth ${optionsString}`,
        __unparsed__: [],
      },
      context
    );

    if (result.success && options.postTargets) {
      for (const target of options.postTargets) {
        const targetElements = target.split(":");

        for await (const s of await runExecutor(
          {
            project: targetElements[0],
            target: targetElements[1],
            configuration: targetElements.length > 2 ? targetElements[2] : undefined,
          },
          {},
          context
        )) {
          if (s.success === false) {
            logger.error(`Failed to run post target: ${target}`);
            return { success: false };
          }
        }
      }
    }

    return result;
  }

  logger.error("Missing workspace and project from context");
  return { success: false };
}
