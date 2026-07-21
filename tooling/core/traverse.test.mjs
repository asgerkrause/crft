import assert from "node:assert/strict";
import { symlinkSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createFixture } from "../test-support/fixture.mjs";
import { MAX_TEXT_BYTES, readTextFile, walkFiles } from "./traverse.mjs";

test("walks sorted regular files and skips fixed sensitive/build exclusions", (t) => {
  const root = createFixture(t, {
    "z.css": "z",
    "a.css": "a",
    "nested/b.css": "b",
    ".git/config": "skip",
    "node_modules/pkg/index.css": "skip",
    "dist/output.css": "skip",
    "build/output.css": "skip",
    ".cache/output.css": "skip",
    "coverage/output.css": "skip",
    ".env.local": "skip",
    "secrets/private.pem": "skip",
    "secrets/private.key": "skip",
    ".ssh/id_rsa": "skip",
  });
  symlinkSync(join(root, "a.css"), join(root, "linked.css"));

  assert.deepEqual(walkFiles(root).map((file) => file.relative), ["a.css", "nested/b.css", "z.css"]);
});

test("reads bounded text without reading symlinks or oversized files", (t) => {
  const root = createFixture(t, { "small.css": "body {}", "large.css": "x".repeat(MAX_TEXT_BYTES + 1) });
  symlinkSync(join(root, "small.css"), join(root, "linked.css"));

  assert.equal(readTextFile(join(root, "small.css")), "body {}");
  assert.equal(readTextFile(join(root, "large.css")), undefined);
  assert.equal(readTextFile(join(root, "linked.css")), undefined);
});
