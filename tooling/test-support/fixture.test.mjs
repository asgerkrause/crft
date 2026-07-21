import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createFixture } from "./fixture.mjs";

test("creates isolated files from relative POSIX paths", (t) => {
  const root = createFixture(t, { "src/entry.css": "@import 'seess';\n" });
  const path = join(root, "src/entry.css");
  assert.equal(readFileSync(path, "utf8"), "@import 'seess';\n");
  assert.equal(existsSync(root), true);
});

test("rejects fixture paths outside the temporary root", (t) => {
  assert.throws(
    () => createFixture(t, { "../outside.css": "no" }),
    /fixture files must map relative POSIX paths to strings/,
  );
});
