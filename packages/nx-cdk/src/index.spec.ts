import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2 } from "./index";
import { vol } from "memfs";

jest.mock("node:fs", () => ({
  ...jest.requireActual("memfs"),
}));

describe("nx-cdk", () => {
  const createNodesFunction = createNodesV2[1];
  let context: CreateNodesContext;
  const outputPath = "../../../dist/cdk.out";

  beforeEach(async () => {
    vol.fromJSON({
      "proj/cdk.json": `{ "output": "${outputPath}"}`,
      "proj/project.json": "{}",
    });

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

  it("should create nodes based on cdk.json", async () => {
    const results = await createNodesFunction(
      ["proj/cdk.json"],
      {
        synthTargetName: "synth-test",
        deployTargetName: "deploy-test",
      },
      context
    );

    expect(results).toMatchInlineSnapshot(`
      [
        [
          "proj/cdk.json",
          {
            "projects": {
              "proj": {
                "metadata": undefined,
                "root": "proj",
                "targets": {
                  "deploy-test": {
                    "cache": true,
                    "command": "cdk deploy",
                    "inputs": [
                      "production",
                      "^production",
                      {
                        "externalDependencies": [
                          "aws-cdk",
                        ],
                      },
                    ],
                    "metadata": {
                      "help": {
                        "command": "yarn cdk deploy --help",
                        "example": {
                          "options": {
                            "require-approval": "never",
                          },
                        },
                      },
                      "technologies": [
                        "cdk",
                      ],
                    },
                    "options": {
                      "cwd": "proj",
                    },
                    "outputs": [
                      "${outputPath}",
                    ],
                  },
                  "synth-test": {
                    "cache": true,
                    "command": "cdk synth",
                    "inputs": [
                      "production",
                      "^production",
                      {
                        "externalDependencies": [
                          "aws-cdk",
                        ],
                      },
                    ],
                    "metadata": {
                      "help": {
                        "command": "yarn cdk synth --help",
                        "example": {
                          "options": {
                            "strict": true,
                          },
                        },
                      },
                      "technologies": [
                        "cdk",
                      ],
                    },
                    "options": {
                      "cwd": "proj",
                    },
                    "outputs": [
                      "${outputPath}",
                    ],
                  },
                },
              },
            },
          },
        ],
      ]
    `);
  });
});
