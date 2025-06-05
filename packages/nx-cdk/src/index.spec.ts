import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2, makeOptionsString } from "./index.js";
import { vol } from "memfs";

vi.mock("node:fs", async () => {
  const memfs = await vi.importActual<typeof import("memfs")>("memfs");
  return { default: memfs.fs, ...memfs.fs };
});

describe("nx-cdk", () => {
  const createNodesFunction = createNodesV2[1];
  let context: CreateNodesContext;

  beforeEach(async () => {
    context = {
      workspaceRoot: `.`,
      configFiles: [],
      nxJsonConfiguration: {
        cli: { packageManager: "npm" },
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

  it("options: can handle no stacks passed", async () => {
    expect(
      makeOptionsString(
        {
          region: "us-east-2",
          account: "12345678",
        },
        [],
      ),
    ).toEqual("--region=us-east-2 --account=12345678 --all");
  });

  it("options: can handle mutiple stacks", async () => {
    expect(
      makeOptionsString(
        {
          region: "us-east-2",
          account: "12345678",
        },
        ["test-1", "test-2"],
      ),
    ).toEqual("--region=us-east-2 --account=12345678 test-1 test-2");
  });

  it("should create nodes based on cdk.json", async () => {
    vol.fromJSON({
      "pnpm exec.lock": "",
      "proj/cdk.json": `{}`,
      "proj/project.json": "{}",
    });

    const results = await createNodesFunction(
      ["proj/cdk.json"],
      {
        destroyTargetName: "destroy-test",
        synthTargetName: "synth-test",
        deployTargetName: "deploy-test",
        bootstrapTargetName: "bootstrap-test",
      },
      context,
    );

    expect(results).toMatchObject([
      [
        "proj/cdk.json",
        {
          projects: {
            proj: {
              root: "proj",
              targets: {
                "destroy-test": {
                  cache: true,
                  command: "cdk destroy",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    technologies: ["cdk"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdk.out"],
                },
                "bootstrap-test": {
                  cache: true,
                  command: "cdk bootstrap",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    technologies: ["cdk"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdk.out"],
                },
                "deploy-test": {
                  cache: true,
                  command: "cdk deploy",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    help: {
                      command: "pnpm exec cdk deploy --help",
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
                      command: "pnpm exec cdk synth --help",
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
        bootstrapTargetName: "bootstrap-test",
      },
      context,
    );

    expect(results).toMatchObject([
      [
        "proj/cdk.json",
        {
          projects: {
            proj: {
              root: "proj",
              targets: {
                "bootstrap-test": {
                  cache: true,
                  command: "cdk bootstrap",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    technologies: ["cdk"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdk.test.out"],
                },
                "deploy-test": {
                  cache: true,
                  command: "cdk deploy",
                  inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
                  metadata: {
                    help: {
                      command: "pnpm exec cdk deploy --help",
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
                      command: "pnpm exec cdk synth --help",
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
