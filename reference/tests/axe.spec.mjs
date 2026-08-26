import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const scan = (page) => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);

/* craft/color.md documents the muted role as a deliberate sub-AA secondary tone, never a
   body-text role. A contrast violation is accepted only when the element's computed color
   is the muted role resolved in its own context; everything else stays a failure. */
const isDocumentedMuted = (page, target) =>
  page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    /* --sg-muted resolves at its body-level declaration, --c-mu re-routes per skin
       boundary, so a muted element can carry either computed value. */
    return ["var(--c-mu)", "var(--sg-muted)"].some((muted) => {
      const probe = document.createElement("i");
      probe.style.color = muted;
      element.parentElement.append(probe);
      const match = getComputedStyle(element).color === getComputedStyle(probe).color;
      probe.remove();
      return match;
    });
  }, target);

/* Open accessibility findings awaiting a system-level decision. This register must only
   shrink. Each entry names the defect; new violations still fail the suite.
   - t="ac" and t="sc" put raw accent sources on text; the routed --c-ac-fg role is the
     readable alternative (craft/color.md, craft/type.md own the call).
   - base.css strips link underlines, so a link inside a text block is color-only (WCAG 1.4.1).
   - The dialog trigger and the checked motion label inherit those same open decisions. */
const openFindings = [
  { id: "color-contrast", target: 'p[t="ac"]' },
  { id: "color-contrast", target: 'p[t="sc"]' },
  { id: "color-contrast", target: 'button[data-fixture="native-dialog-trigger"]' },
  { id: "color-contrast", target: ".sg-motion-speed > div > label:nth-child(5)" },
  { id: "color-contrast", target: "label:nth-child(5) > code" },
  { id: "link-in-text-block", target: 'a[href$="#native-dialog"]' },
];

async function unexplainedViolations(page, results) {
  const violations = [];
  for (const violation of results.violations) {
    const nodes = [];
    for (const node of violation.nodes) {
      const target = node.target.join(" ");
      if (violation.id === "color-contrast" && (await isDocumentedMuted(page, target))) continue;
      if (openFindings.some((finding) => finding.id === violation.id && finding.target === target)) continue;
      nodes.push(target);
    }
    if (nodes.length > 0) violations.push({ id: violation.id, impact: violation.impact, targets: nodes.slice(0, 5) });
  }
  return violations;
}

test("reference page has no undocumented WCAG A/AA violations in light and dark schemes", async ({ page }) => {
  await page.goto("/");
  for (const mode of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => element.setAttribute("data-mode", value), mode);
    const results = await scan(page).analyze();
    expect(await unexplainedViolations(page, results), `mode=${mode}`).toEqual([]);
  }
});

test("skin canvases have no undocumented color-contrast violations", async ({ page }) => {
  await page.goto("/#skins");
  const results = await scan(page).include("#skins").analyze();
  expect(await unexplainedViolations(page, results)).toEqual([]);
});
