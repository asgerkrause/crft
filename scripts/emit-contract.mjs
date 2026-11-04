import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const usage = "Usage: node scripts/emit-contract.mjs [--out <path>]";
// --out writes the committed fixture, which cannot name its own merged commit, so it omits revision.
const layerDependencies = {
  tokens: [],
  type: ["tokens"],
  layout: ["tokens"],
  grid: ["tokens", "layout"],
  base: ["tokens"],
  motion: ["tokens", "layout"],
  utility: [],
};
// Public composition hooks. Keep aligned with CRFT.md public-hook-index.
const hooks = {
  attributes: ["g", "c", "r", "o", "l", "data-theme", "data-accent", "data-scrub", "container", "sg", "fit", "fit-sm", "fit-lg", "fill", "fill-sm", "fill-lg"],
  classes: [".c", ".c.sm", ".c.lg", ".s", ".display", ".h1", ".h2", ".h3", ".lead", ".body", ".small", ".label", ".caption", ".img-w", ".sr", ".sr.focusable", ".squircle"],
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

// One pass so a quote inside a comment or a comment marker inside a string cannot desync the other.
const commentOrString = /\/\*[\s\S]*?\*\/|"(?:[^"\\\n]|\\[\s\S])*"|'(?:[^'\\\n]|\\[\s\S])*'/g;
const stripCssCommentsAndStrings = (value) => value.replace(commentOrString, (match) => (match.startsWith("/*") ? "" : '""'));
// Keeps quoted four-letter axis tags so a real "wght" setting stays visible while string content does not.
const hasExplicitWght = (css) => /font-variation-settings\s*:[^;}]*["']wght["']/.test(
  css.replace(commentOrString, (match) => (match.startsWith("/*") ? "" : /^["'][a-z]{4}["']$/i.test(match) ? match : '""')),
);

function declaredProperties(css) {
  return unique([...stripCssCommentsAndStrings(css).matchAll(/(--[a-z0-9_-]+)\s*:/g)].map((match) => match[1])).sort();
}

function quotedAttributeValues(css, attribute) {
  const pattern = new RegExp(`\\[${attribute}\\s*=\\s*(['"])([^'"]+)\\1\\s*\\]`, "g");
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

// Consumers pin this: sha256 of UTF-8 JSON.stringify output (no whitespace, non-ASCII unescaped) with exactly these keys, in this order.
function contractDigest({ contractVersion, publicTokens, privateProperties }) {
  const canonical = JSON.stringify({ contractVersion, publicTokens, privateProperties });
  return `sha256:${createHash("sha256").update(canonical).digest("hex")}`;
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

  const bans = [
    ...privateProperties.map((name) => `never use ${name} in product CSS or examples`),
    ...staticBans,
  ];

  // Copies adopted before the rename still carry the old marker spelling.
  const marker = /\/\* (?:crft|Craft) semantic contract: 3\. \*\//;
  const contractVersion = marker.test(tokensCss) ? 3 : 2;
  if (files.some((name) => name !== "tokens.css" && marker.test(sources[name]) !== (contractVersion === 3))) {
    throw new Error("Incompatible token/framework semantic versions; explicit v2/v3 migration required");
  }

  return {
    contractVersion,
    ...(flat ? { packagingVersion: 1 } : {}),
    revision: git.revision,
    dirty: git.dirty,
    publicTokens,
    privateProperties,
    digest: contractDigest({ contractVersion, publicTokens, privateProperties }),
    bans,
    themes: quotedAttributeValues(tokensCss, "data-theme"),
    ...(contractVersion === 2 ? { skins: quotedAttributeValues(tokensCss, "data-skin") } : {}),
    accents: quotedAttributeValues(tokensCss, "data-accent"),
    layers: Object.fromEntries(files.map((name) => [name, declaredLayers(sources[name])])),
    layerDependencies: snapshotDependencies(),
    hooks: contractVersion === 3 ? hooks : { ...hooks, attributes: [...hooks.attributes, "data-skin"] },
  };
}

const cssUnescape = (value) => value.replace(/\\([0-9a-f]{1,6}\s?|[^\r\n])/gi, (_, escaped) => {
  if (!/^[0-9a-f]/i.test(escaped)) return escaped;
  const point = parseInt(escaped.trim(), 16);
  return String.fromCodePoint(point === 0 || point > 0x10ffff ? 0xfffd : point);
});

// Walk statement boundaries, retaining selector ancestry through nested rules and at-rules.
// Strings, escapes, comments and component-value blocks cannot create rule boundaries.
function walkCss(css, rule, declaration) {
  let buffer = "";
  let quote = "";
  const components = [];
  const scopes = [{ theme: false, root: false }];
  const flush = () => {
    const match = buffer.trim().match(/^([^:]+):\s*([\s\S]*)$/);
    if (match) declaration(cssUnescape(match[1].trim()), match[2], scopes.at(-1));
    buffer = "";
  };
  for (let i = 0; i < css.length; i += 1) {
    const char = css[i];
    if (char === "\\") {
      buffer += char + (css[++i] ?? "");
    } else if (quote) {
      buffer += char;
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'") {
      quote = char;
      buffer += char;
    } else if (char === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      i = end < 0 ? css.length : end + 1;
    } else if (char === "(" || char === "[" || (char === "{" && (components.length || /^\s*--[\w-]+\s*:/.test(buffer)))) {
      components.push(char === "(" ? ")" : char === "[" ? "]" : "}");
      buffer += char;
    } else if (components.length) {
      if (char === components.at(-1)) components.pop();
      buffer += char;
    } else if (char === "{") {
      const selector = buffer.trim();
      const parent = scopes.at(-1);
      scopes.push(rule(selector, parent));
      buffer = "";
    } else if (char === ";" || char === "}") {
      flush();
      if (char === "}" && scopes.length > 1) scopes.pop();
    } else {
      buffer += char;
    }
  }
}

// Color tokens are a closed public family; unknown custom properties cannot prove color-only scope.
const colorToken = /^--(?:palette-[a-z-]+|canvas(?:-base)?|text(?:-base)?|surface|border|muted|(?:accent|secondary|tertiary)(?:-surface|-text|-border)?|success|warning|danger|on-(?:accent|secondary|tertiary|success|warning|danger))$/;
const colorProperty = /^(?:color|background-color|(?:border(?:-(?:top|right|bottom|left|block|inline)(?:-start|-end)?)?|outline|text-decoration|text-emphasis|column-rule|caret|accent|stop|flood|lighting)-color|fill|stroke)$/;
const colorValue = /^(?:[a-z]+|#[a-f0-9]+|(?:var|light-dark|color|color-mix|contrast-color|rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\([\s\S]*\))\s*(?:!important)?$/i;

function isColorBackground(value) {
  const active = stripCssCommentsAndStrings(value).trim().replace(/\s*!important$/i, "");
  if (!colorValue.test(active) || /(?:url|(?:repeating-)?(?:linear|radial|conic)-gradient)\(/i.test(active)) return false;
  let depth = 0;
  for (let i = 0; i < active.length; i += 1) {
    if (active[i] === "(") depth += 1;
    if (active[i] === ")" && (--depth === 0 && i !== active.length - 1)) return false;
  }
  return depth === 0;
}

function isRootSelector(selector, parentRoot) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quote = "";
  for (let i = 0; i <= selector.length; i += 1) {
    const char = selector[i];
    if (char === "\\") { if (!depth && !quote) return false; i += 1; continue; }
    if (quote) { if (char === quote) quote = ""; continue; }
    if (char === '"' || char === "'") { quote = char; continue; }
    if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth -= 1;
    else if (!depth && (char === "," || char === undefined)) {
      parts.push(selector.slice(start, i).trim());
      start = i + 1;
    } else if (!depth) {
      if (/[>+~|]/.test(char) || /^::|^:(?:before|after|first-line|first-letter)(?![\w-])/i.test(selector.slice(i))) return false;
      const rest = selector.slice(i).trimStart();
      if (/\s/.test(char) && selector.slice(start, i).trim() && rest !== "" && !rest.startsWith(",")) return false;
    }
  }
  return parts.length > 0 && parts.every((part) => {
    const anchor = part.startsWith(":root") ? ":root" : part.startsWith("html") ? "html" : parentRoot && part.startsWith("&") ? "&" : "";
    return anchor !== "" && (part.length === anchor.length || ".#[:".includes(part[anchor.length]));
  });
}

// Check the v3-only boundary in canonical and adopted CSS; final role/layout outputs remain local.
function v3CssErrors(css) {
  const errors = [];
  const foundation = /^--(?:fluid-(?:min|max)|type-(?:min|max|ratio-min|ratio-max)|font(?:-sans|-serif|-mono|-display)?|weight(?:-light|-bold)?|(?:space|gap|padding|radius)-ratio|(?:display|h[1-3]|lead|body|small|label|caption)-(?:step|min|max))$/;
  walkCss(css, (selector, parent) => {
    let theme = parent.theme;
    // Match whole attributes so quoted values of unrelated attributes stay opaque.
    for (const [rawAttribute] of selector.matchAll(/\[(?:[^\]"'\\]|\\[\s\S]|"(?:[^"\\]|\\[\s\S])*"|'(?:[^'\\]|\\[\s\S])*')*\]/g)) {
      const attribute = cssUnescape(rawAttribute);
      if (/^\[\s*data-(?:skin|scheme)(?=[\s~|^$*!=\]])/i.test(attribute)) errors.push("v3 rejects data-skin and scheme attributes");
      if (!/^\[\s*data-theme(?=[\s~|^$*!=\]])/i.test(attribute)) continue;
      theme = true;
      if (!/^\[\s*data-theme\s*(?:=\s*(?:(["'])(?:invert|tone|accent)\1|invert|tone|accent)\s*)?\]$/i.test(attribute)) errors.push("v3 data-theme accepts invert, tone, accent only");
    }
    return { theme, root: !theme && (selector.startsWith("@") ? parent.root : isRootSelector(selector, parent.root)) };
  }, (property, value, scope) => {
    const name = property.startsWith("--") ? property : property.toLowerCase();
    if (scope.theme && !colorToken.test(name) && !colorProperty.test(name) && !(name === "background" && isColorBackground(value))) errors.push("v3 themes must change color only");
    if (name === "color-scheme" && !scope.root) errors.push("v3 document color-scheme requires :root");
    if (scope.root) return;
    if (foundation.test(name)) errors.push("v3 foundations and recipes require :root");
    if (/^--(?:display|h[1-3]|lead|body|small|label|caption)-size$/.test(name) && /pow\(|var\(\s*--(?:_fluid|type-|fluid-|(?:display|h[1-3]|lead|body|small|label|caption)-(?:min|max))/.test(value)) errors.push("v3 type recipes require :root");
    if (/^--(?:space|gap|padding|radius)(?:-xs|-sm|-lg|-xl)?$/.test(name) && /var\(\s*--(?:space|gap|padding|radius)-ratio/.test(value)) errors.push("v3 spacing and radius recipes require :root");
  });
  return [...new Set(errors)];
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
    const contract = buildContract(new URL("../", import.meta.url));
    const json = `${JSON.stringify(contract, null, 2)}\n`;
    process.stdout.write(json);
    if (out) {
      const { revision: _revision, ...fixture } = contract;
      writeFileSync(out, `${JSON.stringify(fixture, null, 2)}\n`);
    }
  } catch (error) {
    fail(error.message);
  }
}

export { v3CssErrors, buildContract, contractDigest, declaredProperties, gitState, hasExplicitWght, layerDependencies, staticBans };

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
