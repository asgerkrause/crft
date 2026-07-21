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
 * Validate and copy the canonical tree through a private sibling staging directory.
 * Staging is the only recursively removed path; the final target is never removed.
 * @param {{ sourceRoot: string, target: string, dryRun?: boolean, beforePublish?: (paths: { staging: string, target: string }) => Promise<void> | void }} input
 */
async function adoptSystem(input) {
  const { sourceRoot, target: targetArgument, dryRun = false, beforePublish } = input ?? {};
  const source = await resolveSource(sourceRoot);
  const destination = await resolveDestination(targetArgument, source);
  await validateManifest(source);
  if (dryRun) return { sourceRoot: source, target: destination.target, dryRun: true };

  let staging = await createStaging(destination.parent);
  try {
    await copyManifest(source, staging.path);
    if (beforePublish) await beforePublish({ staging: staging.path, target: destination.target });
    await requireAbsent(destination.target);
    await rename(staging.path, destination.target);
    staging = undefined;
    return { sourceRoot: source, target: destination.target, dryRun: false };
  } finally {
    if (staging) await removeStaging(staging);
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

/** @param {string} parent */
async function createStaging(parent) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const staging = join(parent, `.seess-stage-${randomUUID()}`);
    try {
      await mkdir(staging, { mode: 0o700 });
      const entry = await lstat(staging);
      return { path: staging, dev: entry.dev, ino: entry.ino };
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
  throw new Error("Unable to create private staging directory");
}

/** @param {{ path: string, dev: number, ino: number }} staging */
async function removeStaging(staging) {
  try {
    const entry = await lstat(staging.path);
    if (entry.dev === staging.dev && entry.ino === staging.ino) {
      await rm(staging.path, { force: true, recursive: true });
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
