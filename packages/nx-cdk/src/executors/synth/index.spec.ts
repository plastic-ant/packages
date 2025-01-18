import { ExecutorContext } from "@nx/devkit";
import { SynthExecutorOptions } from "./schema";
import executor from ".";

const options: SynthExecutorOptions = {};
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

describe("Synth Executor", () => {
  it("can run", async () => {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
