import { ExecutorContext, Tree, getProjects, readProjectConfiguration } from "@nx/devkit";
import { SynthExecutorOptions } from "./schema";
import executor from "./executor";
import appGenerator from "../../generators/app/generator";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import * as path from "node:path";

describe("nx-cdk-aws:synth", () => {
  let context: ExecutorContext;
  let options: SynthExecutorOptions;
  let tree: Tree;

  //const root = process.cwd() + "/tmp";
  const appName = "cdk-app";

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await appGenerator(tree, { name: appName, projectNameAndRootFormat: "as-provided" });

    const projectConfiguration = readProjectConfiguration(tree, appName);

    context = {
      root: tree.root,
      cwd: tree.root,
      projectName: appName,
      targetName: "synth",
      isVerbose: false,
      workspace: {
        version: 2,
        projects: Object.fromEntries(getProjects(tree)),
      },
    };

    options = {
      app: path.join(projectConfiguration.root, "bin", "app.ts"),
      tsConfig: path.join(projectConfiguration.root, "tsconfig.app.json"),
      debug: true,
      verbose: true,
      useCliLib: false,
      validation: true,
      strict: true,
    };
  });

  it("Should run successfully", async function () {
    const output = await executor(options, context);
    expect(output.success).toBe(true);
  });
});
