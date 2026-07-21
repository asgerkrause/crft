import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { ADOPTION_MANIFEST, assessAdoptionIntegrity } from "./adoption-integrity.mjs";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const record = (path, value = `canonical ${path}`, kind = "file") => ({
  path,
  kind,
  byteLength: Buffer.byteLength(value),
  sha256: hash(value),
});

function fixture(overrides = {}) {
  const canonicalEntries = [{ path: "styles", kind: "directory" }, ...ADOPTION_MANIFEST.map((path) => record(path))];
  const adoptedEntries = canonicalEntries.map((entry) => ({ ...entry }));
  return {
    adoptionPath: "vendor/seess",
    canonicalEntries,
    adoptedEntries,
    importGraph: {
      entrypoint: "src/styles.css",
      edges: [{ from: "src/styles.css", to: "vendor/seess/global.css" }],
    },
    ...overrides,
  };
}

function failures(findings) {
  return findings.filter((finding) => finding.status === "fail");
}

test("accepts an exact copied manifest with one resolved entrypoint edge", () => {
  const findings = assessAdoptionIntegrity(fixture());

  assert.deepEqual(findings.map((finding) => [finding.ruleId, finding.status]), [
    ["adoption/manifest", "pass"],
    ["adoption/copied-tree-drift", "pass"],
    ["adoption/entrypoint-import", "pass"],
  ]);
  for (const finding of findings) {
    assert.equal(finding.analyzerVersion, "0.1.0");
    assert.equal(finding.seessVersion, "0.1.0");
    assert.equal(finding.classification, "deterministic");
    assert.equal(finding.evidence.state, "observed");
  }
});

test("reports missing, extra, symbolic-link, and non-regular copied entries", () => {
  const input = fixture();
  input.adoptedEntries = input.adoptedEntries
    .filter((entry) => entry.path !== "mono.ttf")
    .map((entry) => entry.path === "sans.ttf" ? { ...entry, kind: "symlink" } : entry)
    .concat(
      record("styles/extra.css"),
      { path: "styles/cache", kind: "directory" },
    );

  const result = failures(assessAdoptionIntegrity(input));
  assert.deepEqual(result.map((finding) => [finding.ruleId, finding.path]), [
    ["adoption/manifest", "vendor/seess/sans.ttf"],
    ["adoption/manifest", "vendor/seess/mono.ttf"],
    ["adoption/manifest", "vendor/seess/styles/extra.css"],
    ["adoption/manifest", "vendor/seess/styles/cache"],
  ]);
  assert.match(result.find((finding) => finding.path === "vendor/seess/sans.ttf")?.evidence.summary ?? "", /symbolic link/);
  assert.match(result.find((finding) => finding.path === "vendor/seess/styles/cache")?.evidence.summary ?? "", /directory/);
});

test("requires byte length and hash equality, including copied project.css", () => {
  const input = fixture();
  input.adoptedEntries = input.adoptedEntries.map((entry) => (
    entry.path === "styles/project.css"
      ? { ...entry, byteLength: entry.byteLength + 1 }
      : entry
  ));

  const result = failures(assessAdoptionIntegrity(input));
  assert.deepEqual(result.map((finding) => [finding.ruleId, finding.path]), [
    ["adoption/copied-tree-drift", "vendor/seess/styles/project.css"],
  ]);
  assert.match(result[0].evidence.summary, /byte length/);

  input.adoptedEntries = input.canonicalEntries.map((entry) => (
    entry.path === "styles/project.css" ? { ...entry, sha256: hash("changed") } : { ...entry }
  ));
  assert.match(failures(assessAdoptionIntegrity(input))[0].evidence.summary, /hash/);
});

test("requires exactly one resolved edge from the entrypoint to adopted global.css", () => {
  const input = fixture({
    importGraph: {
      entrypoint: "src/styles.css",
      edges: [
        { from: "src/styles.css", to: "vendor/seess/global.css" },
        { from: "src/styles.css", to: "vendor/seess/global.css" },
      ],
    },
  });

  const result = failures(assessAdoptionIntegrity(input));
  assert.deepEqual(result.map((finding) => [finding.ruleId, finding.path]), [
    ["adoption/entrypoint-import", "src/styles.css"],
  ]);
  assert.match(result[0].evidence.summary, /2 resolved entrypoint edges/);
});

test("reports a missing resolved entrypoint edge", () => {
  const result = failures(assessAdoptionIntegrity(fixture({
    importGraph: { entrypoint: "src/styles.css", edges: [] },
  })));
  assert.deepEqual(result.map((finding) => [finding.ruleId, finding.path]), [
    ["adoption/entrypoint-import", "src/styles.css"],
  ]);
  assert.match(result[0].evidence.summary, /0 resolved entrypoint edges/);
});

test("blocks integrity when static import resolution is incomplete", () => {
  const findings = assessAdoptionIntegrity(fixture({
    importGraph: {
      entrypoint: "src/styles.css",
      edges: [{ from: "src/styles.css", to: "vendor/seess/global.css" }],
      blocked: [{
        path: "src/styles.css",
        range: { start: { line: 2, column: 1 }, end: { line: 2, column: 25 } },
        blocked: "uri",
      }],
    },
  }));
  const finding = findings.find((item) => item.ruleId === "adoption/import-graph");
  assert.deepEqual(finding && [finding.status, finding.evidence.state, finding.safeNextAction.type, finding.range], [
    "blocked",
    "blocked",
    "escalate",
    { start: { line: 2, column: 1 }, end: { line: 2, column: 25 } },
  ]);
});

test("rejects malformed pure-rule inputs rather than resolving paths or traversing disk", () => {
  assert.throws(
    () => assessAdoptionIntegrity(fixture({ adoptionPath: "../outside" })),
    /adoptionPath must be a relative POSIX path/,
  );
  assert.throws(
    () => assessAdoptionIntegrity(fixture({ importGraph: { entrypoint: "src/styles.css", edges: [{}] } })),
    /importGraph edge from must be a relative POSIX path/,
  );
});
