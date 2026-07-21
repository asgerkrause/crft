import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { adoptSystem, files } from "./copy-system.mjs";

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

  await adoptSystem({ sourceRoot: source, target });

  assert.deepEqual(files, [
    "global.css", "sans.ttf", "mono.ttf", "styles/base.css", "styles/tokens.css",
    "styles/type.css", "styles/layout.css", "styles/features.css", "styles/utility.css", "styles/project.css",
  ]);
  for (const file of files) {
    assert.equal(readFileSync(join(target, file), "utf8"), readFileSync(join(source, file), "utf8"));
  }
});

test("dry-run validates source and target without creating target or staging", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await adoptSystem({ sourceRoot: source, target, dryRun: true });
  assert.equal(existsSync(target), false);
  assert.deepEqual(readdirSync(root).filter((name) => name.startsWith(".seess-stage-")), []);

  await assert.rejects(adoptSystem({ sourceRoot: source, target: join(root, "missing", "target"), dryRun: true }), /Target parent cannot be safely addressed/);
});

test("CLI dry-run preserves its plan output without creating target", (t) => {
  const root = fixture(t);
  const target = join(root, "adopted");
  const result = runCopy("--dry-run", target);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PLAN: copy 10 files/);
  assert.match(result.stdout, /PLAN: no files created/);
  assert.equal(existsSync(target), false);
});

test("refuses targets inside canonical source", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(source, "adopted");

  await assert.rejects(adoptSystem({ sourceRoot: source, target }), /Target must not be the source root or its descendant/);
  assert.equal(existsSync(target), false);
});

test("refuses an existing target or target symlink without overwriting it", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");
  writeFileSync(target, "preserve");

  await assert.rejects(adoptSystem({ sourceRoot: source, target }), /Target already exists/);
  assert.equal(readFileSync(target, "utf8"), "preserve");

  const protectedTarget = join(root, "protected");
  writeFileSync(protectedTarget, "protected");
  const linkedTarget = join(root, "linked");
  symlinkSync(protectedTarget, linkedTarget);
  await assert.rejects(adoptSystem({ sourceRoot: source, target: linkedTarget }), /Target already exists/);
  assert.equal(readFileSync(protectedTarget, "utf8"), "protected");
});

test("refuses source symlinks and cleans only process-owned staging after copy failures", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");
  rmSync(join(source, "global.css"));
  symlinkSync(join(source, "sans.ttf"), join(source, "global.css"));

  await assert.rejects(adoptSystem({ sourceRoot: source, target }), /not a regular file/);
  assert.equal(existsSync(target), false);
  assert.deepEqual(readdirSync(root).filter((name) => name.startsWith(".seess-stage-")), []);
});

test("refuses a target created before publish and never removes that target", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await assert.rejects(adoptSystem({
    sourceRoot: source,
    target,
    beforePublish: ({ staging }) => {
      assert.equal(existsSync(staging), true);
      writeFileSync(target, "adversary target");
    },
  }), /Target already exists/);

  assert.equal(readFileSync(target, "utf8"), "adversary target");
  assert.deepEqual(readdirSync(root).filter((name) => name.startsWith(".seess-stage-")), []);
});
