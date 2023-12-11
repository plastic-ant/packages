import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";
import appGenerator from "./generator";

describe("app generator", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace({ layout: "apps-libs" });
  });

  it("should run successfully 2", async () => {
    await appGenerator(tree, {
      name: "test",
      directory: "folder",
      projectNameAndRootFormat: "derived",
    });
    const config = readProjectConfiguration(tree, "folder-test");
    expect(config).toBeDefined();
  });

  it("should run successfully", async () => {
    await appGenerator(tree, {
      name: "test",
      directory: "tmp/test",
      projectNameAndRootFormat: "as-provided",
    });
    const config = readProjectConfiguration(tree, "test");
    expect(config).toBeDefined();
  });
});
