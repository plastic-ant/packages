import { PromiseExecutor } from "@nx/devkit";
import { DeployExecutorOptions } from "./schema";
// import { logger } from "@nx/devkit";
import { paramCase } from "change-case";
import * as path from "node:path";
// import * as fs from "node:fs";
import runCommands from "nx/src/executors/run-commands/run-commands.impl";
// import * as dotenv from "dotenv";

const runExecutor: PromiseExecutor<DeployExecutorOptions> = async (options, context) => {
  // const envFile = options.envFile;

  // if (envFile) {
  //   const res = dotenv.config({ path: envFile, debug: true, override: true });
  //   if (res.error) {
  //     logger.error(res.error.message);
  //     return { success: false };
  //   }
  // }

  // options = variableReplace(options, process.env);

  if (context.projectName) {
    const projectDir = context.projectsConfigurations.projects[context.projectName].root;

    if (options.output) {
      options.output = path.join(context.root, options.output);
    }

    const newOptions: Record<string, string | number | boolean | symbol> = {};

    // if (options.config) {
    //   const data = fs.readFileSync(options.config.file, "utf-8");
    //   newOptions["context"] = `${options.config.contextKey}=${JSON.stringify(data)}`;
    // }

    let oldKey: keyof typeof options;
    for (oldKey in options) {
      if (oldKey !== "postTargets" && oldKey !== "stacks") {
        const newKey = paramCase(oldKey);
        Object.assign(newOptions, { [newKey]: options[oldKey] });
      }
    }

    const optionsString = Object.entries(newOptions)
      .map(([k, v]) => `--${k}=${v.toString()}`)
      .join(" ");

    // --require-approval=never

    const result = await runCommands(
      {
        //envFile,
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
