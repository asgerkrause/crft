import { constants } from "node:fs";
import {
  access,
  copyFile,
  lstat,
  mkdir,
  realpath,
  rename,
  rm,
} from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const files = [
  "global.css",
  "sans.ttf",
  "mono.ttf",
  "styles/base.css",
  "styles/tokens.css",
  "styles/type.css",
  "styles/layout.css",
  "styles/features.css",
  "styles/utility.css",
  "styles/project.css",
];

const usage = "Usage: node scripts/copy-system.mjs [--dry-run] <target>";

function parseArguments(arguments_) {
  let dryRun = false;
  const targets = [];

  for (const argument of arguments_) {
    if (argument === "--dry-run") {
      if (dryRun) throw new Error(usage);
      dryRun = true;
    } else if (argument.startsWith("-")) {
      throw new Error(`${usage}\nUnknown option: ${argument}`);
    } else {
      targets.push(argument);
    }
  }

  if (targets.length !== 1) throw new Error(usage);
  return { dryRun, target: targets[0] };
}

/**
 * Validate and copy through private staging, then atomically claim the empty target.
 * Under the documented stable-filesystem precondition, cleanup verifies the
 * recorded inode before recursively removing a process-created directory.
 * @param {{ sourceRoot: string, target: string, dryRun?: boolean, beforePublish?: (paths: { staging: string, target: string }) => Promise<void> | void }} input
 */
async function adoptSystem(input) {
  const { sourceRoot, target: targetArgument, dryRun = false, beforePublish } = input ?? {};
  const source = await resolveSource(sourceRoot);
  const destination = await resolveDestination(targetArgument, source);
  await validateManifest(source);
  if (dryRun) return { sourceRoot: source, target: destination.target, dryRun: true };

  let staging = await createOwnedDirectory(join(destination.parent, `.seess-stage-${randomUUID()}`), "staging");
  let claimed;
  try {
    await copyManifest(source, staging.path);
    if (beforePublish) await beforePublish({ staging: staging.path, target: destination.target });
    claimed = await createOwnedDirectory(destination.target, "target");
    await publishManifest(staging.path, claimed.path);
    await removeOwnedDirectory(staging);
    staging = undefined;
    claimed = undefined;
    return { sourceRoot: source, target: destination.target, dryRun: false };
  } finally {
    if (claimed) await removeOwnedDirectory(claimed);
    if (staging) await removeOwnedDirectory(staging);
  }
}

/** @param {unknown} sourceRoot */
async function resolveSource(sourceRoot) {
  if (typeof sourceRoot !== "string") throw new TypeError("Source root must be a path");
  let source;
  try {
    if ((await lstat(sourceRoot)).isSymbolicLink()) throw new Error("source root is a symbolic link");
    source = await realpath(sourceRoot);
    if (!(await lstat(source)).isDirectory()) throw new Error("source root is not a directory");
  } catch (error) {
    throw new Error(`Source root cannot be safely addressed: ${error.message}`);
  }
  return source;
}

/** @param {unknown} targetArgument @param {string} source */
async function resolveDestination(targetArgument, source) {
  if (typeof targetArgument !== "string") throw new TypeError("Target must be a path");
  const requestedTarget = resolve(targetArgument);
  const requestedParent = dirname(requestedTarget);
  let parent;
  try {
    parent = await realpath(requestedParent);
    const parentStats = await lstat(parent);
    if (!parentStats.isDirectory()) throw new Error("parent is not a directory");
    await access(parent, constants.W_OK | constants.X_OK);
  } catch (error) {
    throw new Error(`Target parent cannot be safely addressed: ${requestedParent} (${error.message})`);
  }

  const target = join(parent, basename(requestedTarget));
  const sourceRelative = relative(source, target);
  if (target === source || (sourceRelative && !sourceRelative.startsWith("..") && !isAbsolute(sourceRelative))) {
    throw new Error(`Target must not be the source root or its descendant: ${target}`);
  }
  await requireAbsent(target);
  return { parent, target };
}

/** @param {string} path */
async function requireAbsent(path) {
  try {
    await lstat(path);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw new Error(`Target cannot be safely addressed: ${path} (${error.message})`);
  }
  throw new Error(`Target already exists: ${path}`);
}

/** @param {string} source */
async function validateManifest(source) {
  for (const file of files) {
    const path = join(source, file);
    const entry = await lstat(path);
    if (entry.isSymbolicLink() || !entry.isFile()) {
      throw new Error(`Canonical source file is not a regular file: ${file}`);
    }
  }
}

/** @param {string} path @param {"staging" | "target"} kind */
async function createOwnedDirectory(path, kind) {
  try {
    await mkdir(path, { mode: 0o700 });
  } catch (error) {
    if (error.code === "EEXIST" && kind === "target") throw new Error(`Target already exists: ${path}`);
    throw error;
  }
  try {
    const entry = await lstat(path);
    return { path, dev: entry.dev, ino: entry.ino };
  } catch (error) {
    await rm(path, { force: true, recursive: true }).catch(() => {});
    throw error;
  }
}

/** @param {{ path: string, dev: number, ino: number }} owned */
async function removeOwnedDirectory(owned) {
  try {
    const entry = await lstat(owned.path);
    if (entry.isDirectory() && entry.dev === owned.dev && entry.ino === owned.ino) {
      await rm(owned.path, { force: true, recursive: true });
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

/** @param {string} source @param {string} staging */
async function copyManifest(source, staging) {
  await mkdir(join(staging, "styles"));
  for (const file of files) {
    await copyFile(join(source, file), join(staging, file));
  }
}

/** @param {string} staging @param {string} target */
async function publishManifest(staging, target) {
  for (const name of ["global.css", "sans.ttf", "mono.ttf", "styles"]) {
    await rename(join(staging, name), join(target, name));
  }
}

async function main() {
  try {
    const { dryRun, target } = parseArguments(process.argv.slice(2));
    const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
    const result = await adoptSystem({ sourceRoot, target, dryRun });

    if (dryRun) {
      console.log(`PLAN: copy ${files.length} files to ${result.target}`);
      for (const file of files) console.log(`  ${join(result.target, file)}`);
      console.log("PLAN: no files created");
    } else {
      console.log(`COPIED: ${files.length} files to ${result.target}`);
    }
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}

export { adoptSystem, files };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
