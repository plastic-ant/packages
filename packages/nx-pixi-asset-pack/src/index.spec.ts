import { addProjectConfiguration, CreateNodesContext, Tree, updateJson, writeJson } from "@nx/devkit";
import { createNodesV2 } from "./index.js";
//import { vol } from "memfs";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";
import { TempFs } from "./tmp-fs.js";
import { resetWorkspaceContext } from "nx/src/utils/workspace-context.js";

const assetPackConfig = {
  entry: "./raw-assets",
  output: "./public-test",
  ignore: ["**/*.html"],
  cache: true,
  cacheLocation: "./.assetpack-test",
  logLevel: "info",
  pipes: [],
  assetSettings: [],
};

// vi.mock("node:fs", async () => {
//   const memfs = await vi.importActual<typeof import("memfs")>("memfs");
//   return { default: memfs.fs, ...memfs.fs };
// });

// vi.mock(import("/pas-packages/proj/.assetpack.js"), async (importOriginal) => {
//   const mod = await importOriginal(); // type is inferred
//   return {
//     ...mod,
//     ...{
//       default: assetPackConfig,
//     },
//   };
// });

describe("nx-pixi-asset-pack", () => {
  const createNodesFunction = createNodesV2[1];
  let context: CreateNodesContext;
  let tempFs: TempFs;
  const cwd = process.cwd();
  let originalCacheProjectGraph: string | undefined;

  beforeEach(async () => {
    tempFs = new TempFs("nx-pixi-asset-pack");

    await tempFs.createFiles({
      "package.json": "{}",
      ".assetpack.js": `export default ${JSON.stringify(assetPackConfig)}`,
    });

    context = {
      nxJsonConfiguration: {
        namedInputs: {
          default: ["{projectRoot}/**/*"],
          production: ["!{projectRoot}/**/*.spec.ts"],
        },
      },
      workspaceRoot: tempFs.tempDir,
      configFiles: [],
    };

    process.chdir(tempFs.tempDir);
    originalCacheProjectGraph = process.env.NX_CACHE_PROJECT_GRAPH;
    process.env.NX_CACHE_PROJECT_GRAPH = "false";
  });

  afterEach(() => {
    vi.resetModules();
    //vol.reset();
    tempFs.cleanup();
    process.chdir(cwd);
    process.env.NX_CACHE_PROJECT_GRAPH = originalCacheProjectGraph;
  });

  afterAll(() => {
    resetWorkspaceContext();
  });

  it("should create nodes based on .assetpack.js", async () => {
    // vol.fromJSON({
    //   "pnpm exec.lock": "",
    //   "proj/.assetpack.js": `export default ${JSON.stringify(assetPackConfig)}`,
    //   "proj/project.json": "{}",
    // });

    const results = await createNodesFunction([`.assetpack.js`], { targetName: "assetpack-test" }, context);

    expect(results).toMatchObject([
      [
        ".assetpack.js",
        {
          projects: {
            ".": {
              root: ".",
              targets: {
                "assetpack-test": {
                  cache: true,
                  command: "pnpm exec assetpack",
                  inputs: ["production", "^production", { externalDependencies: ["@assetpack/core"] }],
                  options: { cwd: "." },
                  outputs: ["./public-test", "./.assetpack-test"],
                },
              },
            },
          },
        },
      ],
    ]);
  });
});
