import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const usage = "Usage: node scripts/emit-contract.mjs [--out <path>]";
const layerDependencies = {
  tokens: [],
  type: ["tokens"],
  layout: ["tokens"],
  grid: ["tokens", "layout"],
  base: ["tokens"],
  motion: ["tokens", "layout"],
  utility: [],
};
// Public composition hooks. Keep aligned with CRAFT.md public-hook-index.
const hooks = {
  attributes: ["g", "c", "r", "o", "l", "data-theme", "data-skin", "data-accent", "data-scrub", "container", "sg", "fit", "fit-sm", "fit-lg", "fill", "fill-sm", "fill-lg"],
  classes: [".c", ".c.sm", ".c.lg", ".s", ".display", ".h1", ".h2", ".h3", ".lead", ".body", ".small", ".label", ".caption", ".img-w", ".sr", ".sr.focusable"],
};
const staticBans = [
  "never *-block-start or *-inline-start single-side longhands",
  "never a class on section",
  "never style through an ID selector",
  "never new spacing, alignment, or display utility matrices",
  "never substring attribute selectors in documentation",
  "never explicit wght in canonical role axes; ordinary weight uses font-weight",
  "never heading max-width; override the role's --ROLE-measure token",
];

const unique = (values) => [...new Set(values)];
const stripCssComments = (value) => value.replace(/\/\*[\s\S]*?\*\//g, "");

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function resolveRoot(rootUrl) {
  if (rootUrl == null) throw new TypeError("rootUrl is required");
  if (typeof rootUrl === "string") {
    return rootUrl.startsWith("file:") ? fileURLToPath(rootUrl) : rootUrl;
  }
  return fileURLToPath(rootUrl);
}

function findLayersDirectory(root) {
  for (const dir of [join(root, "styles"), root]) {
    const layers = join(dir, "layers");
    if (existsSync(layers) && readdirSync(layers).some((name) => name.endsWith(".css") || name === "crft-manifest.json")) return layers;
    if (existsSync(join(dir, "tokens.css")) || existsSync(join(dir, "crft.css"))) return dir;
  }
  return join(root, "layers");
}

function declaredProperties(css) {
  return unique([...stripCssComments(css).matchAll(/(--[a-z0-9_-]+)\s*:/g)].map((match) => match[1])).sort();
}

function quotedAttributeValues(css, attribute) {
  const pattern = new RegExp(`\\[${attribute}=(['"])([^'"]+)\\1\\]`, "g");
  return unique([...stripCssComments(css).matchAll(pattern)].map((match) => match[2])).sort();
}

function declaredLayers(css) {
  return unique(
    [...stripCssComments(css).matchAll(/@layer\s+([a-z0-9_-]+(?:\s*,\s*[a-z0-9_-]+)*)\s*\{/gi)]
      .flatMap((match) => match[1].split(",").map((name) => name.trim())),
  );
}

function snapshotDependencies() {
  return Object.fromEntries(
    Object.entries(layerDependencies).map(([name, needs]) => [name, [...needs]]),
  );
}

function gitState(cwd) {
  const revision = spawnSync("git", ["rev-parse", "HEAD"], { cwd, encoding: "utf8" });
  const status = spawnSync("git", ["status", "--porcelain"], { cwd, encoding: "utf8" });
  return {
    revision: revision.status === 0 ? revision.stdout.trim() || null : null,
    dirty: status.status === 0 && status.stdout.trim() !== "",
  };
}

function buildContract(rootUrl) {
  const root = resolveRoot(rootUrl);
  const layersDir = findLayersDirectory(root);
  const flat = layersDir === root || layersDir === join(root, "styles");
  const files = existsSync(layersDir)
    ? readdirSync(layersDir).filter((name) => flat ? ["tokens.css", "crft.css"].includes(name) : name.endsWith(".css")).sort()
    : [];
  const sources = Object.fromEntries(
    files.map((name) => [name, readFileSync(join(layersDir, name), "utf8")]),
  );
  const tokensCss = sources["tokens.css"] ?? "";
  const publicTokens = declaredProperties(tokensCss).filter((name) => !name.startsWith("--_"));
  const publicSet = new Set(publicTokens);
  const privateProperties = unique(
    files
      .flatMap((name) => declaredProperties(sources[name])),
  )
    .filter((name) => !publicSet.has(name))
    .sort();
  const git = gitState(root);

  return {
    contractVersion: 2,
    ...(flat ? { packagingVersion: 1 } : {}),
    revision: git.revision,
    dirty: git.dirty,
    publicTokens,
    privateProperties,
    bans: [
      ...privateProperties.map((name) => `never use ${name} in product CSS or examples`),
      ...staticBans,
    ],
    themes: quotedAttributeValues(tokensCss, "data-theme"),
    skins: quotedAttributeValues(tokensCss, "data-skin"),
    accents: quotedAttributeValues(tokensCss, "data-accent"),
    layers: Object.fromEntries(files.map((name) => [name, declaredLayers(sources[name])])),
    layerDependencies: snapshotDependencies(),
    hooks,
  };
}

function parseArguments(arguments_) {
  let out;
  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];
    if (argument === "--out") {
      if (out != null) throw new Error(usage);
      const value = arguments_[index + 1];
      if (!value || value.startsWith("-")) throw new Error(usage);
      out = value;
      index += 1;
    } else if (argument.startsWith("--out=")) {
      if (out != null) throw new Error(usage);
      out = argument.slice("--out=".length);
      if (!out) throw new Error(usage);
    } else if (argument.startsWith("-")) {
      throw new Error(`${usage}\nUnknown option: ${argument}`);
    } else {
      throw new Error(usage);
    }
  }
  return { out };
}

function main() {
  try {
    const { out } = parseArguments(process.argv.slice(2));
    const json = `${JSON.stringify(buildContract(new URL("../", import.meta.url)), null, 2)}\n`;
    process.stdout.write(json);
    if (out) writeFileSync(out, json);
  } catch (error) {
    fail(error.message);
  }
}

export { buildContract, gitState, layerDependencies, staticBans };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
