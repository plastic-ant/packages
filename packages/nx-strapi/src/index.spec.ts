import { CreateNodesContext } from "@nx/devkit";
import { createNodesV2 } from "./index";
import { vol } from "memfs";

vi.mock("node:fs", async () => {
  const memfs = await vi.importActual<typeof import("memfs")>("memfs");
  return { default: memfs.fs, ...memfs.fs };
});

describe("nx-strapi", () => {
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

  it("should create nodes based on package.json", async () => {
    vol.fromJSON({
      "proj/package.json": `{ "strapi": { "uuid": "xxx" }}`,
    });

    const results = await createNodesFunction(
      ["proj/package.json"],
      {
        buildTargetName: "build-test",
        developTargetName: "dev-test",
        startTargetName: "start-test",
      },
      context
    );

    expect(results).toMatchObject([
      [
        "proj/package.json",
        {
          projects: {
            proj: {
              root: "proj",
              targets: {
                "build-test": {
                  cache: true,
                  command: "strapi build",
                  inputs: [
                    "production",
                    "^production",
                    {
                      externalDependencies: ["@strapi/strapi"],
                    },
                  ],
                  metadata: {
                    help: {
                      command: "pnpm exec strapi build --help",
                      example: {
                        options: {
                          strict: true,
                        },
                      },
                    },
                    technologies: ["strapi"],
                  },
                  options: {
                    cwd: "proj",
                  },
                  outputs: ["{projectRoot}/dist", "{projectRoot}/.strapi"],
                },
                "dev-test": {
                  cache: true,
                  command: "strapi develop",
                  inputs: [
                    "production",
                    "^production",
                    {
                      externalDependencies: ["@strapi/strapi"],
                    },
                  ],
                  metadata: {
                    help: {
                      command: "pnpm exec strapi develop --help",
                      example: {
                        options: {
                          debug: true,
                        },
                      },
                    },
                    technologies: ["strapi"],
                  },
                  options: {
                    cwd: "proj",
                  },
                  outputs: ["{projectRoot}/dist", "{projectRoot}/.strapi"],
                },
                "start-test": {
                  cache: false,
                  command: "strapi start",
                  inputs: [
                    "production",
                    "^production",
                    {
                      externalDependencies: ["@strapi/strapi"],
                    },
                  ],
                  options: {
                    cwd: "proj",
                  },
                  outputs: ["{projectRoot}/dist", "{projectRoot}/.strapi"],
                },
              },
            },
          },
        },
      ],
    ]);
  });
});
