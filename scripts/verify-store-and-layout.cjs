// Browser-only catalogue fixtures: this test does not submit a payment or create real products.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: "reduce" });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(process.argv[2] || "http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(4000);
    await p.getByRole("heading", { name: "Our Services.", exact: true }).waitFor();
    assert.equal(
      await p.getByRole("button", { name: /Pause hero|Next hero|Previous hero/ }).count(),
      0,
    );
    assert.equal(await p.locator(".gc-filmstrip").count(), 0);
    assert.equal(await p.locator(".gc-playlist-image").count(), 0);
    assert.equal(await p.locator(".gc-podcast-clip").count(), 8);
    await p.locator("#about").scrollIntoViewIfNeeded();
    assert.equal(await p.locator(".gc-principle-mark").count(), 3);
    for (const svg of await p.locator(".gc-principle-mark").all())
      assert.equal(await svg.evaluate((e) => getComputedStyle(e).display), "block");
    await p.locator(".gc-about-portraits").scrollIntoViewIfNeeded();
    await p.waitForFunction(() =>
      document.querySelector(".gc-nav")?.classList.contains("is-scrolled"),
    );
    assert.ok(await p.locator(".gc-nav").evaluate((e) => e.getBoundingClientRect().top < 15));
    assert.ok(
      await p
        .locator(".gc-nav-main")
        .evaluate((e) => getComputedStyle(e).backdropFilter.includes("blur")),
    );
    await p.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      scrollTo(0, 0);
    });
    for (const width of [390, 760, 1024]) {
      await p.setViewportSize({ width, height: 844 });
      await p.goto(process.argv[2] || "http://localhost:3000/", { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(700);
      assert.equal(
        await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        false,
        "Homepage overflow " + width,
      );
      if (width === 390) {
        await p.getByRole("button", { name: "Open navigation" }).click();
        await p
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "Groups", exact: true })
          .click();
        await p.locator(".gc-about-portraits").scrollIntoViewIfNeeded();
        await p.screenshot({ path: "/workspace/gc-portrait-fix-mobile.png" });
      }
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS home: Our Services heading; hero transports removed; podcast repetition removed; three visible marks; portrait framing; morphing navigation; mobile/tablet widths",
    );
    const store = await b.newPage({
      viewport: { width: 1440, height: 1050 },
      reducedMotion: "reduce",
    });
    const storeErrors = [];
    store.on("pageerror", (e) => storeErrors.push(e.message));
    const base = {
      author: "Browser Test Author",
      description: "Browser-only fixture, not a real product.",
      isbn: null,
      active: true,
      stock: 5,
      created_at: "2026-11-13T00:00:00Z",
      updated_at: "2026-11-13T00:00:00Z",
      file_kind: null,
      file_url: null,
      cover_url: "/cdn/e32ef967-c74f-42e5-a8c6-2fe75d3bbf4f/gc-1.jpg",
    };
    const books = [
      { ...base, id: "fixture-print", title: "Test Printed Resource", price_usd: 12 },
      { ...base, id: "fixture-print2", title: "Another Printed Resource", price_usd: 20 },
      {
        ...base,
        id: "fixture-digital",
        title: "Test Digital Resource",
        price_usd: 0,
        file_url: "fixture.pdf",
        file_kind: "pdf",
      },
    ];
    await store.route("**/rest/v1/books?**", (r) =>
      r.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers":
            "apikey,authorization,x-client-info,content-type,accept-profile",
          "access-control-allow-methods": "GET,OPTIONS",
        },
        body: JSON.stringify(books),
      }),
    );
    await store.goto(new URL("/store", process.argv[2] || "http://localhost:3000/").href, {
      waitUntil: "domcontentloaded",
    });
    await store.getByRole("heading", { name: "Test Printed Resource", exact: true }).waitFor();
    assert.equal(await store.locator(".gc-store-book").count(), 3);
    await store.getByRole("button", { name: "Digital editions", exact: true }).click();
    await store.waitForFunction(() => document.querySelectorAll(".gc-store-book").length === 1);
    await store.getByRole("button", { name: "Print books", exact: true }).click();
    await store.waitForFunction(() => document.querySelectorAll(".gc-store-book").length === 2);
    await store.getByRole("searchbox", { name: "Search resources" }).fill("Another");
    await store.waitForFunction(() => document.querySelectorAll(".gc-store-book").length === 1);
    await store.getByRole("searchbox", { name: "Search resources" }).fill("");
    await store.getByRole("button", { name: "All resources", exact: true }).click();
    await store
      .getByRole("button", { name: "Add Test Printed Resource to cart", exact: true })
      .click();
    await store.getByRole("dialog", { name: "Your cart", exact: true }).waitFor();
    await store.getByRole("button", { name: "Add one Test Printed Resource", exact: true }).click();
    assert.ok((await store.getByRole("dialog").innerText()).includes("$24.00"));
    await store.getByRole("button", { name: "Checkout securely", exact: true }).click();
    await store
      .getByRole("button", { name: "Continue to secure card payment", exact: true })
      .click();
    assert.ok((await store.getByRole("alert").count()) >= 2);
    await store.keyboard.press("Escape");
    await store.getByRole("dialog").waitFor({ state: "hidden" });
    for (const width of [390, 760, 1024]) {
      await store.setViewportSize({ width, height: 844 });
      assert.equal(
        await store.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        false,
        "Store overflow " + width,
      );
      if (width === 390) await store.screenshot({ path: "/workspace/gc-store-mobile.png" });
    }
    assert.deepEqual(storeErrors, []);
    console.log(
      "PASS store with browser-only fixtures: catalogue, search, print/digital filters, cart quantities, checkout validation and Escape; no real checkout submitted; responsive widths",
    );
    await store.unroute("**/rest/v1/books?**");
    await store.route("**/rest/v1/books?**", (r) =>
      r.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await store.goto(new URL("/store", process.argv[2] || "http://localhost:3000/").href, {
      waitUntil: "domcontentloaded",
    });
    await store.getByRole("heading", { name: "The next chapter is coming." }).waitFor();
    console.log("PASS store empty state without invented products");
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
