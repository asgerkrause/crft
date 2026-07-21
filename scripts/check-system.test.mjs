import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
const fixtureFiles = [
  "AGENTS.md",
  "README.md",
  "global.css",
  "sans.ttf",
  "mono.ttf",
  ".agents/skills/snz-css-system/SKILL.md",
  "scripts/check-system.mjs",
  "scripts/copy-system.mjs",
  "styles/base.css",
  "styles/tokens.css",
  "styles/type.css",
  "styles/layout.css",
  "styles/features.css",
  "styles/utility.css",
  "styles/project.css",
];

function makeFixture(t) {
  const root = mkdtempSync(join(tmpdir(), "seess-check-system-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  for (const relativePath of fixtureFiles) {
    const target = join(root, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(join(sourceRoot, relativePath), target);
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

test("current repository contract passes", (t) => {
  const result = runCheck(makeFixture(t));
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /PASS: static contract — \d+ public tokens/);
});

test("a CSS token missing from the README catalog fails", (t) => {
  const root = makeFixture(t);
  replace(root, "README.md", "| `--h-h` | Header sizing token |\n", "");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--h-h is missing from README\.md public-token catalog/);
});

test("a stale README catalog token fails", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "README.md",
    "| `--h-h` | Header sizing token |\n",
    "| `--h-h` | Header sizing token |\n| `--fixture-stale` | Fixture-only stale token |\n",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--fixture-stale is cataloged in README\.md but not declared in styles\/tokens\.css/);
});

test("a fully cataloged new token needs no hard-coded count update", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "styles/tokens.css",
    "    /* Header */\n",
    "    /* Header */\n    --fixture-token: 0;\n",
  );
  replace(
    root,
    "README.md",
    "| `--h-h` | Header sizing token |\n",
    "| `--h-h` | Header sizing token |\n| `--fixture-token` | Fixture-only token |\n",
  );
  const expectedCount = new Set(
    [...readFileSync(join(root, "styles/tokens.css"), "utf8").matchAll(/(--[a-z0-9-]+)\s*:/g)]
      .map((match) => match[1]),
  ).size;
  const result = runCheck(root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, new RegExp(`PASS: static contract — ${expectedCount} public tokens`));
});

test("data-accent selector checks accept either quote style", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "[data-accent='danger']", '[data-accent="danger"]');
  const result = runCheck(root);
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test("an unsupported data-accent route fails the contract", (t) => {
  const root = makeFixture(t);
  replace(root, "styles/tokens.css", "[data-accent='danger']", "[data-accent='accent']");
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /explicit data-accent routes differ from the contract/);
});

test("data-accent documentation must retain the canonical routes", (t) => {
  const root = makeFixture(t);
  replace(
    root,
    "AGENTS.md",
    "and `danger`; omit `data-accent` for the default accent.",
    "and `accent`; omit `data-accent` for the default accent.",
  );
  const result = runCheck(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /AGENTS\.md does not state the supported explicit data-accent routes/);
});
