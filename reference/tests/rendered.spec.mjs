import { expect, test } from "@playwright/test";

const fixture = (page, name) => page.locator(`[data-fixture="${name}"]`);

function contrastRatio(foreground, background) {
  const luminance = (value) => {
    const channels = value.match(/[\d.]+/g).slice(0, 3).map((channel) => {
      const normalized = Number(channel) / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const values = [luminance(foreground), luminance(background)].sort((left, right) => right - left);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("container grids resolve independently and no-container grids retain fallback", async ({ page }) => {
  await page.goto("/#grid");

  await expect(fixture(page, "grid-sm")).toHaveCSS("display", "flex");
  await expect(fixture(page, "grid-no-container-grid")).toHaveCSS("display", "flex");

  await fixture(page, "grid-boundary-lg").evaluate((boundary) => {
    boundary.style.width = "1100px";
    const container = boundary.querySelector(":scope > .c");
    container.style.width = "100%";
    container.style.maxWidth = "none";
  });
  await expect(fixture(page, "grid-lg")).toHaveCSS("display", "grid");

  const columns = await fixture(page, "grid-lg").evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(" ").filter(Boolean).length,
  );
  expect(columns).toBe(3);
});

test("fluid type clamps, interpolates, inherits, and respects explicit roles", async ({ page }) => {
  const size = (name) => fixture(page, name).evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));

  await page.setViewportSize({ width: 400, height: 900 });
  await page.goto("/#long-content");

  const minimum = {
    body: await page.locator("body").evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    inherited: await size("type-inherited-item"),
    semantic: await size("type-semantic-heading"),
    override: await size("type-visual-override"),
  };
  expect(minimum.body).toBeCloseTo(14, 1);
  expect(minimum.inherited).toBeCloseTo(minimum.body, 2);
  expect(minimum.semantic).toBeCloseTo(16.1, 1);
  expect(minimum.override).toBeCloseTo(24.486, 1);

  await page.setViewportSize({ width: 1000, height: 900 });
  const midpoint = await size("type-visual-override");
  expect(midpoint).toBeGreaterThan(minimum.override);

  await page.setViewportSize({ width: 1600, height: 900 });
  const maximum = {
    body: await page.locator("body").evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    override: await size("type-visual-override"),
  };
  expect(maximum.body).toBeCloseTo(20, 1);
  expect(maximum.override).toBeCloseTo(76.832, 1);
  expect(midpoint).toBeLessThan(maximum.override);
});

test("keyboard order follows source order despite visual reordering", async ({ page }) => {
  await page.goto("/#visual-order-focus");
  const grid = fixture(page, "visual-order-focus");
  await grid.evaluate((element) => {
    const container = element.closest("section")?.querySelector(":scope > .c") ?? element.closest(".c");
    container.style.width = "1100px";
    container.style.maxWidth = "none";
  });
  await expect(grid).toHaveCSS("display", "grid");

  const links = ["visual-order-first", "visual-order-second", "visual-order-third"];
  const orders = await Promise.all(links.map((name) => fixture(page, name).evaluate((element) => getComputedStyle(element).order)));
  expect(orders).toEqual(["2", "-2", "0"]);

  await fixture(page, links[0]).focus();
  const focused = [await page.locator(":focus").getAttribute("data-fixture")];
  for (let index = 1; index < links.length; index += 1) {
    await page.keyboard.press("Tab");
    focused.push(await page.locator(":focus").getAttribute("data-fixture"));
  }
  expect(focused).toEqual(links);
  await expect(fixture(page, "visual-order-third")).toHaveCSS("outline-style", "solid");
});

test("native disclosure, hidden state, and dialog remain operable", async ({ page }) => {
  await page.goto("/#native-state");

  const details = fixture(page, "native-details");
  await expect(details).not.toHaveAttribute("open", "");
  await details.locator("summary").click();
  await expect(details).toHaveAttribute("open", "");
  await expect(fixture(page, "native-hidden")).toBeHidden();

  await fixture(page, "native-dialog-trigger").click();
  await expect(fixture(page, "native-dialog")).toHaveAttribute("open", "");
  await fixture(page, "native-dialog").getByRole("button", { name: "Close dialog" }).click();
  await expect(fixture(page, "native-dialog")).not.toHaveAttribute("open", "");
});

test("reduced-motion preference resolves public motion durations to near zero", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#motion-roles");
  const durations = await fixture(page, "reduced-motion").evaluate((element) => {
    const style = getComputedStyle(element);
    return ["--m-td-sf", "--m-td-f", "--m-td", "--m-td-s", "--m-td-ss"].map((token) => style.getPropertyValue(token).trim());
  });
  expect(durations.map((duration) => Number.parseFloat(duration))).toEqual([0.001, 0.001, 0.001, 0.001, 0.001]);
});

test("image scrub travels in opposite directions and keeps static media and labels", async ({ page }) => {
  await page.goto("/#scroll-linked-motion");
  expect(await page.evaluate(() => CSS.supports("animation-timeline", "view()"))).toBe(true);

  const figures = [fixture(page, "progressive-scroll-default"), fixture(page, "progressive-scroll-reverse")];
  const translations = async () => Promise.all(figures.map((figure) => figure.locator("img").evaluate((image) => {
    const translate = getComputedStyle(image).translate;
    return Number.parseFloat(translate.split(" ").at(-1));
  })));

  await figures[0].evaluate((element) => window.scrollTo(0, element.offsetTop - window.innerHeight * 0.8));
  await page.waitForTimeout(100);
  const before = await translations();
  await page.evaluate(() => window.scrollBy(0, window.innerHeight * 0.6));
  await page.waitForTimeout(100);
  const after = await translations();
  const deltas = after.map((value, index) => value - before[index]);
  expect(Math.abs(deltas[0])).toBeGreaterThan(1);
  expect(Math.abs(deltas[1])).toBeGreaterThan(1);
  expect(Math.sign(deltas[0])).toBe(-Math.sign(deltas[1]));
  for (const caption of await page.locator(".sg-scroll-example figcaption").all()) await expect(caption).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const reduced = await Promise.all([
    fixture(page, "progressive-scroll-default"),
    fixture(page, "progressive-scroll-reverse"),
  ].map((figure) => figure.locator("img").evaluate((image) => ({
    height: image.getBoundingClientRect().height,
    translate: getComputedStyle(image).translate,
    width: image.getBoundingClientRect().width,
  }))));
  for (const image of reduced) {
    expect(image.translate).toBe("none");
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
  }
  for (const caption of await page.locator(".sg-scroll-example figcaption").all()) await expect(caption).toBeVisible();
});

test("accent skin follows every active route across presets and schemes", async ({ page }) => {
  await page.goto("/#accent-skins");
  const root = page.locator("html");
  const routes = [
    ["skin-accent-primary", "--c-ac"],
    ["skin-accent-secondary", "--c-sc"],
    ["skin-accent-tertiary", "--c-tr"],
    ["skin-accent-success", "--c-fb-su"],
    ["skin-accent-warning", "--c-fb-wn"],
    ["skin-accent-danger", "--c-fb-dn"],
  ];
  for (const preset of ["core", "claude", "openai", "github", "supabase"]) {
    for (const mode of ["light", "dark"]) {
      await root.evaluate((element, values) => {
        element.setAttribute("data-mode", values.mode);
        element.setAttribute("data-preset", values.preset);
      }, { mode, preset });
      for (const [name, token] of routes) {
        const colors = await fixture(page, name).evaluate((element, expectedToken) => {
          const routed = document.createElement("i");
          const expected = document.createElement("i");
          routed.style.backgroundColor = "var(--c-ac)";
          expected.style.backgroundColor = `var(${expectedToken})`;
          element.append(routed, expected);
          const result = [getComputedStyle(routed).backgroundColor, getComputedStyle(expected).backgroundColor];
          routed.remove();
          expected.remove();
          return result;
        }, token);
        expect(colors[0], `${preset} ${mode} ${name}`).toBe(colors[1]);
      }
    }
  }
});

test("nested skin boundary resets semantic colors", async ({ page }) => {
  await page.goto("/#nested-boundaries");
  const outer = fixture(page, "skin-nested-outer");
  const inner = fixture(page, "skin-nested-inner");
  await expect(outer).toHaveCSS("background-color", /rgb/);
  expect(await outer.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(await inner.evaluate((element) => getComputedStyle(element).backgroundColor));
});

test("muted text meets WCAG AA across skins, presets, and both schemes", async ({ page }) => {
  await page.goto("/#skins");
  const root = page.locator("html");
  const cards = page.locator("#skins [data-skin]");

  for (const preset of ["core", "claude", "openai", "github", "supabase"]) {
    for (const mode of ["light", "dark"]) {
      await root.evaluate((element, values) => {
        element.setAttribute("data-mode", values.mode);
        element.setAttribute("data-preset", values.preset);
      }, { mode, preset });
      const colors = await cards.evaluateAll((elements) => elements.map((element) => {
        const sample = document.createElement("span");
        sample.className = "c-mu";
        sample.textContent = "Muted";
        element.append(sample);
        const foreground = getComputedStyle(sample).color;
        const background = getComputedStyle(element).backgroundColor;
        sample.remove();

        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.fillStyle = background;
        context.fillRect(0, 0, 1, 1);
        const backgroundPixel = context.getImageData(0, 0, 1, 1).data;
        context.fillStyle = foreground;
        context.fillRect(0, 0, 1, 1);
        const foregroundPixel = context.getImageData(0, 0, 1, 1).data;
        return {
          foreground: `rgb(${foregroundPixel[0]}, ${foregroundPixel[1]}, ${foregroundPixel[2]})`,
          background: `rgb(${backgroundPixel[0]}, ${backgroundPixel[1]}, ${backgroundPixel[2]})`,
        };
      }));
      for (const color of colors) {
        expect(contrastRatio(color.foreground, color.background), `${preset} ${mode} ${JSON.stringify(color)}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  }
});
