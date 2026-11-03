import { expect, test } from "@playwright/test";

const fixture = (page, name) => page.locator(`[data-fixture="${name}"]`);

test("layout specimens reveal caps, gaps, real lengths, and grid tracks", async ({ page }) => {
  for (const width of [1440, 960, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const widths = await page.locator(".sg-width-specimens > .c").evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
    if (width === 1440) expect(widths).toEqual([384, 576, 768]);
    if (width === 375) expect(new Set(widths).size).toBe(1);
    const stacks = await page.locator(".sg-stack-sample").evaluateAll((elements) => elements.map((element) => {
      const [first, second] = element.children;
      return { gap: second.getBoundingClientRect().top - first.getBoundingClientRect().bottom, itemHeight: first.getBoundingClientRect().height };
    }));
    expect(stacks.map((stack) => stack.gap)).toEqual([20, 40]);
    expect(stacks[0].itemHeight).toBe(stacks[1].itemHeight);
    const lengths = await page.locator(".sg-measure i").evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
    expect(lengths).toEqual([20, 40, 80, 160, 320]);
    for (const suffix of ["-sm", "", "-lg"]) {
      const fit = await page.locator(`[g="fit${suffix}"] > span`).first().boundingBox();
      const fill = await page.locator(`[g="fill${suffix}"] > span`).first().boundingBox();
      if (width === 1440) expect(fit.width).toBeGreaterThan(fill.width);
    }
    expect(await page.locator(".sg-grid-list [g] > *").evaluateAll((elements) => elements.every((element) => element.scrollWidth <= element.clientWidth + 1))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

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
    body: await size("type-body-text"),
    inherited: await size("type-inherited-item"),
    semantic: await size("type-semantic-heading"),
    override: await size("type-visual-override"),
  };
  expect(minimum.body).toBeCloseTo(14, 1);
  expect(minimum.inherited).toBeCloseTo(minimum.body, 2);
  expect(minimum.semantic).toBeCloseTo(18.515, 1);
  expect(minimum.override).toBeCloseTo(24.486, 1);

  await page.setViewportSize({ width: 1000, height: 900 });
  const midpoint = await size("type-visual-override");
  expect(midpoint).toBeGreaterThan(minimum.override);

  await page.setViewportSize({ width: 1600, height: 900 });
  const maximum = {
    body: await size("type-body-text"),
    override: await size("type-visual-override"),
  };
  expect(maximum.body).toBeCloseTo(20, 1);
  expect(maximum.override).toBeCloseTo(76.832, 1);
  expect(midpoint).toBeLessThan(maximum.override);
});

test("fluid type doubles with root font size at the clamp ends", async ({ page }) => {
  const readSizes = () => page.evaluate(() => ({
    body: Number.parseFloat(getComputedStyle(document.querySelector('[data-fixture="type-body-text"]')).fontSize),
    heading: Number.parseFloat(getComputedStyle(document.querySelector("[data-fixture=\"type-semantic-heading\"]")).fontSize),
  }));
  const zoomRoot = () => page.evaluate(() => {
    document.documentElement.style.fontSize = "32px";
  });
  const resetRoot = () => page.evaluate(() => {
    document.documentElement.style.fontSize = "";
  });

  await page.setViewportSize({ width: 400, height: 900 });
  await page.goto("/#long-content");
  const atMin = await readSizes();
  await zoomRoot();
  const atMinZoomed = await readSizes();
  expect(Math.abs(atMinZoomed.body - atMin.body * 2)).toBeLessThanOrEqual(0.5);
  expect(atMinZoomed.heading / atMin.heading).toBeGreaterThanOrEqual(1.9);

  await resetRoot();
  await page.setViewportSize({ width: 1600, height: 900 });
  const atMax = await readSizes();
  await zoomRoot();
  const atMaxZoomed = await readSizes();
  expect(atMaxZoomed.body / atMax.body).toBeGreaterThanOrEqual(1.3);
  // h4 now uses h3 (step 2); assert its actual rem-bound interpolation.
  expect(atMaxZoomed.heading).toBeCloseTo((18.515 + (39.2 - 18.515) / 3) * 2, 2);

  await resetRoot();
  await page.setViewportSize({ width: 1000, height: 900 });
  const atMid = await readSizes();
  await zoomRoot();
  const atMidZoomed = await readSizes();
  expect(atMidZoomed.body / atMid.body).toBeGreaterThanOrEqual(1.3);
  expect(atMidZoomed.heading / atMid.heading).toBeGreaterThanOrEqual(1.3);
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
    return ["--duration-xs", "--duration-sm", "--duration", "--duration-lg", "--duration-xl"].map((token) => style.getPropertyValue(token).trim());
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

  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    for (const figure of figures) {
      for (const progress of [0, .25, .5, .75, 1]) {
        await figure.evaluate((element, value) => {
          const bounds = element.getBoundingClientRect();
          window.scrollTo(0, bounds.top + scrollY - innerHeight + (innerHeight + bounds.height) * value);
        }, progress);
        await expect.poll(() => figure.evaluate((element) => {
          const frame = element.getBoundingClientRect();
          const image = element.querySelector("img").getBoundingClientRect();
          return Math.max(image.top - frame.top, frame.bottom - image.bottom, Math.abs(image.height - frame.height - innerHeight * .08), Math.abs(frame.height - frame.width * 7 / 12));
        })).toBeLessThan(1);
      }
    }
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  const reduced = await Promise.all([
    fixture(page, "progressive-scroll-default"),
    fixture(page, "progressive-scroll-reverse"),
  ].map((figure) => figure.locator("img").evaluate((image) => ({
    height: image.getBoundingClientRect().height,
    frameHeight: image.parentElement.getBoundingClientRect().height,
    translate: getComputedStyle(image).translate,
    width: image.getBoundingClientRect().width,
  }))));
  for (const image of reduced) {
    expect(image.translate).toBe("none");
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
    expect(image.height).toBeCloseTo(image.frameHeight, 1);
  }
  for (const caption of await page.locator(".sg-scroll-example figcaption").all()) await expect(caption).toBeVisible();
});

test("image crop stays complete without view timeline support", async ({ page }) => {
  let replaced = false;
  await page.route("**/*.css", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    const fallback = body.replace(/@supports\s*\(animation-timeline:\s*view\(\)\)/g, "@supports (animation-timeline: unsupported)");
    replaced ||= fallback !== body;
    await route.fulfill({ response, body: fallback });
  });
  await page.goto("/#scroll-linked-motion");
  expect(replaced).toBe(true);
  for (const name of ["progressive-scroll-default", "progressive-scroll-reverse"]) {
    const image = fixture(page, name).locator("img");
    await expect(image).toHaveCSS("translate", "none");
    expect(await image.evaluate((element) => Math.abs(element.getBoundingClientRect().height - element.parentElement.getBoundingClientRect().height))).toBeLessThan(1);
  }
});

test("accent skin follows every active route across presets and schemes", async ({ page }) => {
  await page.goto("/#accent-skins");
  const root = page.locator("html");
  const routes = [
    ["skin-accent-primary", "--accent"],
    ["skin-accent-secondary", "--secondary"],
    ["skin-accent-tertiary", "--tertiary"],
    ["skin-accent-success", "--success"],
    ["skin-accent-warning", "--warning"],
    ["skin-accent-danger", "--danger"],
  ];
  for (const preset of ["core", "claude", "openai", "github", "supabase"]) {
    for (const mode of ["light", "dark"]) {
      await root.evaluate((element, values) => {
        element.style.colorScheme = values.mode;
        element.setAttribute("data-preset", values.preset);
      }, { mode, preset });
      for (const [name, token] of routes) {
        const colors = await fixture(page, name).evaluate((element, expectedToken) => {
          const routed = document.createElement("i");
          const expected = document.createElement("i");
          routed.style.backgroundColor = "var(--accent)";
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

test("muted text stays a quieter tone than foreground across skins", async ({ page }) => {
  await page.goto("/#skins");
  const root = page.locator("html");
  const cards = page.locator("#skins [data-theme]");

  for (const preset of ["core", "claude", "openai", "github", "supabase"]) {
    for (const mode of ["light", "dark"]) {
      await root.evaluate((element, values) => {
        element.style.colorScheme = values.mode;
        element.setAttribute("data-preset", values.preset);
      }, { mode, preset });
      const colors = await cards.evaluateAll((elements) => elements.map((element) => {
        const muted = document.createElement("span");
        muted.style.color = "var(--muted)";
        muted.textContent = "Muted";
        const body = document.createElement("span");
        body.textContent = "Body";
        element.append(muted, body);
        const read = (sample) => {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const context = canvas.getContext("2d", { willReadFrequently: true });
          context.fillStyle = getComputedStyle(element).backgroundColor;
          context.fillRect(0, 0, 1, 1);
          const backgroundPixel = context.getImageData(0, 0, 1, 1).data;
          context.fillStyle = getComputedStyle(sample).color;
          context.fillRect(0, 0, 1, 1);
          const foregroundPixel = context.getImageData(0, 0, 1, 1).data;
          return {
            foreground: `rgb(${foregroundPixel[0]}, ${foregroundPixel[1]}, ${foregroundPixel[2]})`,
            background: `rgb(${backgroundPixel[0]}, ${backgroundPixel[1]}, ${backgroundPixel[2]})`,
          };
        };
        const pair = { muted: read(muted), body: read(body) };
        muted.remove();
        body.remove();
        return pair;
      }));
      for (const color of colors) {
        const label = `${preset} ${mode} ${JSON.stringify(color)}`;
        expect(contrastRatio(color.muted.foreground, color.muted.background), label).toBeGreaterThanOrEqual(4.5);
        expect(color.muted.foreground, label).not.toBe(color.body.foreground);
        expect(color.muted.foreground, label).not.toBe(color.muted.background);
        expect(
          contrastRatio(color.muted.foreground, color.muted.background),
          label,
        ).toBeLessThan(contrastRatio(color.body.foreground, color.body.background));
      }
    }
  }
});
