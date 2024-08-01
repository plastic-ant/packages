///import nxScopes from "@commitlint/config-nx-scopes";
//import { RuleConfigSeverity } from "@commitlint/types";
import { getProjects } from "nx/src/generators/utils/project-configuration.js";
import { FsTree } from "nx/src/generators/tree.js";

function listProjects(context, selector = () => true) {
  const ctx = context || {};
  const cwd = ctx.cwd || process.cwd();
  const projects = getProjects(new FsTree(cwd, false));

  return Array.from(projects.entries())
    .map(([name, project]) => ({ name, ...project }))
    .filter((project) => selector({ name: project.name, projectType: project.projectType, tags: project.tags }))
    .map((project) => project.name)
    .map((name) => (name.charAt(0) === "@" ? name.split("/")[1] : name));
}

const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-empty": [2, "never"],
    "scope-enum": async (ctx) => {
      return [2, "always", ["docs", "repo", "ci", ...listProjects(ctx, ({ name }) => !name.includes("e2e"))]];
    },
  },
};

export default config;
