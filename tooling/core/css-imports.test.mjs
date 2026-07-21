import assert from "node:assert/strict";
import test from "node:test";
import { createFixture } from "../test-support/fixture.mjs";
import { buildCssImportGraph, parseCssImports } from "./css-imports.mjs";
import { resolveScope } from "./scope.mjs";

test("parses only static top-level imports before ordinary rules", () => {
  const source = [
    "/* @import './comment.css'; */",
    '@import "./nested.css" layer(theme) supports(display: grid) screen and (width > 30rem);',
    '.notice::before { content: "@import \\"./content.css\\";"; }',
    '.nested { @import "./nested-only.css"; }',
    '@import "./late.css";',
  ].join("\n");

  assert.deepEqual(parseCssImports(source), [{
    specifier: "./nested.css",
    range: { start: { line: 2, column: 1 }, end: { line: 2, column: 88 } },
  }]);
});

test("permits @charset and @layer statements before imports", () => {
  const source = '@charset "utf-8";\n@layer reset;\n@import "./nested.css" print;\n';
  assert.deepEqual(parseCssImports(source), [{
    specifier: "./nested.css",
    range: { start: { line: 3, column: 1 }, end: { line: 3, column: 30 } },
  }]);
});

test("builds local import graph and retains invalid candidates as blocked data", (t) => {
  const root = createFixture(t, {
    "src/main.css": [
      '@import "./nested.css" layer(theme) supports(display: grid);',
      '@import "package";',
      '@import url("./url.css");',
      '@import "https://example.com/base.css";',
      '@import var(--dynamic);',
      '@import unquoted.css;',
      '@import "../../outside.css";',
      '@import "/system.css";',
      'body {}',
      '@import "./late.css";',
      '@import "./unterminated.css" layer(foo;',
    ].join("\n"),
    "src/nested.css": '@import "./main.css";',
  });
  const graph = buildCssImportGraph(resolveScope({ root, entrypoint: "src/main.css" }));

  assert.deepEqual(graph.files.map((file) => file.path), ["src/main.css", "src/nested.css"]);
  assert.deepEqual(graph.blocked.map((entry) => entry.blocked).sort(), [
    "bare", "cycle", "dynamic", "ordering", "outside", "outside", "syntax", "unsupported", "uri", "url",
  ]);
  assert.deepEqual(graph.files.find((file) => file.path === "src/main.css").imports[0], {
    specifier: "./nested.css",
    range: { start: { line: 1, column: 1 }, end: { line: 1, column: 61 } },
    resolved: "src/nested.css",
  });
});

test("does not resolve malformed or escaped-string import text", (t) => {
  const root = createFixture(t, {
    "src/main.css": [
      '@import "./valid.css";',
      '.x { content: "@import \\"./ignored.css\\";"; }',
      '/* @import "./comment.css"; */',
      '@import "./broken.css" supports(display: grid;',
    ].join("\n"),
    "src/valid.css": "",
  });
  const graph = buildCssImportGraph(resolveScope({ root, entrypoint: "src/main.css" }));

  assert.deepEqual(graph.files.map((file) => file.path), ["src/main.css", "src/valid.css"]);
  assert.deepEqual(graph.blocked.map((entry) => [entry.specifier, entry.blocked]), [["./broken.css", "syntax"]]);
});
