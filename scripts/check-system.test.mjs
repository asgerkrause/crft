import assert from "node:assert/strict";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
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
  "reference/fixtures/public-contract.json",
  "reference/package.json",
  "reference/src/components/Header.astro",
  "reference/src/layouts/Shell.astro",
  "reference/src/scripts/shell.js",
  "scripts/check-system.mjs",
  "scripts/check-markup.mjs",
  "scripts/copy-system.mjs",
  "scripts/emit-contract.mjs",
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
  writeFileSync(path, source.replaceAll(before, after));
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

test("the committed public contract must match emitted output", (t) => {
  const root = makeFixture(t);
  replace(root, "reference/fixtures/public-contract.json", '    "--accent-border",\n', "");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /public-contract\.json drifts from scripts\/emit-contract\.mjs output/);
});

test("the committed public contract must record a clean checkout", (t) => {
  const root = makeFixture(t);
  replace(root, "reference/fixtures/public-contract.json", '"dirty": false', '"dirty": true');
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /public-contract\.json must record dirty false/);
});

test("the committed public contract is identified by digest, not revision", (t) => {
  const root = makeFixture(t);
  replace(root, "reference/fixtures/public-contract.json", '"dirty": false,', '"dirty": false,\n  "revision": "0000000000000000000000000000000000000000",');
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /public-contract\.json must not record a revision/);
});

test("the contract digest is sha256 of the canonical name fields", () => {
  const fixture = JSON.parse(readFileSync(join(sourceRoot, "reference/fixtures/public-contract.json"), "utf8"));
  const { contractVersion, publicTokens, privateProperties } = fixture;
  const canonical = JSON.stringify({ contractVersion, publicTokens, privateProperties });
  assert.equal(fixture.digest, `sha256:${createHash("sha256").update(canonical).digest("hex")}`);
});

test("a non-object public contract fails clearly", (t) => {
  const root = makeFixture(t);
  writeFileSync(join(root, "reference/fixtures/public-contract.json"), "null\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /public-contract\.json must contain a contract object/);
});

test("a missing public contract fails clearly", (t) => {
  const root = makeFixture(t);
  rmSync(join(root, "reference/fixtures/public-contract.json"));
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /public-contract\.json is missing or invalid JSON/);
});

test("explicit wght is rejected even after another axis", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "@layer type {", '@layer type {\n  .x { font-variation-settings: "opsz" 14, "wght" 700; }\n');
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /explicit wght overrides ordinary font-weight/);
});

test("corner shape stays opt-in through .squircle", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "@layer base {\n", "@layer base {\n  * { corner-shape: squircle; }\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /base must not set corner-shape; corners stay opt-in through \.squircle/);
});

test("the opt-in .squircle utility must exist", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "  .squircle { corner-shape: squircle; }\n", "");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /utility\.css is missing documented hook \.squircle/);
});

test("a new public token requires a documented job", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "    /* Layout */\n", "    /* Layout */\n    --fixture-token: 0;\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing public tokens: --fixture-token/);
});

test("a removed public token cannot remain documented", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "    --header: 4rem;\n", "");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /stale public tokens: --header/);
});

test("a public token value change needs no duplicate documentation value", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "    --header: 4rem;", "    --header: 5rem;");
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

test("retired holistic authority claims are rejected", (t) => {
  for (const claim of [
    "CRFT is the system.",
    "CRFT is design authority.",
    "CRFT provides product strategy.",
    "CRFT governs design judgment.",
    "This guide owns product intent.",
    "CRFT owns product strategy, not just CSS.",
  ]) {
    const root = makeFixture(t);
    replace(root, "README.md", "# CRFT\n", `# CRFT\n\n${claim}\n`);
    const result = runCheck(root);
    assert.equal(result.status, 1, claim);
    assert.match(result.stderr, /retired CRFT strategy claim/, claim);
  }
});

test("explicit authority denials remain allowed", (t) => {
  for (const claim of [
    "CRFT provides no product strategy.",
    "CRFT supplies CSS without design judgment.",
  ]) {
    const root = makeFixture(t);
    replace(root, "README.md", "# CRFT\n", `# CRFT\n\n${claim}\n`);
    const result = runCheck(root);
    assert.equal(result.status, 0, claim);
  }
});

test("mandatory copier and fluid-type claims are rejected", (t) => {
  for (const claim of ["The copier is required.", "Fluid type is mandatory."]) {
    const root = makeFixture(t);
    replace(root, "README.md", "# CRFT\n", `# CRFT\n\n${claim}\n`);
    const result = runCheck(root);
    assert.equal(result.status, 1, claim);
    assert.match(result.stderr, /retired CRFT strategy claim/, claim);
  }
});

test("adoption modes remain explicit", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/adopt.md", "| Local extraction |", "| Project subset |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /adoption modes differ from the canonical four-mode contract/);
});

test("local extraction grants no CRFT hooks", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "craft/adopt.md",
    "| Local extraction | Only useful declarations, tokens, or relationships moved into an existing project stylesheet | None |",
    "| Local extraction | Only useful declarations, tokens, or relationships moved into an existing project stylesheet | Complete API |",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Local extraction must expose no CRFT hooks/);
});

test("selected layers expose retained live hooks only", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/adopt.md", "Only retained live hooks from tokens.css", "Every documented hook");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /tokens-only adoption must expose retained live hooks only/);
});

test("fluid type remains optional for projects", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/type.md", "Fluid type is a reference strategy, not a project requirement", "Fluid type is required");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /craft\/type\.md must keep fluid type optional for projects/);
});

test("direct CRFT guidance rejects product authority", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "skills/crft/SKILL.md",
    "It does not supply product strategy, design judgment, taste, or product accessibility acceptance.",
    "It supplies product strategy, design judgment, taste, and product accessibility acceptance.",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /retired CRFT strategy claim/);
});

test("the public token index rejects duplicate names", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/tokens.md", "| `--header` |", "| `--header`, `--header` |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /documents a public token more than once/);
});

test("the public token index rejects copied live values", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/tokens.md", "| `--control` | Native control height for buttons, inputs, selects, and textareas |", "| `--control` | Native control height set to `2.75rem` |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicates a live value or formula/);
});

test("every indexed public token requires a non-empty job", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/tokens.md", "| `--control` | Native control height for buttons, inputs, selects, and textareas |", "| `--control` | |");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /has an empty job for: --control/);
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
  replace(root, "README.md", "  <div class=\"c\">", "  <div class=\"c\" aria-label=\"Content\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("names a generic div wrapper"), result.stderr);
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
    "styles/crft.css",
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
  replace(root, "styles/crft.css", "  .display {", "  .fixture {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("missing documented role display"), result.stderr);
});

test("fluid type calculation remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "--_fluid: clamp(", "--_fluid: min(");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("missing fluid font-size clamping"), result.stderr);
});

test("native first-paint remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", ":where(a, button, label) {", ":where(a, button) {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /base layer is missing native enhancement: :where\(a, button, label\) \{/);
});

test("reset must not consume tokens", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "styles/crft.css",
    "    box-sizing: border-box;",
    "    box-sizing: border-box;\n    color: var(--text);",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /reset must not consume custom properties/);
});

test("reset token use with space inside var() is caught", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "styles/crft.css",
    "    box-sizing: border-box;",
    "    box-sizing: border-box;\n    color: var( --text);",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /reset must not consume custom properties/);
});

test("duplicate layer blocks in one file fail", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "@layer reset {", "@layer reset {\n}\n@layer reset {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicate @layer reset block in crft\.css/);
});

test("generic containers cannot establish the query boundary", (t) => {
  for (const selector of [".c", "[c]"]) {
    const root = makeFixture(t);
    replace(root, "styles/crft.css", "@layer layout {", `@layer layout {\n  ${selector} { container: container / inline-size; }`);
    const result = runCheck(root);
    assert.equal(result.status, 1, selector);
    assert.ok(result.stderr.includes("only section > .c may establish the query boundary"), result.stderr);
  }
});

test("documented layout hooks remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "&.sm {", "&.narrow {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("missing documented hook .c.sm"), result.stderr);
});

test("derived container ratios remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "max-width: calc(var(--content-max) / 3 * 2)", "max-width: calc(var(--content-max) * .75)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /layout\.css is missing viewport-derived container behavior/);
});

test("documented grid modes remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "[g=\"fill-sm\"]", "[g=\"fixture\"]");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("missing documented grid hook fill-sm"), result.stderr);
});

test("every documented numeric grid position remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "[g]>[r$=\"4\"]", "[g]>[r$=\"5\"]");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("missing row-span grid rule"), result.stderr);
});

test("the finite utility surface remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "  .sr {\n", "  .visually-hidden {\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /utility\.css selectors differ/);
});

test("documented color boundaries remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", ":root,\n  [data-theme],\n  [data-skin] {", ":root,\n  [data-theme],\n  [data-context] {");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("missing a documented skin or accent boundary"), result.stderr);
});

test("documented motion hooks remain source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", ".img-w[data-scrub]", ".media[data-scrub]");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /motion\.css is missing documented motion hook/);
});

test("the generic scrub progress rule remains source-backed", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "      [data-scrub] {\n", "      [data-progress] {\n");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing the generic scrub progress rule/);
});

test("image scrub remains inside its feature gate", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "@supports (animation-timeline: view())", "@supports (display: grid)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /scrub must remain inside feature and reduced-motion gates/);
});

test("image scrub remains inside its reduced-motion gate", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "@media (prefers-reduced-motion: no-preference)", "@media (prefers-reduced-motion: reduce)");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /scrub must remain inside feature and reduced-motion gates/);
});

test("an unsupported type role fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "class=\"small\"", "class=\"unsupported\"");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("uses unlisted example class"), result.stderr);
});

test("legacy stack flags fail", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "class=\"s\"", "s=\"h\"");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("retired s attribute"), result.stderr);
});

test("three-position numeric grids fail", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "g=\"3-2\"", "g=\"3-2-1\"");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("invalid g value"), result.stderr);
});

test("named container-query tokens must match grid literals", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "--query-md: 30rem;", "--query-md: 32rem;");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /grid\.css is missing invariant/);
});

test("an unsupported accent route fails", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "[data-accent='danger']", "[data-accent='accent']");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /explicit data-accent routes differ/);
});

test("removed color-specific skin routes fail", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "  [data-skin='tone'] {", "  [data-skin='secondary'] {\n    --canvas: var(--canvas-base);\n  }\n\n  [data-skin='tone'] {");
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
  assert.match(result.stderr, /uses unlisted example class/);
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

test("the router records the retired tooling boundary", (t) => {
  const root = makeFixture(t);
  replace(root, "CRAFT.md", "consumer analyzer", "consumer inspector");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /does not record the retired tooling boundary/);
});

test("adoption keeps the breaking migration record", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/adopt.md", "contractVersion 2", "contractVersion future");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("missing breaking migration guidance"), result.stderr);
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

test("the skill starts with inspect and plan", (t) => {
  const root = makeFixture(t);
  replace(root, "skills/crft/SKILL.md", "## Start", "## Begin");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing the inspect-and-plan start/);
});

test("the layout owner keeps property-form doctrine", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/layout.md", "*-block-start", "*-block-begin");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /craft\/layout\.md is missing \*-block-start/);
});

test("the HTML owner names the reset and base layers", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/html.md", "@layer reset", "@layer strip");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /craft\/html\.md Native base guarantees is missing @layer reset/);
});

test("adoption documents overlay copy", (t) => {
  const root = makeFixture(t);
  replace(root, "craft/adopt.md", "Do not default to the full tree on an existing site", "Always copy every layer");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /missing breaking migration guidance: Do not default to the full tree on an existing site/);
});

test("canonical axes must not override ordinary font-weight", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "font-variation-settings: var(--body-axes);", "font-variation-settings: \"wght\" 400;");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("explicit wght overrides ordinary font-weight"), result.stderr);
});

test("native transitions preserve ordinary weight interpolation", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "transition-property: color, background, border, transform, opacity, font-weight;", "transition-property: color, background, border, transform, opacity;");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("base layer is missing native enhancement: transition-property"), result.stderr);
});

test("crft.css must not register brand faces", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/crft.css", "@layer type {", "@layer type {\n  @font-face { font-family: \"sans\"; }\n");
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

test("legacy type flags fail", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "<h1>", "<h1 t=\"bo\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("retired t attribute"), result.stderr);
});

test("legacy family flags fail", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "<code>", "<code f=\"mo\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("retired f attribute"), result.stderr);
});

test("retired w attribute fails", (t) => {
  const root = makeFixture(t);
  replace(root, "examples/foundations/markup.html", "<h1>", "<h1 w=\"bd\">");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("retired w attribute"), result.stderr);
});

test("fluid text steps cannot exceed the 2x zoom budget", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "    --type-max: 1.25;", "    --type-max: 2;");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("fluid text step 1 exceeds the 2x zoom budget"), result.stderr);
});

test("fluid type steps cannot lose zoom growth", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "    --fluid-min: 25;", "    --fluid-min: 87.5;");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("loses zoom growth"), result.stderr);
});

test("the router ban index must stay present", (t) => {
  const root = makeFixture(t);
  const path = join(root, "CRAFT.md");
  writeFileSync(path, readFileSync(path, "utf8").replace(/<!-- ban-index:start -->[\s\S]*?<!-- ban-index:end -->\n?/, ""));
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /CRAFT.md is missing the ban index/);
});

test("retired public token families fail", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "    --control: 2.75rem;", "    --control: 2.75rem;\n    --c-sm: red;");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.ok(result.stderr.includes("uses a retired token family"), result.stderr);
});
