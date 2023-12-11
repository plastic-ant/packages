import { BootstrapExecutorOptions } from "./schema";

export default async function runExecutor(options: BootstrapExecutorOptions) {
  console.log("Executor ran for Bootstrap", options);
  return {
    success: true,
  };
}
