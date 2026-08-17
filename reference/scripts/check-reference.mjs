import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const systemRoot = new URL("../", root);
const dist = new URL("dist/", root);
const htmlPath = new URL("index.html", dist);

if (!existsSync(htmlPath)) throw new Error("Run the Astro build before checking the reference.");

const html = readFileSync(htmlPath, "utf8");
const referenceCss = readFileSync(new URL("src/styles/reference.css", root), "utf8");
const unique = (values) => [...new Set(values)];
const sameValues = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);
const accentRoutes = (value) => unique([...value.matchAll(/\bdata-accent\s*=\s*(["'])([^"']+)\1/g)].map((match) => match[2])).sort();
const requiredSections = [
  "overview", "colors", "typography", "sizes", "layout", "grid", "skins", "native", "forms",
  "features", "utilities", "architecture", "tokens",
];
const requiredMarkup = [
  't="h0"', 't="h1"', 't="h2"', 't="h3"', 't="h4"', 't="h5"', 't="h6"',
  't="lg"', 't="bd"', 't="sm"', 'class="sr focusable"',
  'g="8-4"', 'c="4-2"', 'c="0"', 'r="2-1"', 'o="f-a-l"',
  'g="a-sm"', 'g="a"', 'g="a-lg"', 'g="sg"',
  'data-skin=""', 'data-skin="tone"', 'data-skin="accent"', 'data-skin="invert"',
  'data-skin="accent" data-accent="secondary"', 'data-skin="accent" data-accent="tertiary"',
  'class="img-w" data-scrub', 'data-scrub="reverse"', 'id="grid-no-container"',
  'id="native-invalid" name="invalid" aria-invalid="true" aria-describedby="native-invalid-error"',
];
const internalProperties = [
  "--l-gc", "--l-cs", "--l-rs", "--or", "--m-src-to", "--m-src-fr", "--m-plx",
  "--t-st", "--t-fs-lo", "--t-fs-hi", "--t-fs-sl",
];
const requiredFixtures = [
  "grid-boundary-sm", "grid-boundary-default", "grid-boundary-lg", "grid-boundary-nested", "grid-boundary-nested-inner", "grid-no-container",
  "grid-sm", "grid-default", "grid-lg", "grid-nested-outer", "grid-nested-inner", "grid-no-container-grid",
  "visual-order-focus", "visual-order-first", "visual-order-second", "visual-order-third",
  "type-long-content", "type-semantic-heading", "type-visual-override", "type-large-text", "type-body-text", "type-small-text", "type-inheritance", "type-inherited-item",
  "skin-accent-primary", "skin-accent-secondary", "skin-accent-tertiary", "skin-accent-success", "skin-accent-warning", "skin-accent-danger", "skin-nested-outer", "skin-nested-inner",
  "native-details", "native-focus", "native-hidden", "native-dialog-trigger", "native-dialog",
  "progressive-disclosure", "progressive-corner", "reduced-motion", "progressive-scroll-default", "progressive-scroll-reverse",
];

let previousSection = -1;
for (const id of requiredSections) {
  const match = new RegExp(`<section[^>]+id=["']${id}["'][^>]*>`, "i").exec(html);
  if (!match) throw new Error(`Built reference is missing section #${id}.`);
  if (match.index <= previousSection) throw new Error(`Built reference section order is invalid at #${id}.`);
  previousSection = match.index;
}

if (/<footer(?:\s|>)/i.test(html)) throw new Error("Built reference contains an unowned footer.");

if ((html.match(/<h1(?:\s|>)/gi) || []).length !== 1) {
  throw new Error("Built reference must contain exactly one h1.");
}
if (/https?:\/\//i.test(html)) throw new Error("Built reference contains a remote runtime dependency.");
if (html.includes("--h-*")) throw new Error("Built reference exposes the retired header token namespace.");
if (/role=["']presentation["']/i.test(html)) throw new Error("Built reference suppresses semantic presentation.");
for (const signal of requiredMarkup) {
  if (!html.includes(signal)) throw new Error(`Built reference is missing specimen markup: ${signal}.`);
}
for (const fixture of requiredFixtures) {
  if (!html.includes(`data-fixture="${fixture}"`)) throw new Error(`Built reference is missing fixture: ${fixture}.`);
}
let previousFixture = -1;
for (const fixture of ["visual-order-first", "visual-order-second", "visual-order-third"]) {
  const position = html.indexOf(`data-fixture="${fixture}"`);
  if (position <= previousFixture) throw new Error(`Built reference visual-order fixture source order is invalid at ${fixture}.`);
  previousFixture = position;
}
for (const property of internalProperties) {
  if (html.includes(property)) throw new Error(`Built reference markup exposes private property ${property}.`);
}

const tokensCss = readFileSync(new URL("styles/layers/tokens.css", systemRoot), "utf8");
const publicTokens = [...new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]))];
if (!sameValues(accentRoutes(html), accentRoutes(tokensCss))) {
  throw new Error(`Built reference data-accent routes differ from styles/layers/tokens.css: ${accentRoutes(html).join(", ") || "none"}`);
}
for (const route of accentRoutes(tokensCss)) {
  if (!html.includes(`<code>${route}</code>`)) throw new Error(`Built reference guidance omits data-accent route ${route}.`);
}
if (!html.includes("omit <code>data-accent</code> for the default accent")) {
  throw new Error("Built reference does not explain the default accent route.");
}
if (/\b\d+ public (?:names|tokens)\b/i.test(html)) throw new Error("Built reference hard-codes a public-token count.");
for (const token of publicTokens) {
  if (!html.includes(token)) throw new Error(`Built reference is missing public token ${token}.`);
}

if (html.includes("<astro-island")) throw new Error("Reference unexpectedly contains a hydrated Astro island.");

const assetPaths = [...html.matchAll(/(?:href|src)="(\/_astro\/[^"?#]+)[^"#]*"/g)].map((match) => match[1]);
for (const assetPath of assetPaths) {
  if (!existsSync(join(new URL(".", dist).pathname, assetPath))) {
    throw new Error(`Built reference asset does not exist: ${assetPath}`);
  }
}

const assetDir = new URL("_astro/", dist);
const css = existsSync(assetDir)
  ? readdirSync(assetDir)
      .filter((name) => name.endsWith(".css"))
      .map((name) => readFileSync(new URL(name, assetDir), "utf8"))
      .join("\n")
  : "";

for (const signal of [
  "--c-bg-base", ".sg-swatch", "section[data-scrub]:has(.sg-heading-wrap)",
  "animation-range:entry 100% exit 50%", "width:calc(100% * var(--m-src-to))",
]) {
  if (!css.includes(signal)) throw new Error(`Built CSS is missing ${signal}.`);
}
for (const property of internalProperties) {
  const uses = referenceCss.match(new RegExp(`var\\(${property}\\)`, "g"))?.length ?? 0;
  const allowed = property === "--m-src-to" ? 1 : 0;
  if (uses !== allowed) throw new Error(`Reference CSS consumes private property ${property} ${uses} times; expected ${allowed}.`);
}

let previousLayer = -1;
for (const layer of ["base", "tokens", "type", "layout", "features", "utility", "project"]) {
  const position = css.indexOf(`@layer ${layer}{`);
  if (position <= previousLayer) throw new Error(`Built CSS layer order is invalid at ${layer}.`);
  previousLayer = position;
}

console.log(`PASS: static Astro reference — ${requiredSections.length} sections, ${requiredFixtures.length} fixtures, ${publicTokens.length} public tokens, ${assetPaths.length} emitted asset references, no hydrated islands; rendered behavior remains unverified`);
