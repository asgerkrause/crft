import assert from "node:assert/strict";
import { symlinkSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createFixture } from "../test-support/fixture.mjs";
import { MAX_TEXT_BYTES, enumerateTree, inspectTextFile, readStableFile, readTextFile, walkFiles } from "./traverse.mjs";

test("enumerates every descendant, including excluded names and symlinks, without following links", (t) => {
  const root = createFixture(t, {
    "z.css": "z",
    "a.css": "a",
    "nested/b.css": "b",
    ".git/config": "excluded",
    "node_modules/pkg/index.css": "excluded",
    "secret.key": "excluded",
  });
  symlinkSync(join(root, "a.css"), join(root, "linked.css"));

  const entries = enumerateTree(root);
  assert.deepEqual(entries.map((entry) => [entry.relative, entry.kind, entry.excluded]), [
    [".git", "directory", true],
    [".git/config", "file", false],
    ["a.css", "file", false],
    ["linked.css", "symlink", false],
    ["nested", "directory", false],
    ["nested/b.css", "file", false],
    ["node_modules", "directory", true],
    ["node_modules/pkg", "directory", false],
    ["node_modules/pkg/index.css", "file", false],
    ["secret.key", "file", true],
    ["z.css", "file", false],
  ]);
  assert.deepEqual(walkFiles(root).map((file) => file.relative), ["a.css", "nested/b.css", "z.css"]);
});

test("reports why text records cannot be read and bounds stable regular files", (t) => {
  const root = createFixture(t, {
    "small.css": "body {}",
    "binary.css": "a\0b",
    "large.css": "x".repeat(MAX_TEXT_BYTES + 1),
  });
  symlinkSync(join(root, "small.css"), join(root, "linked.css"));

  assert.equal(readTextFile(join(root, "small.css")), "body {}");
  assert.deepEqual(inspectTextFile(join(root, "binary.css")), { reason: "binary" });
  assert.deepEqual(inspectTextFile(join(root, "large.css")), { reason: "oversized" });
  assert.deepEqual(inspectTextFile(join(root, "linked.css")), { reason: "symlink" });
  assert.deepEqual(readStableFile(join(root, "linked.css")), { reason: "symlink" });
  assert.equal(readTextFile(join(root, "large.css")), undefined);
});
