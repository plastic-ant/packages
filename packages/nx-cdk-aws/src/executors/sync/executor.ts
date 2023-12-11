import { SynthExecutorOptions } from "./schema";
import { ExecutorContext, logger, runExecutor } from "@nx/devkit";
import { kebabCase } from "change-case";
import { default as runCommands } from "nx/src/executors/run-commands/run-commands.impl";
import * as path from "node:path";

export default async function (options: SynthExecutorOptions, context: ExecutorContext) {
  if (context.workspace && context.projectName) {
    const projectDir = context.workspace.projects[context.projectName].root;

    if (typeof options.app !== "string") {
      const project = options.app.tsConfig ? `--project ${options.app.tsConfig}` : "";
      const reg = "node_modules/tsconfig-paths/register";
      options.app = `"ts-node ${project} --prefer-ts-exts -r ${reg} ${options.app.tsEntryFile}"`;
    }

    const newOptions: Record<string, string | number | boolean | symbol> = {};
    let stackOption = "--all";
    const contextOption = [""];

    Object.keys(options).forEach((k) => {
      const key = k as keyof typeof options;
      if (key === "stacks") {
        if (Array.isArray(options["stacks"])) {
          stackOption = options.stacks.join(" ");
        }
      } else if (key === "context") {
        Object.entries((k, v) => {
          contextOption.push(`--context ${k}=${v}`);
        });
      } else if (key !== "postTargets" && key !== "envFile") {
        const newKey = kebabCase(key);
        Object.assign(newOptions, { [newKey]: options[key] });
      }
    });

    const optionsString = Object.entries(newOptions)
      .map(([k, v]) => `--${k}=${v.toString()}`)
      .join(" ");

    const result = await runCommands(
      {
        envFile: options.envFile,
        cwd: path.join(context.root, projectDir),
        color: true,
        command: `cdk synth ${stackOption} ${optionsString} ${contextOption.join(" ")}`,
        __unparsed__: [],
      },
      context
    );

    if (result.success && options.postTargets) {
      for (const target of options.postTargets) {
        const targetElements = target.includes(":") ? target.split(":") : [context.projectName, target];

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
