import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./check-project.mjs", import.meta.url));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "crft-check-project-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  return root;
}

function write(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

function fakeLayers(root, extra = {}) {
  write(
    join(root, "layers/tokens.css"),
    `@layer tokens {\n  :root {\n    --c-fg: #111;\n    --c-bg: #eee;\n  }\n}\n`,
  );
  write(
    join(root, "layers/crft-manifest.json"),
    `${JSON.stringify({
      source: "crft",
      revision: null,
      dirty: false,
      copiedAt: new Date().toISOString(),
      layers: extra.layers ?? ["tokens"],
      fonts: false,
      files: {},
      contract: {
        publicTokens: ["--c-bg", "--c-fg"],
        privateProperties: ["--l-gc", "--t-st"],
        skins: ["invert"],
        accents: ["danger"],
        layerDependencies: {
          tokens: [],
          type: ["tokens"],
          layout: ["tokens"],
          grid: ["tokens", "layout"],
          base: ["tokens"],
          motion: ["tokens", "layout"],
          utility: [],
        },
      },
    }, null, 2)}\n`,
  );
  if (extra.grid) write(join(root, "layers/grid.css"), "@layer grid { [g] { --l-gc: 3; } }\n");
  if (extra.layout) write(join(root, "layers/layout.css"), "@layer layout { [c] {} }\n");
}

function run(target) {
  return spawnSync(process.execPath, [script, target], { encoding: "utf8" });
}

test("clean project passes", (t) => {
  const root = fixture(t);
  fakeLayers(root);
  write(join(root, "project.css"), "h1 { color: var(--c-fg); }\n");
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS: 1 files, 2 tokens verified/);
});

test("private property fails", (t) => {
  const root = fixture(t);
  fakeLayers(root);
  write(join(root, "project.css"), "h1 { width: var(--l-gc); }\n");
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /FAIL:.*private/);
});

test("padding-block-start fails", (t) => {
  const root = fixture(t);
  fakeLayers(root);
  write(join(root, "project.css"), "h1 { padding-block-start: 1rem; }\n");
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /padding-block-start/);
});

test("unknown --c-whatever var fails", (t) => {
  const root = fixture(t);
  fakeLayers(root);
  write(join(root, "project.css"), "h1 { color: var(--c-whatever); }\n");
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /--c-whatever/);
});

test("project-declared --c-whatever passes", (t) => {
  const root = fixture(t);
  fakeLayers(root);
  write(join(root, "project.css"), ":root { --c-whatever: #f00; }\nh1 { color: var(--c-whatever); }\n");
  const result = run(root);
  assert.equal(result.status, 0, result.stderr);
});

test("grid without layout fails", (t) => {
  const root = fixture(t);
  fakeLayers(root, { layers: ["tokens", "grid"], grid: true });
  write(join(root, "project.css"), "h1 { color: var(--c-fg); }\n");
  const result = run(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /grid\.css requires layout/);
});

test("a custom property name inside a CSS string does not declare a local property", (t) => {
  const root = fixture(t);
  fakeLayers(root);
  write(join(root, "project.css"), '.x { content: "--c-ghost: red"; }\np { color: var(--c-ghost); }\n');
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unknown CRFT token --c-ghost/);
});

test("project CSS cannot set wght in font-variation-settings, even among other axes", (t) => {
  const root = fixture(t);
  fakeLayers(root);
  write(join(root, "project.css"), 'p { font-variation-settings: "opsz" 14, "wght" 700; }\n');
  const result = run(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /project\.css sets wght in font-variation-settings; use font-weight/);
});
