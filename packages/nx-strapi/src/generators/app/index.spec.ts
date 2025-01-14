import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { Tree, readProjectConfiguration } from "@nx/devkit";
import generator from "./index";
import { AppGeneratorOptions } from "./schema";

describe("@igr8/strapi-plugin: app generator", () => {
  let tree: Tree;
  const options: AppGeneratorOptions = { name: "my-app", directory: "./apps" };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should run successfully", async () => {
    await generator(tree, options);
    const projectConfig = readProjectConfiguration(tree, options.name);
    expect(projectConfig.root).toEqual(options.name);
  });
});
