import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { markupErrors } from "../../scripts/check-markup.mjs";

const route = "/blocks/";
const blockIds = ["hero", "clients", "about", "selected-work", "portfolio-index", "services", "case-study", "gallery", "team", "faq", "testimonials", "start"];
const placeholder = /lorem|ipsum|todo|tbd|placeholder|undefined|\[object|coming soon/i;

const fits = async (page) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const outside = await page.locator("main h1, main h2, main h3, main p, main a, main li, main dd, main dt, main summary, main address").evaluateAll((elements) => elements.filter((element) => {
    const bounds = element.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element);
    return [...range.getClientRects()].some((rect) => rect.left < bounds.left - 1 || rect.right > bounds.right + 1);
  }).map((element) => element.textContent.trim()));
  expect(outside).toEqual([]);
};

const scan = async (page) => {
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  await test.info().attach("axe", { body: JSON.stringify({ violations: result.violations, incomplete: result.incomplete }), contentType: "application/json" });
  expect(result.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
};

test("gallery renders each block as a labelled direct section with sample content", async ({ page }) => {
  const errors = [];
  const remote = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("request", (request) => { if (!request.url().startsWith("http://127.0.0.1:4321/")) remote.push(request.url()); });
  await page.goto(route);
  await expect(page).toHaveTitle("Block gallery · crft");
  await expect(page.getByRole("heading", { level: 1, name: "Block gallery" })).toBeVisible();
  expect(await page.locator("main > section").evaluateAll((elements) => elements.map((element) => element.id))).toEqual(["top", ...blockIds]);
  for (const id of blockIds) {
    const section = page.locator(`main > section#${id}`);
    if (id === "clients") expect(await section.locator("li").count()).toBeGreaterThan(2);
    else await expect(section.locator("h1, h2").first()).not.toHaveText("");
    expect(await section.locator("p, li, dd, blockquote, summary, figcaption").count()).toBeGreaterThan(1);
  }
  expect(markupErrors(await page.locator("main").innerHTML())).toEqual([]);
  expect(markupErrors(await page.locator("body > header").innerHTML())).toEqual([]);
  expect(markupErrors(await page.locator("body > footer").innerHTML())).toEqual([]);
  await expect(page.locator("script, astro-island")).toHaveCount(0);
  const text = await page.locator("body").innerText();
  expect(text.match(placeholder)).toBeNull();
  expect(errors).toEqual([]);
  expect(remote).toEqual([]);
});

test("gallery links, anchors, and images resolve locally", async ({ page }) => {
  await page.goto(route);
  const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  const ids = await page.evaluate(() => [...document.querySelectorAll("[id]")].map((element) => element.id));
  for (const href of hrefs) {
    expect(href.startsWith("#") || href.startsWith("mailto:"), href).toBe(true);
    if (href.startsWith("#")) expect(ids, href).toContain(href.slice(1));
  }
  const images = await page.locator("img").evaluateAll((elements) => elements.map((image) => ({ src: image.getAttribute("src"), alt: image.getAttribute("alt"), width: image.naturalWidth })));
  expect(images.length).toBeGreaterThanOrEqual(10);
  for (const image of images) {
    expect(image.alt, image.src).toBeTruthy();
    expect(image.width, image.src).toBeGreaterThan(0);
  }
});

for (const width of [1440, 768, 375, 320]) {
  test(`gallery blocks fit at ${width}px without clipped text or overflow`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await fits(page);
    const overlaps = await page.locator(".metrics > div").evaluateAll((groups) => groups.map((group) => {
      const [label, value] = group.children;
      return label.getBoundingClientRect().bottom <= value.getBoundingClientRect().top + 1;
    }));
    expect(overlaps.every(Boolean)).toBe(true);
  });
}

test("gallery keeps keyboard focus visible and FAQ answers open natively", async ({ page }) => {
  await page.goto(route);
  await page.keyboard.press("Tab");
  const brand = page.locator("body > header a").first();
  await expect(brand).toBeFocused();
  await expect(brand).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Tab");
  await expect(page.locator("body > header nav a").first()).toBeFocused();
  await expect(page.locator("body > header nav a").first()).toHaveCSS("outline-style", "solid");

  const summaries = page.locator("#faq summary");
  await summaries.nth(0).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#faq details").nth(0)).toHaveAttribute("open", "");
  await summaries.nth(1).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#faq details").nth(1)).toHaveAttribute("open", "");
  await expect(page.locator("#faq details").nth(0)).not.toHaveAttribute("open", "");
});

test("gallery passes WCAG 2.2 AA axe checks at desktop and narrow widths", async ({ page }) => {
  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(route);
    await scan(page);
  }
});
