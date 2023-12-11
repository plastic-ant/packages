import { InitGeneratorSchemaOptions } from "./schema";
import { addDependenciesToPackageJson, convertNxGenerator, Tree } from "@nx/devkit";

export async function initGenerator(tree: Tree, options: InitGeneratorSchemaOptions) {
  if (!options.skipPackageJson) {
    const task = addDependenciesToPackageJson(
      tree,
      {
        "aws-cdk": "^2.99.0",
        "aws-cdk-lib": "^2.99.0",
      },
      {}
    );

    return task;
  }
}

export default initGenerator;

export const initSchematic = convertNxGenerator(initGenerator);
