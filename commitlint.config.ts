import { utils } from "@commitlint/config-nx-scopes";

const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": async (ctx) => {
      return [2, "always", ["repo", "ci", ...utils.getProjects(ctx, ({ name, projectType }) => !name.includes("e2e"))]];
    },
  },
  // . . .
};

export default config;
