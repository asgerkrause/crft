import { existsSync, readFileSync, readdirSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { resolveAdoptRequest } from "./copy-system.mjs";
import { markupErrors } from "./check-markup.mjs";
import { buildContract, hasExplicitWght, staticBans } from "./emit-contract.mjs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const unique = (values) => [...new Set(values)];
const stripCssComments = (value) => value.replace(/\/\*[\s\S]*?\*\//g, "");
const normalizeCss = (value) => value.replace(/\s+/g, "");
const hasCssSignal = (css, signal) => normalizeCss(css).includes(normalizeCss(signal));
const cssLayerBlock = (css, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const opener = css.match(new RegExp(`@layer\\s+${escaped}\\s*\\{`));
  if (!opener) return "";
  const open = css.indexOf("{", opener.index);
  let depth = 0;
  for (let index = open; index < css.length; index += 1) {
    const character = css[index];
    if (character === "{") depth += 1;
    else if (character === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, index);
    }
  }
  return "";
};
const assertWeightVariationPair = (css, path) => {
  if (hasExplicitWght(css)) fail(`${path} explicit wght overrides ordinary font-weight`);
};
const markedCodeNames = (document, marker, pattern) => {
  const block = document.match(new RegExp(`<!-- ${marker}:start -->([\\s\\S]*?)<!-- ${marker}:end -->`));
  if (!block) return undefined;
  return [...block[1].matchAll(pattern)].map((match) => match[1]);
};

const preludeLayers = ["reset", "base", "tokens", "type", "layout", "grid", "motion", "utility"];
const files = ["styles/tokens.css", "styles/crft.css"];
const topicNames = [
  "brief", "composition", "html", "components", "forms", "tokens", "color", "type",
  "layout", "grid", "utilities", "motion", "adopt", "accessibility", "performance", "verify",
];
const topicDocs = topicNames.map((name) => `craft/${name}.md`);
const retiredTopicDocs = ["strategy", "design", "structure", "css", "quality"].map((name) => `craft/${name}.md`);
const retiredTopicPattern = /craft\/(?:strategy|design|structure|css|quality)\.md/i;
const canonicalDocs = ["README.md", "AGENTS.md", "CRAFT.md", ...topicDocs, "skills/crft/SKILL.md"];
const privateProperties = [
  "--l-gc", "--l-cs", "--l-rs", "--or", "--m-src-to", "--m-src-fr", "--m-plx",
  "--_fluid",
];
const typeRoles = ["display", "h1", "h2", "h3", "lead", "body", "small", "label", "caption"];
const supportedAccentRoutes = ["danger", "secondary", "success", "tertiary", "warning"];
const supportedSkins = ["accent", "invert", "tone"];

for (const path of [...canonicalDocs, "styles/global.css", ...files, "styles/sans.woff", "styles/mono.woff"]) {
  if (!existsSync(new URL(path, root))) fail(`missing canonical file: ${path}`);
}
const actualTopicDocs = readdirSync(new URL("craft/", root))
  .filter((name) => name.endsWith(".md"))
  .map((name) => `craft/${name}`)
  .sort();
if (actualTopicDocs.join("|") !== [...topicDocs].sort().join("|")) fail("craft/ differs from the 16-topic documentation map");
for (const path of retiredTopicDocs) {
  if (existsSync(new URL(path, root))) fail(`retired topic owner remains: ${path}`);
}

if (existsSync(new URL("tooling/", root))) fail("tooling/ remains; CRFT has no product CLI or analyzer");
if (existsSync(new URL("styles/layers/", root))) fail("styles/layers/ remains; shared CSS has three physical owners");
if (existsSync(new URL("styles/sans.ttf", root)) || existsSync(new URL("styles/mono.ttf", root))) {
  fail("TrueType fonts remain; WOFF is the copied font format");
}
if (existsSync(new URL(".agents/skills/snz-css-system/", root)) || existsSync(new URL(".agents/skills/snz-frontend/", root))) {
  fail("retired split skill packs remain");
}

const docsByPath = Object.fromEntries(canonicalDocs.map((path) => [path, read(path)]));
const referenceBrandSources = [
  "reference/package.json",
  "reference/src/components/Header.astro",
  "reference/src/layouts/Shell.astro",
  "reference/src/scripts/shell.js",
];
for (const [path, source] of Object.entries(docsByPath)) {
  if (/\bseess\b|snz-frontend|snz-css-system/i.test(source)) fail(`${path} references a retired frontend source`);
  if (retiredTopicPattern.test(source)) fail(`${path} references a retired topic owner`);
  if (/\/Users\/|\/home\/|~\/|[A-Z]:\\/.test(source)) fail(`${path} contains an absolute private path`);
  if (/\[TODO(?::|\])/i.test(source)) fail(`${path} contains an unresolved TODO`);
}
const retiredStrategyPatterns = [
  /\bCRFT is (?!not\b)[^.\n]*(?:frontend design|design system|complete [^.\n]*system|the system)\b/i,
  /\bCRFT is (?!not\b)(?:the\s+)?(?:product strategy|design authority|product accessibility authority)\b/i,
  /\b(?:CRFT|It|This (?:file|owner|guide|document)|Composition|The (?:system|strategy|reference))\s+(?:owns|decides|approves|sets|supplies|provides|combines|governs|controls|directs|determines)(?:(?!\b(?:not|no|without)\b)[^.\n])*(?:product strategy|product intent|design judgment|visual judgment|taste|product accessibility|user-facing requirements|form behavior|product-state requirements)/i,
  /\bfluid type\s+(?:is|remains|must be|should be)\s+(?:required|mandatory)\b/i,
  /\b(?:must|shall|required to)\s+(?:use|run)\s+(?:the\s+)?(?:CRFT\s+)?(?:copier|copy-system)\b/i,
  /\b(?:copier|copy-system)[^.\n]*\b(?:is|remains)\s+(?:required|mandatory)\b/i,
];
for (const [path, source] of Object.entries(docsByPath)) {
  for (const pattern of retiredStrategyPatterns) {
    const claim = source.match(pattern)?.[0];
    if (claim) fail(`${path} contains retired CRFT strategy claim: ${claim}`);
  }
}
for (const path of referenceBrandSources) {
  const source = read(path);
  if (/\bseess\b|snz-frontend|snz-css-system/i.test(source)) fail(`${path} references a retired frontend source`);
  if (!/crft/i.test(source)) fail(`${path} does not identify CRFT`);
}
const referenceHeader = read("reference/src/components/Header.astro");
if (!referenceHeader.includes('<header class="sg-header">') || referenceHeader.includes('<header id="top">')) {
  fail("reference header does not use its stable visual-role class");
}

const craft = docsByPath["CRAFT.md"];
const adoption = docsByPath["craft/adopt.md"];
const adoptionModeBlock = adoption.match(/## Choose a mode\n([\s\S]*?)\n## /)?.[1];
const adoptionModeRows = [...(adoptionModeBlock ?? "").matchAll(/^\| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)]
  .map((match) => match.slice(1).map((cell) => cell.trim()))
  .filter(([name]) => name !== "Mode" && !/^-+$/.test(name));
const adoptionModes = adoptionModeRows.map(([name]) => name);
const expectedAdoptionModes = ["Strategy only", "Local extraction", "Tokens only", "Explicit full adoption"];
if (adoptionModes.join("|") !== expectedAdoptionModes.join("|")) fail("craft/adopt.md adoption modes differ from the canonical four-mode contract");
for (const mode of ["Strategy only", "Local extraction"]) {
  if (adoptionModeRows.find(([name]) => name === mode)?.[2] !== "None") fail(`craft/adopt.md ${mode} must expose no CRFT hooks`);
}
if (!/retained live hooks/i.test(adoptionModeRows.find(([name]) => name === "Tokens only")?.[2] ?? "")) {
  fail("craft/adopt.md tokens-only adoption must expose retained live hooks only");
}
if (!craft.includes("intentionally does not ship a product CLI, consumer analyzer, automatic audit, or generated migration plan")) {
  fail("CRAFT.md does not record the retired tooling boundary");
}
for (const migration of ["contractVersion 2", "legacy v1", "--layers", "Do not default to the full tree on an existing site", "does not copy `global.css`", "Observed", "--fonts", "--ROLE-size", "No compatibility aliases", "--t-h4-fw"]) {
  if (!adoption.includes(migration)) fail(`craft/adopt.md is missing breaking migration guidance: ${migration}`);
}
const routeBlock = craft.match(/## Route\n([\s\S]*?)\n## Common workflows/)?.[1];
if (!routeBlock) fail("CRAFT.md is missing its bounded topic route");
for (const path of topicDocs) {
  if (!routeBlock?.includes(`](${path})`)) fail(`CRAFT.md does not route to ${path}`);
}
for (const path of retiredTopicDocs) {
  if (craft.includes(`](${path})`)) fail(`CRAFT.md routes to retired owner ${path}`);
}
for (const [index, path] of topicDocs.entries()) {
  const document = docsByPath[path];
  if (!/^---\n[\s\S]*?^status: canonical$[\s\S]*?^owner: [a-z-]+$[\s\S]*?^read_when: .+$[\s\S]*?^---$/m.test(document)) {
    fail(`${path} is missing canonical topic frontmatter`);
  }
  if (index > 0 && routeBlock && routeBlock.indexOf(`](${topicDocs[index - 1]})`) > routeBlock.indexOf(`](${path})`)) {
    fail(`CRAFT.md route order is incorrect before ${path}`);
  }
}
const skill = docsByPath["skills/crft/SKILL.md"];
if (!skill.includes("CRAFT.md")) fail("skills/crft/SKILL.md does not route through CRAFT.md");
if (skill.length > 5000) fail("skills/crft/SKILL.md is no longer a thin router");
const skillAsk = skill.match(/## Ask\n([\s\S]*?)\n## Detect/)?.[1] ?? "";
const skillCopy = skill.match(/## Copy\n([\s\S]*?)\n## Work/)?.[1] ?? "";
const skillWork = skill.match(/## Work\n([\s\S]*?)\n## Stop/)?.[1] ?? "";
for (const mode of expectedAdoptionModes) {
  if (!skillAsk.toLowerCase().includes(mode.toLowerCase())) fail(`skills/crft/SKILL.md Ask is missing adoption mode: ${mode}`);
}
if (!/local extraction[^.\n]*tokens-only adoption[^.\n]*coexist/i.test(skillAsk) || !/extraction itself grants no CRFT hooks/i.test(skillAsk)) {
  fail("skills/crft/SKILL.md Ask must allow mixed subsystem modes without granting extraction hooks");
}
if (!/copier[^.\n]*optional[^.\n]*whole-layer/i.test(skillCopy)) {
  fail("skills/crft/SKILL.md Copy must keep the copier optional and whole-layer only");
}
if (!/fluid type[^.\n]*(?:unnecessary|not needed|optional)[^.\n]*static semantic type tokens/i.test(skillWork)) {
  fail("skills/crft/SKILL.md Work must keep fluid type optional for projects");
}
if (!/file presence alone[^.\n]*not API/i.test(skill)) {
  fail("skills/crft/SKILL.md must inspect retained live hooks after project simplification");
}
if (!/fluid type[^.\n]*(?:not a project requirement|optional)/i.test(docsByPath["craft/type.md"])) {
  fail("craft/type.md must keep fluid type optional for projects");
}
for (const component of [".btn", ".crd", ".lnk"]) {
  if (!craft.includes(component) || !docsByPath["craft/components.md"].includes(component)) {
    fail(`${component} is missing from the project component naming boundary`);
  }
}
const documentedHooks = {
  "craft/type.md": [".display", ".h1", ".h2", ".h3", ".lead", ".body", ".small", ".label", ".caption", "l"],
  "craft/layout.md": [".c", ".c.sm", ".c.lg", ".s", "container", ".img-w"],
  "craft/grid.md": ["g", "c", "r", "o", "fit", "fit-sm", "fit-lg", "fill", "fill-sm", "fill-lg", "sg"],
  "craft/utilities.md": [".sr", ".sr.focusable", ".squircle"],
  "craft/motion.md": [".img-w", "data-scrub"],
  "craft/color.md": ["data-theme", "data-skin", "data-accent"],
};
for (const [path, hooks] of Object.entries(documentedHooks)) {
  for (const hook of hooks) {
    if (!docsByPath[path].includes(`\`${hook}\``)) fail(`${path} does not document public hook ${hook}`);
  }
}
if (!craft.includes("## Public hook grammar")) fail("CRAFT.md is missing the public hook grammar");
if (!craft.includes("Do not add margin, padding, gap, radius, align, or justify attributes")) {
  fail("CRAFT.md does not reject a spacing or alignment matrix");
}
const indexedHooks = markedCodeNames(craft, "public-hook-index", /`([^`]+)`/g);
const expectedHooks = unique(Object.values(documentedHooks).flat()).sort();
if (!indexedHooks) fail("CRAFT.md is missing the public hook index");
else if (unique(indexedHooks).sort().join("|") !== expectedHooks.join("|")) {
  fail("CRAFT.md hook index differs from the documented hook map");
}
if (!skill.includes("Do not add a spacing, alignment, or display matrix")) {
  fail("skills/crft/SKILL.md does not reject a spacing matrix");
}
if (!skill.includes("--layers")) fail("skills/crft/SKILL.md does not route overlay copy through --layers");
if (!skill.includes("inventory")) fail("skills/crft/SKILL.md does not require inventory before token fill");
if (!skill.includes("Do not invent")) fail("skills/crft/SKILL.md does not refuse invented CRFT without a copy");
if (!skill.includes("at most three")) fail("skills/crft/SKILL.md does not cap topic reads");
if (!skill.includes("class on `section`")) fail("skills/crft/SKILL.md does not forbid class on section");
if (!skill.includes("## Start")) fail("skills/crft/SKILL.md is missing the inspect-and-plan start");
const banIndexLines = markedCodeNames(craft, "ban-index", /^(.+)$/gm);
if (!banIndexLines) fail("CRAFT.md is missing the ban index");
else {
  const indexed = banIndexLines.join("\n").replace(/`/g, "");
  for (const ban of staticBans) {
    if (!indexed.includes(ban)) fail(`CRAFT.md ban index is missing: ${ban}`);
  }
}
if (!skill.includes("craft/layout.md")) fail("skills/crft/SKILL.md does not route spacing through layout.md");
if (!docsByPath["craft/layout.md"].includes("## Property form")) fail("craft/layout.md is missing ## Property form");
if (!docsByPath["craft/layout.md"].includes("*-block-start")) fail("craft/layout.md is missing *-block-start");

const globalCss = stripCssComments(read("styles/global.css"));
const source = Object.fromEntries(files.map((file) => [file, stripCssComments(read(file))]));
const allCss = files.map((file) => source[file]).join("\n");
const tokensCss = source["styles/tokens.css"];
const frameworkCss = source["styles/crft.css"];
const typeCss = cssLayerBlock(frameworkCss, "type");
const fontsCss = tokensCss;
const layoutCss = cssLayerBlock(frameworkCss, "layout");
const gridCss = cssLayerBlock(frameworkCss, "grid");
const motionCss = cssLayerBlock(frameworkCss, "motion");
const baseCss = frameworkCss;
const utilityCss = cssLayerBlock(frameworkCss, "utility");

const expectedGlobal = [
  `@layer ${preludeLayers.join(", ")};`,
  "",
  '@import "./tokens.css";',
  '@import "./crft.css";',
].join("\n");
if (globalCss.trim() !== expectedGlobal.trim()) fail("styles/global.css must contain only the layer prelude and two imports");
const actualCssFiles = readdirSync(new URL("styles/", root)).filter((name) => name.endsWith(".css")).sort();
if (actualCssFiles.join("|") !== "crft.css|global.css|tokens.css") fail("styles/ differs from the three-file owner map");
for (const [file, expected] of [["styles/tokens.css", ["tokens", "type"]], ["styles/crft.css", ["reset", "base", "type", "layout", "grid", "motion", "utility"]]]) {
  const openings = [...source[file].matchAll(/@layer\s+([a-z-]+)\s*\{/g)].map((match) => match[1]);
  const seen = new Set();
  for (const name of openings) {
    if (seen.has(name)) fail(`duplicate @layer ${name} block in ${file.slice("styles/".length)}`);
    seen.add(name);
  }
  if (openings.join("|") !== expected.join("|")) fail(`${file} must own layers ${expected.join(", ")}`);
}
if (!read("styles/tokens.css").includes("/* Optional bundled fonts. */")) fail("tokens.css must mark optional bundled fonts");

const copyScript = read("scripts/copy-system.mjs");
if (/skill|inject|seess/i.test(copyScript)) fail("copy-system.mjs retains removed skill, inject, or product identifiers");
const tokensOnly = resolveAdoptRequest({ layers: "tokens" });
if (tokensOnly.manifest.join("|") !== "tokens.css") fail("copy-system.mjs tokens profile is not tokens.css only");
if (/global\.css/.test(tokensOnly.entryBlock)) fail("copy-system.mjs entry block still names global.css");
const fullCopy = resolveAdoptRequest({ layers: "full" });
if (fullCopy.manifest.includes("global.css") || fullCopy.manifest.includes("fonts.css") || fullCopy.manifest.some((file) => file.endsWith(".woff"))) {
  fail("copy-system.mjs full profile copies global.css, fonts, or woffs");
}
try {
  resolveAdoptRequest({ layers: "grid" });
  fail("copy-system.mjs allows grid without layout");
} catch (error) {
  if (!/Unsupported layer selection/.test(error.message)) fail(`copy-system.mjs grid refusal is unclear: ${error.message}`);
}

const publicTokens = unique([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
const publicTokenSet = new Set(publicTokens);
for (const token of publicTokens) {
  if (/^--[lsgprbctm](?:-|$)/.test(token)) fail(`${token} uses a retired token family`);
}
const tokenDocument = docsByPath["craft/tokens.md"];
const tokenIndexBlock = tokenDocument.match(/<!-- public-token-index:start -->([\s\S]*?)<!-- public-token-index:end -->/)?.[1];
const documentedTokens = markedCodeNames(tokenDocument, "public-token-index", /`(--[a-z0-9-]+)`/g);
if (!documentedTokens || !tokenIndexBlock) fail("craft/tokens.md is missing the public token index");
else {
  if (/#(?:[0-9a-f]{3}){1,2}\b|\b\d+(?:\.\d+)?(?:px|rem|ch|ms|s|%)\b|\b(?:calc|clamp|color-mix|light-dark)\(/i.test(tokenIndexBlock)) {
    fail("craft/tokens.md public token index duplicates a live value or formula");
  }
  if (documentedTokens.length !== unique(documentedTokens).length) fail("craft/tokens.md documents a public token more than once in its index");
  const tokenJobRows = tokenIndexBlock.split("\n").filter((line) => /^\s*\|/.test(line) && /`--[a-z0-9-]+`/.test(line));
  const tokensWithJobs = new Set();
  for (const row of tokenJobRows) {
    const cells = row.split("|");
    const job = cells.at(-2)?.trim();
    const names = [...row.matchAll(/`(--[a-z0-9-]+)`/g)].map((match) => match[1]);
    if (!job) fail(`craft/tokens.md has an empty job for: ${names.join(", ")}`);
    else names.forEach((name) => tokensWithJobs.add(name));
  }
  const tokensWithoutJobs = documentedTokens.filter((name) => !tokensWithJobs.has(name));
  if (tokensWithoutJobs.length) fail(`craft/tokens.md has no job row for: ${tokensWithoutJobs.join(", ")}`);
  const missingTokens = publicTokens.filter((name) => !documentedTokens.includes(name));
  const staleTokens = documentedTokens.filter((name) => !publicTokenSet.has(name));
  if (missingTokens.length) fail(`craft/tokens.md is missing public tokens: ${missingTokens.join(", ")}`);
  if (staleTokens.length) fail(`craft/tokens.md contains stale public tokens: ${staleTokens.join(", ")}`);
}
if (!tokenDocument.includes("styles/tokens.css") || !/sole catalog and authority/i.test(tokenDocument)) {
  fail("craft/tokens.md must route live token values and formulas to styles/tokens.css");
}
for (const signal of [
  "A section needs no ID by default.",
  "Do not put a class on `section`.",
  "Add `aria-labelledby` only when the section should become a useful named `region` landmark.",
  "Do not style through IDs.",
]) {
  if (!docsByPath["craft/html.md"].includes(signal)) fail(`craft/html.md is missing identifier doctrine: ${signal}`);
}
const htmlDocument = docsByPath["craft/html.md"];
if (!htmlDocument.includes("## Native base guarantees")) fail("craft/html.md is missing ## Native base guarantees");
else {
  const nativeBaseSection = htmlDocument.match(/## Native base guarantees\n([\s\S]*?)(?=\n## )/)?.[1] ?? "";
  if (!nativeBaseSection.includes("@layer reset")) fail("craft/html.md Native base guarantees is missing @layer reset");
  if (!nativeBaseSection.includes("@layer base")) fail("craft/html.md Native base guarantees is missing @layer base");
}

for (const role of typeRoles) {
  if (!hasCssSignal(typeCss, `.${role} {`)) fail(`type.css is missing documented role ${role}`);
  for (const property of ["font", "size", "weight", "leading", "tracking", "measure", "case", "features", "axes", "optical-sizing"]) {
    if (!publicTokenSet.has(`--${role}-${property}`) || !typeCss.includes(`var(--${role}-${property})`)) fail(`type.css is missing role property ${role}-${property}`);
  }
}
if (/body[^}]*max-width/s.test(typeCss.slice(0, typeCss.indexOf("  :where(h1)")))) fail("type.css must keep body unconstrained");
assertWeightVariationPair(typeCss, "styles/crft.css");
assertWeightVariationPair(baseCss, "styles/crft.css");
if (/@font-face/i.test(frameworkCss)) fail("crft.css must not register faces; tokens.css owns @font-face");
for (const [family, file] of [["sans", "sans.woff"], ["mono", "mono.woff"]]) {
  const face = [...fontsCss.matchAll(/@font-face\s*\{[^}]*\}/g)].map((match) => match[0]).find((block) => block.includes(`font-family: "${family}"`));
  if (!face || !face.includes(`src: url("./${file}") format("woff");`) || !/font-weight:\s*100 900;/.test(face)) fail(`${family} must load ./${file} with a registered 100 900 font-weight range`);
}
for (const signal of [":where(h1)", ":where(h2)", ":where(h3, h4, h5, h6)", ":where(small)", ":where(label)", ":where(figcaption)", ":where([data-theme])"]) {
  if (!hasCssSignal(typeCss, signal)) fail(`type.css is missing native/context mapping ${signal}`);
}
if (!hasCssSignal(tokensCss, "--_fluid: clamp(")) fail("tokens.css is missing fluid font-size clamping");
if (!hasCssSignal(tokensCss, "@supports (font-size: calc(1rem * pow(2, 1))) { :root, [data-theme] {")) fail("type recipes require a pow feature gate and context rebinding");
for (const role of typeRoles) {
  if (!new RegExp(`--${role}-size:\\s*[\\d.]+rem;`).test(tokensCss)) fail(`missing static fallback ${role}`);
}
const cssNumber = (css, name) => {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`${escaped}\\s*:\\s*([+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+))\\s*;`));
  return match ? Number(match[1]) : Number.NaN;
};
const fluidTokenNames = ["--type-min", "--type-max", "--type-ratio-min", "--type-ratio-max", "--fluid-min", "--fluid-max"];
const fluidTokens = Object.fromEntries(fluidTokenNames.map((name) => [name, cssNumber(tokensCss, name)]));
const unparsedFluidTokens = fluidTokenNames.filter((name) => !Number.isFinite(fluidTokens[name]));
if (unparsedFluidTokens.length) {
  fail(`fluid type tokens are not finite numbers: ${unparsedFluidTokens.join(", ")}`);
} else {
  const fsMin = fluidTokens["--type-min"];
  const fsMax = fluidTokens["--type-max"];
  const rtMin = fluidTokens["--type-ratio-min"];
  const rtMax = fluidTokens["--type-ratio-max"];
  const vpMin = fluidTokens["--fluid-min"];
  const vpMax = fluidTokens["--fluid-max"];
  if (Object.values(fluidTokens).some((value) => value <= 0) || vpMax <= vpMin) fail("fluid foundations must be positive and range strictly increasing");
  const fluidSteps = unique(
    [...tokensCss.matchAll(/--[a-z0-9]+-step\s*:\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*;/g)].map((match) => Number(match[1])),
  );
  if (!fluidSteps.length) fail("tokens.css has no role-step declarations");
  for (const step of fluidSteps) {
    const lo = fsMin * rtMin ** step;
    const hi = fsMax * rtMax ** step;
    if (lo * vpMax <= hi * vpMin) {
      fail(`fluid type step ${step} loses zoom growth: lo * vp-max must exceed hi * vp-min`);
    }
    if (step >= -1 && step <= 1 && hi / lo > 2.5) {
      fail(`fluid text step ${step} exceeds the 2x zoom budget: hi / lo must stay at or below 2.5`);
    }
  }
}
const layoutHookSignals = { ".c": ".c {", ".c.sm": "&.sm {", ".c.lg": "&.lg {", ".s": ".s {", container: "section > .c { container: container / inline-size", ".img-w": ".img-w {" };
for (const [hook, signal] of Object.entries(layoutHookSignals)) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing documented hook ${hook}`);
}
for (const signal of [
  ">header, >main>section, >footer { padding: var(--bleed-y) var(--bleed-x)",
  ">header { padding-block: var(--padding)", ">footer { padding-bottom: var(--padding)",
  "view-transition-name: header", "view-transition-name: main", "view-transition-name: footer",
  "max-width: var(--content-max)", "max-width: calc(var(--content-max) / 3 * 2)",
  "max-width: calc(var(--content-max) / 3 * 4)",
]) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing viewport-derived container behavior: ${signal}`);
}
const gridHookSignals = {
  g: "[g] {", c: "[g]>[c", r: "[g]>[r", o: "[g]>[o", "fill-sm": '[g="fill-sm"]',
  fill: '[g="fill"]', "fill-lg": '[g="fill-lg"]', fit: '[g="fit"]', "fit-sm": '[g="fit-sm"]', "fit-lg": '[g="fit-lg"]', sg: '[g="sg"]',
};
for (const [hook, signal] of Object.entries(gridHookSignals)) {
  if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing documented grid hook ${hook}`);
}
for (let position = 1; position <= 12; position += 1) {
  for (const signal of [`[g$="${position}"]`, `[g^="${position}"]`, `[g]>[c$="${position}"]`, `[g]>[c^="${position}"]`]) {
    if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing numeric grid rule ${signal}`);
  }
}
for (const signal of ['[g]>[c$="0"]', '[g]>[c^="0"]']) {
  if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing full-row grid rule ${signal}`);
}
for (let position = 1; position <= 4; position += 1) {
  for (const signal of [`[g]>[r$="${position}"]`, `[g]>[r^="${position}"]`]) {
    if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing row-span grid rule ${signal}`);
  }
}
for (const position of ["f", "a", "l"]) {
  for (const signal of [`[g]>[o$="-${position}"]`, `[g]>[o*="-${position}-"]`, `[g]>[o^="${position}"]`]) {
    if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing visual-order grid rule ${signal}`);
  }
}
for (const signal of ["--l-gc: 3", "--l-cs: 1", "--l-rs: 1"]) {
  if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing omitted-span default ${signal}`);
}
const expectedUtilityHooks = documentedHooks["craft/utilities.md"].filter((hook) => hook !== ".sr.focusable").sort();
const actualUtilityHooks = unique([...utilityCss.matchAll(/^ {2}\.([a-z0-9-]+)\s*\{/gm)].map((match) => `.${match[1]}`)).sort();
if (actualUtilityHooks.join("|") !== expectedUtilityHooks.join("|")) fail("utility.css selectors differ from the documented finite utility surface");
if (!hasCssSignal(utilityCss, "&.focusable:focus-visible")) fail("utility.css is missing documented hook .sr.focusable");
if (!hasCssSignal(utilityCss, ".squircle { corner-shape: squircle; }")) fail("utility.css is missing documented hook .squircle");
if (!hasCssSignal(tokensCss, ":root, [data-theme], [data-skin] {") || !hasCssSignal(tokensCss, "[data-accent] {")) {
  fail("tokens.css is missing a documented skin or accent boundary");
}
const resetCss = cssLayerBlock(baseCss, "reset");
const baseLayerCss = cssLayerBlock(baseCss, "base");
if (!resetCss) fail("base.css is missing an @layer reset block");
if (!baseLayerCss) fail("base.css is missing an @layer base block");
if (/corner-shape/.test(baseLayerCss)) fail("base must not set corner-shape; corners stay opt-in through .squircle");
if (/var\(\s*--/i.test(resetCss)) fail("reset must not consume custom properties");
for (const signal of [
  "@supports selector(details::details-content)",
  ':where(a) {', ':where(a, button, label) {',
  "transition-property: color, background, border, transform, opacity, font-weight",
  'transition-duration: var(--duration)',
  '[aria-current="page"]',
  "list-style-position: outside",
  "border: var(--border-width) solid var(--border)",
  "border-color: var(--danger)",
]) {
  if (!hasCssSignal(baseLayerCss, signal)) fail(`base layer is missing native enhancement: ${signal}`);
}
if (!hasCssSignal(typeCss, "[l] {") || !hasCssSignal(typeCss, '[l="4"]')) {
  fail("type.css is missing documented l");
}
if (/\[w=/.test(typeCss) || /\[f=/.test(typeCss)) fail("type.css must not keep w or f attributes; weight and family are t flags");
for (const signal of [
  ".img-w[data-scrub]", "&[data-scrub='reverse']>img",
]) {
  if (!hasCssSignal(motionCss, signal)) fail(`motion.css is missing documented motion hook: ${signal}`);
}
const genericScrub = motionCss.match(/(?:^|\n)\s+\[data-scrub\]\s*\{([^}]*)\}/)?.[1];
if (!genericScrub || !hasCssSignal(genericScrub, "animation-timeline: view()") || !hasCssSignal(genericScrub, "animation-range: entry 0% exit 100%")) {
  fail("motion.css is missing the generic scrub progress rule");
}
if (!hasCssSignal(motionCss, "@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {")) {
  fail("motion.css scrub must remain inside feature and reduced-motion gates");
}
if (!hasCssSignal(motionCss, "@supports (view-transition-name: none)") || !hasCssSignal(motionCss, "@view-transition")) {
  fail("motion.css is missing gated view transitions");
}

for (const signal of [
  "section > .c { container: container / inline-size", "display: flex", "flex-direction: column",
]) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing invariant: ${signal}`);
}
const containerQueryMd = tokensCss.match(/--query-md\s*:\s*([^;]+);/)?.[1].trim();
const containerQueryLg = tokensCss.match(/--query-lg\s*:\s*([^;]+);/)?.[1].trim();
if (!containerQueryMd || !containerQueryLg) fail("tokens.css is missing named container-query thresholds");
for (const signal of [
  `@container container (width >=${containerQueryMd})`,
  `@container container (width >=${containerQueryLg})`,
  "grid-template-columns: repeat(var(--l-gc), minmax(0, 1fr))", '[g]> :is([c="0"], [c$="-0"])',
  '[g]> :is([c="0"], [c^="0-"])', '[g]>[o*="-a-"]', '[g]>[o^="a"]',
]) {
  if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing invariant: ${signal}`);
}
if (/@media\s*\(\s*width\b/.test(gridCss)) fail("grid.css must use container queries for grid states");
if (/(?:^|})\s*(?:\.c|\[c\])\s*\{[^}]*\bcontainer\s*:/s.test(layoutCss)) fail("only section > .c may establish the query boundary");

const accentRoutes = unique([...tokensCss.matchAll(/\[data-accent\s*=\s*(["'])([^"']+)\1\]/g)].map((match) => match[2])).sort();
const skinRoutes = unique([...tokensCss.matchAll(/\[data-skin\s*=\s*(["'])([^"']+)\1\]/g)].map((match) => match[2])).sort();
if (accentRoutes.join("|") !== supportedAccentRoutes.join("|")) fail("tokens.css explicit data-accent routes differ from the contract");
if (skinRoutes.join("|") !== supportedSkins.join("|")) fail("tokens.css explicit data-skin routes differ from the contract");
const documentedAccentRoutes = markedCodeNames(docsByPath["craft/color.md"], "accent-value-index", /`([a-z-]+)`/g)?.sort();
const documentedSkinRoutes = markedCodeNames(docsByPath["craft/color.md"], "skin-value-index", /`([a-z-]+)`/g)?.sort();
if (!documentedAccentRoutes || documentedAccentRoutes.join("|") !== accentRoutes.join("|")) fail("craft/color.md accent routes differ from source");
if (!documentedSkinRoutes || documentedSkinRoutes.join("|") !== skinRoutes.join("|")) fail("craft/color.md skin routes differ from source");
if (!motionCss.includes("&[data-scrub='reverse']>img")) fail("motion.css is missing reverse scrub behavior");
if (/\.(?:btn|crd|lnk|card)(?:[\s,:.{#]|$)/i.test(allCss)) fail("canonical CSS styles a project component naming convention");

for (const property of privateProperties) {
  if ((!tokenDocument.includes(property) || !docsByPath["AGENTS.md"].includes(property)) && !property.startsWith("--_")) fail(`${property} is not documented as private`);
  if (documentedTokens?.includes(property)) fail(`${property} appears in the public token index`);
}
if (/\[(?:t|s|x|y)[~=$*^\]]/.test(allCss)) fail("canonical CSS retains legacy hooks");

const privatePattern = new RegExp(`(?:${privateProperties.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![a-z0-9-])`, "i");
const attributeValues = (html, name) => unique(
  [...html.matchAll(new RegExp(`\\s${name}\\s*=\\s*([\"'])([^\"']*)\\1`, "gi"))].map((match) => match[2]),
);
const idReferenceAttributes = [
  "for", "aria-labelledby", "aria-describedby", "aria-controls", "aria-owns",
  "aria-activedescendant", "aria-details", "aria-errormessage",
];
const allowedExampleClasses = new Set([
  "action", "action-secondary", "banner", "board-frame", "btn", "chip", "crd", "focusable",
  "img-w", "index", "invites", "issue", "issue-summary", "lnk", "northline", "panel", "pill",
  "proof-tile", "signal", "skeleton", "sr", "c", "s", "sm", "lg", ...typeRoles,
]);
const validateIdentifiers = (html, path) => {
  const active = html.replace(/<!--[\s\S]*?-->/g, "");
  const ids = [...active.matchAll(/\sid\s*=\s*(["'])([^"']*)\1/gi)].map((match) => match[2]);
  const seen = new Set();
  for (const id of ids) {
    if (!id) fail(`${path} contains an empty id`);
    else if (seen.has(id)) fail(`${path} repeats id ${id}`);
    else seen.add(id);
  }
  const references = new Set();
  for (const attribute of idReferenceAttributes) {
    for (const value of attributeValues(active, attribute)) {
      for (const reference of value.trim().split(/\s+/).filter(Boolean)) references.add(reference);
    }
  }
  for (const href of attributeValues(active, "href")) {
    if (href.startsWith("#") && href.length > 1) references.add(href.slice(1));
  }
  for (const reference of references) {
    if (!seen.has(reference)) fail(`${path} references missing id ${reference}`);
  }
  for (const match of active.matchAll(/<(div|span)\b([^>]*)>/gi)) {
    if (/\saria-(?:label|labelledby)\s*=/i.test(match[2])) fail(`${path} names a generic ${match[1]} wrapper`);
  }
  for (const match of active.matchAll(/<section\b([^>]*)>/gi)) {
    if (/\sclass\s*=/i.test(match[1])) fail(`${path} puts a class on a section`);
  }
};
const validateExampleMarkup = (html, path) => {
  const active = html.replace(/<!--[\s\S]*?-->/g, "");
  validateIdentifiers(active, path);
  for (const match of active.matchAll(/\sclass\s*=\s*(["'])([^"']*)\1/gi)) {
    for (const hook of match[2].trim().split(/\s+/)) {
      if (!allowedExampleClasses.has(hook)) fail(`${path} uses unlisted example class .${hook}`);
    }
  }
  for (const value of attributeValues(active, "data-skin")) {
    if (value && !supportedSkins.includes(value)) fail(`${path} uses unsupported data-skin ${value}`);
  }
  for (const value of attributeValues(active, "data-accent")) {
    if (!supportedAccentRoutes.includes(value)) fail(`${path} uses unsupported data-accent ${value}`);
  }
  for (const error of markupErrors(active)) fail(`${path} ${error}`);

};
const validateExampleCss = (css, path) => {
  const active = stripCssComments(css);
  if (!/^\s*@layer\s+project\s*\{/.test(active)) fail(`${path} must declare its chosen project layer`);
  assertWeightVariationPair(active, path);
  if (/(?:^|[,{}])\s*#[a-z][a-z0-9_-]*/im.test(active)) fail(`${path} styles through an ID selector`);
  const localProperties = new Set([...active.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
  for (const match of active.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) {
    if (!publicTokenSet.has(match[1]) && !localProperties.has(match[1])) fail(`${path} uses undeclared custom property ${match[1]}`);
  }
};
for (const [path, document] of Object.entries(docsByPath)) {
  let index = 0;
  for (const match of document.matchAll(/```html\n([\s\S]*?)```/g)) {
    index += 1;
    validateIdentifiers(match[1], `${path} HTML example ${index}`);
  }
}
const brandedExampleCss = stripCssComments(read("examples/branded-extension/example.css"));
if (!hasCssSignal(brandedExampleCss, "@supports (animation-delay: calc(1ms * sibling-index())) { @media (prefers-reduced-motion: no-preference) {")) {
  fail("branded extension stagger must keep sibling-index() inside feature and reduced-motion gates");
}
const pageReferenceMarkup = read("examples/page-from-reference/markup.html");
if (!pageReferenceMarkup.includes('class="img-w" data-scrub')) {
  fail("page-from-reference does not demonstrate the public image scrub with a static fallback");
}
for (const signal of ["## Progressive stagger", "## Split text", "sibling-count()", "complete static fallback"]) {
  if (!docsByPath["craft/motion.md"].includes(signal)) fail(`craft/motion.md is missing progressive guidance: ${signal}`);
}
const exampleRoot = new URL("examples/", root);
if (existsSync(exampleRoot)) {
  const paths = [];
  const walk = (url, prefix = "examples") => {
    for (const entry of readdirSync(url, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const path = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) walk(new URL(`${entry.name}/`, url), path);
      else paths.push(path);
    }
  };
  walk(exampleRoot);
  for (const path of paths) {
    const text = read(path);
    if (/\bseess\b|snz-frontend|snz-css-system|seess_api/i.test(text)) fail(`${path} references a retired source or metadata field`);
    if (retiredTopicPattern.test(text)) fail(`${path} references a retired topic owner`);
    if (/\/Users\/|\/home\/|~\/|[A-Z]:\\/.test(text)) fail(`${path} contains an absolute private path`);
    if (path.endsWith(".html") || path.endsWith(".css")) {
      const active = path.endsWith(".css") ? stripCssComments(text) : text.replace(/<!--[\s\S]*?-->/g, "");
      if (privatePattern.test(active)) fail(`${path} uses a private implementation property`);
      if (path.endsWith(".css")) {
        validateExampleCss(text, path);
      }
      if (path.endsWith(".html")) {
        validateExampleMarkup(text, path);
      }
    }
    const frontmatterEnd = text.startsWith("---\n") ? text.indexOf("\n---\n", 4) : -1;
    const frontmatter = frontmatterEnd > 0 ? text.slice(4, frontmatterEnd) : "";
    if (/\/README\.md$/.test(path) && /^status:\s*example\s*$/m.test(frontmatter)) {
      if (!/^crft_api:\s*(confirmed|mixed|unknown)\s*$/m.test(frontmatter)) fail(`${path} is missing valid crft_api metadata`);
      if (!text.includes("## Layout intent") || !text.includes("```text")) fail(`${path} is missing its ASCII layout intent`);
    }
  }
}

// Brand OS pins this fixture's digest; squash merges make a commit SHA unusable as its identity.
const contractFixture = "reference/fixtures/public-contract.json";
let savedContract;
try {
  savedContract = JSON.parse(read(contractFixture));
} catch (error) {
  fail(`${contractFixture} is missing or invalid JSON: ${error.message}`);
}
if (savedContract !== undefined && (savedContract === null || typeof savedContract !== "object" || Array.isArray(savedContract))) {
  fail(`${contractFixture} must contain a contract object`);
} else if (savedContract) {
  const { dirty, ...saved } = savedContract;
  const { revision: _revision, dirty: _dirty, ...emitted } = buildContract(root);
  if (Object.hasOwn(saved, "revision")) fail(`${contractFixture} must not record a revision; its digest of contractVersion, publicTokens and privateProperties identifies the name contract`);
  else if (!isDeepStrictEqual(saved, emitted)) fail(`${contractFixture} drifts from scripts/emit-contract.mjs output; regenerate it from a clean checkout`);
  if (dirty !== false) fail(`${contractFixture} must record dirty false`);
}

if (!process.exitCode) {
  console.log(`PASS: CRFT contract — ${publicTokens.length} public tokens, ${privateProperties.length} private properties, ${preludeLayers.length} layers, ${files.length} shared stylesheets`);
}
