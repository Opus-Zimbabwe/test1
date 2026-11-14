// Read-only integration. Uses TLS-verified request routing for the managed browser's proxy CA.
const { chromium, request } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const base = process.argv[2] || "http://localhost:3000";
  const url = process.env.GC_SUPABASE_URL;
  const key = process.env.GC_SUPABASE_PUBLISHABLE_KEY;
  const passcode = process.env.GC_TEST_ADMIN_PASSCODE;
  if (!url || !key || !passcode)
    throw Error(
      "Provide the content URL, public key and admin test passcode privately in environment variables.",
    );
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const api = await request.newContext({ ...(proxy ? { proxy: { server: proxy } } : {}) });
  const getRows = async (table) => {
    const response = await api.get(`${url}/rest/v1/${table}?select=*`, {
      headers: { apikey: key },
    });
    assert.equal(response.status(), 200);
    return response.json();
  };
  const announcements = await getRows("announcements");
  const books = (await getRows("books")).filter((book) => book.active);
  const b = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
    let prohibitedWrites = 0;
    await p.route("https://**/*", async (route) => {
      const req = route.request();
      const host = new URL(req.url()).hostname;
      if (![new URL(url).hostname, new URL(base).hostname].includes(host)) {
        await route.abort();
        return;
      }
      if (
        host === new URL(url).hostname &&
        req.method() !== "GET" &&
        req.method() !== "OPTIONS" &&
        !new URL(req.url()).pathname.startsWith("/storage/v1/object/sign/")
      ) {
        prohibitedWrites++;
        await route.abort();
        return;
      }
      try {
        const response = await api.fetch(req.url(), {
          method: req.method(),
          headers: req.headers(),
          data: req.postDataBuffer() || undefined,
          timeout: 20000,
        });
        await route.fulfill({ response });
      } catch {
        await route.abort();
      }
    });
    await p.goto(base, { waitUntil: "domcontentloaded" });
    await p.waitForFunction(
      (count) =>
        document.querySelectorAll("#announcements .gc-announcement-entry").length === count,
      announcements.length,
    );
    const ids = await p
      .locator("#announcements .gc-announcement-entry")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => node.getAttribute("aria-labelledby").replace("announcement-", ""))
          .sort(),
      );
    assert.deepEqual(ids, announcements.map((row) => row.id).sort());
    for (const image of await p
      .locator("#announcements .gc-announcement-original-image img")
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await p.waitForFunction(
        (element) => element.complete && element.naturalWidth > 0,
        await image.elementHandle(),
      );
    }
    await p.goto(base + "/store");
    await p.waitForFunction(
      (count) => document.querySelectorAll(".gc-store-book").length === count,
      books.length,
    );
    for (const book of books)
      await p
        .locator(".gc-store-book")
        .getByRole("heading", { name: book.title, exact: true })
        .waitFor();
    for (const image of await p.locator(".gc-store-book .gc-book-cover img").all()) {
      await image.scrollIntoViewIfNeeded();
      await p.waitForFunction(
        (element) => element.complete && element.naturalWidth > 0,
        await image.elementHandle(),
      );
    }
    await p.locator(".gc-store-exhibit").scrollIntoViewIfNeeded();
    await p.waitForFunction(
      (count) => document.querySelectorAll(".gc-store-exhibit img").length === count,
      Math.min(3, books.filter((book) => book.cover_url).length),
    );
    await p.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      scrollTo(0, 0);
    });
    await p.screenshot({ path: "/workspace/artifacts/reading-room-current.png", fullPage: false });
    await p.goto(base + "/admin");
    await p.getByPlaceholder("Enter passcode").fill("incorrect-check-only");
    await p.getByRole("button", { name: "Open content admin", exact: true }).click();
    await p.getByText("That passcode was not accepted. Please try again.").waitFor();
    await p.getByPlaceholder("Enter passcode").fill(passcode);
    await p.getByRole("button", { name: "Open content admin", exact: true }).click();
    await p.getByLabel("Search announcements").waitFor();
    await p.getByLabel("Search announcements").fill("Lusaka");
    await p.waitForFunction(() => document.querySelectorAll(".gc-admin-pane article").length === 2);
    await p.getByLabel("Search announcements").fill("");
    await p.getByLabel("Announcement order").selectOption("recent");
    await p.waitForFunction(
      (count) => document.querySelectorAll(".gc-admin-pane article").length === count,
      announcements.length,
    );
    await p.screenshot({
      path: "/workspace/artifacts/admin-announcements-current.png",
      fullPage: true,
    });
    await p.getByRole("button", { name: /^Books & resources/ }).click();
    await p.waitForFunction(
      (count) => document.querySelectorAll(".gc-admin-book").length === count,
      books.length,
    );
    await p.getByLabel("Search books").fill("The Woman");
    assert.equal(await p.locator(".gc-admin-book").count(), 1);
    await p.getByLabel("Search books").fill("");
    await p.waitForFunction(
      (count) =>
        [...document.querySelectorAll(".gc-admin-book-cover img")].filter(
          (image) => image.complete && image.naturalWidth > 0,
        ).length === count,
      books.filter((book) => book.cover_url).length,
    );
    await p.screenshot({ path: "/workspace/artifacts/admin-books-current.png", fullPage: true });
    await p.setViewportSize({ width: 390, height: 844 });
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await p.screenshot({
      path: "/workspace/artifacts/admin-books-mobile-current.png",
      fullPage: true,
    });
    assert.equal(prohibitedWrites, 0);
    console.log(
      `PASS ${announcements.length} live announcements and flyers; ${books.length} published books, covers and store exhibit; correct/incorrect admin sign-in; announcement/book search; sidebar navigation; mobile layout. No content writes or payments.`,
    );
  } finally {
    await b.close();
    await api.dispose();
  }
})().catch((error) => {
  const secret = process.env.GC_TEST_ADMIN_PASSCODE || "__not_set__";
  console.error(error.name, error.message.replaceAll(secret, "[redacted]"));
  process.exit(1);
});
