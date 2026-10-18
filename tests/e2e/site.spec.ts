import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/garden/",
  "/kitchen/",
  "/kitchen/butternut-chickpea-traybake/",
  "/crafts/",
  "/crafts/first-plushie/",
  "/studio/",
  "/music/",
  "/animals/",
  "/type-2/",
  "/workshop/",
  "/family/",
  "/family/mom/",
];

test.describe("accessibility", () => {
  for (const path of pages) {
    test(`${path} has no detectable accessibility violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("dark mode has no color contrast violations", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    for (const path of ["/", "/kitchen/butternut-chickpea-traybake/", "/type-2/"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
      expect(results.violations, path).toEqual([]);
    }
  });
});

test("home page introduces the family and every place on the holding", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "The Nuthlings" })).toBeVisible();
  const plots = page.getByRole("region", { name: "Around the holding" }).getByRole("listitem");
  await expect(plots).toHaveCount(8);
  await expect(page.getByRole("link", { name: "The Garden" })).toBeVisible();
});

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("places navigation reaches a section and marks it as current", async ({ page, isMobile }) => {
  await page.goto("/");
  if (isMobile) {
    await page.getByRole("button", { name: "Places" }).click();
  }
  const nav = page.getByRole("navigation", { name: "Places on the holding" });
  await nav.getByRole("link", { name: "Crafts" }).click();
  await expect(page).toHaveURL("/crafts/");
  await expect(page.getByRole("heading", { level: 1, name: "The Craft Room" })).toBeVisible();
  if (isMobile) {
    await page.getByRole("button", { name: "Places" }).click();
  }
  await expect(nav.getByRole("link", { name: "Crafts" })).toHaveAttribute("aria-current", "page");
});

test("recipe page lists facts and lets the cook tick off ingredients", async ({ page }) => {
  await page.goto("/kitchen/butternut-chickpea-traybake/");
  await expect(page.getByText("about 34 g")).toBeVisible();
  const firstIngredient = page.getByRole("checkbox").first();
  await firstIngredient.check();
  await expect(firstIngredient).toBeChecked();
});

test("type 2 section explains that posts are not medical advice", async ({ page }) => {
  await page.goto("/type-2/");
  await expect(page.getByText(/not medical advice/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recipes with carb estimates" })).toBeVisible();
});

test("the page never scrolls sideways", async ({ page }) => {
  for (const path of ["/", "/kitchen/butternut-chickpea-traybake/", "/crafts/first-plushie/", "/animals/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("unknown pages show the custom not found page", async ({ page }) => {
  const response = await page.goto("/attic/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Lost at sea" })).toBeVisible();
});
