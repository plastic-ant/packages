import nx from "@nx/eslint-plugin";
import jsoncEslintParser from "jsonc-eslint-parser";
import yamlEslintParser from "yaml-eslint-parser";
import globals from "globals";

export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // {
  //   files: ["**/*.ts", "**/*.tsx", "**/*.cts", "**/*.mts"],
  //   rules: {
  //     "prefer-const": "error",
  //     "no-var": "error",
  //     "@typescript-eslint/no-empty-interface": "warn",
  //     "@typescript-eslint/no-empty-object-type": "warn",
  //     "@typescript-eslint/no-unused-vars": "off",
  //     "@typescript-eslint/no-empty-function": "off",
  //     "@typescript-eslint/ban-ts-comment": "error",
  //     "@typescript-eslint/no-explicit-any": "warn",
  //     "@typescript-eslint/naming-convention": [
  //       "warn",
  //       { selector: "variable", format: ["camelCase", "UPPER_CASE"] },
  //       { selector: "function", format: ["camelCase"] },
  //     ],
  //   },
  // },
  {
    files: ["**/*.yaml", "**/*.yml"],
    rules: {
      "spaced-comment": "off",
    },
    languageOptions: {
      parser: yamlEslintParser,
    },
  },
  {
    files: ["**/*.json"],
    rules: {},
    languageOptions: {
      parser: jsoncEslintParser,
    },
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
          ignoredDependencies: ["tslib"],
          ignoredFiles: ["**/*.config.{ts,js,cjs,mjs,mts}"],
        },
      ],
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
  {
    files: ["**/{generators,executors,package}.json"],
    rules: {
      "@nx/nx-plugin-checks": "error",
    },
    languageOptions: {
      parser: jsoncEslintParser,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.cts", "**/*.mts", "**/*.cjs"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?js$"],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
        },
      ],
    },
  },
];
