import baseConfig from "../../eslint.config.mjs";
import jsoncEslintParser from "jsonc-eslint-parser";

export default [
  ...baseConfig,
  {
    ignores: ["**/schema.d.ts"],
  },
  {
    files: ["**/{project,package}.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        {
          includeTransitiveDependencies: false,
          checkMissingDependencies: true,
          checkObsoleteDependencies: true,
          checkVersionMismatches: true,
          buildTargets: ["build"],
          ignoredDependencies: ["tslib", "aws-cdk-lib", "aws-cdk"],
          ignoredFiles: ["**/*.config.{ts,js,cjs,mjs,mts}"],
        },
      ],
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
];
