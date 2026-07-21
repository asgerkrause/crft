import { expect, test } from "@playwright/test";

const fixture = (page, name) => page.locator(`[data-fixture="${name}"]`);

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

test("nested skin boundary resets semantic colors", async ({ page }) => {
  await page.goto("/#nested-boundaries");
  const outer = fixture(page, "skin-nested-outer");
  const inner = fixture(page, "skin-nested-inner");
  await expect(outer).toHaveCSS("background-color", /rgb/);
  expect(await outer.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(await inner.evaluate((element) => getComputedStyle(element).backgroundColor));
});
