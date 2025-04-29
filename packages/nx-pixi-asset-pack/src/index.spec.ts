import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2 } from "./index.js";
import { vol } from "memfs";

vi.mock("node:fs", async () => {
  const memfs = await vi.importActual<typeof import("memfs")>("memfs");
  return { default: memfs.fs, ...memfs.fs };
});

const assetPackConfig = {
  entry: "./raw-assets",
  output: "./public-test",
  ignore: ["**/*.html"],
  cache: true,
  cacheLocation: "./.assetpack-test",
  logLevel: "info",
  pipes: [],
  assetSettings: [
    {
      files: ["**/*.png"],
      settings: {
        compress: {
          jpg: true,
          png: true,
          webp: false,
          avif: true,
        },
      },
    },
  ],
};

vi.mock("proj/.assetpack.js", async () => {
  return {
    default: assetPackConfig,
  };
});

describe("nx-pixi-asset-pack", () => {
  const createNodesFunction = createNodesV2[1];
  let context: CreateNodesContext;

  beforeEach(async () => {
    context = {
      workspaceRoot: `.`,
      configFiles: [],
      nxJsonConfiguration: {
        cli: { packageManager: "pnpm" },
        namedInputs: {
          default: ["{projectRoot}/**/*"],
          production: ["!{projectRoot}/**/*.spec.ts"],
        },
      },
    };
  });

  afterEach(() => {
    vi.resetModules();
    vol.reset();
  });

  it("should create nodes based on .assetpack.js", async () => {
    vol.fromJSON({
      "pnpm exec.lock": "",
      "proj/.assetpack.js": `export default ${JSON.stringify(assetPackConfig)}`,
      "proj/project.json": "{}",
    });

    const results = await createNodesFunction(["proj/.assetpack.js"], { targetName: "assetpack-test" }, context);

    expect(results).toMatchObject([
      [
        "proj/.assetpack.js",
        {
          projects: {
            proj: {
              root: "proj",
              targets: {
                "assetpack-test": {
                  cache: true,
                  command: "pnpm exec assetpack",
                  inputs: ["production", "^production", { externalDependencies: ["@assetpack/core"] }],
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/public-test", "{projectRoot}/.assetpack-test"],
                },
              },
            },
          },
        },
      ],
    ]);
  });
});
