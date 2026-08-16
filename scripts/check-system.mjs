import { existsSync, readFileSync, readdirSync } from "node:fs";

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
const markedCodeNames = (document, marker, pattern) => {
  const block = document.match(new RegExp(`<!-- ${marker}:start -->([\\s\\S]*?)<!-- ${marker}:end -->`));
  if (!block) return undefined;
  return [...block[1].matchAll(pattern)].map((match) => match[1]);
};

const layers = ["base", "tokens", "type", "layout", "features", "utility"];
const files = layers.map((layer) => `styles/layers/${layer}.css`);
const copiedFiles = ["global.css", "sans.ttf", "mono.ttf", ...layers.map((layer) => `layers/${layer}.css`)];
const topicNames = [
  "brief", "composition", "html", "components", "forms", "tokens", "color", "type",
  "layout", "grid", "utilities", "motion", "adopt", "accessibility", "performance", "verify",
];
const topicDocs = topicNames.map((name) => `craft/${name}.md`);
const retiredTopicDocs = ["strategy", "design", "structure", "css", "quality"].map((name) => `craft/${name}.md`);
const retiredTopicPattern = /craft\/(?:strategy|design|structure|css|quality)\.md/i;
const canonicalDocs = ["README.md", "AGENTS.md", "CRAFT.md", ...topicDocs, "skills/crft/SKILL.md"];
const privateProperties = ["--l-gc", "--l-cs", "--l-rs", "--or", "--m-src-to", "--m-src-fr", "--m-plx"];
const typeMeasureRoles = ["h0", "h1", "h2", "h3", "h4", "h5", "h6", "lg", "bd", "sm"];
const supportedAccentRoutes = ["danger", "secondary", "success", "tertiary", "warning"];
const supportedSkins = ["accent", "invert", "tone"];

for (const path of [...canonicalDocs, "styles/global.css", ...files, "styles/sans.ttf", "styles/mono.ttf"]) {
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
if (existsSync(new URL("styles/layers/primitive.css", root))) fail("styles/layers/primitive.css is outside the six-owner CSS contract");
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
if (!craft.includes("intentionally does not ship a product CLI, consumer analyzer, automatic audit, or generated migration plan")) {
  fail("CRAFT.md does not record the retired tooling boundary");
}
for (const migration of [
  "styles/layers/{base,tokens,type,layout,features,utility}.css",
  ".h0` and `--t-h0-*",
  "--t-ff-*",
  "--t-fw-*",
  "--c-fb-su",
  "data-skin=\"accent\"",
  "No CRFT replacement",
  "provides no aliases",
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
for (const component of [".btn", ".crd", ".lnk"]) {
  if (!craft.includes(component) || !docsByPath["craft/components.md"].includes(component)) {
    fail(`${component} is missing from the project component naming boundary`);
  }
}
const documentedHooks = {
  "craft/type.md": [".h0", ".h1", ".h2", ".h3", ".h4", ".h5", ".h6", ".t-bd", ".t-lg", ".t-sm"],
  "craft/layout.md": [".c", ".c.sm", ".c.lg", ".s", ".s.h", ".s.w", ".s.center", ".s.sb", "container"],
  "craft/grid.md": ["g", "c", "r", "o", "a-sm", "a", "a-lg", "sg"],
  "craft/utilities.md": [".sr", ".sr.focusable", ".c-fg", ".c-mu", ".c-ac", ".c-sc", ".f-sa", ".f-se", ".f-mo", ".f-bd", ".f-dp", ".w-lt", ".w-rg", ".w-bd", ".tt-uc", ".tt-lc", ".tt-no", ".tt-cp"],
  "craft/motion.md": [".img-w", "data-scrub"],
  "craft/color.md": ["data-skin", "data-accent"],
};
for (const [path, hooks] of Object.entries(documentedHooks)) {
  for (const hook of hooks) {
    if (!docsByPath[path].includes(`\`${hook}\``)) fail(`${path} does not document public hook ${hook}`);
  }
}

const globalCss = stripCssComments(read("styles/global.css"));
const source = Object.fromEntries(files.map((file) => [file, stripCssComments(read(file))]));
const allCss = files.map((file) => source[file]).join("\n");
const tokensCss = source["styles/layers/tokens.css"];
const typeCss = source["styles/layers/type.css"];
const layoutCss = source["styles/layers/layout.css"];
const featuresCss = source["styles/layers/features.css"];
const utilityCss = source["styles/layers/utility.css"];

const expectedImports = layers.map((layer) => `layers/${layer}.css`);
const expectedGlobal = [
  `@layer ${layers.join(", ")};`,
  "",
  ...expectedImports.map((file) => `@import "./${file}";`),
].join("\n");
if (globalCss.trim() !== expectedGlobal.trim()) fail("styles/global.css must contain only the layer prelude and six imports");

const actualCssFiles = readdirSync(new URL("styles/layers/", root))
  .filter((name) => name.endsWith(".css"))
  .map((name) => `styles/layers/${name}`)
  .sort();
if (actualCssFiles.join("|") !== [...files].sort().join("|")) fail("styles/layers/ differs from the six-owner map");
files.forEach((file, index) => {
  const declared = unique([...source[file].matchAll(/@layer\s+([a-z-]+)\s*\{/g)].map((match) => match[1]));
  if (declared.length !== 1 || declared[0] !== layers[index]) fail(`${file} must own only @layer ${layers[index]}`);
});

const copyScript = read("scripts/copy-system.mjs");
const manifestBlock = copyScript.match(/const files = \[([\s\S]*?)\];/);
const copyManifest = manifestBlock ? [...manifestBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
if (copyManifest.join("|") !== copiedFiles.join("|")) fail("copy-system.mjs manifest differs from the canonical CSS tree");
if (/skill|inject|seess/i.test(copyScript)) fail("copy-system.mjs retains removed skill, inject, or product identifiers");

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
if (/font-variation-settings/i.test(typeCss)) fail("type.css must use registered font-weight instead of font-variation-settings");
for (const [family, file] of [["SNZ Sans", "sans.ttf"], ["SNZ Mono", "mono.ttf"]]) {
  const face = [...typeCss.matchAll(/@font-face\s*\{[^}]*\}/g)].map((match) => match[0]).find((block) => block.includes(`font-family: "${family}"`));
  if (!face || !face.includes(`src: url("../${file}") format("truetype");`) || !/font-weight:\s*100 900;/.test(face)) {
    fail(`${family} must load ../${file} with a registered 100 900 font-weight range`);
  }
}
const typeHookSignals = {
  ".h0": ".h0 {", ".h1": "h1, .h1 {", ".h2": "h2, .h2 {", ".h3": "h3, .h3 {",
  ".h4": "h4, .h4 {", ".h5": "h5, .h5 {", ".h6": "h6, .h6 {",
  ".t-bd": "p, .t-bd {", ".t-lg": ".t-lg {", ".t-sm": ".t-sm {",
};
for (const [hook, signal] of Object.entries(typeHookSignals)) {
  if (!hasCssSignal(typeCss, signal)) fail(`type.css is missing documented hook ${hook}`);
}

const layoutHookSignals = {
  ".c": ".c {", ".c.sm": "&.sm {", ".c.lg": "&.lg {", ".s": ".s {",
  ".s.h": "&.h {", ".s.w": "&.w {", ".s.center": "&.center {", ".s.sb": "&.sb {",
  container: "section>.c { container: container / inline-size",
};
for (const [hook, signal] of Object.entries(layoutHookSignals)) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing documented hook ${hook}`);
}
const gridHookSignals = {
  g: "[g] {", c: "[g]>[c", r: "[g]>[r", o: "[g]>[o", "a-sm": '[g="a-sm"]',
  a: '[g="a"]', "a-lg": '[g="a-lg"]', sg: '[g="sg"]',
};
for (const [hook, signal] of Object.entries(gridHookSignals)) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing documented grid hook ${hook}`);
}
for (let position = 1; position <= 12; position += 1) {
  for (const signal of [`[g$="${position}"]`, `[g^="${position}"]`, `[g]>[c$="${position}"]`, `[g]>[c^="${position}"]`]) {
    if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing numeric grid rule ${signal}`);
  }
}
for (const signal of ['[g]>[c$="0"]', '[g]>[c^="0"]']) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing full-row grid rule ${signal}`);
}
for (let position = 1; position <= 4; position += 1) {
  for (const signal of [`[g]>[r$="${position}"]`, `[g]>[r^="${position}"]`]) {
    if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing row-span grid rule ${signal}`);
  }
}
for (const position of ["f", "a", "l"]) {
  for (const signal of [`[g]>[o$="-${position}"]`, `[g]>[o*="-${position}-"]`, `[g]>[o^="${position}"]`]) {
    if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing visual-order grid rule ${signal}`);
  }
}
for (const signal of ["--l-gc: 3", "--l-cs: 1", "--l-rs: 1"]) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing omitted-span default ${signal}`);
}
const expectedUtilityHooks = documentedHooks["craft/utilities.md"].filter((hook) => hook !== ".sr.focusable").sort();
const actualUtilityHooks = unique([...utilityCss.matchAll(/^ {2}\.([a-z0-9-]+)\s*\{/gm)].map((match) => `.${match[1]}`)).sort();
if (actualUtilityHooks.join("|") !== expectedUtilityHooks.join("|")) fail("utility.css selectors differ from the documented finite utility surface");
if (!hasCssSignal(utilityCss, "&.focusable:focus-visible")) fail("utility.css is missing documented hook .sr.focusable");
if (!hasCssSignal(tokensCss, ":root, [data-skin] {") || !hasCssSignal(tokensCss, "[data-accent] {")) {
  fail("tokens.css is missing a documented skin or accent boundary");
}
for (const signal of [
  "@supports selector(details::details-content)", ":where(dialog, input, textarea, select)",
  ".img-w[data-scrub]", "&[data-scrub='reverse']>img",
]) {
  if (!hasCssSignal(featuresCss, signal)) fail(`features.css is missing documented feature hook: ${signal}`);
}
const genericScrub = featuresCss.match(/(?:^|\n)\s+\[data-scrub\]\s*\{([^}]*)\}/)?.[1];
if (!genericScrub || !hasCssSignal(genericScrub, "animation-timeline: view()") || !hasCssSignal(genericScrub, "animation-range: entry 0% exit 100%")) {
  fail("features.css is missing the generic scrub progress rule");
}
if (!hasCssSignal(featuresCss, "@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) {")) {
  fail("features.css scrub must remain inside feature and reduced-motion gates");
}

for (const signal of [
  "section>.c { container: container / inline-size", "display: flex", "flex-direction: column",
  "@container container (width >=30rem)", "@container container (width >=60rem)",
  "grid-template-columns: repeat(var(--l-gc), minmax(0, 1fr))", '[g]> :is([c="0"], [c$="-0"])',
  '[g]> :is([c="0"], [c^="0-"])', '[g]>[o*="-a-"]', '[g]>[o^="a"]',
]) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing invariant: ${signal}`);
}
if (/@media\s*\(\s*width\b/.test(layoutCss)) fail("layout.css must use container queries for grid states");
if (/(?:^|})\s*\.c\s*\{[^}]*\bcontainer\s*:/s.test(layoutCss)) fail("only section > .c may establish the query boundary");

const accentRoutes = unique([...tokensCss.matchAll(/\[data-accent\s*=\s*(["'])([^"']+)\1\]/g)].map((match) => match[2])).sort();
const skinRoutes = unique([...tokensCss.matchAll(/\[data-skin\s*=\s*(["'])([^"']+)\1\]/g)].map((match) => match[2])).sort();
if (accentRoutes.join("|") !== supportedAccentRoutes.join("|")) fail("tokens.css explicit data-accent routes differ from the contract");
if (skinRoutes.join("|") !== supportedSkins.join("|")) fail("tokens.css explicit data-skin routes differ from the contract");
const documentedAccentRoutes = markedCodeNames(docsByPath["craft/color.md"], "accent-value-index", /`([a-z-]+)`/g)?.sort();
const documentedSkinRoutes = markedCodeNames(docsByPath["craft/color.md"], "skin-value-index", /`([a-z-]+)`/g)?.sort();
if (!documentedAccentRoutes || documentedAccentRoutes.join("|") !== accentRoutes.join("|")) fail("craft/color.md accent routes differ from source");
if (!documentedSkinRoutes || documentedSkinRoutes.join("|") !== skinRoutes.join("|")) fail("craft/color.md skin routes differ from source");
if (!featuresCss.includes("&[data-scrub='reverse']>img")) fail("features.css is missing reverse scrub behavior");
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
  for (const value of attributeValues(active, "g")) {
    if (!["", "a", "a-sm", "a-lg", "sg"].includes(value) && !validResponsiveNumber(value, 12)) {
      fail(`${path} uses invalid g value ${value}`);
    }
  }
  for (const value of attributeValues(active, "c")) {
    if (!value || !validResponsiveNumber(value, 12, true)) fail(`${path} uses invalid c value ${value || "(empty)"}`);
  }
  for (const value of attributeValues(active, "r")) {
    if (!value || !validResponsiveNumber(value, 4)) fail(`${path} uses invalid r value ${value || "(empty)"}`);
  }
  for (const value of attributeValues(active, "o")) {
    if (!/^[fal]-[fal]-[fal]$/.test(value)) fail(`${path} uses invalid o value ${value}`);
  }
};
const validateExampleCss = (css, path) => {
  const active = stripCssComments(css);
  if (!/^\s*@layer\s+project\s*\{/.test(active)) fail(`${path} must declare its chosen project layer`);
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
  console.log(`PASS: CRFT contract — ${publicTokens.length} public tokens, ${privateProperties.length} private properties, ${layers.length} layers, ${files.length} shared stylesheets`);
}
