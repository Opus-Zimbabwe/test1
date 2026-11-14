// Run against a production build with no Supabase variables, then with configured
// variables while the browser's CMS requests are blocked. Requires Playwright.
// Example: NODE_PATH=/tmp/gc-browser/node_modules node scripts/verify-public-homepage.cjs http://localhost:3002
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    for (const width of [1440, 390]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/rest/v1/**", (route) => route.abort());
      const response = await page.goto(process.argv[2] || "http://localhost:3002", {
        waitUntil: "domcontentloaded",
      });
      assert.equal(response.status(), 200);
      await page.locator(".gc-morph-copy h1").waitFor();
      await page.waitForTimeout(1500);
      assert.equal(await page.getByRole("heading", { name: "This page didn't load" }).count(), 0);
      for (const id of [
        "services",
        "about",
        "values",
        "gallery",
        "podcast",
        "videos",
        "announcements",
        "community",
        "contact",
      ]) {
        assert.equal(await page.locator(`#${id}`).count(), 1, `${id} must remain available`);
      }
      assert.ok(
        (await page.locator('#gallery button[aria-label^="Open gallery photograph"]').count()) >=
          10,
      );
      assert.equal(await page.locator("#announcements article").count(), 3);
      await page.getByRole("button", { name: "Open gallery photograph 1", exact: true }).click();
      await page.getByRole("button", { name: "Next", exact: true }).click();
      await page.keyboard.press("Escape");
      await page.getByRole("button", { name: "Close", exact: true }).waitFor({ state: "hidden" });
      assert.deepEqual(errors, [], "Homepage must not crash after hydration");
      console.log(
        `PASS ${width}px: HTTP 200, no error boundary, all public sections, gallery, archive and gallery interaction`,
      );
      await page.close();
    }
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
