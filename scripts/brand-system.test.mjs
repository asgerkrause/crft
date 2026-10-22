import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { buildContract } from "./emit-contract.mjs";
import { adoptSystem } from "./copy-system.mjs";
import { markupErrors } from "./check-markup.mjs";
import { resolveFixture, fixtureCss } from "../reference/fixtures/recipes.mjs";
const root = new URL("../", import.meta.url);
const load = (name) => JSON.parse(readFileSync(new URL(`reference/fixtures/${name}.json`, root), "utf8"));

for (const name of ["fluid", "static", "mixed"]) {
  test(`${name} recipes preserve independently recorded endpoints`, () => {
    const fixture = load(name);
    assert.deepEqual(resolveFixture(fixture), fixture.expected);
    const css = fixtureCss(fixture);
    for (const [role, expected] of Object.entries(fixture.expected)) if (expected.staticRem !== undefined) assert.ok(css.includes(`--${role}-size: ${expected.staticRem}rem;`));
  });
}

test("equal foundations simplify to literal outputs without explicit role sizes", () => {
  const fixture = load("static");
  for (const role of Object.values(fixture.roles)) delete role.size;
  assert.deepEqual(resolveFixture(fixture), fixture.expected);
  assert.doesNotMatch(fixtureCss(fixture), /(?:vw|vi|clamp|pow)\(/);
  assert.match(fixtureCss(fixture), /--body-size: 1.125rem;/);
});

test("fixture inputs reject malformed dimensions, range, steps and weight axes", () => {
  for (const mutate of [
    (f) => { f.contractVersion = 99; },
    (f) => { f.foundations["type-min"].unit = "px"; },
    (f) => { f.foundations["type-min"].value = 0; },
    (f) => { f.foundations["type-ratio-min"] = -1; },
    (f) => { f.foundations["fluid-max"].value = 25; },
    (f) => { delete f.roles.label; },
    (f) => { f.roles.body.step = 0.5; },
    (f) => { f.roles.body.axes = '"wght" 500'; },
    (f) => { f.scales.gap.ratio = 0; },
  ]) {
    const f = load("fluid"); mutate(f); assert.throws(() => fixtureCss(f));
  }
});

test("grid spans use direct responsive parent tracks including partial subgrids", () => {
  for (const valid of [
    '<div g="3-2"><div c="2-1" r="2-1"></div><div c="0"></div></div>',
    '<div g="3"><div g="sg" c="2"><div c="2"></div></div></div>',
    '<div g="3"><div g="2"><div c="2"></div></div></div>',
    '<div g="fit"><div c="0" r="2"></div></div>',
  ]) assert.deepEqual(markupErrors(valid), [], valid);
  for (const invalid of [
    '<div g="3-2"><div c="2-3"></div></div>',
    '<div g="3"><div g="sg" c="2"><div c="3"></div></div></div>',
    '<div g="3"><div><div c="1"></div></div></div>',
    '<div g="fill"><div c="1"></div></div>',
    '<div g="fit-sm"><div c="0-0"></div></div>',
    '<div g="2"><div r="5"></div></div>',
    '<div g="sg"></div>',
  ]) assert.ok(markupErrors(invalid).length, invalid);
});

test("v2 contract excludes private calculations in tokens.css", () => {
  const contract = buildContract(root);
  assert.equal(contract.contractVersion, 2);
  assert.ok(contract.privateProperties.includes("--_fluid"));
  assert.ok(!contract.publicTokens.some((name) => name.startsWith("--_")));
  assert.ok(contract.publicTokens.includes("--caption-size"));
  assert.deepEqual(contract.themes, ["dark", "light"]);
});

function temporary(t) {
  const path = mkdtempSync(join(tmpdir(), "crft-v2-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}
function check(target) { return spawnSync(process.execPath, [new URL("scripts/check-project.mjs", root).pathname, target], { encoding: "utf8" }); }

test("copied v2 manifest, hashes, extensions and typo/mixed failures", async (t) => {
  const parent = temporary(t); const target = join(parent, "styles");
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  const path = join(target, "crft-manifest.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  assert.equal(manifest.contractVersion, 2); assert.equal(manifest.contract.contractVersion, 2);
  writeFileSync(join(target, "local.css"), ':root { --project-space: 1rem; }');
  for (const [css, pass] of [
    ['p { color: var(--text); gap: var(--project-space); margin: var(--x-extra, 0); }', true],
    ['p { color: var(--txet); }', false],
    ['p { --c-fg: red; color: var(--c-fg); }', false],
    ['[t="h1"] { color: var(--text); }', false],
    ['p { --_local: 1; width: var(--_local); }', false],
  ]) {
    writeFileSync(join(target, "project.css"), css);
    const result = check(target); assert.equal(result.status === 0, pass, result.stderr);
  }
  writeFileSync(join(target, "project.css"), 'p { color: var(--text); }');
  for (const mutate of [
    (m) => { m.contractVersion = 99; },
    (m) => { m.packagingVersion = 99; },
    (m) => { delete m.packagingVersion; },
    (m) => { m.contract.packagingVersion = 99; },
    (m) => { m.layers = ["tokens", "grid"]; },
    (m) => { delete m.contract.publicTokens; },
    (m) => { delete m.contract.hooks; },
    (m) => { m.contract.layerDependencies.type = "tokens"; },
    (m) => { m.contract.contractVersion = 1; },
  ]) {
    const bad = structuredClone(manifest); mutate(bad); writeFileSync(path, JSON.stringify(bad)); assert.notEqual(check(target).status, 0);
  }
});

test("manual flat copies derive v2 without requiring the copier", (t) => {
  const target = temporary(t);
  cpSync(new URL("styles/tokens.css", root), join(target, "tokens.css"));
  writeFileSync(join(target, "project.css"), 'p { color: var(--text); }');
  assert.equal(check(target).status, 0, check(target).stderr);
  writeFileSync(join(target, "project.css"), 'p { width: var(--_fluid); }');
  assert.notEqual(check(target).status, 0);
});

test("manual legacy copy retains legacy vocabulary and rejects declared new families", (t) => {
  const target = temporary(t); mkdirSync(join(target, "layers"));
  writeFileSync(join(target, "layers/tokens.css"), ':root { --c-fg: #111; }');
  writeFileSync(join(target, "project.css"), 'p { color: var(--c-fg); }');
  assert.equal(check(target).status, 0, check(target).stderr);
  for (const name of ["--gap", "--padding", "--content-max", "--body-size"]) {
    writeFileSync(join(target, "project.css"), `:root { ${name}: 1rem; }`);
    assert.notEqual(check(target).status, 0, name);
  }
});


test("flat full package works in a directory named layers", async (t) => {
  const target = join(temporary(t), "layers");
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  const contract = buildContract(target);
  assert.equal(contract.packagingVersion, 1);
  assert.deepEqual(Object.keys(contract.layers), ["crft.css", "tokens.css"]);
  assert.ok(contract.privateProperties.includes("--l-gc"));
  writeFileSync(join(target, "project.css"), "p { color: var(--text); }");
  assert.equal(check(target).status, 0, check(target).stderr);
  rmSync(join(target, "crft-manifest.json"));
  assert.equal(check(target).status, 0, check(target).stderr);
});

test("flat adoption rejects mixed layout and missing framework", async (t) => {
  const target = join(temporary(t), "styles");
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  mkdirSync(join(target, "layers"));
  writeFileSync(join(target, "layers/tokens.css"), ":root { --text: black; }");
  assert.match(check(target).stderr, /Mixed flat and legacy/);
  rmSync(join(target, "layers"), { recursive: true });
  rmSync(join(target, "crft.css"));
  assert.match(check(target).stderr, /Missing adopted file crft.css/);
});

test("recorded and manual v2 legacy layer packages remain supported", (t) => {
  const target = temporary(t);
  mkdirSync(join(target, "layers"));
  cpSync(new URL("styles/tokens.css", root), join(target, "layers/tokens.css"));
  const contract = buildContract(root);
  delete contract.packagingVersion;
  writeFileSync(join(target, "layers/crft-manifest.json"), JSON.stringify({ contractVersion: 2, contract }));
  writeFileSync(join(target, "project.css"), "p { color: var(--text); }");
  assert.equal(check(target).status, 0, check(target).stderr);
  rmSync(join(target, "layers/crft-manifest.json"));
  assert.equal(check(target).status, 0, check(target).stderr);
});


test("legacy v2 package permits project-owned root tokens but rejects flat package evidence", (t) => {
  const target = temporary(t);
  mkdirSync(join(target, "layers"));
  const contract = buildContract(root);
  delete contract.packagingVersion;
  const layers = Object.keys(contract.layerDependencies);
  for (const layer of layers) writeFileSync(join(target, "layers", `${layer}.css`), `@layer ${layer} {}`);
  cpSync(new URL("styles/tokens.css", root), join(target, "layers/tokens.css"));
  const manifest = join(target, "layers/crft-manifest.json");
  writeFileSync(manifest, JSON.stringify({ contractVersion: 2, layers, contract }));
  writeFileSync(join(target, "tokens.css"), ":root { --project-gutter: 2rem; }");
  for (const recorded of [true, false]) {
    if (!recorded) rmSync(manifest);
    const result = check(target);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, new RegExp(`PASS: 1 files, ${contract.publicTokens.length} tokens verified`));
    assert.equal(buildContract(target).packagingVersion, undefined);
    for (const file of ["crft.css", "crft-manifest.json"]) {
      writeFileSync(join(target, file), "{}");
      assert.match(check(target).stderr, /Mixed flat and legacy layer packaging/);
      rmSync(join(target, file));
    }
  }
});

test("a custom property name inside a CSS string is not a declared token", (t) => {
  const target = temporary(t);
  writeFileSync(join(target, "tokens.css"), ':root { --real: 1; }\n.x { content: "--ghost: red"; }\n.y { content: \'--ghost-single: red\'; }\n');
  const contract = buildContract(target);
  assert.deepEqual(contract.publicTokens, ["--real"]);
  assert.deepEqual(contract.privateProperties, []);
});

test("spaced attribute selectors still yield theme, skin, and accent values", (t) => {
  const target = temporary(t);
  writeFileSync(join(target, "tokens.css"), '[data-theme = "dark"] { --a: 1; }\n[data-skin= \'tone\'] { --b: 1; }\n[data-accent ="danger" ] { --c: 1; }\n');
  const contract = buildContract(target);
  assert.deepEqual(contract.themes, ["dark"]);
  assert.deepEqual(contract.skins, ["tone"]);
  assert.deepEqual(contract.accents, ["danger"]);
});

test("comments and strings are stripped in one pass", (t) => {
  const target = temporary(t);
  writeFileSync(join(target, "tokens.css"), '.x { content: "/*"; }\n:root { --real: 1; }\n/* x */\n.y { content: "a\\\n--ghost: 1"; }\n');
  assert.deepEqual(buildContract(target).publicTokens, ["--real"]);
});
