import assert from "node:assert/strict";
import test from "node:test";
import {
  CONSUMER_API_RULE_IDS,
  PRIVATE_PROPERTIES,
  VALID_DATA_ACCENT_VALUES,
  analyzeConsumerApi,
} from "./consumer-api.mjs";

function record(path, text) {
  return { path, text };
}

function findingsFor(text) {
  return analyzeConsumerApi([record("src/feature.css", text)]);
}

test("reports every private property with exact token ranges", () => {
  const text = PRIVATE_PROPERTIES.map((property, index) => `a${index} { color: var(${property}); }`).join("\n");
  const findings = findingsFor(text);

  assert.equal(findings.length, PRIVATE_PROPERTIES.length);
  assert.deepEqual(findings.map((finding) => finding.ruleId), PRIVATE_PROPERTIES.map(() => CONSUMER_API_RULE_IDS.privateProperty));
  assert.deepEqual(findings.map((finding) => finding.range), PRIVATE_PROPERTIES.map((property, index) => ({
    start: { line: index + 1, column: `a${index} { color: var(`.length + 1 },
    end: { line: index + 1, column: `a${index} { color: var(`.length + property.length + 1 },
  })));
  assert.ok(findings.every((finding) => finding.status === "fail" && finding.evidence.excerpts === undefined));
});

test("reports retired tokens, classes, and data-theme without source excerpts", () => {
  const findings = findingsFor(`
.notice { color: var(--c-fb); }
.old { color: var(--c-ac-base); }
.older { color: var(--c-ac-co-base); }
.fb { display: block; }
.notice {
  &.su, &.wn, &.dn { display: block; }
}
<section data-theme="tone"></section>`);

  assert.deepEqual(findings.map((finding) => finding.ruleId), [
    CONSUMER_API_RULE_IDS.retiredToken,
    CONSUMER_API_RULE_IDS.retiredToken,
    CONSUMER_API_RULE_IDS.retiredToken,
    CONSUMER_API_RULE_IDS.retiredClass,
    CONSUMER_API_RULE_IDS.retiredClass,
    CONSUMER_API_RULE_IDS.retiredClass,
    CONSUMER_API_RULE_IDS.retiredClass,
    CONSUMER_API_RULE_IDS.retiredDataTheme,
  ]);
  assert.ok(findings.every((finding) => finding.evidence.excerpts === undefined));
});

test("accepts every explicit data-accent route in quoted and unquoted forms", () => {
  const text = [
    '<section data-theme-name="project-owned">',
    '<section data-accent="secondary">',
    "<section data-accent='tertiary'>",
    "<section data-accent=success>",
    "[data-accent='warning'] {}",
    '[data-accent="danger"] {}',
  ].join("\n");

  assert.deepEqual(VALID_DATA_ACCENT_VALUES, ["secondary", "tertiary", "success", "warning", "danger"]);
  assert.deepEqual(findingsFor(text), []);
});

test("reports retired and unsupported explicit data-accent values", () => {
  const findings = findingsFor(`
<div data-accent='accent'>
<div data-accent="blue">
<div data-accent=>`);

  assert.deepEqual(findings.map((finding) => [finding.ruleId, finding.status, finding.range.start.line]), [
    [CONSUMER_API_RULE_IDS.retiredDataAccent, "fail", 2],
    [CONSUMER_API_RULE_IDS.unsupportedDataAccent, "fail", 3],
    [CONSUMER_API_RULE_IDS.unsupportedDataAccent, "fail", 4],
  ]);
});

test("routes data-accent expressions to review rather than pass or fail", () => {
  const findings = findingsFor(`
<div data-accent={accent}>
<div data-accent="${"${accent}"}">
<div data-accent={condition ? "success" : "warning"}>
<div :data-accent="accent">
<div [data-accent]="accent">
<div data-accent="{{ accent }}">
[data-accent=var(--accent)] {}`);

  assert.deepEqual(findings.map((finding) => [finding.ruleId, finding.status]), [
    [CONSUMER_API_RULE_IDS.dynamicDataAccent, "review"],
    [CONSUMER_API_RULE_IDS.dynamicDataAccent, "review"],
    [CONSUMER_API_RULE_IDS.dynamicDataAccent, "review"],
    [CONSUMER_API_RULE_IDS.dynamicDataAccent, "review"],
    [CONSUMER_API_RULE_IDS.dynamicDataAccent, "review"],
    [CONSUMER_API_RULE_IDS.dynamicDataAccent, "review"],
    [CONSUMER_API_RULE_IDS.dynamicDataAccent, "review"],
  ]);
});

test("uses only passed records and returns deterministic path order", () => {
  const findings = analyzeConsumerApi([
    record("z/feature.css", "a { color: var(--m-plx); }"),
    record("a/feature.css", '<div data-accent="blue">'),
  ]);

  assert.deepEqual(findings.map((finding) => [finding.path, finding.ruleId]), [
    ["a/feature.css", CONSUMER_API_RULE_IDS.unsupportedDataAccent],
    ["z/feature.css", CONSUMER_API_RULE_IDS.privateProperty],
  ]);
});

test("rejects records without a relative path and text", () => {
  assert.throws(() => analyzeConsumerApi("records"), /records must be an array/);
  assert.throws(() => analyzeConsumerApi([{ path: "../outside.css", text: "" }]), /relative POSIX path/);
  assert.throws(() => analyzeConsumerApi([{ path: "src/feature.css" }]), /text must be a string/);
});
