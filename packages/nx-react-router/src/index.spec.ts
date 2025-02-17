import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2 } from "./index.js";
import { vol } from "memfs";

vi.mock("node:fs", async () => {
  const memfs = await vi.importActual<typeof import("memfs")>("memfs");
  return { default: memfs.fs, ...memfs.fs };
});

describe("nx-react-router", () => {
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

  it("should create nodes based on react-router.ts", async () => {
    vol.fromJSON({
      "pnpm exec.lock": "",
      "proj/react-router.ts": ``,
      "proj/project.json": "{}",
    });

    const results = await createNodesFunction(
      ["proj/react-router.config.ts"],
      {
        buildTargetName: "build-test",
        devTargetName: "dev-test",
        startTargetName: "start-test",
        typecheckTargetName: "typecheck-test",
      },
      context
    );

    expect(results).toMatchObject([
      [
        "proj/react-router.config.ts",
        {
          projects: {
            proj: {
              root: "proj",
              targets: {
                "build-test": {
                  cache: true,
                  command: "react-router build",
                  inputs: ["production", "^production", { externalDependencies: ["react-router"] }],
                  metadata: {
                    technologies: ["react-router"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/.react-router"],
                },
                "dev-test": {
                  cache: true,
                  command: "react-router dev",
                  inputs: ["production", "^production", { externalDependencies: ["react-router"] }],
                  metadata: {
                    technologies: ["react-router"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/.react-router"],
                },
                "start-test": {
                  cache: true,
                  command: "react-router start",
                  inputs: ["production", "^production", { externalDependencies: ["react-router"] }],
                  metadata: {
                    technologies: ["react-router"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/.react-router"],
                },
                "typecheck-test": {
                  cache: true,
                  command: "react-router typegen && tsc",
                  inputs: ["production", "^production", { externalDependencies: ["react-router"] }],
                  metadata: {
                    technologies: ["react-router"],
                  },
                  options: { cwd: "proj" },
                  outputs: ["{projectRoot}/.react-router"],
                },
              },
            },
          },
        },
      ],
    ]);
  });

  // it("should create nodes based on cdk.json with output cache", async () => {
  //   vol.fromJSON({
  //     "proj/react-router.config.ts": ``,
  //     "proj/project.json": "{}",
  //   });

  //   const results = await createNodesFunction(
  //     ["proj/cdk.json"],
  //     {
  //       buildTargetName: "build-test",
  //       devTargetName: "dev-test",
  //       startTargetName: "start-test",
  //       typecheckTargetName: "typecheck-test",
  //     },
  //     context
  //   );

  //   expect(results).toMatchObject([
  //     [
  //       "proj/cdk.json",
  //       {
  //         projects: {
  //           proj: {
  //             root: "proj",
  //             targets: {
  //               "bootstrap-test": {
  //                 cache: true,
  //                 command: "cdk bootstrap",
  //                 inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
  //                 metadata: {
  //                   technologies: ["cdk"],
  //                 },
  //                 options: { cwd: "proj" },
  //                 outputs: ["{projectRoot}/cdk.test.out"],
  //               },
  //               "deploy-test": {
  //                 cache: true,
  //                 command: "cdk deploy",
  //                 inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
  //                 metadata: {
  //                   help: {
  //                     command: "pnpm exec cdk deploy --help",
  //                     example: {
  //                       options: {
  //                         "require-approval": "never",
  //                       },
  //                     },
  //                   },
  //                   technologies: ["cdk"],
  //                 },
  //                 options: { cwd: "proj" },
  //                 outputs: ["{projectRoot}/cdk.test.out"],
  //               },
  //               "synth-test": {
  //                 cache: true,
  //                 command: "cdk synth",
  //                 inputs: ["production", "^production", { externalDependencies: ["aws-cdk"] }],
  //                 metadata: {
  //                   help: {
  //                     command: "pnpm exec cdk synth --help",
  //                     example: {
  //                       options: {
  //                         strict: true,
  //                       },
  //                     },
  //                   },
  //                   technologies: ["cdk"],
  //                 },
  //                 options: { cwd: "proj" },
  //                 outputs: ["{projectRoot}/cdk.test.out"],
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   ]);
  // });
});
