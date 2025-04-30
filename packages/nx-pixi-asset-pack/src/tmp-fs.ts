import {
  appendFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  realpathSync,
  renameSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "path";
import { tmpdir } from "os";
import { joinPathFragments } from "@nx/devkit";
import path from "node:path";
import { fileExists } from "nx/src/utils/fileutils";

function workspaceRootInner(dir: string, candidateRoot: string | null): string {
  if (process.env.NX_WORKSPACE_ROOT_PATH) return process.env.NX_WORKSPACE_ROOT_PATH;
  if (path.dirname(dir) === dir) return candidateRoot!;

  const matches = [path.join(dir, "nx.json"), path.join(dir, "nx"), path.join(dir, "nx.bat")];

  if (matches.some((x) => fileExists(x))) {
    return dir;
    // This handles the case where we have a workspace which uses npm / yarn / pnpm
    // workspaces, and has a project which contains Nx in its dependency tree.
    // e.g. packages/my-lib/package.json contains @nx/devkit, which references Nx and is
    // thus located in //packages/my-lib/node_modules/nx/package.json
  } else if (fileExists(path.join(dir, "node_modules", "nx", "package.json"))) {
    return workspaceRootInner(path.dirname(dir), dir);
  } else {
    return workspaceRootInner(path.dirname(dir), candidateRoot);
  }
}

let workspaceRoot = workspaceRootInner(process.cwd(), process.cwd());

// Required for integration tests in projects which depend on Nx at runtime, such as lerna and angular-eslint
function setWorkspaceRoot(root: string): void {
  workspaceRoot = root;
}

type NestedFiles = {
  [fileName: string]: string;
};

export class TempFs {
  readonly tempDir: string;

  private previousWorkspaceRoot: string;

  constructor(
    private dirname: string,
    overrideWorkspaceRoot = true,
  ) {
    this.tempDir = realpathSync(mkdtempSync(join(tmpdir(), this.dirname)));
    this.previousWorkspaceRoot = workspaceRoot;

    if (overrideWorkspaceRoot) {
      setWorkspaceRoot(this.tempDir);
    }
  }

  async createFiles(fileObject: NestedFiles) {
    await Promise.all(
      Object.keys(fileObject).map(async (path) => {
        await this.createFile(path, fileObject[path]);
      }),
    );
  }

  createFilesSync(fileObject: NestedFiles) {
    for (const path of Object.keys(fileObject)) {
      this.createFileSync(path, fileObject[path]);
    }
  }

  async createFile(filePath: string, content: string) {
    const dir = joinPathFragments(this.tempDir, dirname(filePath));
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    await writeFile(joinPathFragments(this.tempDir, filePath), content);
  }

  createFileSync(filePath: string, content: string) {
    const dir = joinPathFragments(this.tempDir, dirname(filePath));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(joinPathFragments(this.tempDir, filePath), content);
  }

  createSymlinkSync(fileOrDirPath: string, symlinkPath: string, type: "dir" | "file") {
    const absoluteFileOrDirPath = joinPathFragments(this.tempDir, fileOrDirPath);
    const absoluteSymlinkPath = joinPathFragments(this.tempDir, symlinkPath);
    const symlinkDir = dirname(absoluteSymlinkPath);
    if (!existsSync(symlinkDir)) {
      mkdirSync(symlinkDir, { recursive: true });
    }

    symlinkSync(absoluteFileOrDirPath, absoluteSymlinkPath, type);
  }

  async readFile(filePath: string): Promise<string> {
    return await readFile(joinPathFragments(this.tempDir, filePath), "utf-8");
  }

  removeFileSync(filePath: string): void {
    unlinkSync(joinPathFragments(this.tempDir, filePath));
  }

  appendFile(filePath: string, content: string) {
    appendFileSync(joinPathFragments(this.tempDir, filePath), content);
  }

  writeFile(filePath: string, content: string) {
    writeFileSync(joinPathFragments(this.tempDir, filePath), content);
  }
  renameFile(oldPath: string, newPath: string) {
    renameSync(joinPathFragments(this.tempDir, oldPath), joinPathFragments(this.tempDir, newPath));
  }

  cleanup() {
    try {
      rmSync(this.tempDir, { recursive: true, force: true, maxRetries: 5 });
      setWorkspaceRoot(this.previousWorkspaceRoot);
    } catch (e) {
      // We are experiencing flakiness in CI related to this cleanup, so log only for now
      if (process.env.CI) {
        console.error(`Failed to cleanup temp dir: ${e}`);
      } else {
        throw e;
      }
    }
  }

  reset() {
    try {
      rmSync(this.tempDir, { recursive: true, force: true, maxRetries: 5 });
      mkdirSync(this.tempDir, { recursive: true });
    } catch (e) {
      // We are experiencing flakiness in CI related to this cleanup, so log only for now
      if (process.env.CI) {
        console.error(`Failed to cleanup temp dir: ${e}`);
      } else {
        throw e;
      }
    }
  }
}
