import { ExecutorContext, logger } from "@nx/devkit";
import { BootstrapExecutorOptions } from "./schema";
import { paramCase } from "change-case";
import * as path from "node:path";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";

export default async function executor(options: BootstrapExecutorOptions, context: ExecutorContext) {
  if (options.skipOnCI === true) {
    logger.info("Skipping bootstrap because skipOnCI is set");
    return { success: true };
  }

  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;

    if (options.output) {
      options.output = path.join(context.root, options.output);
    }

    const newOptions: Record<string, string | number | boolean | symbol> = {};

    let oldKey: keyof typeof options;
    for (oldKey in options) {
      if (oldKey !== "postTargets") {
        const newKey = paramCase(oldKey);
        Object.assign(newOptions, { [newKey]: options[oldKey] });
      }
    }

    const optionsString = Object.entries(newOptions)
      .map(([k, v]) => `--${k}=${v.toString()}`)
      .join(" ");

    // --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess
    const result = await runCommands(
      {
        cwd: projectDir,
        color: true,
        command: `cdk bootstrap aws://${options.account}/${options.region} ${optionsString}`,
        __unparsed__: [],
      },
      context
    );

    if (result.success && options.postTargets) {
      for (const postTarget of options.postTargets) {
        await runCommands(
          {
            color: true,
            command: `nx run ${postTarget}`,
            __unparsed__: [],
          },
          context
        );
      }
    }

    return result;
  }

  return { success: false };
}
