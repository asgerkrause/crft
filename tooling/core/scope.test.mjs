import assert from "node:assert/strict";
import { rmSync, symlinkSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createFixture } from "../test-support/fixture.mjs";
import { resolveScope } from "./scope.mjs";

test("resolves explicit root-relative entrypoint and adoption scopes", (t) => {
  const root = createFixture(t, { "src/entry.css": "body {}", "vendor/seess/global.css": "" });
  const scope = resolveScope({ root, entrypoint: "src/entry.css", adoption: "vendor/seess" });

  assert.deepEqual(scope.entrypoint, { absolute: join(scope.root, "src/entry.css"), relative: "src/entry.css" });
  assert.deepEqual(scope.adoption, { absolute: join(scope.root, "vendor/seess"), relative: "vendor/seess" });
});

test("requires an explicit absolute root and relative existing scope paths", (t) => {
  const root = createFixture(t, { "src/entry.css": "" });
  assert.throws(() => resolveScope({ root: "src", entrypoint: "src/entry.css" }), /root must be an explicit absolute path/);
  assert.throws(() => resolveScope({ root, entrypoint: "../outside.css" }), /scope paths must be relative POSIX paths/);
  assert.throws(() => resolveScope({ root, entrypoint: "src/missing.css" }), /scope path does not exist/);
});

test("refuses symlinked roots and scope paths", (t) => {
  const root = createFixture(t, { "src/entry.css": "" });
  const rootLink = `${root}-link`;
  symlinkSync(root, rootLink);
  t.after(() => rmSync(rootLink, { force: true }));
  assert.throws(() => resolveScope({ root: rootLink, entrypoint: "src/entry.css" }), /symlinks are not allowed in scope/);

  symlinkSync(join(root, "src/entry.css"), join(root, "src/linked.css"));
  assert.throws(() => resolveScope({ root, entrypoint: "src/linked.css" }), /symlinks are not allowed in scope/);
});
