// Local-only integration: isolated settings/catalogue fixture; never contacts the real CMS for writes.
const { createServer } = require("node:http");
const { spawn } = require("node:child_process");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
const defaults = require("../src/data/hero-slides.json");
const passcode = process.env.GC_TEST_ADMIN_PASSCODE;
if (!passcode) throw Error("Provide GC_TEST_ADMIN_PASSCODE privately.");
(async () => {
  let settings = {
    heroSlides: structuredClone(defaults),
    maintenance: { enabled: false, message: "Fixture maintenance & recovery." },
  };
  let writes = 0;
  let checkoutCalls = 0;
  let lastSection = "";
  const book = {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Local test resource",
    author: "Fixture author",
    description: "Disposable test resource.",
    price_usd: 12,
    active: true,
    stock: 5,
    cover_url: defaults[0].image,
    file_url: null,
    file_kind: null,
    isbn: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const backend = createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(204, { "Access-Control-Allow-Headers": "*" }).end();
      return;
    }
    if (req.url.startsWith("/rest/v1/site_experience")) {
      assert.ok(req.url.includes("greatcouples-test"));
      res.end(JSON.stringify([{ settings }]));
      return;
    }
    if (req.url.startsWith("/rest/v1/books")) return res.end(JSON.stringify([book]));
    if (req.url.startsWith("/rest/v1/rpc/create_paynow_checkout")) {
      checkoutCalls++;
      res.statusCode = 400;
      res.end(JSON.stringify({ message: "Fixture never creates payments" }));
      return;
    }
    if (req.url.startsWith("/rest/v1/rpc/site_admin_save_experience")) {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const payload = JSON.parse(raw);
      if (payload._passcode !== passcode) {
        res.statusCode = 403;
        res.end(JSON.stringify({ message: "Invalid passcode" }));
        return;
      }
      assert.equal(payload._site_key, "greatcouples-test");
      lastSection = payload._section;
      writes++;
      if (lastSection === "hero") settings.heroSlides = payload._settings.heroSlides;
      else if (lastSection === "message")
        settings.maintenance.message = payload._settings.maintenance.message;
      else settings.maintenance = payload._settings.maintenance;
      res.end(JSON.stringify({ settings }));
      return;
    }
    res.end("[]");
  });
  await new Promise((resolve) => backend.listen(0, "127.0.0.1", resolve));
  const database = `http://127.0.0.1:${backend.address().port}`;
  const base = "http://127.0.0.1:3004";
  const app = spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1", "--port", "3004", "--strictPort"],
    {
      detached: true,
      stdio: "ignore",
      env: {
        ...process.env,
        SUPABASE_URL: database,
        VITE_SUPABASE_URL: database,
        SUPABASE_PUBLISHABLE_KEY: "sb_publishable_fixture",
        VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_fixture",
        SITE_INSTANCE_ID: "greatcouples-test",
      },
    },
  );
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 50; i++) {
      try {
        if ((await fetch(base, { signal: AbortSignal.timeout(1200) })).ok) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
    assert.ok(ready, "App starts");
    browser = await chromium.launch({
      executablePath: "/usr/bin/chromium",
      args: ["--no-sandbox"],
    });
    const p = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    await p.route(/https:\/\/(www\.)?(tiktok|facebook|youtube-nocookie)\.com\//, (route) =>
      route.abort(),
    );
    await p.goto(base);
    await p.locator(".gc-morph-hero h1").waitFor();
    assert.equal(await p.locator(".gc-morph-navigation button").count(), 5);
    console.log("Checking source slides");
    for (let i = 0; i < defaults.length; i++) {
      await p.getByRole("button", { name: `Show hero slide ${i + 1}`, exact: true }).click();
      await p.waitForFunction(
        (title) => document.querySelector(".gc-morph-copy h1")?.textContent === title,
        defaults[i].title,
      );
      assert.equal(await p.locator(".gc-morph-hero").getAttribute("data-shape"), defaults[i].shape);
      assert.ok(await p.locator(".gc-hero-clip-defs path").getAttribute("d"));
    }
    await p.setViewportSize({ width: 390, height: 844 });
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await p.setViewportSize({ width: 1440, height: 1000 });
    console.log("Checking hero editor");
    await p.addInitScript((code) => sessionStorage.setItem("gc_site_admin", code), passcode);
    await p.goto(base + "/admin");
    await p.getByRole("button", { name: "Website controls", exact: true }).click();
    await p.getByLabel("Heading", { exact: true }).fill("Edited fixture heading");
    await p.getByRole("button", { name: "Move slide 1 down", exact: true }).click();
    await p.getByRole("button", { name: "Publish hero changes", exact: true }).click();
    await p.getByText("Website settings saved. Public pages refresh within 30 seconds.").waitFor();
    assert.equal(lastSection, "hero");
    assert.equal(settings.heroSlides[1].title, "Edited fixture heading");
    assert.equal(settings.maintenance.enabled, false);
    console.log("Checking public hero update");
    await p.goto(base);
    await p.waitForFunction(
      () =>
        document.querySelector(".gc-morph-copy h1")?.textContent ===
        "Marriage Counselling Sessions",
    );
    await p.getByRole("button", { name: "Show hero slide 2", exact: true }).click();
    await p.waitForFunction(
      () => document.querySelector(".gc-morph-copy h1")?.textContent === "Edited fixture heading",
    );
    await p.goto(base + "/admin");
    await p.getByRole("button", { name: "Website controls", exact: true }).click();
    for (let i = 1; i <= 5; i++)
      await p.getByRole("button", { name: `Hide slide ${i}`, exact: true }).click();
    await p.getByRole("button", { name: "Publish hero changes", exact: true }).click();
    await p
      .getByRole("alert")
      .filter({ hasText: "Keep at least one hero slide visible." })
      .waitFor();
    assert.equal(writes, 1);
    await p.getByRole("button", { name: "Site availability", exact: true }).click();
    await p.screenshot({
      path: "/workspace/artifacts/admin-site-availability.png",
      fullPage: true,
    });
    console.log("Checking checkout scrolling");
    const shopper = await browser.newPage({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    await shopper.goto(base + "/store");
    await shopper
      .getByRole("button", { name: "Add Local test resource to cart", exact: true })
      .click();
    await shopper.getByRole("button", { name: "Checkout securely", exact: true }).click();
    await shopper
      .locator("label")
      .filter({ has: shopper.locator("input[name=method][value=ecocash]") })
      .click();
    await shopper.getByLabel("EcoCash mobile number", { exact: false }).waitFor();
    await shopper.waitForFunction(() => {
      const node = document.querySelector("#mobile-details-heading");
      const box = node?.getBoundingClientRect();
      return box && box.top >= 0 && box.top < 300;
    });
    await shopper
      .locator("label")
      .filter({ has: shopper.locator("input[name=method][value=visa]") })
      .click();
    await shopper.waitForFunction(() => {
      const box = document.querySelector("#card-details-heading")?.getBoundingClientRect();
      return box && box.top >= 0 && box.top < 300;
    });
    await shopper
      .locator("label")
      .filter({ has: shopper.locator("input[name=method][value=onemoney]") })
      .click();
    await shopper.getByLabel("OneMoney mobile number", { exact: false }).waitFor();
    const logo = shopper.locator('img[src="/images/payments/onemoney.png"]').first();
    assert.ok(await logo.count());
    await shopper.getByLabel("OneMoney mobile number", { exact: false }).fill("0771234567");
    await shopper.getByLabel("Customer name", { exact: true }).fill("Local Fixture");
    await shopper.getByLabel("Receipt email", { exact: true }).fill("fixture@example.test");
    await shopper.screenshot({
      path: "/workspace/artifacts/checkout-onemoney-scroll.png",
      fullPage: true,
    });
    console.log("Checking maintenance");
    p.once("dialog", (dialog) => dialog.dismiss());
    await p.getByRole("button", { name: "Turn off public website", exact: true }).click();
    assert.equal(settings.maintenance.enabled, false);
    assert.equal(writes, 1);
    p.on("dialog", (dialog) => dialog.accept());
    await p.getByRole("button", { name: "Turn off public website", exact: true }).click();
    await p.getByText("Public website is turned off", { exact: true }).waitFor();
    assert.equal(lastSection, "availability");
    assert.equal(settings.maintenance.enabled, true);
    const offline = await fetch(base);
    assert.equal(offline.status, 503);
    assert.equal(offline.headers.get("cache-control"), "no-store");
    assert.ok((await offline.text()).includes("Fixture maintenance &amp; recovery."));
    assert.equal((await fetch(base + "/admin")).status, 200);
    assert.equal((await fetch(base + "/auth")).status, 200);
    await shopper.getByRole("button", { name: "Send OneMoney prompt", exact: true }).click();
    await shopper
      .getByText("The website is temporarily unavailable. Please try again later.", { exact: true })
      .waitFor();
    assert.equal(checkoutCalls, 0, "Maintenance blocks payment creation");
    await p.getByRole("button", { name: "Turn website back on", exact: true }).click();
    await p.getByText("Public website is available", { exact: true }).waitFor();
    assert.equal((await fetch(base)).status, 200);
    assert.equal(settings.maintenance.enabled, false);
    assert.equal(writes, 3);
    console.log(
      "PASS 5 source hero headings and changing shapes; mobile layout; admin hero edit/reorder/save; confirmed maintenance off/on; HTTP 503 with admin/auth access; checkout scroll and actual OneMoney asset; payment creation blocked during maintenance. Local fixtures only.",
    );
  } finally {
    if (browser) await browser.close();
    try {
      process.kill(-app.pid, "SIGTERM");
    } catch {}
    await new Promise((resolve) => backend.close(resolve));
  }
})().catch((error) => {
  console.error(error.name, error.stack.replaceAll(passcode, "[redacted]"));
  process.exit(1);
});
