import { ExecutorContext } from "@nx/devkit";
import { BootstrapExecutorOptions } from "./schema";
import { paramCase } from "change-case";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";

export default async function executor(options: BootstrapExecutorOptions, context: ExecutorContext) {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;
    const optionsString = Object.entries(options)
      .map(([k, v]) => `--${paramCase(k)}=${v.toString()}`)
      .filter((v) => v != "postTargets")
      .join(" ");

    // --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess
    const result = await runCommands(
      {
        cwd: projectDir,
        envFile: options.envFile,
        color: true,
        command: `cdklocal bootstrap aws://${options.account}/${options.region} ${optionsString}`,
        __unparsed__: [],
      },
      context,
    );

    if (result.success && options.postTargets) {
      for (const postTarget of options.postTargets) {
        await runCommands(
          {
            color: true,
            command: `nx run ${postTarget}`,
            __unparsed__: [],
          },
          context,
        );
      }
    }

    return result;
  }

  return { success: false };
}
