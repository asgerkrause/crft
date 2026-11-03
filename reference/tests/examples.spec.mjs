import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const workspace = "/examples/product-interface/";
const noOverflow = async (page) => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);

test("sidebar navigation works wide, narrow, by keyboard, and without script", async ({ page }) => {
  await page.goto(workspace);
  const navigation = page.getByRole("navigation", { name: "Workspace", exact: true });
  await expect(navigation).toBeVisible();
  const positions = await page.locator("body > header, body > main").evaluateAll((elements) => elements.map((e) => e.getBoundingClientRect().x));
  expect(positions[1]).toBeGreaterThan(positions[0]);
  await page.screenshot({ path: "evidence/sidebar-wide.png", fullPage: true, animations: "disabled" });
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(navigation).toBeHidden();
  const summary = page.getByText("Workspace navigation", { exact: true });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(navigation.getByRole("link", { name: "Invitations", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#invite-compose$/);
  await noOverflow(page);
  await page.screenshot({ path: "evidence/sidebar-narrow.png", fullPage: true, animations: "disabled" });
});

test("sidebar local form, filters, states, and themes stay truthful", async ({ page }) => {
  await page.goto(workspace);
  await page.getByLabel("Search invitations").fill("nobody");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator("#result-status")).toContainText("No invitations");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("#results tbody tr:visible")).toHaveCount(2);
  await page.getByLabel("Work email").fill("invalid");
  await page.getByRole("button", { name: "Create local draft" }).click();
  expect(await page.getByLabel("Work email").evaluate((e) => e.validity.typeMismatch)).toBe(true);
  await expect(page.locator("#results tbody tr")).toHaveCount(2);
  await page.getByLabel("Work email").fill("long-team-name-with-many-departments@northline.example");
  await page.getByRole("button", { name: "Create local draft" }).click();
  await expect(page.locator("#draft-status")).toContainText("No email sent");
  await expect(page.locator("#results tbody tr")).toHaveCount(3);
  await page.getByText("Preview result states", { exact: true }).click();
  await page.getByLabel("Demo state").selectOption("loading");
  await expect(page.locator("#results")).toHaveAttribute("aria-busy", "true");
  await page.getByLabel("Demo state").selectOption("empty");
  await expect(page.locator("#result-status")).toContainText("No invitations");
  await page.getByLabel("Demo state").selectOption("error");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByLabel("Demo state")).toBeFocused();
  await expect(page.locator("#results tbody tr:visible")).toHaveCount(3);
  for (const theme of ["light", "dark"]) {
    await page.getByLabel("Appearance").selectOption(theme);
    await expect(page.locator("html")).toHaveCSS("color-scheme", theme);
    await expect(page.locator("#invite-compose")).toHaveAttribute("data-theme", "tone");
    await page.evaluate(() => Promise.all(document.getAnimations().filter((animation) => animation instanceof CSSTransition).map((animation) => animation.finished)));
    const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(scan.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
  }
  await page.screenshot({ path: "evidence/sidebar-dark.png", fullPage: true, animations: "disabled" });
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.getByLabel("Appearance").selectOption("");
  expect(await page.locator("html").evaluate((e) => e.style.colorScheme)).toBe("");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.locator("html").evaluate((e) => { e.style.fontSize = "32px"; });
  await noOverflow(page);
  await page.getByRole("region", { name: "Invitation records" }).focus();
  await expect(page.getByRole("region", { name: "Invitation records" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await page.screenshot({ path: "evidence/sidebar-enlarged.png", fullPage: true, animations: "disabled" });
});

test("navigation survives disabled JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto(workspace);
  await expect(page.getByRole("navigation", { name: "Workspace", exact: true })).toBeVisible();
  await expect(page.getByText("This local workspace demo requires JavaScript", { exact: false })).toBeVisible();
  await context.close();
});

for (const [width, expected] of [[1440, 3], [800, 2], [375, 1]]) {
  test(`basic page grid at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/examples/foundations/");
    const tiles = await page.locator("#proof article").evaluateAll((elements) => elements.map((e) => e.getBoundingClientRect().y));
    expect(tiles.filter((y) => Math.abs(y - tiles[0]) < 1)).toHaveLength(expected);
    await noOverflow(page);
    await page.screenshot({ path: `evidence/basic-${width}.png`, fullPage: true, animations: "disabled" });
  });
}

test("all examples and root recipes render with valid local destinations", async ({ page }) => {
  for (const name of ["foundations", "page-from-brief", "page-from-reference", "branded-extension"]) {
    await page.goto(`/examples/${name}/`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    for (const width of [1440, 800, 375]) {
      await page.setViewportSize({ width, height: 900 });
      await noOverflow(page);
    }
    await page.screenshot({ path: `evidence/${name}-narrow.png`, fullPage: true, animations: "disabled" });
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/examples/page-from-reference/");
  await page.screenshot({ path: "evidence/editorial-wide.png", fullPage: true, animations: "disabled" });
  for (const profile of ["static", "fluid", "mixed"]) {
    await page.goto(`/brands/${profile}/`);
    await expect(page.locator(`main [data-fixture="${profile}"]`)).toHaveCount(1);
    expect(await page.locator("html").getAttribute("style")).toContain("--h1");
    await page.screenshot({ path: `evidence/recipe-${profile}.png`, fullPage: true, animations: "disabled" });
  }
});

test("theme changes never alter example or recipe geometry", async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [workspace, "/examples/page-from-brief/", "/brands/static/", "/brands/fluid/", "/brands/mixed/"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      const boundaries = await page.locator("[data-theme]").elementHandles();
      for (const boundary of boundaries) {
        const original = await boundary.getAttribute("data-theme");
        const geometry = () => boundary.evaluate((element) => [element, ...element.querySelectorAll("*")].map((node) => {
          const style = getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return [rect.width, rect.height, style.padding, style.margin, style.fontSize, style.lineHeight, style.fontWeight, style.letterSpacing];
        }));
        const before = await geometry();
        for (const value of [null, "accent", "invert", "tone"]) {
          await boundary.evaluate((element, theme) => theme === null ? element.removeAttribute("data-theme") : element.setAttribute("data-theme", theme), value);
          expect(await geometry(), `${route} ${width} ${value}`).toEqual(before);
        }
        await boundary.evaluate((element, value) => element.setAttribute("data-theme", value), original);
      }
    }
  }
});

const contrast = (element, focus) => {
  const context = new OffscreenCanvas(1, 1).getContext("2d");
  const luminance = (color) => {
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
      .map((c) => c / 255).map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4)
      .reduce((sum, c, i) => sum + c * [.2126, .7152, .0722][i], 0);
  };
  const style = getComputedStyle(element);
  let canvas = focus ? element.parentElement : element;
  while (getComputedStyle(canvas).backgroundColor === "rgba(0, 0, 0, 0)") canvas = canvas.parentElement;
  const values = [luminance(focus ? style.outlineColor : style.color), luminance(getComputedStyle(canvas).backgroundColor)];
  return (Math.max(...values) + .05) / (Math.min(...values) + .05);
};
const settle = (page) => page.evaluate(() => Promise.all(document.getAnimations().map((animation) => animation.finished)));

test("issue links and form actions retain contrast in both schemes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const colorScheme of ["light", "dark"]) {
    await page.emulateMedia({ colorScheme });
    await page.goto("/examples/branded-extension/");
    await settle(page);
    await expect(page.getByRole("navigation", { name: "Campaign", exact: true }).locator('a[href="#issues"]')).toHaveCount(1);
    for (const link of await page.locator("body > header a, body > footer a").all()) {
      await link.hover();
      await settle(page);
      expect(await link.evaluate(contrast, false)).toBeGreaterThanOrEqual(4.5);
    }
    for (const link of await page.locator(".issue a").all()) {
      expect(await link.evaluate(contrast, false)).toBeGreaterThanOrEqual(4.5);
      await link.focus();
      await settle(page);
      await expect(link).toBeFocused();
      expect(await link.evaluate((e) => e.matches(":focus-visible"))).toBe(true);
      expect(await link.evaluate(contrast, true)).toBeGreaterThanOrEqual(3);
      await expect(link).toHaveCSS("outline-style", "solid");
    }
    await page.goto(workspace);
    await settle(page);
    await expect(page.locator("#invite-form textarea")).toHaveCount(0);
    expect(await page.locator("#invite-form [name]").evaluateAll((fields) => fields.map((field) => field.name))).toEqual(["email", "role"]);
    for (const form of await page.locator("form").all()) {
      const submit = form.locator('[type="submit"]');
      const reset = form.locator('[type="reset"]');
      expect(await submit.evaluate((e) => getComputedStyle(e).backgroundColor)).not.toBe(await reset.evaluate((e) => getComputedStyle(e).backgroundColor));
      for (const button of [submit, reset]) expect(await button.evaluate(contrast, false)).toBeGreaterThanOrEqual(4.5);
    }
  }
});

test("every recipe visibly names its nine type roles", async ({ page }) => {
  for (const profile of ["static", "fluid", "mixed"]) {
    await page.goto(`/brands/${profile}/`);
    await expect(page.locator(".role-sample")).toHaveCount(9);
    for (const sample of await page.locator(".role-sample").all()) {
      const role = await sample.locator("[data-role]").getAttribute("data-role");
      await expect(sample.locator("span")).toHaveText(role);
      await expect(sample.locator("span")).toBeVisible();
    }
  }
});
