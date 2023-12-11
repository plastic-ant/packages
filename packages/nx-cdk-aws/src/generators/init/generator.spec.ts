import { readJson, writeJson, Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { initGenerator } from "./generator";

describe("initGenerator", () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace({ layout: "apps-libs" });
    writeJson(tree, "package.json", {});
  });

  it("should add esbuild as a dev dependency", async () => {
    await initGenerator(tree, {});

    const packageJson = readJson(tree, "package.json");
    expect(packageJson.dependencies).toEqual({
      "aws-cdk": expect.any(String),
      "aws-cdk-lib": expect.any(String),
    });
  });
});
