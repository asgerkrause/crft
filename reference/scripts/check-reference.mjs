import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const systemRoot = new URL("../", root);
const dist = new URL("dist/", root);
const htmlPath = new URL("index.html", dist);

if (!existsSync(htmlPath)) throw new Error("Run the Astro build before checking the reference.");

const html = readFileSync(htmlPath, "utf8");
const referenceCss = readFileSync(new URL("src/styles/reference.css", root), "utf8");
const requiredSections = [
  "overview", "colors", "typography", "sizes", "layout", "grid", "skins", "native", "forms",
  "features", "utilities", "architecture", "tokens",
];
const requiredMarkup = [
  'class="hd"', 'class="h1"', 'class="h2"', 'class="h3"', 'class="h4"', 'class="h5"', 'class="h6"',
  'class="t-lg"', 'class="t-bd"', 'class="t-sm"', 'class="sr focusable"',
  'g="8-4"', 'c="4-2"', 'c="0"', 'r="2-1"', 'o="f-a-l"',
  'g="a-sm"', 'g="a"', 'g="a-lg"', 'g="sg"',
  'data-skin=""', 'data-skin="tone"', 'data-skin="accent"', 'data-skin="secondary"',
  'data-skin="tertiary"', 'data-skin="invert"',
  'data-accent="secondary"', 'data-accent="tertiary"', 'data-accent="success"',
  'data-accent="warning"', 'data-accent="danger"',
  'class="img-w" data-scrub', 'data-scrub="reverse"',
  'id="native-invalid" aria-invalid="true" aria-describedby="native-invalid-error"',
];
const internalProperties = ["--l-gc", "--l-cs", "--l-rs", "--or", "--m-src-to", "--m-src-fr", "--m-plx"];

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
if (/role=["']presentation["']/i.test(html)) throw new Error("Built reference suppresses semantic presentation.");
for (const signal of requiredMarkup) {
  if (!html.includes(signal)) throw new Error(`Built reference is missing specimen markup: ${signal}.`);
}
for (const property of internalProperties) {
  if (html.includes(property)) throw new Error(`Built reference markup exposes private property ${property}.`);
}

const tokensCss = readFileSync(new URL("styles/tokens.css", systemRoot), "utf8");
const publicTokens = [...new Set([...tokensCss.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]))];
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

console.log(`PASS: Astro reference — ${requiredSections.length} sections, ${publicTokens.length} public tokens, ${assetPaths.length} emitted asset references, no hydrated islands`);
