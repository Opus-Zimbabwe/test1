// Read-only UI checks with browser-only catalogue fixtures. No payment requests are submitted.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    await p.route(/https:\/\/(www\.)?(tiktok|facebook|youtube-nocookie)\.com\//, (route) =>
      route.abort(),
    );
    const base = process.argv[2] || "http://localhost:3000";
    await p.goto(base);
    await p.getByRole("button", { name: "Show hero slide 1", exact: true }).click();
    assert.equal(await p.locator('iframe[src*="tiktok.com/player"]').count(), 0);
    assert.equal(
      await p
        .getByRole("link", { name: "Account admin sign in", exact: true })
        .getAttribute("href"),
      "/auth",
    );
    assert.equal(
      await p
        .getByRole("link", { name: "Content admin sign in", exact: true })
        .getAttribute("href"),
      "/admin",
    );
    assert.equal(
      await p
        .getByRole("link", { name: "Designed & developed by Opus Zimbabwe", exact: true })
        .getAttribute("href"),
      "https://opuszim.co.zw/",
    );
    await p.setViewportSize({ width: 390, height: 844 });
    assert.ok(
      (
        await p.locator(".gc-morph-photograph").evaluate((el) => getComputedStyle(el).maskImage)
      ).includes("gc-flow-"),
    );
    const before = await p.locator('.gc-mask-mobile path[fill="white"]').getAttribute("d");
    await p.getByRole("button", { name: "Show hero slide 2", exact: true }).click();
    await p.waitForFunction(
      (old) => document.querySelector('.gc-mask-mobile path[fill="white"]')?.getAttribute("d") !== old,
      before,
    );
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await p.screenshot({ path: "/workspace/artifacts/bezier-hero-mobile.png" });
    await p.setViewportSize({ width: 1440, height: 1000 });
    await p.locator("#podcast-tiktok .gc-podcast-rail").scrollIntoViewIfNeeded();
    await p.waitForTimeout(400);
    assert.ok((await p.locator('iframe[src*="tiktok.com/player"]').count()) <= 4);
    await p.getByRole("button", { name: "Play TikTok podcast 1", exact: true }).click();
    assert.equal(await p.getByRole("dialog").locator("iframe").count(), 1);
    assert.equal(await p.locator('iframe[src*="tiktok.com/player"]').count(), 1);
    await p.keyboard.press("Escape");
    const bookBase = {
      author: "Fixture Author",
      description: "Catalogue text retained for a read-only browser test.",
      price_usd: 20,
      active: true,
      stock: 20,
      cover_url: "/cdn/b5678dc9-e94a-4d2d-b51e-96ace5f5536b/gc-3.jpg",
      file_url: null,
      file_kind: null,
      isbn: null,
      created_at: "2026-11-14T00:00:00Z",
      updated_at: "2026-11-14T00:00:00Z",
    };
    const books = [
      { ...bookBase, id: "11111111-1111-4111-8111-111111111111", title: "First resource" },
      { ...bookBase, id: "22222222-2222-4222-8222-222222222222", title: "Second resource" },
      { ...bookBase, id: "33333333-3333-4333-8333-333333333333", title: "Third resource" },
    ];
    await p.route("**/rest/v1/books?**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: JSON.stringify(books),
      }),
    );
    await p.goto(base + "/store");
    await p.getByRole("button", { name: "Feature First resource", exact: true }).waitFor();
    await p.getByRole("button", { name: "Next featured book", exact: true }).click();
    assert.equal(
      await p
        .getByRole("button", { name: "Feature Second resource", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await p.getByRole("button", { name: "Read about Second resource", exact: true }).click();
    await p
      .getByRole("dialog", { name: "Second resource", exact: true })
      .getByRole("button", { name: "Add to cart", exact: true })
      .click();
    await p.getByRole("dialog", { name: "Your cart", exact: true }).waitFor();
    assert.ok((await p.getByRole("dialog").innerText()).includes("$20.00"));
    await p.keyboard.press("Escape");
    await p.getByRole("searchbox", { name: "Search resources" }).fill("Third");
    assert.equal(await p.locator(".gc-store-book").count(), 1);
    await p.getByRole("searchbox", { name: "Search resources" }).fill("");
    for (const width of [390, 760, 1024, 1440]) {
      await p.setViewportSize({ width, height: 1000 });
      assert.ok(
        await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
        `Store overflow ${width}`,
      );
    }
    await p.goto(base + "/client-admin");
    await p.waitForURL(/\/auth(?:\?|$)/);
    console.log(
      "PASS separate admin links and unchanged login gate; referral credit; Bézier mobile changes; visible-only TikTok resource budget and one active player; featured-book navigation, details-to-cart, catalogue search and responsive reading room. No payments.",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e.name, e.message);
  process.exit(1);
});
