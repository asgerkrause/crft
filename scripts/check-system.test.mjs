import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
const fixturePaths = [
  "README.md",
  "AGENTS.md",
  "CRAFT.md",
  "craft",
  "examples",
  "skills",
  "reference/package.json",
  "reference/src/components/Header.astro",
  "reference/src/layouts/Shell.astro",
  "reference/src/scripts/shell.js",
  "scripts/check-system.mjs",
  "scripts/copy-system.mjs",
  "styles",
];

function makeFixture(t) {
  const root = mkdtempSync(join(tmpdir(), "crft-check-system-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  for (const relativePath of fixturePaths) {
    const source = join(sourceRoot, relativePath);
    const target = join(root, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(source, target, { recursive: true });
  }
  return root;
}

function replace(root, relativePath, before, after) {
  const path = join(root, relativePath);
  const source = readFileSync(path, "utf8");
  assert.ok(source.includes(before), `${relativePath} fixture signal is missing`);
  writeFileSync(path, source.replace(before, after));
}

function runCheck(root) {
  return spawnSync(process.execPath, [join(root, "scripts/check-system.mjs")], {
    cwd: root,
    encoding: "utf8",
  });
}

test("current repository contract passes", () => {
  const result = runCheck(sourceRoot);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /PASS: CRFT contract — \d+ public tokens/);
});

test("a new public token requires a documented job", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/tokens.css", "    /* Layout */\n", "    /* Layout */\n    --fixture-token: 0;\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing public tokens: --fixture-token/);
});

test("a removed public token cannot remain documented", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/tokens.css", "    --l-hh: 4rem;\n", "");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /stale public tokens: --l-hh/);
});

test("a public token value change needs no duplicate documentation value", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/tokens.css", "    --l-hh: 4rem;", "    --l-hh: 5rem;");
  const result = runCheck(root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("the token owner routes live authority to CSS", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/tokens.md", "sole catalog and authority", "secondary reference");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must route live token values and formulas/);
});

test("the public token index rejects duplicate names", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/tokens.md", "| `--l-hh` |", "| `--l-hh`, `--l-hh` |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /documents a public token more than once/);
});

test("the public token index rejects copied live values", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/tokens.md", "| `--l-hh` | Shared header-height role for project composition |", "| `--l-hh` | Shared header-height role set to `4rem` |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicates a live value or formula/);
});

test("every indexed public token requires a non-empty job", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/tokens.md", "| `--l-hh` | Shared header-height role for project composition |", "| `--l-hh` | |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /has an empty job for: --l-hh/);
});

test("the HTML owner states the purpose-based identifier contract", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/html.md", "A section needs no ID by default.", "Every section needs identity.");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing identifier doctrine/);
});

test("canonical examples reject names on generic wrappers", (t) => {
  const root = makeFixture(t);
  replace(root, "README.md", "  <div c>", "  <div c aria-label=\"Content\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /names a generic div wrapper/);
});

test("canonical examples reject dangling ARIA id references", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/forms.md", "invite-email-help invite-email-error", "invite-email-help missing-error");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /references missing id missing-error/);
});

test("the canonical topic map rejects extra files", (t) => {
  const root = makeFixture(t);
  writeFileSync(join(root, "craft/extra.md"), "# Extra\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /differs from the 16-topic documentation map/);
});

test("CRAFT routes every topic", (t) => {
  const root = makeFixture(t);
  replace(root, "CRAFT.md", "](craft/brief.md)", "](craft/missing.md)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /does not route to craft\/brief\.md/);
});

test("topic owners require canonical frontmatter", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/brief.md", "read_when:", "usage:");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing canonical topic frontmatter/);
});

test("documented color routes must match source", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/color.md", "| `danger` | Danger feedback |", "| `critical` | Danger feedback |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /accent routes differ from source/);
});

test("a project component selector in canonical CSS fails", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "styles/layers/base.css",
    ":where(dialog) {",
    ":where(.btn, dialog) {",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /styles a project component naming convention/);
});

test("project examples may style project component conventions", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/example.css", "@layer project {\n", "@layer project {\n.btn { display: inline-flex; }\n");
  const result = runCheck(root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("documented type roles remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/type.css", "  [t~=\"h0\"] {\n", "  [t~=\"display\"] {\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /type\.css is missing documented t value h0/);
});

test("fluid type calculation remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/type.css", "    font-size: clamp(", "    font-size: min(");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /type\.css is missing fluid font-size clamping/);
});

test("native first-paint remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/base.css", ":where(a, button, label) {", ":where(a, button) {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /base\.css is missing native enhancement: :where\(a, button, label\) \{/);
});

test("documented layout hooks remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/layout.css", "    &[c~=\"sm\"] {\n", "    &[c~=\"narrow\"] {\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /layout\.css is missing documented hook c="sm"/);
});

test("derived container ratios remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/layout.css", "max-width: calc(var(--l-cw) / 3 * 2)", "max-width: calc(var(--l-cw) * .75)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /layout\.css is missing viewport-derived container behavior/);
});

test("documented grid modes remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/grid.css", "&[g=\"a-sm\"]", "&[g=\"fixture\"]");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /grid\.css is missing documented grid hook a-sm/);
});

test("every documented numeric grid position remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/grid.css", "[g]>[y$=\"4\"]", "[g]>[y$=\"5\"]");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing row-span grid rule/);
});

test("the finite utility surface remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/utility.css", "  .sr {\n", "  .visually-hidden {\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /utility\.css selectors differ/);
});

test("documented color boundaries remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/tokens.css", ":root,\n  [data-skin] {", ":root,\n  [data-context] {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing a documented skin or accent boundary/);
});

test("documented motion hooks remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/motion.css", ".img-w[data-scrub]", ".media[data-scrub]");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /motion\.css is missing documented motion hook/);
});

test("the generic scrub progress rule remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/motion.css", "      [data-scrub] {\n", "      [data-progress] {\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing the generic scrub progress rule/);
});

test("image scrub remains inside its feature gate", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/motion.css", "@supports (animation-timeline: view())", "@supports (display: grid)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /scrub must remain inside feature and reduced-motion gates/);
});

test("image scrub remains inside its reduced-motion gate", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/motion.css", "@media (prefers-reduced-motion: no-preference)", "@media (prefers-reduced-motion: reduce)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /scrub must remain inside feature and reduced-motion gates/);
});

test("an unsupported type role fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", 't="sm mu"', 't="xs"');
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /uses unsupported t token xs/);
});

test("an unsupported s flag fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", 's="h sb ct"', 's="h tight"');
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /uses invalid s flag tight/);
});

test("more than one s gap fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", 's="h sb ct"', 's="h sm lg"');
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /uses more than one s gap/);
});

test("named container-query tokens must match grid literals", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/tokens.css", "--l-cq-md: 30rem;", "--l-cq-md: 32rem;");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /grid\.css is missing invariant/);
});

test("an unsupported accent route fails", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/tokens.css", "[data-accent='danger']", "[data-accent='accent']");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /explicit data-accent routes differ/);
});

test("removed color-specific skin routes fail", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/tokens.css", "  [data-skin='tone'] {", "  [data-skin='secondary'] {\n    --c-bg: var(--c-bg-base);\n  }\n\n  [data-skin='tone'] {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /explicit data-skin routes differ/);
});

test("confirmed example styles must declare their chosen project layer", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/example.css", "@layer project {\n", "");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must declare its chosen project layer/);
});

test("example markup rejects duplicate ids", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "id=\"proof\"", "id=\"orientation\"");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /repeats id orientation/);
});

test("example markup rejects dangling fragments", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "href=\"#proof\"", "href=\"#missing\"");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /references missing id missing/);
});

test("retired one-off example hooks fail", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "    <header>\n", "    <header class=\"site-header\">\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /retains unnecessary example hook \.site-header/);
});

test("every example README keeps a layout intent diagram", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/README.md", "## Layout intent", "## Composition note");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing its ASCII layout intent/);
});

test("project stagger remains inside feature and reduced-motion gates", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/branded-extension/example.css", "@media (prefers-reduced-motion: no-preference)", "@media (prefers-reduced-motion: reduce)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /stagger must keep sibling-index/);
});

test("page-from-reference keeps a deliberate image crop", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/page-from-reference/example.css", "aspect-ratio: 3 / 2", "aspect-ratio: 8 / 5");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing deliberate crop behavior/);
});

test("the router records the retired tooling boundary", (t) => {
  const root = makeFixture(t);
  replace(root, "CRAFT.md", "consumer analyzer", "consumer inspector");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /does not record the retired tooling boundary/);
});

test("adoption keeps the breaking migration record", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/adopt.md", "t=\"h0\"", "t=\"display\"");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing breaking migration guidance/);
});

test("retired doctrine references fail", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/brief.md", "# Brief", "# Brief\n\nSee seess for values.");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /references a retired frontend source/);
});

test("retired topic references fail in examples", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/README.md", "# Foundations", "# Foundations\n\nSee craft/css.md.");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /references a retired topic owner/);
});

test("the skill must stay a thin router", (t) => {
  const root = makeFixture(t);
  const path = join(root, "skills/crft/SKILL.md");
  writeFileSync(path, `${readFileSync(path, "utf8")}\n${"detail ".repeat(1000)}`);
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /no longer a thin router/);
});

test("adoption documents overlay copy", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/adopt.md", "Do not default to the full tree on an existing site", "Always copy every layer");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing breaking migration guidance: Do not default to the full tree on an existing site/);
});

test("type.css font-weight must pair the wght axis", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "styles/layers/type.css",
    "    font-weight: var(--t-bd-fw);\n    font-variation-settings: \"wght\" var(--t-bd-fw);",
    "    font-weight: var(--t-bd-fw);",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must pair font-variation-settings "wght"/);
});

test("link transitions must include font-variation-settings", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "styles/layers/base.css",
    "transition-property: color, background, border, transform, opacity, font-variation-settings;",
    "transition-property: color, background, border, transform, opacity;",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing native enhancement: transition-property: color, background, border, transform, opacity, font-variation-settings/);
});

test("type.css must not keep @font-face after the fonts extract", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/layers/type.css", "@layer type {", "@layer type {\n  @font-face { font-family: \"SNZ Sans\"; }\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /must not register faces/);
});

test("example markup rejects class on section", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "<section id=\"orientation\">", "<section id=\"orientation\" class=\"page-block\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /puts a class on a section/);
});

test("an unsupported t weight flag fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "<h1 t=\"bo\">", "<h1 t=\"bold\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /uses unsupported t token bold/);
});

test("an unsupported t family flag fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "<code t=\"mo\">", "<code t=\"comic\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /uses unsupported t token comic/);
});

test("retired w attribute fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "<h1 t=\"bo\">", "<h1 w=\"bd\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /uses retired w attribute/);
});
