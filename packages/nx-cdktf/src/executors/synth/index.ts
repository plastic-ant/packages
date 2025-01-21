import { PromiseExecutor } from "@nx/devkit";
import { SynthExecutorOptions } from "./schema";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";
import { makeOptionsString } from "../..";

const runExecutor: PromiseExecutor<SynthExecutorOptions> = async (options, context) => {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;
    const optionsString = makeOptionsString(options, options.stacks);

    const result = await runCommands(
      {
        cwd: projectDir,
        color: true,
        command: `cdktf synth ${optionsString}`,
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
};

export default runExecutor;
