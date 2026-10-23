import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";
const profiles = ["fluid", "static", "mixed"].map((name) => JSON.parse(readFileSync(new URL(`../fixtures/${name}.json`, import.meta.url), "utf8")));
const source = (name) => readFileSync(new URL(`../../styles/${name}.css`, import.meta.url), "utf8");
const css = source("global").split("@import")[0] + source("tokens") + source("crft");
const size = (locator) => locator.evaluate((element) => parseFloat(getComputedStyle(element).fontSize));

test("all steps match endpoint interpolation across bounds and user root sizes", async ({ page, browser }) => {
  console.log(`Brand proof browser: ${browser.browserType().name()} ${browser.version()}`);
  await page.goto("/brands/");
  for (const rootSize of [16, 20, 32]) {
    await page.locator("html").evaluate((element, value) => { element.style.fontSize = `${value}px`; }, rootSize);
    for (const width of [240, 400, 1000, 1600, 4000]) {
      await page.setViewportSize({ width, height: 900 });
      for (const profile of profiles) {
        const f = profile.foundations;
        const progress = Math.max(0, Math.min(1, (width / rootSize - f["fluid-min"].value) / (f["fluid-max"].value - f["fluid-min"].value)));
        for (const [role, values] of Object.entries(profile.expected)) {
          const expected = (values.staticRem ?? values.minRem + (values.maxRem - values.minRem) * progress) * rootSize;
          expect(await size(page.locator(`[data-fixture="${profile.id}"] [data-role="${role}"]`)), `${profile.id}/${role} root=${rootSize} width=${width}`).toBeCloseTo(expected, 2);
        }
      }
    }
  }
});

test("theme foundations rebind, local final overrides win, literal metadata inherits", async ({ page }) => {
  await page.setContent(`<style>${css}</style><main><section><div class="c"><div data-theme="dark"><h1>Theme</h1><p>Inherited <strong>strong</strong></p></div><h1 class="small">Override</h1></div></section></main>`);
  await page.locator("html").evaluate((element) => {
    element.style.setProperty("--h1-leading", "0.9");
    element.style.setProperty("--h1-axes", '"opsz" 32');
  });
  const theme = page.locator("[data-theme]");
  await theme.evaluate((element) => {
    for (const name of ["type-min", "type-max"]) element.style.setProperty(`--${name}`, "2");
    for (const name of ["type-ratio-min", "type-ratio-max"]) element.style.setProperty(`--${name}`, "1");
    element.style.setProperty("--font", "serif"); element.style.setProperty("--font-display", "monospace");
    element.style.setProperty("--gap", "10px"); element.style.setProperty("--gap-ratio", "3");
  });
  expect(await size(theme.locator("h1"))).toBe(32);
  expect(await size(theme.locator("p"))).toBe(32);
  await expect(theme.locator("h1")).toHaveCSS("font-family", "monospace");
  await expect(theme.locator("p")).toHaveCSS("font-family", "serif");
  await expect(theme.locator("h1")).toHaveCSS("line-height", "28.8px");
  await expect(theme.locator("h1")).toHaveCSS("font-variation-settings", '"opsz" 32');
  await theme.locator("h1").evaluate((element) => { element.style.setProperty("--h1-size", "3rem"); });
  expect(await size(theme.locator("h1"))).toBe(48);
  expect(await size(page.locator("h1.small"))).toBeLessThan(20);
  const gap = await theme.evaluate((element) => { const child = document.createElement("div"); child.style.padding = "var(--gap-lg)"; element.append(child); return getComputedStyle(child).paddingTop; });
  expect(gap).toBe("30px");
});

test("independent scales and equal-foundation static modular scale", async ({ page }) => {
  await page.goto("/brands/");
  const staticBrand = page.locator('[data-fixture="static"]');
  const sizes = await staticBrand.evaluate((element) => {
    const values = {};
    for (const name of ["gap-lg", "padding-lg", "radius-lg"]) { const probe = document.createElement("i"); probe.style.paddingTop = `var(--${name})`; element.append(probe); values[name] = parseFloat(getComputedStyle(probe).paddingTop); probe.remove(); }
    for (const role of ["display", "h1", "h2", "h3", "lead", "body", "small", "label", "caption"]) element.style.removeProperty(`--${role}-size`);
    return values;
  });
  expect(sizes).toEqual({ "gap-lg": 21, "padding-lg": 27, "radius-lg": 13.5 });
  for (const width of [320, 1000, 2000]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [role, expected] of Object.entries(profiles[1].expected)) expect(await size(staticBrand.locator(`[data-role="${role}"]`))).toBeCloseTo(expected.staticRem * 16, 2);
  }
});

test("loaded variable faces preserve opsz and nested emphasis; static fallback works", async ({ page }) => {
  const fonts = [];
  page.on("response", (response) => { if (/\.woff(?:\?|$)/.test(response.url())) fonts.push(response); });
  await page.goto("/brands/");
  await page.evaluate(async () => { await document.fonts.load('550 24px "sans"'); await document.fonts.load('550 24px "mono"'); await document.fonts.ready; });
  expect(fonts.length).toBeGreaterThanOrEqual(2);
  for (const response of fonts) expect(response.ok()).toBe(true);
  expect(await page.evaluate(() => [...document.fonts].filter((face) => face.status === "loaded").map((face) => face.family))).toEqual(expect.arrayContaining(["sans", "mono"]));
  const paragraph = page.locator('[data-fixture="fluid"] [data-fixture="inherited-body"]');
  await paragraph.evaluate((element) => { element.style.fontWeight = "550"; element.style.fontVariationSettings = '"opsz" 32'; });
  await expect(paragraph).toHaveCSS("font-weight", "550");
  await expect(paragraph.locator("strong")).toHaveCSS("font-weight", "600");
  await expect(paragraph.locator("b")).toHaveCSS("font-variation-settings", '"opsz" 32');
  await paragraph.evaluate((element) => { element.style.fontFamily = "serif"; element.style.fontVariationSettings = "normal"; });
  await expect(paragraph).toHaveCSS("font-family", "serif");
  await expect(paragraph.locator("strong")).toHaveCSS("font-weight", "600");
});

test("intrinsic fit/fill works without a container for 1, 2 and 7 items", async ({ page }) => {
  await page.setContent(`<style>${css}</style><div g="fit"></div>`);
  const grid = page.locator("[g]");
  for (const mode of ["fit", "fit-sm", "fit-lg", "fill", "fill-sm", "fill-lg"]) {
    for (const width of [280, 1100]) for (const count of [1, 2, 7]) {
      const result = await grid.evaluate((element, values) => {
        element.setAttribute("g", values.mode); element.style.width = `${values.width}px`; element.innerHTML = "<div>Item</div>".repeat(values.count);
        const style = getComputedStyle(element);
        return { display: style.display, tracks: style.gridTemplateColumns.split(" ").map(parseFloat).filter((track) => track > 0), gap: parseFloat(style.columnGap), overflow: element.scrollWidth > element.clientWidth };
      }, { mode, width, count });
      const minimum = mode.endsWith("-sm") ? 240 : mode.endsWith("-lg") ? 400 : 320;
      const capacity = Math.max(1, Math.floor((width + result.gap) / (minimum + result.gap)));
      expect(result.display).toBe("grid"); expect(result.overflow).toBe(false);
      expect(result.tracks.length).toBe(mode.startsWith("fit") ? Math.min(count, capacity) : capacity);
    }
  }
  await grid.evaluate((element) => { element.innerHTML = '<div>One</div><div c="0">Full row</div>'; });
  const widths = await grid.evaluate((element) => [element.clientWidth, element.lastElementChild.getBoundingClientRect().width]);
  expect(widths[1]).toBeCloseTo(widths[0], 1);
});

test("partial subgrid, nested grids and unsupported grid features keep fallbacks", async ({ page }) => {
  const markup = '<section><div class="c" style="width:1100px"><div g="3"><div g="sg" c="2"><p c="0">Full subgrid</p></div><div g="2"><p>Nested</p><p>Nested</p></div></div></div></section><div g="3" data-fixture="outside"><p>Outside</p></div>';
  await page.setContent(`<style>${css}</style>${markup}`);
  await expect(page.locator('[g="sg"]')).toHaveCSS("grid-template-columns", "subgrid [] [] []");
  const widths = await page.locator('[g="sg"]').evaluate((element) => [element.getBoundingClientRect().width, element.firstElementChild.getBoundingClientRect().width]);
  expect(widths[1]).toBeCloseTo(widths[0], 1);
  await expect(page.locator('[data-fixture="outside"]')).toHaveCSS("display", "flex");
  await page.setContent(`<style>${css.replaceAll('grid-template-columns: subgrid;', 'grid-template-columns: unsupported;')}</style>${markup}`);
  const tracks = await page.locator('[g="sg"]').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
  expect(tracks).toBe(2);
  await page.setContent(`<style>${css.replaceAll('@container container', '@unsupported container')}</style>${markup}`);
  await expect(page.locator('[g="sg"]')).toHaveCSS("display", "flex");
});

test("unsupported pow keeps readable static text", async ({ page }) => {
  await page.setContent(`<style>${css.replace('@supports (font-size: calc(1rem * pow(2, 1)))', '@supports (unsupported: unsupported)')}</style><h1>Readable fallback</h1><p>Body</p>`);
  expect(await size(page.locator("h1"))).toBeGreaterThan(20);
  expect(await size(page.locator("p"))).toBe(14);
});

test("200% text enlargement and narrow multilingual reflow preserve content", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/brands/");
  const before = await size(page.locator('[data-fixture="fluid"] [data-role="body"]'));
  await page.locator("html").evaluate((element) => { element.style.fontSize = "200%"; });
  expect(await size(page.locator('[data-fixture="fluid"] [data-role="body"]'))).toBeCloseTo(before * 2, 2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const role of await page.locator("[data-role]").all()) {
    expect(await role.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
    expect(await role.textContent()).toContain("読みやすい設計");
  }
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  expect(await page.evaluate(() => visualViewport.scale)).toBe(2);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 1 });
});

test("custom disclosure state stays truthful and keyboard-operable", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "Controls" });
  await button.focus(); await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#styleguide-preferences")).toBeVisible();
  await page.keyboard.press("Escape"); await expect(button).toHaveAttribute("aria-expanded", "false");
});


test("full-span subgrid and fallback inherit tracks without a variable cycle", async ({ page }) => {
  for (const fallback of [false, true]) for (const width of [700, 1100]) for (const span of ["0", "0-2", "2-0"]) {
    const source = fallback ? css.replaceAll('grid-template-columns: subgrid;', 'grid-template-columns: unsupported;') : css;
    await page.setContent(`<style>${source}</style><section><div class="c" style="width:${width}px"><div g="6"><div g="sg" c="${span}"><div c="0">Full</div></div></div></div></section>`);
    const result = await page.locator('[g="sg"]').evaluate((element) => {
      const style = getComputedStyle(element);
      return { count: Number(style.getPropertyValue("--l-gc")), tracks: style.gridTemplateColumns, width: element.getBoundingClientRect().width, child: element.firstElementChild.getBoundingClientRect().width };
    });
    const activeSpan = span === "0" ? "0" : span.split("-")[width >= 960 ? 0 : 1];
    const expected = activeSpan === "0" ? 6 : 2;
    expect(result.count).toBe(expected);
    if (fallback) expect(result.tracks.split(" ").length).toBe(expected);
    else expect(result.tracks).toMatch(/^subgrid/);
    expect(result.child).toBeCloseTo(result.width, 1);
  }
});

test("contrast preference rebinds muted and borders at theme-only boundaries", async ({ page }) => {
  for (const contrast of ["more", "no-preference"]) for (const theme of ["light", "dark"]) {
    await page.emulateMedia({ contrast });
    const muted = contrast === "more" ? 90 : 78;
    const border = contrast === "more" ? 50 : 25;
    await page.setContent(`<style>${css}</style><div data-theme="${theme}"><p style="color:var(--muted);border-color:var(--border)">Actual</p><p style="color:color-mix(in srgb,var(--text) ${muted}%,var(--canvas));border-color:color-mix(in srgb,var(--text) ${border}%,transparent)">Expected</p></div>`);
    const colors = await page.locator("p").evaluateAll((elements) => elements.map((element) => { const style = getComputedStyle(element); return [style.color, style.borderTopColor]; }));
    expect(colors[0]).toEqual(colors[1]);
  }
});

test("on-color companions follow a retuned source through routes in both derivation tiers", async ({ page }) => {
  for (const sheet of [css, css.replace("@supports (color: contrast-color(red))", "@supports (unsupported: unsupported)")]) {
    await page.setContent(`<style>${sheet}</style><p data-accent="success" style="background:var(--accent);color:var(--on-accent)">Saved</p>`);
    const result = await page.evaluate(() => {
      const context = new OffscreenCanvas(1, 1).getContext("2d", { willReadFrequently: true });
      const paint = (color) => { context.fillStyle = color; context.fillRect(0, 0, 1, 1); return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]; };
      const luminance = (rgb) => rgb.map((c) => c / 255).map((c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4).reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
      const p = document.querySelector("p");
      let worst = Infinity;
      const inks = new Set();
      for (let r = 0; r < 256; r += 17) for (let g = 0; g < 256; g += 17) for (let b = 0; b < 256; b += 17) {
        document.documentElement.style.setProperty("--success", `rgb(${r} ${g} ${b})`);
        const style = getComputedStyle(p);
        const ink = paint(style.color);
        const [y1, y2] = [luminance(paint(style.backgroundColor)), luminance(ink)];
        inks.add(ink.join());
        worst = Math.min(worst, (Math.max(y1, y2) + 0.05) / (Math.min(y1, y2) + 0.05));
      }
      return { worst, inks: [...inks].sort() };
    });
    expect(result.inks).toEqual(["0,0,0", "255,255,255"]);
    expect(result.worst).toBeGreaterThanOrEqual(4.5);
  }
});
