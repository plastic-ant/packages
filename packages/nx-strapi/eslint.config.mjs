import baseConfig from "../../eslint.config.mjs";
import jsoncEslintParser from "jsonc-eslint-parser";

export default [
  ...baseConfig,
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
          ignoredDependencies: ["tslib", "@strapi/strapi", "create-strapi"],
          ignoredFiles: ["**/*.config.{ts,js,cjs,mjs,mts}"],
        },
      ],
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
];
