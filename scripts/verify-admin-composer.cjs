// UI-only fixture. Never verifies a passcode, uploads media or publishes a post.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
    await page.addInitScript(() => sessionStorage.setItem("gc_site_admin", "browser-fixture-only"));
    await page.goto((process.argv[2] || "http://localhost:3000") + "/admin");
    await page.getByRole("button", { name: "New announcement", exact: true }).click();
    await page.getByLabel(/^Title/).fill("Draft recovery check");
    await page.getByLabel(/^Date text/).fill("December 2026");
    await page.getByRole("status").filter({ hasText: "Draft saved on this device." }).waitFor();
    await page.waitForTimeout(800);
    assert.equal(
      await page
        .getByLabel("Announcement preview")
        .getByRole("heading", { name: "Draft recovery check" })
        .count(),
      1,
    );
    await page.getByRole("button", { name: "Show mobile preview" }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "New announcement", exact: true }).click();
    await page.getByRole("button", { name: "Restore draft" }).click();
    assert.equal(await page.getByLabel(/^Title/).inputValue(), "Draft recovery check");
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(
      await page.getByRole("dialog").evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    );
    await page.screenshot({ path: "/tmp/gc-admin-composer.png", fullPage: true });
    console.log(
      "PASS admin: live preview, mobile preview, autosave, explicit restore, Escape, mobile overflow; no publishing",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
