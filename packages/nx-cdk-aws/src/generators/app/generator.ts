import { formatFiles, generateFiles, offsetFromRoot, Tree } from "@nx/devkit";
import * as path from "path";
import { AppGeneratorSchemaOptions } from "./schema";
import { determineProjectNameAndRootOptions } from "@nx/devkit/src/generators/project-name-and-root-utils";

export default async function (tree: Tree, options: AppGeneratorSchemaOptions) {
  const {
    projectName,
    names: projectNames,
    projectRoot,
  } = await determineProjectNameAndRootOptions(tree, {
    name: options.name,
    projectType: "application",
    directory: options.directory,
    projectNameAndRootFormat: options.projectNameAndRootFormat,
    callingGenerator: "nx-cdk-aws:app",
  });

  generateFiles(tree, path.join(__dirname, "files"), projectRoot, {
    ...options,
    ...projectNames,
    projectName,
    projectRoot,
    projectRootSrc: path.join(projectRoot, "lib"),
    offsetFromRoot: offsetFromRoot(projectRoot),
    template: "",
  });

  await formatFiles(tree);
}
