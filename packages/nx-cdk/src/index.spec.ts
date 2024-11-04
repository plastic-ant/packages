import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2 } from "./index";
import { vol } from "memfs";

vi.mock("node:fs", async () => ({ ...(await vi.importActual("memfs")) }));

describe("nx-cdk", () => {
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

  it("should create nodes based on cdk.json", async () => {
    vol.fromJSON({
      "proj/cdk.json": `{}`,
      "proj/project.json": "{}",
    });

    const results = await createNodesFunction(
      ["proj/cdk.json"],
      { synthTargetName: "synth-test", deployTargetName: "deploy-test" },
      context
    );

    expect(results).toMatchObject([
      [
        "proj/cdk.json",
        {
          projects: {
            proj: {
              metadata: undefined,
              root: "proj",
              targets: {
                "deploy-test": {
                  cache: true,
                  command: "cdk deploy",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    help: {
                      command: "yarn cdk deploy --help",
                      example: {
                        options: { "require-approval": "never" },
                      },
                    },
                    technologies: ["cdk"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdk.out"],
                },
                "synth-test": {
                  cache: true,
                  command: "cdk synth",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    help: {
                      command: "yarn cdk synth --help",
                      example: {
                        options: {
                          strict: true,
                        },
                      },
                    },
                    technologies: ["cdk"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdk.out"],
                },
              },
            },
          },
        },
      ],
    ]);
  });

  it("should create nodes based on cdk.json with output cache", async () => {
    vol.fromJSON({
      "proj/cdk.json": `{ "output": "cdk.test.out" }`,
      "proj/project.json": "{}",
    });

    const results = await createNodesFunction(
      ["proj/cdk.json"],
      {
        synthTargetName: "synth-test",
        deployTargetName: "deploy-test",
      },
      context
    );

    expect(results).toMatchObject([
      [
        "proj/cdk.json",
        {
          projects: {
            proj: {
              metadata: undefined,
              root: "proj",
              targets: {
                "deploy-test": {
                  cache: true,
                  command: "cdk deploy",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    help: {
                      command: "yarn cdk deploy --help",
                      example: {
                        options: {
                          "require-approval": "never",
                        },
                      },
                    },
                    technologies: ["cdk"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdk.test.out"],
                },
                "synth-test": {
                  cache: true,
                  command: "cdk synth",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    help: {
                      command: "yarn cdk synth --help",
                      example: {
                        options: {
                          strict: true,
                        },
                      },
                    },
                    technologies: ["cdk"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdk.test.out"],
                },
              },
            },
          },
        },
      ],
    ]);
  });
});
