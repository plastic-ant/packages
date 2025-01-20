import { PromiseExecutor } from "@nx/devkit";
import { DeployExecutorOptions } from "./schema";
import { paramCase } from "change-case";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";

const runExecutor: PromiseExecutor<DeployExecutorOptions> = async (options, context) => {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;
    const optionsString = Object.entries(options)
      .map(([k, v]) => `--${paramCase(k)}=${v.toString()}`)
      .filter((v) => v != "postTargets")
      .join(" ");

    // --require-approval=never

    const result = await runCommands(
      {
        cwd: projectDir,
        color: true,
        command: `cdk deploy ${options.stacks?.join(" ") ?? ""} ${optionsString}`,
        __unparsed__: [],
      },
      context
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
          context
        );
      }
    }

    return result;
  }

  return { success: false };
};

export default runExecutor;
