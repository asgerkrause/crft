import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createFixture } from "./test-support/fixture.mjs";
import { run } from "./seess.mjs";

async function adoptedFixture(t, entry = '@import "../vendor/seess/global.css";\n') {
  const root = createFixture(t, {
    "src/entry.css": entry,
    "vendor/.keep": "",
    "package.json": '{"scripts":{"preinstall":"touch package-script-ran"}}',
  });
  const target = join(root, "vendor/seess");
  const adopted = await run(["adopt", "--target", target]);
  assert.equal(adopted.exitCode, 0);
  return root;
}

test("adopt dispatches only to trusted copier and dry-run does not create its target", async (t) => {
  const root = createFixture(t, { "vendor/.keep": "" });
  const target = join(root, "vendor/seess");
  const dryRun = await run(["adopt", "--target", target, "--dry-run"]);
  assert.equal(dryRun.exitCode, 0);
  assert.equal(dryRun.output.result.dryRun, true);
  assert.equal(existsSync(target), false);

  const adopted = await run(["adopt", "--target", target]);
  assert.equal(adopted.exitCode, 0);
  assert.equal(adopted.output.result.copiedFiles, 10);
  assert.equal(existsSync(join(target, "global.css")), true);
});

test("verify requires one resolved adopted global import and emits no absolute root", async (t) => {
  const root = await adoptedFixture(t);
  const result = await run([
    "verify", "--root", root, "--entrypoint", "src/entry.css", "--adoption", "vendor/seess",
  ]);

  assert.equal(result.exitCode, 0);
  assert.deepEqual(result.output.scope, { entrypoint: "src/entry.css", adoption: "vendor/seess" });
  assert.deepEqual(result.output.summary, { total: 3, pass: 3, fail: 0, review: 0, blocked: 0 });
  assert.equal(JSON.stringify(result.output).includes(root), false);
  assert.equal(existsSync(join(root, "package-script-ran")), false);
});

test("verify fails when the static graph resolves zero or multiple adopted global edges", async (t) => {
  for (const entry of ["body {}\n", '@import "../vendor/seess/global.css";\n@import "../vendor/seess/global.css";\n']) {
    const root = await adoptedFixture(t, entry);
    const result = await run([
      "verify", "--root", root, "--entrypoint", "src/entry.css", "--adoption", "vendor/seess",
    ]);
    assert.equal(result.exitCode, 1);
    assert.equal(result.output.findings.find((finding) => finding.ruleId === "adoption/entrypoint-import").status, "fail");
  }
});

test("audit adds consumer API findings and migrate returns its read-only plan", async (t) => {
  const root = await adoptedFixture(t, '@import "../vendor/seess/global.css";\n:root { --l-gc: 1rem; }\n');
  const args = ["--root", root, "--entrypoint", "src/entry.css", "--adoption", "vendor/seess"];
  const audit = await run(["audit", ...args]);
  const migrate = await run(["migrate", ...args]);

  assert.equal(audit.exitCode, 1);
  assert.equal(audit.output.findings.some((finding) => finding.ruleId === "consumer-api/private-property"), true);
  assert.equal(migrate.exitCode, 1);
  assert.deepEqual(migrate.output.plan.map((step) => Object.keys(step).sort()), migrate.output.plan.map(() => ["action", "path", "range", "ruleId"]));
});

test("requires command-specific flags and emits JSON usage errors", async () => {
  const result = await run(["audit", "--entrypoint", "src/entry.css"]);
  assert.equal(result.exitCode, 2);
  assert.deepEqual(result.output, { error: { code: "invalid-input", message: "audit requires --root, --entrypoint, and --adoption only" } });
  assert.equal(result.output.error.message.includes(process.cwd()), false);
});
