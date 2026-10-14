import { constants } from "node:fs";
import {
  access,
  copyFile,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { basename, dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const behaviorLayers = ["base", "tokens", "type", "layout", "grid", "motion", "utility"];
const cascadePrelude = "@layer reset, base, tokens, type, layout, grid, motion, utility, project;";
const adoptionManifestFile = "crft-manifest.json";
const copyableSourceFiles = ["tokens.css", "crft.css", "sans.woff", "mono.woff"];

// The optional faces are the final marked section of the canonical token owner.
function tokensWithoutFonts(css) {
  return `${css.split("/* Optional bundled fonts. */")[0].trimEnd()}\n`;
}

const usage = "Usage: node scripts/copy-system.mjs [--dry-run] --layers <tokens|full> [--fonts] <target>";

/**
 * Resolve a consumer copy request to a file list and project-entry block.
 * @param {{ layers?: unknown, fonts?: unknown }} input
 */
function resolveAdoptRequest(input) {
  const { layers, fonts = false } = input ?? {};
  if (typeof fonts !== "boolean") throw new TypeError("fonts must be a boolean");
  const layerNames = parseLayerNames(layers);
  const cssFiles = layerNames.length === 1 ? ["tokens.css"] : ["tokens.css", "crft.css"];
  const manifest = fonts ? [...cssFiles, "sans.woff", "mono.woff"] : cssFiles;
  return {
    layerNames,
    fonts,
    manifest,
    entryBlock: [
      cascadePrelude,
      "",
      ...cssFiles.map((file) => `@import "./${file}";`),
    ].join("\n"),
  };
}

/** @param {unknown} layers */
function parseLayerNames(layers) {
  if (layers == null || layers === "") throw new Error(usage);
  if (layers === "tokens") return ["tokens"];
  if (layers === "full") return [...behaviorLayers];
  throw new Error(`Unsupported layer selection: ${String(layers)}. Use tokens or full; extract individual behavior into project CSS.\n${usage}`);
}

function parseArguments(arguments_) {
  let dryRun = false;
  let fonts = false;
  let layers;
  const targets = [];

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === "--dry-run") {
      if (dryRun) throw new Error(usage);
      dryRun = true;
    } else if (argument === "--fonts") {
      if (fonts) throw new Error(usage);
      fonts = true;
    } else if (argument === "--layers") {
      if (layers != null) throw new Error(usage);
      const value = arguments_[index + 1];
      if (!value || value.startsWith("-")) throw new Error(usage);
      layers = value;
      index += 1;
    } else if (argument.startsWith("--layers=")) {
      if (layers != null) throw new Error(usage);
      layers = argument.slice("--layers=".length);
    } else if (argument.startsWith("-")) {
      throw new Error(`${usage}\nUnknown option: ${argument}`);
    } else {
      targets.push(argument);
    }
  }

  if (layers == null || targets.length !== 1) throw new Error(usage);
  return { dryRun, fonts, layers, target: targets[0] };
}

/**
 * Validate and copy through private staging, then atomically claim the empty destinations.
 * @param {{ sourceRoot: string, target: string, layers?: unknown, fonts?: boolean, dryRun?: boolean, beforePublish?: (paths: { staging: string, target: string }) => Promise<void> | void }} input
 */
async function adoptSystem(input) {
  const {
    sourceRoot,
    target: targetArgument,
    layers,
    fonts = false,
    dryRun = false,
    beforePublish,
  } = input ?? {};
  const adopted = resolveAdoptRequest({ layers, fonts });
  const destinations = [...adopted.manifest, adoptionManifestFile];
  const repoRoot = await resolveSource(sourceRoot);
  const source = await hasSystemManifest(join(repoRoot, "styles")) ? join(repoRoot, "styles") : repoRoot;
  const destination = await resolveDestination(targetArgument, repoRoot, true);
  await validateManifest(source, adopted.manifest);
  await validateDestinationManifest(destination.target, destinations);
  if (dryRun) {
    return {
      sourceRoot: repoRoot,
      target: destination.target,
      dryRun: true,
      destinations,
      ...adopted,
    };
  }

  await copyIntoTarget({
    source,
    destination,
    manifest: adopted.manifest,
    destinations,
    sourceRoot: repoRoot,
    adopted,
    beforePublish,
  });
  return {
    sourceRoot: repoRoot,
    target: destination.target,
    dryRun: false,
    destinations,
    ...adopted,
  };
}

/** Copy the requested files into an existing or new styles directory after a complete conflict preflight. */
async function copyIntoTarget({ source, destination, manifest, destinations, sourceRoot, adopted, beforePublish }) {
  let staging = await createOwnedDirectory(join(destination.parent, `.crft-stage-${randomUUID()}`), "staging");
  let targetCreated;
  const copied = [];
  try {
    await copyManifest(source, staging.path, manifest);
    if (!adopted.fonts) {
      const path = join(staging.path, "tokens.css");
      await writeFile(path, tokensWithoutFonts(await readFile(path, "utf8")));
    }
    await writeAdoptionManifest(staging.path, sourceRoot, adopted, manifest);
    for (const file of destinations) await requireAbsent(join(destination.target, file));
    if (beforePublish) await beforePublish({ staging: staging.path, target: destination.target });
    try {
      const entry = await lstat(destination.target);
      if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`Target must be a directory: ${destination.target}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      targetCreated = await createOwnedDirectory(destination.target, "target");
    }
    for (const file of destinations) {
      const output = join(destination.target, file);
      await mkdir(dirname(output), { recursive: true });
      await copyFile(join(staging.path, file), output, constants.COPYFILE_EXCL);
      copied.push(output);
    }
    await removeOwnedDirectory(staging);
    staging = undefined;
  } catch (error) {
    await Promise.allSettled(copied.reverse().map((path) => rm(path, { force: true })));
    if (targetCreated) await removeOwnedDirectory(targetCreated);
    throw error;
  } finally {
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
async function resolveDestination(targetArgument, source, allowExistingDirectory = false) {
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
  if (allowExistingDirectory) {
    try {
      const entry = await lstat(target);
      if (entry.isSymbolicLink() || !entry.isDirectory()) throw new Error(`Target must be a directory: ${target}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  } else {
    await requireAbsent(target);
  }
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

async function validateDestinationManifest(target, manifest) {
  try {
    const names = await readdir(join(target, "layers"));
    if (names.some((name) => name.endsWith(".css") || name === "crft-manifest.json")) throw new Error("Mixed flat and legacy layer packaging; use an empty adoption target");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  for (const file of manifest) await requireAbsent(join(target, file));
}

async function hasSystemManifest(path) {
  try {
    return (await lstat(join(path, "global.css"))).isFile();
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

/** @param {string} source @param {string[]} manifest */
async function validateManifest(source, manifest) {
  for (const file of manifest) {
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

/** @param {string} source @param {string} staging @param {string[]} manifest */
async function copyManifest(source, staging, manifest) {
  const directories = new Set(
    manifest
      .map((file) => dirname(file))
      .filter((dir) => dir && dir !== "."),
  );
  for (const dir of [...directories].sort()) {
    await mkdir(join(staging, dir), { recursive: true });
  }
  for (const file of manifest) {
    await copyFile(join(source, file), join(staging, file));
  }
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

async function writeAdoptionManifest(staging, sourceRoot, adopted, manifest) {
  // Dynamic so this module stays loadable when copied without emit-contract.mjs.
  const { buildContract } = await import(new URL("./emit-contract.mjs", import.meta.url));
  const contract = buildContract(sourceRoot);
  const files = {};
  for (const file of manifest) {
    files[file] = sha256(await readFile(join(staging, file)));
  }
  const body = {
    contractVersion: 2,
    packagingVersion: 1,
    source: "crft",
    revision: contract.revision,
    dirty: contract.dirty,
    copiedAt: new Date().toISOString(),
    layers: adopted.layerNames,
    fonts: adopted.fonts,
    files,
    contract: {
      contractVersion: 2,
      packagingVersion: 1,
      themes: contract.themes,
      hooks: contract.hooks,
      publicTokens: contract.publicTokens,
      privateProperties: contract.privateProperties,
      skins: contract.skins,
      accents: contract.accents,
      layerDependencies: contract.layerDependencies,
    },
  };
  await writeFile(join(staging, adoptionManifestFile), `${JSON.stringify(body, null, 2)}\n`);
}

function printPlan(result) {
  const files = result.destinations ?? result.manifest;
  console.log(`PLAN: copy ${files.length} files to ${result.target}`);
  for (const file of files) console.log(`  ${join(result.target, file)}`);
  console.log("PLAN: project entry");
  console.log(result.entryBlock);
  console.log("PLAN: no files created");
}

async function main() {
  try {
    const { dryRun, fonts, layers, target } = parseArguments(process.argv.slice(2));
    const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
    const result = await adoptSystem({ sourceRoot, target, layers, fonts, dryRun });

    if (dryRun) {
      printPlan(result);
    } else {
      console.log(`COPIED: ${result.destinations.length} files to ${result.target}`);
      console.log("ENTRY:");
      console.log(result.entryBlock);
    }
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}

export {
  adoptSystem,
  behaviorLayers,
  copyableSourceFiles,
  resolveAdoptRequest,
  tokensWithoutFonts,
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
