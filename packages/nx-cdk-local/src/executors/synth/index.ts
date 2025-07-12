import { PromiseExecutor } from "@nx/devkit";
import { SynthExecutorOptions } from "./schema";
import { paramCase } from "change-case";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";

const runExecutor: PromiseExecutor<SynthExecutorOptions> = async (options, context) => {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;

    const optionsString = Object.entries(options)
      .map(([k, v]) => `--${paramCase(k)}=${v.toString()}`)
      .filter((v) => v != "postTargets" && v != "stacks")
      .join(" ");

    const result = await runCommands(
      {
        cwd: projectDir,
        envFile: options.envFile,
        color: true,
        command: `cdklocal synth ${options.stacks?.join(" ") ?? ""} ${optionsString}`,
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
};

export default runExecutor;
