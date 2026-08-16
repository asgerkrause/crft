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
  const root = mkdtempSync(join(tmpdir(), "crft-copy-system-"));
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

function stagingDirectories(root) {
  return readdirSync(root).filter((name) => name.startsWith(".crft-stage-"));
}

test("copies the exact canonical manifest byte-for-byte", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await adoptSystem({ sourceRoot: source, target });

  assert.deepEqual(files, [
    "global.css", "sans.ttf", "mono.ttf", "layers/base.css", "layers/tokens.css",
    "layers/type.css", "layers/layout.css", "layers/features.css", "layers/utility.css",
  ]);
  for (const file of files) {
    assert.equal(readFileSync(join(target, file), "utf8"), readFileSync(join(source, file), "utf8"));
  }
});

test("copies into an existing directory only when every destination is absent", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");
  await mkdir(target);

  await adoptSystem({ sourceRoot: source, target });
  assert.equal(readFileSync(join(target, "global.css"), "utf8"), "source:global.css");

  await assert.rejects(adoptSystem({ sourceRoot: source, target }), /Target already exists/);
  assert.equal(readFileSync(join(target, "global.css"), "utf8"), "source:global.css");
});

test("dry-run validates without creating target or staging", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await adoptSystem({ sourceRoot: source, target, dryRun: true });

  assert.equal(existsSync(target), false);
  assert.deepEqual(stagingDirectories(root), []);
});

test("command dry-run prints the plan without creating target", (t) => {
  const root = fixture(t);
  const target = join(root, "adopted");
  const result = runCopy("--dry-run", target);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PLAN: copy 9 files/);
  assert.match(result.stdout, /PLAN: no files created/);
  assert.equal(existsSync(target), false);
});

test("refuses a target inside canonical source", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);

  await assert.rejects(adoptSystem({ sourceRoot: source, target: join(source, "adopted") }), /must not be the source root or its descendant/);
});

test("refuses target and source symlinks", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const protectedTarget = join(root, "protected");
  writeFileSync(protectedTarget, "preserve");
  const linkedTarget = join(root, "linked");
  symlinkSync(protectedTarget, linkedTarget);

  await assert.rejects(adoptSystem({ sourceRoot: source, target: linkedTarget }), /Target must be a directory/);
  assert.equal(readFileSync(protectedTarget, "utf8"), "preserve");

  rmSync(join(source, "global.css"));
  symlinkSync(join(source, "sans.ttf"), join(source, "global.css"));
  await assert.rejects(adoptSystem({ sourceRoot: source, target: join(root, "other") }), /not a regular file/);
  assert.deepEqual(stagingDirectories(root), []);
});

test("never removes a target created by another process before publish", async (t) => {
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
  }), /Target must be a directory/);

  assert.equal(readFileSync(target, "utf8"), "adversary target");
  assert.deepEqual(stagingDirectories(root), []);
});
