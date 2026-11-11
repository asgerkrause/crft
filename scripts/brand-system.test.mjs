import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync, cpSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { createHash } from "node:crypto";
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

test("v3 contract excludes private calculations in tokens.css", () => {
  const contract = buildContract(root);
  assert.equal(contract.contractVersion, 3);
  assert.ok(contract.privateProperties.includes("--_fluid"));
  assert.ok(!contract.publicTokens.some((name) => name.startsWith("--_")));
  assert.ok(contract.publicTokens.includes("--caption-size"));
  assert.deepEqual(contract.themes, ["accent", "invert", "tone"]);
});

function temporary(t) {
  const path = mkdtempSync(join(tmpdir(), "crft-v2-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
}
function check(target) { return spawnSync(process.execPath, [new URL("scripts/check-project.mjs", root).pathname, target], { encoding: "utf8" }); }

test("copied v3 manifest, hashes, extensions and typo/mixed failures", async (t) => {
  const parent = temporary(t); const target = join(parent, "styles");
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  const path = join(target, "crft-manifest.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  assert.equal(manifest.contractVersion, 3); assert.equal(manifest.contract.contractVersion, 3);
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

test("manual flat copies derive v3 without requiring the copier", (t) => {
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


test("copies adopted before the crft rename keep contract v3", async (t) => {
  const target = temporary(t);
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  for (const file of ["tokens.css", "crft.css"]) {
    const path = join(target, file);
    writeFileSync(path, readFileSync(path, "utf8").replace("/* crft semantic contract: 3. */", "/* Craft semantic contract: 3. */"));
  }
  assert.match(readFileSync(join(target, "tokens.css"), "utf8"), /Craft semantic contract/);
  assert.equal(buildContract(target).contractVersion, 3);
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
  writeFileSync(join(target, "layers/tokens.css"), readFileSync(new URL("styles/tokens.css", root), "utf8").replace("/* crft semantic contract: 3. */", ""));
  const contract = buildContract(root);
  delete contract.packagingVersion;
  contract.contractVersion = 2;
  contract.skins = ["tone"];
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
  contract.contractVersion = 2;
  contract.skins = ["tone"];
  const layers = Object.keys(contract.layerDependencies);
  for (const layer of layers) writeFileSync(join(target, "layers", `${layer}.css`), `@layer ${layer} {}`);
  writeFileSync(join(target, "layers/tokens.css"), readFileSync(new URL("styles/tokens.css", root), "utf8").replace("/* crft semantic contract: 3. */", ""));
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


test("old Brand OS context is rejected instead of treated as v3", () => {
  for (const contractVersion of [1, 2]) {
    const fixture = load("fluid"); fixture.contractVersion = contractVersion;
    assert.throws(() => fixtureCss(fixture), /Incompatible Brand OS context/);
  }
});

test("section identity and color-only hook grammar", () => {
  for (const html of [
    '<main><section id="customer-proof" data-theme="invert"><section><h2>Detail</h2></section></section></main>',
    '<div g="3-2"><div c="2-1" r="2-1" o="f-a-l"></div></div>',
  ]) assert.deepEqual(markupErrors(html), []);
  for (const html of [
    '<main><section></section></main>', '<main><section id=""></section></main>',
    '<main><section id="section-1"></section></main>', '<main><section id="proof"></section><section id="proof"></section></main>',
    '<section class="hero"></section>', '<section data-theme="dark"></section>',
    '<section data-theme=""></section>', '<section data-skin="tone"></section>', '<main data-scheme="dark"></main>',
    '<div g="3-2-1"></div>', '<div g="3"><div c="2-1-1" r="2-1-1" o="f-a"></div></div>',
  ]) assert.ok(markupErrors(html).length, html);
});

test("v3 rejects mixed selectors and recipes while permitting local final roles", async (t) => {
  const target = join(temporary(t), "styles");
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  for (const [css, pass] of [
    [':root { --type-min: 1; --gap: 2rem; } .campaign { --h1-size: 3rem; --h1-font: serif; --h1-leading: 1.2; }', true],
    ['[data-theme="tone"] { --h1-size: 3rem; --h1-weight: 500; }', false],
    ['[data-skin="tone"] { color: var(--text); }', false],
    ['[data-theme="dark"] { color-scheme: dark; }', false],
    ['[data-theme="tone"] { font-size: var(--body-size); }', false],
    ['[data-theme] { --font: serif; --type-min: 2; }', false],
    ['.campaign { --gap-ratio: 3; --radius-lg: 3rem; }', false],
    ['.campaign { --h1-size: calc(var(--type-min) * 1rem); }', false],
    [':root, [data-theme] { --h1-min: 2; }', false],
  ]) {
    writeFileSync(join(target, "project.css"), css);
    const result = check(target); assert.equal(result.status === 0, pass, `${css}\n${result.stderr}`);
  }
  writeFileSync(join(target, "project.css"), "");
  const path = join(target, "crft-manifest.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  manifest.contractVersion = manifest.contract.contractVersion = 2; manifest.contract.skins = [];
  writeFileSync(path, JSON.stringify(manifest));
  assert.match(check(target).stderr, /Semantic version marker disagrees/);
});

test("flat v2 adoptions keep v2 validation and never silently upgrade", (t) => {
  const target = temporary(t);
  writeFileSync(join(target, "tokens.css"), ':root { --text: black; } [data-theme="dark"] { color-scheme: dark; } [data-skin="tone"] { --text: gray; }');
  const contract = buildContract(target);
  assert.equal(contract.contractVersion, 2);
  assert.ok(contract.hooks.attributes.includes("data-skin"));
  for (const recorded of [false, true]) {
    if (recorded) writeFileSync(join(target, "crft-manifest.json"), JSON.stringify({ contractVersion: 2, packagingVersion: 1, layers: ["tokens"], contract }));
    writeFileSync(join(target, "project.css"), '[data-theme="dark"] { color: var(--text); }');
    assert.equal(check(target).status, 0, check(target).stderr);
    writeFileSync(join(target, "project.css"), 'p { color: var(--txet); }');
    assert.notEqual(check(target).status, 0);
  }
});

test("v3 checker preserves local outputs and tracks color-only nested theme scopes", async (t) => {
  const target = join(temporary(t), "styles");
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  const cases = [
    ['.card { --gap: 1rem; --padding: 2rem; --radius: 3rem; --gap-lg: 4rem; --radius-xl: 5rem; --space-sm: 1rem; --padding-lg: calc(2rem + 1vw); }', true],
    ['[data-state="open"] { display: grid; padding: 2rem; --h1-size: 3rem; }', true],
    [':root { @media (width > 10px) { --gap-ratio: 3; color-scheme: dark; } }', true],
    [':root.dark { color-scheme: dark; }', true],
    [':root[data-brand="client"] { --type-min: 1; --gap-ratio: 1.5; }', true],
    ['html:root:not([data-brand="other"]) { --type-min: 1; }', true],
    [':root { &.dark { color-scheme: dark; @media (width > 10px) { --gap-ratio: 2; } } }', true],
    [':root.dark, html[data-brand="client"] { --type-min: 1; }', true],
    [':root .card { --type-min: 1; }', false],
    [':root { & .card { --gap-ratio: 2; } }', false],
    [':root::before { --type-min: 1; }', false],
    [':root:before { --gap-ratio: 2; }', false],
    [':root:after { --type-min: 1; }', false],
    [':root:first-line { --type-min: 1; }', false],
    [':root:first-letter { --type-min: 1; }', false],
    [':root { &:before { --gap-ratio: 2; } }', false],
    [String.raw`:root:b\65 fore { --gap-ratio: 2; }`, false],
    ['[data-theme="tone"] { @media (width > 10px) { & > p { color: var(--text); background-color: rgb(1 2 3); } } --canvas: #eee; } .card { padding: 2rem; }', true],
    ['.card { content: "/* [data-theme] { display:none; }"; --payload: { nested: ";}" }; padding: calc(1rem + var(--gap)); }', true],
    ['[data-label="[data-theme]"] { padding: 2rem; }', true],
    ['[data-theme="tone"] { padding: 3rem; display: none; border-radius: 8rem; }', false],
    ['[data-theme="tone"] { @media (width > 10px) { font-weight: 900; } }', false],
    ['[data-theme="tone"] { & p { @supports (display: grid) { margin: 2rem; } } }', false],
    ['@media (width > 10px) { [data-theme="tone"] p { --padding: 2rem; } }', false],
    ['[data-theme="tone"] { --h1-leading: 1.2; }', false],
    ['[data-theme="tone"] { --gap-lg: 3rem; }', false],
    ['[data-theme="tone"] { /* " } */ color: red; @media (width > 10px) { display: none; } }', false],
    ['[data-theme="tone"] { --payload: { nested: "}" }; }', false],
    ['[data-theme="tone"] { color: var(--text, rgb(1 2 3)); p { content: "escaped \\" ; }"; } }', false],
    ['.card { --gap-lg: calc(var(--gap) * var(--gap-ratio)); }', false],
    ['.card { --h1-size: calc(var(--h1-min) * 1rem); }', false],
    ['[data-theme="tone"] { color-scheme: dark; }', false],
    [String.raw`[data-theme="tone"] { font\2d weight: 900; }`, false],
    [String.raw`[data-theme="tone"] { c\6f lor: red; }`, true],
    ['[data-theme="tone"] { background: var(--canvas) url("image.png"); }', false],
    ['[data-theme="tone"] { background: color-mix(in srgb, red 20%, var(--canvas)); }', true],
  ];
  for (const [css, pass] of cases) {
    writeFileSync(join(target, "project.css"), css);
    const result = check(target);
    assert.equal(result.status === 0, pass, `${css}\n${result.stderr}`);
  }
});

test("token/framework v2-v3 mixing fails both ways with and without manifests", async (t) => {
  const target = join(temporary(t), "styles");
  await adoptSystem({ sourceRoot: root.pathname, target, layers: "full" });
  const v3Tokens = readFileSync(join(target, "tokens.css"), "utf8");
  const v3Framework = readFileSync(join(target, "crft.css"), "utf8");
  const manifestPath = join(target, "crft-manifest.json");
  const v3Manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  // Faithful legacy behavior: unmarked v2 themes choose schemes; skins paint canvases and reset body type.
  const v2Tokens = ':root { --text: black; --canvas: white; --body-size: 1rem; } [data-theme="dark"] { color-scheme: dark; } [data-skin="tone"] { --canvas: gray; }';
  const v2Framework = '@layer base { [data-skin] { background: var(--canvas); color: var(--text); font-size: var(--body-size); } }';
  writeFileSync(join(target, "tokens.css"), v2Tokens);
  writeFileSync(join(target, "crft.css"), v2Framework);
  const v2Manifest = { ...v3Manifest, contractVersion: 2, files: { "crft.css": createHash("sha256").update(v2Framework).digest("hex") }, contract: buildContract(target) };
  for (const recorded of [false, true]) {
    for (const [tokens, framework, manifest, pass] of [
      [v2Tokens, v2Framework, v2Manifest, true],
      [v3Tokens, v3Framework, v3Manifest, true],
      [v2Tokens, v3Framework, v2Manifest, false],
      [v3Tokens, v2Framework, v3Manifest, false],
    ]) {
      writeFileSync(join(target, "tokens.css"), tokens);
      writeFileSync(join(target, "crft.css"), framework);
      if (recorded) writeFileSync(manifestPath, JSON.stringify(manifest));
      else rmSync(manifestPath, { force: true });
      const result = check(target);
      assert.equal(result.status === 0, pass, result.stderr);
      if (!pass) assert.match(result.stderr, /Incompatible token\/framework semantic versions/);
    }
  }
});

test("synthetic recipes enforce the ratio policy on resolved endpoints", () => {
  for (const mutate of [
    (f) => { f.foundations["type-ratio-max"] = 1.5; },
    (f) => { f.roles.body.min = { value: 1, unit: "rem" }; f.roles.body.max = { value: 3, unit: "rem" }; },
    (f) => { f.foundations["fluid-min"].value = 80; },
  ]) {
    const f = load("fluid"); mutate(f);
    assert.throws(() => resolveFixture(f), /Source ratio budget|Lost zoom growth/);
  }
  const f = load("fluid");
  f.roles.display.size = { value: 3, unit: "rem" };
  f.roles.display.max = { value: 99, unit: "rem" };
  assert.equal(resolveFixture(f).display.staticRem, 3);
});
