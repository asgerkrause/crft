import assert from "node:assert/strict";
import test from "node:test";
import { createFixture } from "../test-support/fixture.mjs";
import { buildCssImportGraph, parseCssImports } from "./css-imports.mjs";
import { resolveScope } from "./scope.mjs";

test("parses static imports with exact source ranges and ignores comments", () => {
  const source = "/* @import './ignored.css'; */\n@import \"./nested.css\";\n";
  assert.deepEqual(parseCssImports(source), [{
    specifier: "./nested.css",
    range: { start: { line: 2, column: 1 }, end: { line: 2, column: 24 } },
  }]);
});

test("builds local import graph and retains unsupported edges as blocked data", (t) => {
  const root = createFixture(t, {
    "src/main.css": [
      '@import "./nested.css";',
      '@import "package";',
      '@import url("https://example.com/base.css");',
      '@import "../../outside.css";',
      '@import "/system.css";',
    ].join("\n"),
    "src/nested.css": '@import "./main.css";',
  });
  const graph = buildCssImportGraph(resolveScope({ root, entrypoint: "src/main.css" }));

  assert.deepEqual(graph.files.map((file) => file.path), ["src/main.css", "src/nested.css"]);
  assert.deepEqual(graph.blocked.map((entry) => entry.blocked).sort(), ["bare", "cycle", "outside", "outside", "uri"]);
  assert.deepEqual(graph.files.find((file) => file.path === "src/main.css").imports[0], {
    specifier: "./nested.css",
    range: { start: { line: 1, column: 1 }, end: { line: 1, column: 24 } },
    resolved: "src/nested.css",
  });
});
