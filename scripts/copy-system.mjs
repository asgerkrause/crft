import { constants } from "node:fs";
import {
  access,
  copyFile,
  lstat,
  mkdir,
  realpath,
  rm,
} from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
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

async function exists(path) {
  try {
    await lstat(path);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function resolveTarget(targetArgument, sourceRoot) {
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
  if (target === sourceRoot) throw new Error(`Target must not be the source root: ${target}`);

  try {
    if (await exists(target)) throw new Error(`Target already exists: ${target}`);
  } catch (error) {
    if (error.message.startsWith("Target already exists:")) throw error;
    throw new Error(`Target cannot be safely addressed: ${target} (${error.message})`);
  }

  return target;
}

async function copySystem(sourceRoot, target) {
  let ownsTarget = false;

  try {
    await mkdir(target);
    ownsTarget = true;
    await mkdir(join(target, "styles"));

    for (const file of files) {
      await copyFile(join(sourceRoot, file), join(target, file));
    }
  } catch (error) {
    if (ownsTarget) await rm(target, { force: true, recursive: true });
    if (error.code === "EEXIST") throw new Error(`Target already exists: ${target}`);
    throw error;
  }
}

try {
  const { dryRun, target: targetArgument } = parseArguments(process.argv.slice(2));
  const sourceRoot = await realpath(fileURLToPath(new URL("../", import.meta.url)));
  const target = await resolveTarget(targetArgument, sourceRoot);

  if (dryRun) {
    console.log(`PLAN: copy ${files.length} files to ${target}`);
    for (const file of files) console.log(`  ${join(target, file)}`);
    console.log("PLAN: no files created");
  } else {
    await copySystem(sourceRoot, target);
    console.log(`COPIED: ${files.length} files to ${target}`);
  }
} catch (error) {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
}
