import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2 } from "./index";
import { vol } from "memfs";
import { vi, describe, expect, beforeEach, afterEach, it } from "vitest";

vi.mock("node:fs", async () => {
  const memfs = await vi.importActual<typeof import("memfs")>("memfs");
  return { default: memfs.fs, ...memfs.fs };
});

describe("nx-dvc", () => {
  const createNodesFunction = createNodesV2[1];
  let context: CreateNodesContext;

  beforeEach(async () => {
    context = {
      workspaceRoot: ".",
      configFiles: [],
      nxJsonConfiguration: {
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

  it("should create nodes based on dvc.yaml", async () => {
    vol.fromJSON({
      "proj/dvc.yaml": ``,
      "proj/project.json": "{}",
    });

    const results = await createNodesFunction(["proj/dvc.yaml"], { reproTargetName: "dvc-test" }, context);

    expect(results).toMatchObject([
      [
        "proj/dvc.yaml",
        {
          projects: {
            proj: {
              root: "proj",
              targets: {
                "dvc-test": {
                  cache: true,
                  command: "dvc repro",
                  inputs: ["production", "^production"],
                  //options: { cwd: "proj" },
                  //outputs: ["{projectRoot}/cdk.out"],
                },
              },
            },
          },
        },
      ],
    ]);
  });
});
