import { getPackageManagerCommand, PromiseExecutor } from "@nx/devkit";
import { PackExecutorOptions } from "./schema.js";
import runCommandsImpl from "nx/src/executors/run-commands/run-commands.impl.js";
const pmc = getPackageManagerCommand();

const runExecutor: PromiseExecutor<PackExecutorOptions> = async (options, context) => {
  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;

    const cmd = `${pmc.exec} assetpack ${options.watch ? " -w" : ""}`;

    const result = await runCommandsImpl(
      {
        cwd: projectDir,
        color: true,
        command: cmd,
        __unparsed__: [],
      },
      context,
    );

    if (result.success && options.postTargets) {
      for (const postTarget of options.postTargets) {
        await runCommandsImpl(
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
