import { PromiseExecutor } from "@nx/devkit";
import { DevExecutorOptions } from "./schema";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";

const runExecutor: PromiseExecutor<DevExecutorOptions> = async (options, context) => {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;
    const optionsString = "";

    const result = await runCommands(
      {
        cwd: projectDir,
        color: true,
        command: `react-router dev ${optionsString}`,
        __unparsed__: [],
      },
      context
    );

    return result;
  }

  return { success: false };
};

export default runExecutor;
