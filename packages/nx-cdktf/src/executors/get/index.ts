import { PromiseExecutor } from "@nx/devkit";
import { GetExecutorOptions } from "./schema";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";

const runExecutor: PromiseExecutor<GetExecutorOptions> = async (options, context) => {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;

    const result = await runCommands(
      {
        cwd: projectDir,
        command: `cdktf get`,
        __unparsed__: [],
      },
      context
    );

    if (result.success && options.postTargets) {
      for (const postTarget of options.postTargets) {
        await runCommands(
          {
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
