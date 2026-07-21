import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createFixture } from "./test-support/fixture.mjs";
import { run } from "./seess.mjs";

const cli = fileURLToPath(new URL("./seess.mjs", import.meta.url));

test("audit has explicit scope, JSON output, and no project execution", (t) => {
  const root = createFixture(t, { "src/entry.css": "body {}" });
  const result = run(["audit", "--root", root, "--entrypoint", "src/entry.css"]);

  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.output.scope, { entrypoint: "src/entry.css" });
  assert.equal(result.output.summary.total, 0);
  assert.equal(JSON.stringify(result.output).includes(root), false);

  const child = spawnSync(process.execPath, [cli, "audit", "--root", root, "--entrypoint", "src/entry.css"], { encoding: "utf8" });
  assert.equal(child.status, 0, child.stderr);
  assert.equal(child.stderr, "");
  assert.deepEqual(JSON.parse(child.stdout), result.output);
});

test("adopt is explicitly blocked until its integration is available", (t) => {
  const root = createFixture(t, { "vendor/seess/global.css": "" });
  const result = run(["adopt", "--root", root, "--adoption", "vendor/seess"]);

  assert.equal(result.exitCode, 3);
  assert.equal(result.output.findings[0].status, "blocked");
  assert.equal(result.output.findings[0].safeNextAction.type, "escalate");
});

test("requires command-specific flags and emits JSON usage errors", () => {
  const result = run(["audit", "--entrypoint", "src/entry.css"]);
  assert.equal(result.exitCode, 2);
  assert.deepEqual(result.output, { error: { code: "invalid-input", message: "--root is required" } });
  assert.equal(result.output.error.message.includes(process.cwd()), false);
});
