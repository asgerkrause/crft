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
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  adoptSystem,
  copyableSourceFiles,
  resolveAdoptRequest,
  tokensWithoutFonts,
} from "./copy-system.mjs";

const script = fileURLToPath(new URL("./copy-system.mjs", import.meta.url));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "crft-copy-system-"));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  return root;
}

async function sourceFixture(root, omitted = []) {
  const source = join(root, "source");
  for (const file of copyableSourceFiles) {
    if (omitted.includes(file)) continue;
    const path = join(source, file);
    await mkdir(dirname(path), { recursive: true });
    writeFileSync(path, `source:${file}\n`);
  }
  return source;
}

function runCopy(...arguments_) {
  return spawnSync(process.execPath, [script, ...arguments_], { encoding: "utf8" });
}

function stagingDirectories(root) {
  return readdirSync(root).filter((name) => name.startsWith(".crft-stage-"));
}

test("tokens-only copies one layer file and no global.css or fonts", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  const result = await adoptSystem({ sourceRoot: source, target, layers: "tokens" });

  assert.deepEqual(result.manifest, ["tokens.css"]);
  assert.equal(readFileSync(join(target, "tokens.css"), "utf8"), "source:tokens.css\n");
  assert.equal(existsSync(join(target, "global.css")), false);
  assert.equal(existsSync(join(target, "sans.woff")), false);
  assert.match(result.entryBlock, /@layer reset, base, tokens, type, layout, grid, motion, utility, project;/);
  assert.match(result.entryBlock, /@import "\.\/tokens\.css";/);
  assert.doesNotMatch(result.entryBlock, /type\.css/);
});

test("full copies tokens and framework without fonts", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  const result = await adoptSystem({ sourceRoot: source, target, layers: "full" });

  assert.deepEqual(result.manifest, [
    "tokens.css", "crft.css",
  ]);
  assert.equal(existsSync(join(target, "layers/fonts.css")), false);
  assert.equal(existsSync(join(target, "sans.woff")), false);
});

test("fonts flag adds faces and woffs", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  const result = await adoptSystem({ sourceRoot: source, target, layers: "tokens", fonts: true });

  assert.deepEqual(result.manifest, ["tokens.css", "sans.woff", "mono.woff"]);
  assert.doesNotMatch(result.entryBlock, /fonts\.css/);
});

test("grid without layout is refused", () => {
  assert.throws(() => resolveAdoptRequest({ layers: "grid" }), /Unsupported layer selection/);
});

test("type without tokens is refused", () => {
  assert.throws(() => resolveAdoptRequest({ layers: "type" }), /Unsupported layer selection/);
});

test("motion without layout is refused", () => {
  assert.throws(() => resolveAdoptRequest({ layers: "tokens,motion" }), /Unsupported layer selection/);
});

test("missing --layers is refused", () => {
  assert.throws(() => resolveAdoptRequest({}), /Usage:/);
  const result = runCopy("--dry-run", "/tmp/crft-missing-layers");
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Usage:/);
});

test("copies into an existing directory only when every destination is absent", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");
  await mkdir(target);

  await adoptSystem({ sourceRoot: source, target, layers: "tokens" });
  assert.equal(readFileSync(join(target, "tokens.css"), "utf8"), "source:tokens.css\n");

  await assert.rejects(adoptSystem({ sourceRoot: source, target, layers: "tokens" }), /Target already exists/);
  assert.equal(readFileSync(join(target, "tokens.css"), "utf8"), "source:tokens.css\n");
});

test("dry-run validates without creating target or staging", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await adoptSystem({ sourceRoot: source, target, layers: "tokens", dryRun: true });

  assert.equal(existsSync(target), false);
  assert.deepEqual(stagingDirectories(root), []);
});

test("command dry-run prints the plan and entry block without creating target", (t) => {
  const root = fixture(t);
  const target = join(root, "adopted");
  const result = runCopy("--dry-run", "--layers", "tokens", target);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PLAN: copy 2 files/);
  assert.match(result.stdout, /crft-manifest\.json/);
  assert.match(result.stdout, /PLAN: project entry/);
  assert.match(result.stdout, /@import "\.\/tokens\.css";/);
  assert.match(result.stdout, /PLAN: no files created/);
  assert.equal(existsSync(target), false);
});

test("refuses a target inside canonical source", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);

  await assert.rejects(
    adoptSystem({ sourceRoot: source, target: join(source, "adopted"), layers: "tokens" }),
    /must not be the source root or its descendant/,
  );
});

test("refuses target and source symlinks", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const protectedTarget = join(root, "protected");
  writeFileSync(protectedTarget, "preserve");
  const linkedTarget = join(root, "linked");
  symlinkSync(protectedTarget, linkedTarget);

  await assert.rejects(
    adoptSystem({ sourceRoot: source, target: linkedTarget, layers: "tokens" }),
    /Target must be a directory/,
  );
  assert.equal(readFileSync(protectedTarget, "utf8"), "preserve");

  rmSync(join(source, "tokens.css"));
  symlinkSync(join(source, "sans.woff"), join(source, "tokens.css"));
  await assert.rejects(
    adoptSystem({ sourceRoot: source, target: join(root, "other"), layers: "tokens" }),
    /not a regular file/,
  );
  assert.deepEqual(stagingDirectories(root), []);
});

test("never removes a target created by another process before publish", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await assert.rejects(adoptSystem({
    sourceRoot: source,
    target,
    layers: "tokens",
    beforePublish: ({ staging }) => {
      assert.equal(existsSync(staging), true);
      writeFileSync(target, "adversary target");
    },
  }), /Target must be a directory/);

  assert.equal(readFileSync(target, "utf8"), "adversary target");
  assert.deepEqual(stagingDirectories(root), []);
});

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

test("real copy writes crft-manifest.json with layers and file hashes", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  await adoptSystem({ sourceRoot: source, target, layers: "full" });

  const manifest = JSON.parse(readFileSync(join(target, "crft-manifest.json"), "utf8"));
  assert.equal(manifest.source, "crft");
  assert.deepEqual(manifest.layers, ["base", "tokens", "type", "layout", "grid", "motion", "utility"]);
  assert.equal(manifest.fonts, false);
  assert.equal(manifest.files["tokens.css"], digest("source:tokens.css\n"));
  assert.equal(manifest.files["crft.css"], digest("source:crft.css\n"));
  assert.equal(manifest.files["crft-manifest.json"], undefined);
  assert.ok(Number.isFinite(Date.parse(manifest.copiedAt)));
});

test("dry-run lists crft-manifest.json without writing it", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");

  const result = await adoptSystem({ sourceRoot: source, target, layers: "tokens", dryRun: true });

  assert.deepEqual(result.destinations, ["tokens.css", "crft-manifest.json"]);
  assert.equal(existsSync(join(target, "crft-manifest.json")), false);
  assert.equal(existsSync(target), false);
});

test("existing crft-manifest.json refuses the whole publish", async (t) => {
  const root = fixture(t);
  const source = await sourceFixture(root);
  const target = join(root, "adopted");
  await mkdir(join(target, "layers"), { recursive: true });
  writeFileSync(join(target, "crft-manifest.json"), "{}\n");

  await assert.rejects(adoptSystem({ sourceRoot: source, target, layers: "tokens" }), /Target already exists/);
  assert.equal(existsSync(join(target, "tokens.css")), false);
  assert.equal(readFileSync(join(target, "crft-manifest.json"), "utf8"), "{}\n");
});

test("manifest contract includes a known public token and private property", async (t) => {
  const root = fixture(t);
  const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
  const target = join(root, "adopted");

  await adoptSystem({ sourceRoot, target, layers: "tokens" });

  const manifest = JSON.parse(readFileSync(join(target, "crft-manifest.json"), "utf8"));
  assert.ok(manifest.contract.publicTokens.includes("--text"));
  assert.ok(manifest.contract.privateProperties.includes("--l-gc"));
});


test("optional faces, adjacent font URLs and manifest hashes match copied bytes", async (t) => {
  const parent = fixture(t);
  const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
  const canonical = readFileSync(join(sourceRoot, "styles/tokens.css"), "utf8");
  for (const fonts of [false, true]) {
    const target = join(parent, String(fonts));
    await adoptSystem({ sourceRoot, target, layers: "full", fonts });
    const tokens = readFileSync(join(target, "tokens.css"), "utf8");
    assert.equal(tokens, fonts ? canonical : tokensWithoutFonts(canonical));
    assert.equal(tokens.includes("@font-face"), fonts);
    assert.equal(existsSync(join(target, "sans.woff")), fonts);
    if (fonts) for (const file of ["sans.woff", "mono.woff"]) assert.ok(tokens.includes(`url("./${file}")`));
    const manifest = JSON.parse(readFileSync(join(target, "crft-manifest.json"), "utf8"));
    assert.equal(manifest.packagingVersion, 1);
    for (const [file, hash] of Object.entries(manifest.files)) assert.equal(digest(readFileSync(join(target, file))), hash);
  }
});

test("copier refuses legacy packages without changing their files", async (t) => {
  const parent = fixture(t);
  const source = await sourceFixture(parent);
  const target = join(parent, "adopted");
  await mkdir(join(target, "layers"), { recursive: true });
  writeFileSync(join(target, "layers/tokens.css"), "preserve");
  await assert.rejects(adoptSystem({ sourceRoot: source, target, layers: "full" }), /Mixed flat and legacy/);
  assert.equal(readFileSync(join(target, "layers/tokens.css"), "utf8"), "preserve");
  assert.equal(existsSync(join(target, "tokens.css")), false);
});
