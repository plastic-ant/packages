import { ExecutorContext } from "@nx/devkit";
import { DeployExecutorOptions } from "./schema";
import executor from ".";

const options: DeployExecutorOptions = {};
const context: ExecutorContext = {
  root: "",
  cwd: process.cwd(),
  isVerbose: false,
  projectGraph: {
    nodes: {},
    dependencies: {},
  },
  projectsConfigurations: {
    projects: {},
    version: 2,
  },
  nxJsonConfiguration: {},
};

describe("Deploy Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
