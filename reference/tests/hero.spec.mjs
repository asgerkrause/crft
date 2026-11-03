import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { markupErrors } from "../../scripts/check-markup.mjs";

const route = "/recipes/hero/";
const actionLabel = "Read the workshop plan";
const fields = ["heading", "summary", "actionLabel", "actionHref", "detailHeading", "detail"];
const useFixture = (page, selector) => page.locator(selector).evaluate((template) => {
  document.querySelector("main > section").replaceWith(template.content.cloneNode(true));
});
const fits = async (page) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const outside = await page.locator("main h1, main h2, main p, main a").evaluateAll((elements) => elements.filter((element) => {
    const bounds = element.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element);
    return [...range.getClientRects()].some((rect) => rect.left < bounds.left - 1 || rect.right > bounds.right + 1);
  }).map((element) => element.textContent));
  expect(outside).toEqual([]);
  expect(await page.locator("main, main section, .hero, .hero div, .hero aside, .hero h1, .hero p, .hero a").evaluateAll((elements) =>
    elements.filter((element) => ["hidden", "clip"].includes(getComputedStyle(element).overflowY)).map((element) => element.tagName))).toEqual([]);
};
const screenshot = (page, name) => page.screenshot({ path: `evidence/hero-${name}.png`, fullPage: true, animations: "disabled" });
const scan = async (page) => {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  await test.info().attach("axe", { body: JSON.stringify({ violations: result.violations, incomplete: result.incomplete }), contentType: "application/json" });
  expect(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
};

test("hero keeps supplied content, metadata, semantics, and local destination", async ({ page, baseURL }) => {
  const errors = [];
  const remote = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (new URL(request.url()).origin !== new URL(baseURL).origin) remote.push(request.url()); });
  await page.goto(route);
  await expect(page).toHaveTitle("Chair repair workshop · Synthetic hero");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /synthetic chair-repair workshop/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Repair a chair worth keeping.");
  await expect(page.locator(".hero .lead")).toHaveText("A hands-on workshop for the chair you cannot quite give up. Learn to find the loose joint and plan a lasting repair.");
  await expect(page.locator(".hero aside h2")).toHaveText("Bring one wooden chair.");
  await expect(page.locator(".hero aside p")).toHaveText("Choose a chair with a loose joint and a story. We will inspect it together before choosing tools or taking anything apart.");
  await expect(page.getByRole("link", { name: actionLabel, exact: true })).toHaveAttribute("href", "#workshop-plan");
  expect(await page.locator("main").ariaSnapshot()).toContain('- heading "Repair a chair worth keeping." [level=1]');
  expect(await page.locator(".hero h1, .hero p, .hero a, .hero h2").evaluateAll((elements) => elements.map((element) => element.tagName))).toEqual(["H1", "P", "A", "H2", "P"]);
  expect(markupErrors(await page.locator("main").innerHTML())).toEqual([]);
  await expect(page.locator("script, astro-island")).toHaveCount(0);
  expect(errors).toEqual([]);
  expect(remote).toEqual([]);
});

for (const width of [1440, 832, 831, 768, 375, 320]) {
  test(`hero composition fits at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    const wide = await page.locator("#hero > .c").evaluate((element) =>
      element.getBoundingClientRect().width >= 48 * parseFloat(getComputedStyle(document.documentElement).fontSize),
    );
    const geometry = await page.locator(".hero > div, .hero > aside").evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom };
    }));
    if (wide) expect(geometry[1].x).toBeGreaterThanOrEqual(geometry[0].right);
    else expect(geometry[1].y).toBeGreaterThanOrEqual(geometry[0].bottom);
    await fits(page);
    await screenshot(page, String(width));
    if (width === 1440) {
      await page.locator("html").evaluate((element) => { element.style.filter = "blur(6px)"; });
      await screenshot(page, "squint");
    }
  });
}

for (const colorScheme of ["light", "dark"]) {
  test(`hero keyboard, contrast, and accessibility in ${colorScheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto(route);
    await page.keyboard.press("Tab");
    const action = page.getByRole("link", { name: actionLabel, exact: true });
    await expect(action).toBeFocused();
    await expect(action).toHaveCSS("outline-style", "solid");
    expect(await action.evaluate((element) => element.matches(":focus-visible") && parseFloat(getComputedStyle(element).outlineWidth) >= 2)).toBe(true);
    const contrast = await action.evaluate((element) => {
      const context = new OffscreenCanvas(1, 1).getContext("2d");
      const luminance = (color) => {
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
          .map((value) => value / 255).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
          .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
      };
      const style = getComputedStyle(element);
      const canvas = getComputedStyle(document.body).backgroundColor;
      const ratio = (a, b) => (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      return {
        text: ratio(luminance(style.color), luminance(style.backgroundColor)),
        ring: ratio(luminance(style.outlineColor), luminance(canvas)),
      };
    });
    expect(contrast.text).toBeGreaterThanOrEqual(4.5);
    expect(contrast.ring).toBeGreaterThanOrEqual(3);
    const size = await action.boundingBox();
    expect(size.height).toBeGreaterThanOrEqual(44);
    expect(size.width).toBeGreaterThanOrEqual(44);
    await screenshot(page, `focus-${colorScheme}`);
    await scan(page);
    await action.hover();
    await expect(action).toHaveCSS("text-decoration-line", "underline");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#workshop-plan$/);
    await expect(page.locator("#workshop-plan")).toBeFocused();
    await expect(page.getByRole("heading", { name: "The workshop plan", exact: true })).toBeInViewport();
    await screenshot(page, `destination-${colorScheme}`);
  });
}

test("hero long content survives narrow layout and actual text doubling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(route);
  await useFixture(page, "#long-content");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Repair the much-loved wooden chair that has traveled between kitchens, homes, and generations.");
  await expect(page.locator(".hero aside p")).toContainText("ChairRepairWorkshopPreparationNotesForTheLongRememberedKitchenChair");
  await expect(page.locator(".hero a")).toHaveText("Read the complete workshop plan and preparation notes before bringing your chair");
  await expect(page.locator(".hero a")).toHaveAttribute("href", "#workshop-plan");
  await fits(page);
  await screenshot(page, "long");
  await scan(page);
  const heading = page.getByRole("heading", { level: 1 });
  const headingSize = await heading.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
  await page.locator("h1, h2, p, a").evaluateAll((elements) => {
    const sizes = elements.map((element) => parseFloat(getComputedStyle(element).fontSize));
    elements.forEach((element, index) => { element.style.fontSize = `${sizes[index] * 2}px`; });
  });
  await expect(heading).toHaveCSS("font-size", `${headingSize * 2}px`);
  const fragments = await heading.evaluate((element) => ["between", "kitchens"].map((word) => {
    const text = element.firstChild;
    const start = text.textContent.indexOf(word);
    const lines = new Map();
    for (let index = 0; index < word.length; index++) {
      const range = document.createRange();
      range.setStart(text, start + index);
      range.setEnd(text, start + index + 1);
      const top = range.getBoundingClientRect().top;
      lines.set(top, (lines.get(top) ?? "") + word[index]);
    }
    return [...lines.values()];
  }));
  expect(fragments.flat().filter((fragment) => fragment.length === 1)).toEqual([]);
  await fits(page);
  await screenshot(page, "text-200");
  await page.keyboard.press("Tab");
  await expect(page.locator(".hero a")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#workshop-plan")).toBeFocused();
});

test("hero responds to container width, root text size, and CSS zoom", async ({ page }) => {
  await page.goto(route);
  await page.locator("main").evaluate((element) => { element.style.inlineSize = "375px"; });
  await fits(page);
  await screenshot(page, "container");
  await page.locator("main").evaluate((element) => { element.style.inlineSize = ""; });
  await page.locator("html").evaluate((element) => { element.style.fontSize = "200%"; });
  await fits(page);
  await screenshot(page, "root-200");
  await page.locator("html").evaluate((element) => { element.style.fontSize = ""; element.style.zoom = "2"; });
  await fits(page);
  await screenshot(page, "zoom-200");
});

for (const field of fields) {
  test(`hero visibly rejects missing ${field}`, async ({ page }) => {
    await page.goto(route);
    await useFixture(page, `template[data-missing="${field}"]`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hero content needs attention");
    await expect(page.locator(".hero p")).toHaveText(`Provide nonempty values for: ${field}.`);
    await expect(page.locator(".hero a")).toHaveCount(0);
    if (field === "heading") await screenshot(page, "missing");
  });
}

test("hero rejects unsafe destinations and escapes markup-looking copy", async ({ page }) => {
  await page.goto(route);
  await useFixture(page, "#invalid-destination");
  await expect(page.locator(".hero p")).toHaveText("Provide a local fragment for actionHref.");
  await expect(page.locator(".hero a")).toHaveCount(0);
  await useFixture(page, "#escaped-content");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText('A chair <img src=x onerror="alert(1)"> worth keeping');
  await expect(page.locator(".hero img")).toHaveCount(0);
});

test("hero retains native behavior without JavaScript and under user preferences", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 812 }, reducedMotion: "reduce", forcedColors: "active" });
  const page = await context.newPage();
  await page.goto(route);
  await page.keyboard.press("Tab");
  const action = page.getByRole("link", { name: actionLabel });
  await expect(action).toBeFocused();
  await expect(action).toHaveCSS("outline-style", "solid");
  await expect(action).toHaveCSS("border-top-style", "solid");
  expect(await action.evaluate((element) => getComputedStyle(element).transitionDuration.split(",").every((value) => parseFloat(value) <= .01))).toBe(true);
  await screenshot(page, "forced-colors");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#workshop-plan$/);
  await context.close();
});

test("hero consumes only public crft tokens", () => {
  const source = readFileSync(new URL("../../recipes/Hero.astro", import.meta.url), "utf8");
  const tokens = readFileSync(new URL("../../styles/tokens.css", import.meta.url), "utf8");
  const publicNames = new Set([...tokens.matchAll(/(--[a-z][a-z0-9-]*)\s*:/g)].map((match) => match[1]));
  for (const [, name] of source.matchAll(/var\((--[\w-]+)/g)) expect(publicNames.has(name), name).toBe(true);
  expect(source).not.toMatch(/--_|<script|set:html|overflow:\s*(?:hidden|clip)/);
});
