import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2 } from "./index";
import { vol } from "memfs";

jest.mock("node:fs", () => ({ ...jest.requireActual("memfs") }));

describe("nx-cdktf", () => {
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
    jest.resetModules();
    vol.reset();
  });

  it("should create nodes based on cdktf.json", async () => {
    vol.fromJSON({
      "proj/cdktf.json": `{}`,
      "proj/project.json": "{}",
    });

    const results = await createNodesFunction(
      ["proj/cdktf.json"],
      { synthTargetName: "synth-test", deployTargetName: "deploy-test", getTargetName: "get-test" },
      context
    );

    expect(results).toMatchObject([
      [
        "proj/cdktf.json",
        {
          projects: {
            proj: {
              metadata: undefined,
              root: "proj",
              targets: {
                "get-test": {
                  cache: false,
                  command: "cdktf get",
                  inputs: ["production", "^production", { externalDependencies: ["cdktf-cli"] }],
                  options: { cwd: "proj" },
                },
                "deploy-test": {
                  cache: true,
                  command: "cdktf deploy",
                  inputs: ["production", "^production", { externalDependencies: ["cdktf-cli"] }],
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdktf.out"],
                },
                "synth-test": {
                  cache: true,
                  command: "cdktf synth",
                  inputs: ["production", "^production", { externalDependencies: ["cdktf-cli"] }],
                  metadata: {
                    help: {
                      command: "yarn cdktf synth --help",
                      example: {
                        options: {
                          output: "cdktf.custom.out",
                        },
                      },
                    },
                    technologies: ["cdktf"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/cdktf.out"],
                },
              },
            },
          },
        },
      ],
    ]);
  });

  // it("should create nodes based on cdktf.json with output cache", async () => {
  //   vol.fromJSON({
  //     "proj/cdktf.json": `{ "output": "cdktf.test.out" }`,
  //     "proj/project.json": "{}",
  //   });

  //   const results = await createNodesFunction(
  //     ["proj/cdktf.json"],
  //     {
  //       synthTargetName: "synth-test",
  //       deployTargetName: "deploy-test",
  //       getTargetName: "get-test",
  //     },
  //     context
  //   );

  //   expect(results).toMatchObject([
  //     [
  //       "proj/cdktf.json",
  //       {
  //         projects: {
  //           proj: {
  //             metadata: undefined,
  //             root: "proj",
  //             targets: {
  //               "get-test": {
  //                 cache: true,
  //                 command: "cdktf get",
  //                 inputs: ["production", "^production", { externalDependencies: ["cdktf-cli"] }],
  //                 options: { cwd: "proj" },
  //                 outputs: ["{projectRoot}/cdktf.out"],
  //               },
  //               "deploy-test": {
  //                 cache: true,
  //                 command: "cdktf deploy",
  //                 inputs: ["production", "^production", { externalDependencies: ["cdktf-cli"] }],
  //                 metadata: {
  //                   help: {
  //                     command: "yarn cdktf deploy --help",
  //                     example: {
  //                       options: {
  //                         "require-approval": "never",
  //                       },
  //                     },
  //                   },
  //                   technologies: ["cdktf"],
  //                 },
  //                 options: { cwd: "proj" },
  //                 outputs: ["{projectRoot}/cdktf.test.out"],
  //               },
  //               "synth-test": {
  //                 cache: true,
  //                 command: "cdktf synth",
  //                 inputs: ["production", "^production", { externalDependencies: ["cdktf-cli"] }],
  //                 metadata: {
  //                   help: {
  //                     command: "yarn cdktf synth --help",
  //                     example: {
  //                       options: {
  //                         strict: true,
  //                       },
  //                     },
  //                   },
  //                   technologies: ["cdktf"],
  //                 },
  //                 options: { cwd: "proj" },
  //                 outputs: ["{projectRoot}/cdktf.test.out"],
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   ]);
  //});
});
