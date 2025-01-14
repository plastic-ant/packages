import { Tree } from "@nx/devkit";
import { AppGeneratorOptions } from "./schema";
import { spawnSync } from "child_process";

export default async function (tree: Tree, options: AppGeneratorOptions) {
  spawnSync(`npx create-strapi`, { cwd: options.directory });
  return { success: true };
}
