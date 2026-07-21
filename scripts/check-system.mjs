import { existsSync, readFileSync, readdirSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const fail = (message) => {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
};
const unique = (values) => [...new Set(values)];
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const accentRoutes = (value) => unique([...value.matchAll(/\[data-accent\s*=\s*(["'])([^"']+)\1\]/g)].map((match) => match[2])).sort();
const stripCssComments = (value) => value.replace(/\/\*[\s\S]*?\*\//g, "");
const normalizeCss = (value) => value.replace(/\s+/g, "");
const hasCssSignal = (css, signal) => normalizeCss(css).includes(normalizeCss(signal));

const layers = ["base", "tokens", "type", "layout", "features", "utility", "project"];
const files = layers.map((layer) => `styles/${layer}.css`);
const copiedFiles = ["global.css", "sans.ttf", "mono.ttf", ...files];
const retiredTokens = ["--c-br", "--c-sw-org", "--c-sw-grn", "--c-sw-prp", "--c-sw-pnk", "--m-tf-in", "--m-tf-ot"];
const internalTokens = ["--l-gc", "--l-cs", "--l-rs", "--or", "--m-src-to", "--m-src-fr", "--m-plx"];
const typeMeasureRoles = ["hd", "h1", "h2", "h3", "h4", "h5", "h6", "lg", "bd", "sm"];
const supportedAccentRoutes = ["secondary", "tertiary", "success", "warning", "danger"].sort();
const accentRouteGuidance = "Supported explicit routes: `secondary`, `tertiary`, `success`, `warning`, and `danger`; omit `data-accent` for the default accent.";

const globalCss = stripCssComments(read("global.css"));
const source = Object.fromEntries(files.map((file) => [file, stripCssComments(read(file))]));
const allCss = files.map((file) => source[file]).join("\n");
const tokensCss = source["styles/tokens.css"];
const typeCss = source["styles/type.css"];
const layoutCss = source["styles/layout.css"];
const featuresCss = source["styles/features.css"];
const readme = read("README.md");
const agents = read("AGENTS.md");
const skill = read(".agents/skills/snz-css-system/SKILL.md");
const copyScript = read("scripts/copy-system.mjs");
const docs = `${readme}\n${agents}\n${skill}`;
const activeSources = `${allCss}\n${docs}`;
const publicTokens = unique([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
const publicTokenSection = readme.match(/(?:^|\n)## Public tokens\n([\s\S]*?)\n## Internal properties(?:\n|$)/)?.[1];
const catalogTokens = publicTokenSection
  ? unique([...publicTokenSection.matchAll(/`(--[a-z0-9-]+)`/g)].map((match) => match[1]))
  : [];
const importedFiles = [...globalCss.matchAll(/@import\s+"\.\/(styles\/[^"\n]+)";/g)].map((match) => match[1]);
const expectedGlobal = [
  `@layer ${layers.join(", ")};`,
  "",
  ...files.map((file) => `@import "./${file}";`)
].join("\n");
if (globalCss.trim() !== expectedGlobal.trim()) fail("global.css must contain only the seven-layer prelude and canonical imports");
if (importedFiles.join("|") !== files.join("|")) fail("global.css imports differ from the ownership map");

const copyManifestBlock = copyScript.match(/const files = \[([\s\S]*?)\];/);
const copyManifest = copyManifestBlock
  ? [...copyManifestBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1])
  : [];
if (copyManifest.join("|") !== copiedFiles.join("|")) fail("copy-system.mjs manifest differs from the canonical system tree");
for (const [document, name] of [[readme, "README.md"], [agents, "AGENTS.md"], [skill, "local skill"]]) {
  if (!document.includes("scripts/copy-system.mjs")) fail(`${name} does not route adoption through copy-system.mjs`);
  if (!document.includes('o="L-M-S"')) fail(`${name} does not require complete visual-order authoring`);
}
if (!readme.includes("an empty `c` is not public authoring grammar") || !readme.includes("an empty `r` is not public authoring grammar")) {
  fail("README.md does not exclude empty child-span attributes from public authoring grammar");
}
if (agents.includes("`g`, `c`, and `r` accept an empty value")) fail("AGENTS.md retains ambiguous empty grid grammar");

const actualCssFiles = readdirSync(new URL("styles/", root))
  .filter((name) => name.endsWith(".css"))
  .map((name) => `styles/${name}`)
  .sort();
if (actualCssFiles.join("|") !== [...files].sort().join("|")) fail("styles/ contains files outside the seven-file ownership map");
files.forEach((file, index) => {
  const declared = unique([...source[file].matchAll(/@layer\s+([a-z-]+)\s*\{/g)].map((match) => match[1]));
  if (declared.length !== 1 || declared[0] !== layers[index]) fail(`${file} must own only @layer ${layers[index]}`);
});

if (!publicTokenSection) {
  fail("README.md is missing the Public tokens catalog boundary");
} else {
  const publicTokenSet = new Set(publicTokens);
  const catalogTokenSet = new Set(catalogTokens);
  publicTokens.forEach((name) => {
    if (!catalogTokenSet.has(name)) fail(`${name} is missing from README.md public-token catalog`);
  });
  catalogTokens.forEach((name) => {
    if (!publicTokenSet.has(name)) fail(`${name} is cataloged in README.md but not declared in styles/tokens.css`);
  });
}
if (!readme.includes("sans.ttf") || !readme.includes("mono.ttf")) fail("README.md must document both bundled font files");
if (!readme.includes("font-variation-settings") || !readme.includes("variable `wght`")) {
  fail("README.md must document registered font-weight variable-axis behavior");
}
if (!agents.includes("styles/type.css") || !agents.includes("font-variation-settings")) {
  fail("AGENTS.md must assign bundled font ownership to styles/type.css");
}
for (const role of typeMeasureRoles) {
  const token = `--t-${role}-mw`;
  if (!hasCssSignal(tokensCss, `${token}: 70ch`)) fail(`styles/tokens.css must default ${token} to 70ch`);
  if ((typeCss.match(new RegExp(`var\\(${token}\\)`, "g")) || []).length !== 1) {
    fail(`styles/type.css must consume ${token} exactly once`);
  }
}
const bodyTypeBlock = typeCss.match(/body,\s*p,\s*\.t-bd\s*\{([^}]*)\}/s)?.[1] || "";
if (!bodyTypeBlock || /max-width/.test(bodyTypeBlock) || /body\s*\{[^}]*max-width/s.test(typeCss)) {
  fail("styles/type.css must keep body unconstrained while text roles own max-width");
}
for (const [document, name] of [[readme, "README.md"], [agents, "AGENTS.md"], [skill, "local skill"]]) {
  if (!document.includes("70ch")) fail(`${name} does not document the shared type-measure default`);
  if (!document.includes("container")) fail(`${name} does not document the named query boundary`);
}
for (const id of [
  "system.platform-first", "system.semantic-first", "system.nesting", "system.physical-geometry",
  "system.token-role", "system.short-names", "system.skin-context", "system.grid-intent",
  "system.progressive", "system.admission"
]) {
  if (!readme.includes(id)) fail(`README.md is missing decision record ${id}`);
}
if (/\[(?:g|c|r|o)[$*^~]=/i.test(readme)) fail("README.md exposes private grid selector mechanics");
if (/https?:\/\/|\/Users\/|\/home\/|~\/|[A-Z]:\\/i.test(docs)) fail("repository doctrine contains an external URL or absolute path");
if (/\bcraft(?:-old)?\b/i.test(docs)) fail("repository doctrine references an external craft source");

for (const signal of [
  "section > .c { container: container / inline-size", "--l-gc: 3", "display: flex", "flex-direction: column",
  "@container container (width >= 30rem)", "@container container (width >= 60rem)",
  "grid-template-columns: repeat(var(--l-gc), minmax(0, 1fr))", '[g] > :is([c="0"], [c$="-0"])',
  '[g] > :is([c="0"], [c^="0-"])', '[g] > [o*="-a-"]', '[g] > [o^="a"]'
]) {
  if (!hasCssSignal(layoutCss, signal)) fail(`layout.css is missing grid invariant: ${signal}`);
}
if (/@media\s*\(\s*width\b/.test(layoutCss)) fail("layout.css must resolve grid states from container queries, not viewport media queries");
if (/(?:^|})\s*\.c\s*\{[^}]*\bcontainer\s*:/s.test(layoutCss)) {
  fail("layout.css must not apply inline-size containment to every .c; section > .c owns the query boundary");
}
if ((layoutCss.match(/--or: 0;/g) || []).length < 4) fail("grid order state is not reset at every responsive state");
if ((layoutCss.match(/--l-cs: 1;/g) || []).length < 2) fail("column-span state is not reset before large overrides");
if ((layoutCss.match(/--l-rs: 1;/g) || []).length < 2) fail("row-span state is not reset before large overrides");

if (!featuresCss.includes("&[data-scrub='reverse']>img")) {
  fail("features.css is missing reverse scrub movement");
}
for (const signal of [
  "--c-ac: var(--c-sw-blu)",
  "--c-ac-co: var(--c-sw-li)",
  "--c-ac-bg: color-mix(in srgb, var(--c-ac) 15%, var(--c-bg))",
  "--c-ac-fg: color-mix(in srgb, var(--c-ac) 25%, var(--c-fg))",
  "--c-ac-bc: color-mix(in srgb, var(--c-ac) 25%, transparent)"
]) {
  if (!tokensCss.includes(signal)) fail(`tokens.css is missing accent-routing invariant: ${signal}`);
}
if (!sameValues(accentRoutes(tokensCss), supportedAccentRoutes)) {
  fail(`styles/tokens.css explicit data-accent routes differ from the contract: ${accentRoutes(tokensCss).join(", ") || "none"}`);
}
for (const [document, name] of [[readme, "README.md"], [agents, "AGENTS.md"], [skill, "local skill"]]) {
  if (!document.includes(accentRouteGuidance)) fail(`${name} does not state the supported explicit data-accent routes`);
}
if (/data-accent\s*=\s*(["'])accent\1/.test(activeSources)) fail("retired data-accent=accent route remains");
for (const retired of ["--c-fb", "--c-ac-base", "--c-ac-co-base", ".fb {", "&.su", "&.wn", "&.dn"]) {
  if (activeSources.includes(retired)) fail(`retired feedback API remains: ${retired}`);
}
internalTokens.forEach((name) => {
  if (!readme.includes(name) || !agents.includes(name)) fail(`${name} is not classified as private in the contract`);
});
if (/data-theme/i.test(allCss)) fail("production CSS uses retired data-theme");
retiredTokens.forEach((name) => {
  if (activeSources.includes(name)) fail(`active source retains retired token ${name}`);
});

if (!existsSync(new URL("sans.ttf", root)) || !existsSync(new URL("mono.ttf", root))) {
  fail("bundled sans.ttf and mono.ttf must exist");
}
const fontFaces = [...typeCss.matchAll(/@font-face\s*\{[^}]*\}/g)].map((match) => match[0]);
for (const [family, file] of [["SNZ Sans", "sans.ttf"], ["SNZ Mono", "mono.ttf"]]) {
  const face = fontFaces.find((block) => block.includes(`font-family: "${family}"`));
  if (!face || !face.includes(`src: url("../${file}") format("truetype");`) || !/font-weight:\s*100 900;/.test(face)) {
    fail(`${family} must load ../${file} with a registered 100 900 font-weight range`);
  }
}
if (/font-variation-settings/i.test(typeCss)) fail("styles/type.css must not set font-variation-settings");

if (!process.exitCode) {
  console.log(`PASS: static contract — ${publicTokens.length} public tokens, ${internalTokens.length} private properties, ${files.length} production layers`);
}
