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
const familyPattern = /^--[lsgprbctm](?:-[a-z0-9-]+)?$/;
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
const unique = (values) => [...new Set(values)];
const stripCssComments = (value) => value.replace(/\/\*[\s\S]*?\*\//g, "");
const declaredProperties = (css) => unique(
  [...stripCssComments(css).matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]),
);

function walkProjectCss(root) {
  const files = [];
  const visit = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (dir === root && entry.name === "layers") continue;
        visit(path);
      } else if (entry.name.endsWith(".css")) {
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
  const files = existsSync(layersDir)
    ? readdirSync(layersDir).filter((name) => name.endsWith(".css"))
    : [];
  const tokensCss = files.includes("tokens.css") ? readFileSync(join(layersDir, "tokens.css"), "utf8") : "";
  const publicTokens = declaredProperties(tokensCss).sort();
  const publicSet = new Set(publicTokens);
  const privateProperties = unique(
    files
      .filter((name) => name !== "tokens.css")
      .flatMap((name) => declaredProperties(readFileSync(join(layersDir, name), "utf8"))),
  )
    .filter((name) => !publicSet.has(name))
    .sort();
  return {
    publicTokens,
    privateProperties,
    layerDependencies: Object.fromEntries(
      Object.entries(layerDependencies).map(([name, needs]) => [name, [...needs]]),
    ),
  };
}

function loadAdoption(target) {
  const layersDir = join(target, "layers");
  const manifestPath = join(layersDir, "crft-manifest.json");
  if (!existsSync(manifestPath)) {
    return { contract: deriveContract(layersDir) };
  }
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  if (!manifest.contract) throw new Error(`${manifestPath} is missing contract`);
  return { contract: manifest.contract };
}

function privatePattern(names) {
  if (!names.length) return null;
  const escaped = names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(?:${escaped.join("|")})(?![a-z0-9-])`);
}

function checkProject(target) {
  const { contract } = loadAdoption(target);
  const publicTokens = new Set(contract.publicTokens ?? []);
  const privates = contract.privateProperties ?? [];
  const privateSet = new Set(privates);
  const dependencies = contract.layerDependencies ?? layerDependencies;
  const bannedPrivate = privatePattern(privates);
  const present = new Set(layerNamesFromFiles(join(target, "layers")));

  for (const layer of present) {
    const missing = (dependencies[layer] ?? []).filter((need) => !present.has(need));
    if (missing.length) fail(`layer ${layer}.css requires ${missing.join(", ")}`);
  }

  const projectFiles = existsSync(target) ? walkProjectCss(target) : [];
  for (const path of projectFiles) {
    const rel = relative(target, path);
    const active = stripCssComments(readFileSync(path, "utf8"));
    if (bannedPrivate?.test(active)) fail(`${rel} uses a private implementation property`);
    for (const property of bannedSpacing) {
      if (new RegExp(`(?:^|[;{}\\s])${property}\\s*:`).test(active)) {
        fail(`${rel} uses banned spacing longhand ${property}`);
      }
    }
    const declared = new Set(declaredProperties(active));
    for (const match of active.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
      const name = match[1];
      if (declared.has(name) || publicTokens.has(name) || privateSet.has(name)) continue;
      if (familyPattern.test(name)) fail(`${rel} uses unknown CRFT token ${name}`);
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
