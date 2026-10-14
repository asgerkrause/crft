import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
const scan = (page) => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]);

test("reference has no WCAG A/AA violations in supplied light/dark schemes", async ({ page }) => {
  await page.goto("/");
  for (const mode of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => element.setAttribute("data-theme", value), mode);
    const results = await scan(page).analyze();
    expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) })), mode).toEqual([]);
  }
});

test("synthetic brands have no WCAG A/AA violations", async ({ page }) => {
  await page.goto("/brands/");
  const results = await scan(page).analyze();
  expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
});
