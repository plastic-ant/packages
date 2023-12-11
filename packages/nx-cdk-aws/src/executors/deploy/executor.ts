import { DeployExecutorOptions } from "./schema";
import { ExecutorContext, logger } from "@nx/devkit";

export default async function executor(options: DeployExecutorOptions, context: ExecutorContext) {
  console.log("Executor ran for Sync", options);
  return {
    success: true,
  };
}
