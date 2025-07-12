import { PromiseExecutor } from "@nx/devkit";
import { DeployExecutorOptions } from "./schema";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";
import { makeOptionsString } from "../..";

const runExecutor: PromiseExecutor<DeployExecutorOptions> = async (options, context) => {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;
    const optionsString = makeOptionsString(options, options.stacks);

    // --require-approval=never

    const result = await runCommands(
      {
        cwd: projectDir,
        color: true,
        envFile: options.envFile,
        command: `cdk deploy ${optionsString}`,
        __unparsed__: [],
      },
      context,
    );

    if (result.success && options.postTargets) {
      for (const postTarget of options.postTargets) {
        const target = postTarget.includes(`${context.projectName}:`)
          ? postTarget
          : `${context.projectName}:${postTarget}`;

        await runCommands(
          {
            color: true,
            command: `nx run ${target}`,
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
