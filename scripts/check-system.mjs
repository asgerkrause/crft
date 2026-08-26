import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolveAdoptRequest } from "./copy-system.mjs";

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
const assertWeightVariationPair = (css, path) => {
  const active = stripCssComments(css);
  for (const match of active.matchAll(/font-weight:\s*([^;]+);/g)) {
    const value = match[1].trim();
    if (/^\d+\s+\d+$/.test(value)) continue;
    const window = active.slice(match.index, match.index + match[0].length + 120);
    if (!hasCssSignal(window, `font-variation-settings: "wght" ${value}`)) {
      fail(`${path} font-weight ${value} must pair font-variation-settings "wght"`);
    }
  }
};
const markedCodeNames = (document, marker, pattern) => {
  const block = document.match(new RegExp(`<!-- ${marker}:start -->([\\s\\S]*?)<!-- ${marker}:end -->`));
  if (!block) return undefined;
  return [...block[1].matchAll(pattern)].map((match) => match[1]);
};

const preludeLayers = ["reset", "base", "tokens", "type", "layout", "grid", "motion", "utility"];
const layerFiles = ["base", "tokens", "type", "layout", "grid", "motion", "utility"];
const extraLayerFiles = ["fonts"];
const sourceImportOrder = ["base", "tokens", "fonts", "type", "layout", "grid", "motion", "utility"];
const files = [...layerFiles, ...extraLayerFiles].map((layer) => `styles/layers/${layer}.css`);
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
  "--t-st", "--t-fs-lo", "--t-fs-hi", "--t-fs-sl",
];
const typeRoles = ["h0", "h1", "h2", "h3", "h4", "h5", "h6", "lg", "bd", "sm"];
const typeColors = ["fg", "mu", "ac", "sc"];
const typeTransforms = ["uc", "lc", "cp", "no"];
const typeWeightFlags = ["lt", "rg", "bo"];
const typeFamilyFlags = ["sa", "se", "mo", "fb", "dp"];
const typeMeasureRoles = [...typeRoles];
const stackFlags = ["h", "w", "ct", "sb"];
const stackGaps = ["xs", "sm", "lg", "xl"];
const containerMeasures = ["sm", "lg"];
const containerFlags = ["ct"];
const clampValues = ["", "1", "2", "3", "4"];
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
if (existsSync(new URL("styles/layers/primitive.css", root))) fail("styles/layers/primitive.css is outside the canonical CSS contract");
if (existsSync(new URL("styles/layers/features.css", root))) fail("styles/layers/features.css remains; base and motion now own those jobs");
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
const expectedAdoptionModes = ["Strategy only", "Local extraction", "Selected complete layers", "Explicit full adoption"];
if (adoptionModes.join("|") !== expectedAdoptionModes.join("|")) fail("craft/adopt.md adoption modes differ from the canonical four-mode contract");
for (const mode of ["Strategy only", "Local extraction"]) {
  if (adoptionModeRows.find(([name]) => name === mode)?.[2] !== "None") fail(`craft/adopt.md ${mode} must expose no CRFT hooks`);
}
if (!/retained live hooks/i.test(adoptionModeRows.find(([name]) => name === "Selected complete layers")?.[2] ?? "")) {
  fail("craft/adopt.md selected layers must expose retained live hooks only");
}
if (!craft.includes("intentionally does not ship a product CLI, consumer analyzer, automatic audit, or generated migration plan")) {
  fail("CRAFT.md does not record the retired tooling boundary");
}
for (const migration of [
  "styles/layers/{base,tokens,type,layout,grid,motion,utility}.css",
  "styles/layers/features.css",
  "motion.css",
  "t=\"h0\"",
  "c=\"sm\"",
  "[x]",
  "[y]",
  "--t-fs-min",
  "--t-ff-*",
  "--t-fw-*",
  "--c-fb-su",
  "data-skin=\"accent\"",
  "No CRFT replacement",
  "provides no aliases",
  "--layers",
  "Do not default to the full tree on an existing site",
  "does not copy `global.css`",
  "Observed",
  "--t-h1-fs",
  "--fonts",
  "lt`, `rg`, `bo",
  "sa`, `se`, `mo",
]) {
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
if (!/local extraction[^.\n]*selected complete layers[^.\n]*coexist/i.test(skillAsk) || !/extraction itself grants no CRFT hooks/i.test(skillAsk)) {
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
  "craft/type.md": ["t", "l"],
  "craft/layout.md": [
    "c", "c=\"sm\"", "c=\"lg\"", "c=\"ct\"", "s", "s=\"h\"", "s=\"w\"", "s=\"ct\"", "s=\"sb\"",
    "s=\"xs\"", "s=\"sm\"", "s=\"lg\"", "s=\"xl\"", "container", ".img-w",
  ],
  "craft/grid.md": ["g", "x", "y", "o", "a-sm", "a", "a-lg", "sg"],
  "craft/utilities.md": [".sr", ".sr.focusable"],
  "craft/motion.md": [".img-w", "data-scrub"],
  "craft/color.md": ["data-skin", "data-accent"],
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

const globalCss = stripCssComments(read("styles/global.css"));
const source = Object.fromEntries(files.map((file) => [file, stripCssComments(read(file))]));
const allCss = files.map((file) => source[file]).join("\n");
const tokensCss = source["styles/layers/tokens.css"];
const typeCss = source["styles/layers/type.css"];
const fontsCss = source["styles/layers/fonts.css"];
const layoutCss = source["styles/layers/layout.css"];
const gridCss = source["styles/layers/grid.css"];
const motionCss = source["styles/layers/motion.css"];
const baseCss = source["styles/layers/base.css"];
const utilityCss = source["styles/layers/utility.css"];

const expectedImports = sourceImportOrder.map((layer) => `layers/${layer}.css`);
const expectedGlobal = [
  `@layer ${preludeLayers.join(", ")};`,
  "",
  ...expectedImports.map((file) => `@import "./${file}";`),
].join("\n");
if (globalCss.trim() !== expectedGlobal.trim()) fail("styles/global.css must contain only the layer prelude and eight imports");

const actualCssFiles = readdirSync(new URL("styles/layers/", root))
  .filter((name) => name.endsWith(".css"))
  .map((name) => `styles/layers/${name}`)
  .sort();
if (actualCssFiles.join("|") !== [...files].sort().join("|")) fail("styles/layers/ differs from the canonical owner map");
files.forEach((file) => {
  const declared = unique([...source[file].matchAll(/@layer\s+([a-z-]+)\s*\{/g)].map((match) => match[1]));
  if (file.endsWith("base.css")) {
    if (declared.join("|") !== "reset|base") fail(`${file} must own @layer reset then @layer base`);
    return;
  }
  if (file.endsWith("fonts.css")) {
    if (declared.join("|") !== "type") fail(`${file} must own @layer type`);
    return;
  }
  const expected = file.match(/layers\/([a-z]+)\.css$/)?.[1];
  if (declared.length !== 1 || declared[0] !== expected) fail(`${file} must own only @layer ${expected}`);
});

const copyScript = read("scripts/copy-system.mjs");
if (/skill|inject|seess/i.test(copyScript)) fail("copy-system.mjs retains removed skill, inject, or product identifiers");
const tokensOnly = resolveAdoptRequest({ layers: "tokens" });
if (tokensOnly.manifest.join("|") !== "layers/tokens.css") fail("copy-system.mjs tokens profile is not tokens.css only");
if (/global\.css/.test(tokensOnly.entryBlock)) fail("copy-system.mjs entry block still names global.css");
const fullCopy = resolveAdoptRequest({ layers: "full" });
if (fullCopy.manifest.includes("global.css") || fullCopy.manifest.includes("layers/fonts.css") || fullCopy.manifest.some((file) => file.endsWith(".woff"))) {
  fail("copy-system.mjs full profile copies global.css, fonts, or woffs");
}
try {
  resolveAdoptRequest({ layers: "grid" });
  fail("copy-system.mjs allows grid without layout");
} catch (error) {
  if (!/requires/.test(error.message)) fail(`copy-system.mjs grid refusal is unclear: ${error.message}`);
}

const publicTokens = unique([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
const publicTokenSet = new Set(publicTokens);
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
if (!tokenDocument.includes("styles/layers/tokens.css") || !/sole catalog and authority/i.test(tokenDocument)) {
  fail("craft/tokens.md must route live token values and formulas to styles/layers/tokens.css");
}
for (const signal of [
  "A section needs no ID by default.",
  "Do not put a class on `section`.",
  "Add `aria-labelledby` only when the section should become a useful named `region` landmark.",
  "Do not style through IDs.",
]) {
  if (!docsByPath["craft/html.md"].includes(signal)) fail(`craft/html.md is missing identifier doctrine: ${signal}`);
}

for (const role of typeMeasureRoles) {
  const token = `--t-${role}-mw`;
  if (!hasCssSignal(tokensCss, `${token}: 70ch`)) fail(`tokens.css must default ${token} to 70ch`);
  if ((typeCss.match(new RegExp(`var\\(${token}\\)`, "g")) || []).length !== 1) {
    fail(`type.css must consume ${token} exactly once`);
  }
}
if (/body\s*\{[^}]*max-width/s.test(typeCss)) fail("type.css must keep body unconstrained");
assertWeightVariationPair(typeCss, "styles/layers/type.css");
assertWeightVariationPair(baseCss, "styles/layers/base.css");
if (!hasCssSignal(typeCss, 'font-variation-settings: "wght" var(--t-fw-bd)')) {
  fail("type.css must pair registered font-weight with the wght axis");
}
if (!docsByPath["craft/type.md"].includes('font-variation-settings: "wght"') || !docsByPath["AGENTS.md"].includes('font-variation-settings: "wght"')) {
  fail("type guidance must keep font-weight paired with font-variation-settings wght");
}
if (/@font-face/i.test(typeCss)) fail("type.css must not register faces; fonts.css owns @font-face");
for (const [family, file] of [["SNZ Sans", "sans.woff"], ["SNZ Mono", "mono.woff"]]) {
  const face = [...fontsCss.matchAll(/@font-face\s*\{[^}]*\}/g)].map((match) => match[0]).find((block) => block.includes(`font-family: "${family}"`));
  if (!face || !face.includes(`src: url("../${file}") format("woff");`) || !/font-weight:\s*100 900;/.test(face)) {
    fail(`${family} must load ../${file} with a registered 100 900 font-weight range`);
  }
}
if (!hasCssSignal(typeCss, ':where(body, h1, h2, h3, h4, h5, h6, [t]) {')) {
  fail("type.css is missing the bounded fluid type calculation boundary");
}
for (const role of typeRoles) {
  if (!hasCssSignal(typeCss, `[t~="${role}"]`)) fail(`type.css is missing documented t value ${role}`);
}
for (const heading of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
  if (!hasCssSignal(typeCss, `${heading}, [t~="${heading}"] {`)) fail(`type.css is missing native ${heading} mapping`);
}
for (const flag of typeColors) {
  if (!hasCssSignal(typeCss, `[t~="${flag}"]`)) fail(`type.css is missing documented t color flag ${flag}`);
}
for (const flag of typeTransforms) {
  if (!hasCssSignal(typeCss, `[t~="${flag}"]`)) fail(`type.css is missing documented t transform flag ${flag}`);
}
for (const flag of typeWeightFlags) {
  if (!hasCssSignal(typeCss, `[t~="${flag}"]`)) fail(`type.css is missing documented t weight flag ${flag}`);
}
for (const flag of typeFamilyFlags) {
  if (!hasCssSignal(typeCss, `[t~="${flag}"]`)) fail(`type.css is missing documented t family flag ${flag}`);
}
if (!hasCssSignal(typeCss, '[t~="bo"] { font-weight: var(--t-fw-bd); font-variation-settings: "wght" var(--t-fw-bd)')) {
  fail("type.css t flag bo must consume --t-fw-bd");
}
if (!hasCssSignal(typeCss, '[t~="fb"] { font-family: var(--t-ff-bd)')) {
  fail("type.css t flag fb must consume --t-ff-bd");
}
for (const property of ["--t-st", "--t-fs-lo", "--t-fs-hi", "--t-fs-sl"]) {
  if (!typeCss.includes(property)) fail(`type.css is missing private fluid property ${property}`);
}
if (!hasCssSignal(typeCss, "font-size: clamp(")) fail("type.css is missing fluid font-size clamping");
if (/\.(?:h[0-6]|t-(?:lg|bd|sm))(?:[\s,:.{#]|$)/i.test(allCss)) {
  fail("canonical CSS retains a retired class-based type role");
}

const layoutHookSignals = {
  c: "[c] {", "c=\"sm\"": '&[c~="sm"] {', "c=\"lg\"": '&[c~="lg"] {',
  "c=\"ct\"": '&[c~="ct"] {',
  s: "[s] {", "s=\"h\"": '&[s~="h"] {', "s=\"w\"": '&[s~="w"] {',
  "s=\"ct\"": '&[s~="ct"] {', "s=\"sb\"": '&[s~="sb"] {',
  "s=\"xs\"": '&[s~="xs"] {', "s=\"sm\"": '&[s~="sm"] {',
  "s=\"lg\"": '&[s~="lg"] {', "s=\"xl\"": '&[s~="xl"] {',
  container: "section>[c] { container: container / inline-size",
  ".img-w": ".img-w {",
};
for (const [hook, signal] of Object.entries(layoutHookSignals)) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing documented hook ${hook}`);
}
for (const signal of [
  ">header, >main>section, >footer { padding: var(--l-bl-y) var(--l-bl-x)",
  ">header { padding-block: var(--p)", ">footer { padding-bottom: var(--p)",
  "view-transition-name: header", "view-transition-name: main", "view-transition-name: footer",
  "max-width: var(--l-cw)", "max-width: calc(var(--l-cw) / 3 * 2)",
  "max-width: calc(var(--l-cw) / 3 * 4)",
]) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing viewport-derived container behavior: ${signal}`);
}
const gridHookSignals = {
  g: "[g] {", x: "[g]>[x", y: "[g]>[y", o: "[g]>[o", "a-sm": '[g="a-sm"]',
  a: '[g="a"]', "a-lg": '[g="a-lg"]', sg: '[g="sg"]',
};
for (const [hook, signal] of Object.entries(gridHookSignals)) {
  if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing documented grid hook ${hook}`);
}
for (let position = 1; position <= 12; position += 1) {
  for (const signal of [`[g$="${position}"]`, `[g^="${position}"]`, `[g]>[x$="${position}"]`, `[g]>[x^="${position}"]`]) {
    if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing numeric grid rule ${signal}`);
  }
}
for (const signal of ['[g]>[x$="0"]', '[g]>[x^="0"]']) {
  if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing full-row grid rule ${signal}`);
}
for (let position = 1; position <= 4; position += 1) {
  for (const signal of [`[g]>[y$="${position}"]`, `[g]>[y^="${position}"]`]) {
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
if (!hasCssSignal(tokensCss, ":root, [data-skin] {") || !hasCssSignal(tokensCss, "[data-accent] {")) {
  fail("tokens.css is missing a documented skin or accent boundary");
}
for (const signal of [
  "@supports selector(details::details-content)", "corner-shape: squircle",
  ':where(a) {', ':where(a, button, label) {',
  "transition-property: color, background, border, transform, opacity, font-variation-settings",
  'transition-duration: var(--m-td)',
  '[aria-current="page"]',
  "list-style-position: outside",
  "border: var(--b-wd) solid var(--c-bc)",
  "border-color: var(--c-fb-dn)",
]) {
  if (!hasCssSignal(baseCss, signal)) fail(`base.css is missing native enhancement: ${signal}`);
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
  "section>[c] { container: container / inline-size", "display: flex", "flex-direction: column",
]) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing invariant: ${signal}`);
}
const containerQueryMd = tokensCss.match(/--l-cq-md\s*:\s*([^;]+);/)?.[1].trim();
const containerQueryLg = tokensCss.match(/--l-cq-lg\s*:\s*([^;]+);/)?.[1].trim();
if (!containerQueryMd || !containerQueryLg) fail("tokens.css is missing named container-query thresholds");
for (const signal of [
  `@container container (width >=${containerQueryMd})`,
  `@container container (width >=${containerQueryLg})`,
  "grid-template-columns: repeat(var(--l-gc), minmax(0, 1fr))", '[g]> :is([x="0"], [x$="-0"])',
  '[g]> :is([x="0"], [x^="0-"])', '[g]>[o*="-a-"]', '[g]>[o^="a"]',
]) {
  if (!hasCssSignal(gridCss, signal)) fail(`grid.css is missing invariant: ${signal}`);
}
if (/@media\s*\(\s*width\b/.test(gridCss)) fail("grid.css must use container queries for grid states");
if (/(?:^|})\s*\[c\]\s*\{[^}]*\bcontainer\s*:/s.test(layoutCss)) fail("only section > [c] may establish the query boundary");

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
  if (!tokenDocument.includes(property) || !docsByPath["AGENTS.md"].includes(property)) fail(`${property} is not documented as private`);
  if (documentedTokens?.includes(property)) fail(`${property} appears in the public token index`);
}
if (/data-theme/i.test(allCss)) fail("canonical CSS uses data-theme instead of data-skin");

const privatePattern = new RegExp(`(?:${privateProperties.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![a-z0-9-])`, "i");
const attributeValues = (html, name) => unique(
  [...html.matchAll(new RegExp(`\\s${name}\\s*=\\s*([\"'])([^\"']*)\\1`, "gi"))].map((match) => match[2]),
);
const validGridNumber = (value, maximum, allowZero = false) => {
  if (!/^\d+$/.test(value)) return false;
  const number = Number(value);
  return (allowZero && number === 0) || (number >= 1 && number <= maximum);
};
const validResponsiveNumber = (value, maximum, allowZero = false) => {
  const values = value.split("-");
  return values.length <= 2 && values.every((part) => validGridNumber(part, maximum, allowZero));
};
const idReferenceAttributes = [
  "for", "aria-labelledby", "aria-describedby", "aria-controls", "aria-owns",
  "aria-activedescendant", "aria-details", "aria-errormessage",
];
const retiredExampleHooks = [
  "site-header", "site-footer", "site-title", "northline-banner", "northline-colophon", "brand-mark",
  "invites-banner", "invites-compose", "invites-results", "invites-lead", "invites-filters", "invites-form-panel",
  "invites-form", "field", "field-group", "field-msg", "choice", "roster", "band", "orientation", "proof",
  "faq", "refuse", "convert", "hero", "copy", "media", "board", "masthead", "deck", "folio", "folio-panel",
  "pull", "issues", "issues-lead", "pitch", "ladder", "ladder-steps", "proof-intro", "refuse-callout", "refuse-list",
  "c", "s", "center", "c-fg", "c-mu", "c-ac", "c-sc", "f-sa", "f-se", "f-mo", "f-bd", "f-dp",
  "w-lt", "w-rg", "w-bd", "tt-uc", "tt-lc", "tt-no", "tt-cp",
];
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
      if (retiredExampleHooks.includes(hook)) fail(`${path} retains unnecessary example hook .${hook}`);
    }
  }
  for (const value of attributeValues(active, "data-skin")) {
    if (value && !supportedSkins.includes(value)) fail(`${path} uses unsupported data-skin ${value}`);
  }
  for (const value of attributeValues(active, "data-accent")) {
    if (!supportedAccentRoutes.includes(value)) fail(`${path} uses unsupported data-accent ${value}`);
  }
  for (const value of attributeValues(active, "t")) {
    const tokens = value.trim().split(/\s+/).filter(Boolean);
    let roles = 0;
    let colors = 0;
    let transforms = 0;
    let weights = 0;
    let families = 0;
    for (const token of tokens) {
      if (typeRoles.includes(token)) roles += 1;
      else if (typeColors.includes(token)) colors += 1;
      else if (typeTransforms.includes(token)) transforms += 1;
      else if (typeWeightFlags.includes(token)) weights += 1;
      else if (typeFamilyFlags.includes(token)) families += 1;
      else fail(`${path} uses unsupported t token ${token}`);
    }
    if (roles > 1) fail(`${path} uses more than one t role`);
    if (colors > 1) fail(`${path} uses more than one t color`);
    if (transforms > 1) fail(`${path} uses more than one t transform`);
    if (weights > 1) fail(`${path} uses more than one t weight`);
    if (families > 1) fail(`${path} uses more than one t family`);
  }
  if (attributeValues(active, "w").length) fail(`${path} uses retired w attribute; put lt, rg, or bo on t`);
  if (attributeValues(active, "f").length) fail(`${path} uses retired f attribute; put sa, se, mo, fb, or dp on t`);
  for (const value of attributeValues(active, "g")) {
    if (!["", "a", "a-sm", "a-lg", "sg"].includes(value) && !validResponsiveNumber(value, 12)) {
      fail(`${path} uses invalid g value ${value}`);
    }
  }
  for (const value of attributeValues(active, "c")) {
    const tokens = value.trim().split(/\s+/).filter(Boolean);
    let measures = 0;
    const seen = new Set();
    for (const token of tokens) {
      if (containerMeasures.includes(token)) measures += 1;
      else if (!containerFlags.includes(token)) fail(`${path} uses invalid c token ${token}`);
      if (seen.has(token)) fail(`${path} repeats c token ${token}`);
      seen.add(token);
    }
    if (measures > 1) fail(`${path} uses more than one c measure`);
  }
  for (const value of attributeValues(active, "s")) {
    const tokens = value.trim().split(/\s+/).filter(Boolean);
    const seen = new Set();
    let gaps = 0;
    for (const token of tokens) {
      if (stackGaps.includes(token)) gaps += 1;
      else if (!stackFlags.includes(token)) fail(`${path} uses invalid s flag ${token}`);
      if (seen.has(token)) fail(`${path} repeats s flag ${token}`);
      seen.add(token);
    }
    if (gaps > 1) fail(`${path} uses more than one s gap`);
  }
  for (const value of attributeValues(active, "x")) {
    if (!value || !validResponsiveNumber(value, 12, true)) fail(`${path} uses invalid x value ${value || "(empty)"}`);
  }
  for (const value of attributeValues(active, "y")) {
    if (!value || !validResponsiveNumber(value, 4)) fail(`${path} uses invalid y value ${value || "(empty)"}`);
  }
  for (const value of attributeValues(active, "l")) {
    if (!clampValues.includes(value)) fail(`${path} uses invalid l value ${value || "(empty)"}`);
  }
  for (const value of attributeValues(active, "o")) {
    if (!/^[fal]-[fal]-[fal]$/.test(value)) fail(`${path} uses invalid o value ${value}`);
  }
};
const validateExampleCss = (css, path) => {
  const active = stripCssComments(css);
  if (!/^\s*@layer\s+project\s*\{/.test(active)) fail(`${path} must declare its chosen project layer`);
  assertWeightVariationPair(active, path);
  for (const hook of retiredExampleHooks) {
    if (new RegExp(`\\.${hook}(?![a-z0-9-])`, "i").test(active)) fail(`${path} retains unnecessary example selector .${hook}`);
  }
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
const siblingIndexUses = brandedExampleCss.match(/sibling-index\(\)/g)?.length ?? 0;
if (siblingIndexUses !== 2 || !hasCssSignal(brandedExampleCss, "@supports (animation-delay: calc(1ms * sibling-index())) { @media (prefers-reduced-motion: no-preference) {")) {
  fail("branded extension stagger must keep sibling-index() inside feature and reduced-motion gates");
}
const pageReferenceMarkup = read("examples/page-from-reference/markup.html");
const pageReferenceCss = stripCssComments(read("examples/page-from-reference/example.css"));
if (!pageReferenceMarkup.includes('class="img-w" data-scrub')) {
  fail("page-from-reference does not demonstrate the public image scrub with a static fallback");
}
for (const signal of ["aspect-ratio: 3 / 2", "overflow: hidden", "object-fit: cover", "object-position: var(--hero-img-pos)"]) {
  if (!hasCssSignal(pageReferenceCss, signal)) fail(`page-from-reference is missing deliberate crop behavior: ${signal}`);
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
        if (/data-theme/i.test(active)) fail(`${path} uses data-theme`);
        validateExampleCss(text, path);
      }
      if (path.endsWith(".html")) {
        if (/<[^>]*\bdata-theme\b[^>]*>/i.test(active)) fail(`${path} uses data-theme`);
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

if (!process.exitCode) {
  console.log(`PASS: CRFT contract — ${publicTokens.length} public tokens, ${privateProperties.length} private properties, ${preludeLayers.length} layers, ${files.length} shared stylesheets`);
}
