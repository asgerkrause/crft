import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createFixture } from "./test-support/fixture.mjs";

const cli = fileURLToPath(new URL("./seess.mjs", import.meta.url));

function hashes(root, prefix = "") {
  const result = {};
  for (const entry of readdirSync(join(root, prefix), { withFileTypes: true })) {
    const path = `${prefix}${entry.name}`;
    if (entry.isDirectory()) Object.assign(result, hashes(root, `${path}/`));
    else result[path] = createHash("sha256").update(readFileSync(join(root, path))).digest("hex");
  }
  return result;
}

function command(...args) {
  const child = spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
  assert.equal(child.stderr, "");
  assert.notEqual(child.stdout, "");
  return { exitCode: child.status, output: JSON.parse(child.stdout) };
}

test("spawned commands preserve consumer files and never execute package scripts", (t) => {
  const root = createFixture(t, {
    "src/entry.css": '@import "../vendor/seess/global.css";\n',
    "vendor/.keep": "",
    "package.json": '{"scripts":{"preinstall":"touch package-script-ran"}}',
  });
  const target = join(root, "vendor/seess");
  const adopted = command("adopt", "--target", target);
  assert.equal(adopted.exitCode, 0);
  assert.equal(adopted.output.result.operation, "adopt");
  assert.equal(JSON.stringify(adopted.output).includes(root), false);

  const before = hashes(root);
  const args = ["--root", root, "--entrypoint", "src/entry.css", "--adoption", "vendor/seess"];
  const verify = command("verify", ...args);
  const audit = command("audit", ...args);
  const migrate = command("migrate", ...args);

  assert.equal(verify.exitCode, 0);
  assert.equal(audit.exitCode, 3);
  assert.equal(migrate.exitCode, 3);
  assert.equal(verify.output.summary.pass, 3);
  assert.ok(migrate.output.plan.some((step) => step.action === "escalate"));
  assert.ok(migrate.output.plan.some((step) => step.action === "preserve"));
  assert.deepEqual(hashes(root), before);
  assert.equal(existsSync(join(root, "package-script-ran")), false);
});
