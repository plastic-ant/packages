// module.exports = {
//   extends: ["@commitlint/config-nx-scopes", "@commitlint/config-conventional"],
//   rules: {
//     "scope-empty": [2, "never"],
//     "scope-enum": [2, "always", ["ci"]],
//   },
// };

const {
  utils: { getProjects },
} = require("@commitlint/config-nx-scopes");

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": async (ctx) => {
      return [2, "always", ["repo", ...getProjects(ctx, ({ name, projectType }) => !name.includes("e2e"))]];
    },
  },
  // . . .
};
