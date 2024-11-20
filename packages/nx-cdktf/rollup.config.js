const { withNx } = require("@nx/rollup/with-nx");
const { join } = require("node:path");
//const { isCI } = require("ci-info");
const packageTidy = require("../../tools/scripts/rollup-plugins/tidy-package-json");

// "types": "./index.d.ts",
// "typings": "./index.d.ts",

module.exports = withNx(
  {
    main: "./src/index.ts",
    outputPath: "./dist",
    tsConfig: "./tsconfig.lib.json",
    compiler: "tsc",
    sourceMap: false, //!isCI,
    format: ["cjs", "esm"],
    assets: [
      {
        input: "packages/nx-cdktf",
        glob: "package.json",
        output: "/",
      },
    ],
  },
  {
    plugins: [packageTidy({ packagePath: join(__dirname, "package.json") })],
  }
);
