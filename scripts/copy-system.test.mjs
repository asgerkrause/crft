import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { copySystem, files } from "./copy-system.mjs";

const script = fileURLToPath(new URL("./copy-system.mjs", import.meta.url));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "seess-copy-system-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  return root;
}

async function sourceFixture(root, omitted = []) {
  const source = join(root, "source");
  for (const file of files) {
    if (omitted.includes(file)) continue;
    const path = join(source, file);
    await mkdir(dirname(path), { recursive: true });
    writeFileSync(path, `source:${file}`);
  }
  return source;
}

function runCopy(...arguments_) {
  return spawnSync(process.execPath, [script, ...arguments_], { encoding: "utf8" });
}

test("copies the exact ten-file canonical manifest byte-for-byte", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await copySystem(source, target);

  assert.deepEqual(files, [
    "global.css", "sans.ttf", "mono.ttf", "styles/base.css", "styles/tokens.css",
    "styles/type.css", "styles/layout.css", "styles/features.css", "styles/utility.css", "styles/project.css",
  ]);
  for (const file of files) {
    assert.equal(readFileSync(join(target, file), "utf8"), readFileSync(join(source, file), "utf8"));
  }
});

test("dry-run reports the plan without creating its target", (t) => {
  const root = fixture(t);
  const target = join(root, "adopted");
  const result = runCopy("--dry-run", target);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PLAN: copy 10 files/);
  assert.match(result.stdout, /PLAN: no files created/);
  assert.equal(existsSync(target), false);
});

test("refuses an existing target without overwriting it", (t) => {
  const root = fixture(t);
  const target = join(root, "adopted");
  writeFileSync(target, "preserve");

  const result = runCopy(target);

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Target already exists/);
  assert.equal(readFileSync(target, "utf8"), "preserve");
});

test("cleans up a target after a partial copy failure", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root, ["styles/project.css"]);
  const target = join(root, "adopted");

  await assert.rejects(copySystem(source, target), /ENOENT/);
  assert.equal(existsSync(target), false);
});
