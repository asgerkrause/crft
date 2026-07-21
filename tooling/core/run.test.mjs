import assert from "node:assert/strict";
import { symlinkSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createFixture } from "../test-support/fixture.mjs";
import { MAX_TEXT_BYTES } from "./traverse.mjs";
import { SUPPORTED_SOURCE_EXTENSIONS, collectConsumerRecords, consumerSkippedFindings } from "./run.mjs";

test("collects only supported consumer text and retains every skipped reason", (t) => {
  const root = createFixture(t, {
    "src/app.css": "body {}",
    "src/template.astro": "<main />",
    "src/data.json": "{}",
    "src/binary.css": "a\0b",
    "src/large.css": "x".repeat(MAX_TEXT_BYTES + 1),
    "vendor/seess/global.css": "ignored adoption source",
    "node_modules/pkg/index.css": "excluded dependency",
    ".env.local": "excluded secret",
  });
  symlinkSync(join(root, "src/app.css"), join(root, "src/linked.css"));

  const result = collectConsumerRecords({ root, adoption: { relative: "vendor/seess" } });
  assert.deepEqual(SUPPORTED_SOURCE_EXTENSIONS, [".css", ".html", ".astro", ".js", ".jsx", ".ts", ".tsx", ".vue", ".svelte"]);
  assert.deepEqual(result.records.map((record) => record.path), ["src/app.css", "src/template.astro"]);
  assert.deepEqual(result.skipped, [
    { path: ".env.local", reason: "excluded" },
    { path: "node_modules", reason: "excluded" },
    { path: "src/binary.css", reason: "binary" },
    { path: "src/data.json", reason: "unsupported-extension" },
    { path: "src/large.css", reason: "oversized" },
    { path: "src/linked.css", reason: "symlink" },
  ]);

  const findings = consumerSkippedFindings(result.skipped);
  assert.ok(findings.every((finding) => finding.status === "blocked" && finding.evidence.state === "blocked"));
  assert.deepEqual(findings.map((finding) => finding.path), ["[redacted-path]", "node_modules", "src/binary.css", "src/data.json", "src/large.css", "src/linked.css"]);
});
