import { buildContract, v3CssErrors, declaredProperties, hasExplicitWght } from "./emit-contract.mjs";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const usage = "Usage: node scripts/check-project.mjs <project-styles-dir>";
const bannedSpacing = [
  "padding-block-start",
  "padding-block-end",
  "padding-inline-start",
  "padding-inline-end",
  "margin-block-start",
  "margin-block-end",
  "margin-inline-start",
  "margin-inline-end",
];
const legacy = JSON.parse(readFileSync(new URL("./legacy-contract.json", import.meta.url), "utf8"));
const familyPattern = /^--[lsgprbctm](?:-[a-z0-9_-]+)?$/;
const layerDependencies = {
  tokens: [],
  type: ["tokens"],
  layout: ["tokens"],
  grid: ["tokens", "layout"],
  base: ["tokens"],
  motion: ["tokens", "layout"],
  utility: [],
};

const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const stripCssComments = (value) => value.replace(/\/\*[\s\S]*?\*\//g, "");

function walkProjectCss(root, flat) {
  const files = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (dir === root && entry.name === "layers") continue;
        visit(path);
      } else if (entry.name.endsWith(".css") && !(flat && dir === root && ["tokens.css", "crft.css"].includes(entry.name))) {
        files.push(path);
      }
    }
  };
  visit(root);
  return files.sort();
}

function layerNamesFromFiles(layersDir) {
  if (!existsSync(layersDir)) return [];
  return readdirSync(layersDir)
    .filter((name) => name.endsWith(".css"))
    .map((name) => name.slice(0, -".css".length));
}

function deriveContract(layersDir) {
  const contract = buildContract(resolve(layersDir, ".."));
  const legacyNames = new Set(legacy.publicTokens);
  return { ...contract, contractVersion: contract.publicTokens.some((name) => legacyNames.has(name)) ? 1 : contract.contractVersion };
}

function loadAdoption(target) {
  const layersDir = join(target, "layers");
  const flatManifest = join(target, "crft-manifest.json");
  const legacyManifest = join(layersDir, "crft-manifest.json");
  const legacyLayout = existsSync(legacyManifest) || layerNamesFromFiles(layersDir).length > 0;
  const flatPackage = existsSync(flatManifest) || existsSync(join(target, "crft.css"));
  if (legacyLayout && flatPackage) throw new Error("Mixed flat and legacy layer packaging");
  // A legacy consumer may own a separate root tokens.css.
  const flat = flatPackage || (!legacyLayout && existsSync(join(target, "tokens.css")));
  const manifestPath = flat ? flatManifest : legacyManifest;
  if (!existsSync(manifestPath)) {
    return { contract: flat ? buildContract(target) : deriveContract(layersDir), flat };
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!manifest.contract) throw new Error(`${manifestPath} is missing contract`);
  const version = Object.hasOwn(manifest, "contractVersion") ? manifest.contractVersion : 1;
  if (![1, 2, 3].includes(version)) throw new Error(`Unsupported contractVersion ${version}`);
  if ((Object.hasOwn(manifest.contract, "contractVersion") ? manifest.contract.contractVersion : 1) !== version) throw new Error("Manifest and contract versions disagree");
  if (flat) {
    if (manifest.packagingVersion !== 1 || manifest.contract.packagingVersion !== 1 || ![2, 3].includes(version)) throw new Error("Unsupported or missing packagingVersion for flat adoption");
    if (!Array.isArray(manifest.layers) || !manifest.layers.includes("tokens")) throw new Error("Flat adoption requires tokens");
    const expectedLayers = manifest.layers.length === 1 ? ["tokens"] : ["base", "tokens", "type", "layout", "grid", "motion", "utility"];
    if (manifest.layers.join("|") !== expectedLayers.join("|")) throw new Error("Flat adoption supports tokens or full only");
    for (const file of expectedLayers.length === 1 ? ["tokens.css"] : ["tokens.css", "crft.css"]) {
      if (!existsSync(join(target, file))) throw new Error(`Missing adopted file ${file}`);
    }
  } else if (Object.hasOwn(manifest, "packagingVersion") || Object.hasOwn(manifest.contract, "packagingVersion")) {
    throw new Error("Legacy layer packaging must not declare packagingVersion");
  }
  const sourceContract = buildContract(flat ? target : layersDir);
  if ((version === 3) !== (sourceContract.contractVersion === 3)) throw new Error("Semantic version marker disagrees with adoption; explicit v2/v3 migration required");
  return { contract: manifest.contract, flat };
}

function privatePattern(names) {
  if (!names.length) return null;
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(?:${escaped.join("|")})(?![a-z0-9-])`);
}

function checkProject(target) {
  const { contract, flat } = loadAdoption(target);
  const version = Object.hasOwn(contract, "contractVersion") ? contract.contractVersion : 1;
  if (![1, 2, 3].includes(version)) throw new Error(`Unsupported contractVersion ${version}`);
  for (const field of ["publicTokens", "privateProperties"]) {
    if (!Array.isArray(contract[field]) || !contract[field].every((name) => typeof name === "string" && /^--[a-z0-9_-]+$/.test(name))) throw new Error(`Missing or invalid contract ${field}`);
  }
  if (!contract.layerDependencies || typeof contract.layerDependencies !== "object" || Array.isArray(contract.layerDependencies)) throw new Error("Missing or invalid contract layerDependencies");
  for (const name of Object.keys(layerDependencies)) {
    if (!Array.isArray(contract.layerDependencies[name]) || !contract.layerDependencies[name].every((need) => typeof need === "string" && Object.hasOwn(layerDependencies, need))) throw new Error(`Invalid layer dependencies for ${name}`);
  }
  if (version >= 2) {
    for (const field of (version === 2 ? ["themes", "skins", "accents"] : ["themes", "accents"])) {
      if (!Array.isArray(contract[field]) || !contract[field].every((value) => typeof value === "string")) throw new Error(`Missing or invalid contract ${field}`);
    }
    if (!contract.hooks || !["attributes", "classes"].every((field) => Array.isArray(contract.hooks[field]) && contract.hooks[field].every((hook) => typeof hook === "string"))) throw new Error("Missing or invalid contract hooks");
  }
  if (version === 3 && (contract.themes.join("|") !== "accent|invert|tone" || Object.hasOwn(contract, "skins") || contract.hooks.attributes.includes("data-skin"))) throw new Error("Invalid v3 color contract; explicit v2 migration required");
  const publicTokens = new Set(contract.publicTokens);
  const privates = contract.privateProperties ?? [];
  const privateSet = new Set(privates);
  const dependencies = contract.layerDependencies ?? layerDependencies;
  const bannedPrivate = privatePattern(privates);
  const present = new Set(flat
    ? (existsSync(join(target, "crft.css")) ? Object.keys(layerDependencies) : ["tokens"])
    : layerNamesFromFiles(join(target, "layers")));
  if (flat && !existsSync(join(target, "tokens.css"))) throw new Error("crft.css requires tokens.css");

  for (const layer of present) {
    const missing = (dependencies[layer] ?? []).filter((need) => !present.has(need));
    if (missing.length) fail(`layer ${layer}.css requires ${missing.join(", ")}`);
  }

  const projectFiles = existsSync(target) ? walkProjectCss(target, flat) : [];
  const localProperties = new Set(projectFiles.flatMap((path) => declaredProperties(readFileSync(path, "utf8"))));
  const legacyTokens = new Set(legacy.publicTokens);
  const currentTokens = new Set(buildContract(new URL("../", import.meta.url)).publicTokens);
  const layerFiles = flat
    ? ["tokens.css", "crft.css"].map((file) => join(target, file)).filter(existsSync)
    : [...present].map((layer) => join(target, "layers", `${layer}.css`));
  const allActive = [...projectFiles, ...layerFiles].map((path) => stripCssComments(readFileSync(path, "utf8"))).join("\n");
  if (version >= 2 && (/\[(?:t|s|x|y)(?:[\s~|^$*!=]|\])/.test(allActive) || [...allActive.matchAll(/--[a-z0-9_-]+/g)].some(([name]) => legacyTokens.has(name)))) fail("mixed legacy and v2 hooks or tokens");
  if (version === 1 && ([...allActive.matchAll(/--[a-z0-9_-]+/g)].some(([name]) => currentTokens.has(name) && !legacyTokens.has(name)) || /\[(?:data-theme|r)(?:[\s~|^$*!=]|\])|\.(?:c|s|h[1-3]|display|lead|body|small|caption|label)(?=[\s.{:#])/i.test(allActive))) fail("mixed legacy and v2 hooks or tokens");
  if (version === 3) for (const path of [...projectFiles, ...layerFiles]) {
    for (const error of v3CssErrors(readFileSync(path, "utf8"))) fail(error);
  }
  for (const path of projectFiles) {
    const rel = relative(target, path);
    const active = stripCssComments(readFileSync(path, "utf8"));
    if (bannedPrivate?.test(active) || /--_[a-z0-9_-]+/.test(active)) fail(`${rel} uses a private implementation property`);
    if (hasExplicitWght(active)) fail(`${rel} sets wght in font-variation-settings; use font-weight`);
    for (const property of bannedSpacing) {
      if (new RegExp(`(?:^|[;{}\\s])${property}\\s*:`).test(active)) {
        fail(`${rel} uses banned spacing longhand ${property}`);
      }
    }
      for (const match of active.matchAll(/var\(\s*(--[a-z0-9_-]+)/g)) {
      const name = match[1];
      if (publicTokens.has(name) || privateSet.has(name)) continue;
      if (version === 1 && !legacyTokens.has(name) && /^(?:--(?:display|h[1-3]|lead|body|small|label|caption)-|--(?:canvas|surface|text|muted|accent|fluid-min|fluid-max)$)/.test(name)) { fail(`${rel} uses mixed legacy and v2 token ${name}`); continue; }
      if (localProperties.has(name) || name.startsWith("--x-")) continue;
      if (version >= 2 || familyPattern.test(name)) fail(`${rel} uses unknown crft token ${name}`);
    }
  }

  if (!process.exitCode) {
    console.log(`PASS: ${projectFiles.length} files, ${publicTokens.size} tokens verified`);
  }
}

function main() {
  try {
    const target = process.argv[2];
    if (!target || process.argv.length !== 3) throw new Error(usage);
    const resolved = resolve(target);
    if (!existsSync(resolved) || !statSync(resolved).isDirectory()) {
      throw new Error(`project styles directory not found: ${target}`);
    }
    checkProject(resolved);
  } catch (error) {
    fail(error.message);
  }
}

export { checkProject };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
