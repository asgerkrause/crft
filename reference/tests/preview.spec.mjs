import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

const bars = (page) => page.locator(".sg-motion-track > i");

test("preview reading roles stay readable while actual samples remain fluid", async ({ page }) => {
  for (const width of [320, 375, 768, 1440, 1600]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator(".section-name-sticky p").first()).toHaveCSS("font-size", "16px");
    await expect(page.locator(".sg-heading-wrap > h2").first()).toHaveCSS("font-size", "24px");
    await expect(page.locator(".sg-heading-wrap > h3").first()).toHaveCSS("font-size", "20px");
    const scaleHeadings = page.locator(".sg-scale-family h3");
    await expect(scaleHeadings).toHaveText(["Spacing", "Gap", "Padding", "Radius"]);
    for (const heading of await scaleHeadings.all()) {
      await expect(heading).toHaveCSS("font-size", "20px");
      await expect(heading).toHaveCSS("font-weight", "600");
    }
    const sizes = await page.locator(".sg-swatch figcaption, .sg-swatch code, .sg-motion-speed label, .sg-motion-speed code").evaluateAll((elements) => elements.map((element) => parseFloat(getComputedStyle(element).fontSize)));
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(14);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(".sg-type-samples > figure")).toHaveCount(6);
    await expect(page.locator(".sg-type-samples .body")).toHaveCount(2);
  }
  await page.locator("html").evaluate((element) => { element.style.fontSize = "32px"; });
  await expect(page.locator(".section-name-sticky p").first()).toHaveCSS("font-size", "32px");
  await expect(page.locator(".sg-swatch code").first()).toHaveCSS("font-size", "28px");
});

test("section index reaches every topic by keyboard and token families cover the live catalog", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const summary = page.locator(".sg-section-index > summary");
  const nav = page.getByRole("navigation", { name: "Reference sections" });
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(nav).toBeVisible();
  const targets = await page.locator("main > section[id]").evaluateAll((elements) => elements.map((element) => `#${element.id}`).sort());
  const links = await page.locator(".sg-logo, .sg-rail-nav a").evaluateAll((elements) => elements.map((element) => element.getAttribute("href")).sort());
  expect([...new Set(links)]).toEqual(targets);
  await nav.getByRole("link", { name: "Motion", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#motion$/);
  await expect(nav).toBeHidden();
  await expect(page.locator("#motion")).toBeFocused();
  await summary.click();
  await expect(nav.getByRole("link", { name: "Motion", exact: true })).toHaveAttribute("aria-current", "location");
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  const source = readFileSync(new URL("../../styles/tokens.css", import.meta.url), "utf8");
  const names = [...new Set([...source.matchAll(/(--[a-z][a-z0-9-]*)\s*:/g)].map((match) => match[1]))].sort();
  expect((await page.locator(".sg-token-index code").allTextContents()).sort()).toEqual(names);
  for (const link of await page.locator(".sg-token-families a").all()) {
    const href = await link.getAttribute("href");
    await expect(page.locator(href)).toHaveCount(1);
  }
});

test("motion replay is synchronized, finite, repeatable, and equal across widths", async ({ page }) => {
  await page.goto("/#motion-roles");
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const widths = await page.locator(".sg-motion-track").evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
    expect(new Set(widths).size).toBe(1);
  }
  expect(await bars(page).evaluateAll((elements) => elements.flatMap((element) => element.getAnimations()).length)).toBe(0);
  const frames = await page.locator(".sg-motion-groups").evaluate((group) => {
    group.querySelector("button").click();
    return [...group.querySelectorAll(".sg-motion-track > i")].map((bar) => {
      const animation = bar.getAnimations()[0];
      const timing = animation.effect.getTiming();
      const start = animation.startTime;
      animation.pause();
      animation.currentTime = 400;
      return { start, duration: timing.duration, iterations: timing.iterations, transform: getComputedStyle(bar).transform };
    });
  });
  expect(new Set(frames.map((frame) => frame.start)).size).toBe(1);
  expect(frames.map((frame) => frame.duration)).toEqual([800, 800, 800, 800, 800]);
  expect(frames.every((frame) => frame.iterations === 1)).toBe(true);
  expect(new Set(frames.map((frame) => frame.transform)).size).toBeGreaterThan(2);
  // A new replay replaces even paused runs, rather than layering another animation.
  const replay = page.getByRole("button", { name: "Replay from start" });
  await replay.focus();
  await page.keyboard.press("Enter");
  expect(await bars(page).evaluateAll((elements) => elements.map((element) => element.getAnimations().length))).toEqual([1, 1, 1, 1, 1]);
  await expect.poll(() => bars(page).evaluateAll((elements) => elements.flatMap((element) => element.getAnimations()).length)).toBe(0);
  const endpoint = await bars(page).evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
  await page.getByRole("radio", { name: "Slowest --duration-xl", exact: true }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("radio", { name: "Slow --duration-lg", exact: true })).toBeChecked();
  const durations = await page.locator(".sg-motion-groups").evaluate((group) => {
    group.querySelector("button").click();
    return [...group.querySelectorAll(".sg-motion-track > i")].map((bar) => bar.getAnimations()[0].effect.getTiming().duration);
  });
  expect(durations).toEqual([400, 400, 400, 400, 400]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await replay.click();
  expect(await bars(page).evaluateAll((elements) => elements.flatMap((element) => element.getAnimations()).length)).toBe(0);
  expect(await bars(page).evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width))).toEqual(endpoint);
});

test("preview keeps navigation and completed motion without scripts", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 320, height: 812 } });
  const page = await context.newPage();
  await page.goto("/#motion-roles");
  await expect(page.locator(".sg-motion-controls")).toBeHidden();
  const dimensions = await bars(page).evaluateAll((elements) => elements.map((element) => ({ width: element.getBoundingClientRect().width, track: element.parentElement.getBoundingClientRect().width, transform: getComputedStyle(element).transform })));
  expect(dimensions.every(({ width, track, transform }) => Math.abs(width / track - .8) < .01 && transform === "none")).toBe(true);
  await page.locator(".sg-section-index > summary").click();
  await page.getByRole("navigation", { name: "Reference sections" }).getByRole("link", { name: "Tokens", exact: true }).click();
  await expect(page).toHaveURL(/#tokens$/);
  await context.close();
});
