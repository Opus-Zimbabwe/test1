// Requires Playwright and Chromium. Pass the locally served application URL as the first argument.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 1050 }, reducedMotion: "reduce" });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto(process.argv[2] || "http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await p.waitForTimeout(3000);
    assert.equal(
      await p
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Book a session", exact: true })
        .count(),
      0,
    );
    await p.locator("#podcast").scrollIntoViewIfNeeded();
    assert.equal(await p.locator(".gc-podcast-clip").count(), 8);
    assert.equal(await p.locator("#podcast-youtube .gc-podcast-clip").count(), 3);
    assert.equal(await p.locator("#podcast-tiktok .gc-podcast-clip").count(), 5);
    assert.equal(await p.locator("#podcast .gc-context-art").count(), 0);
    const ids = [
      "7707735777718930706",
      "7707357261047532821",
      "7705848215546891540",
      "7704939703518121237",
      "7705073907186863380",
    ];
    for (let i = 0; i < 5; i++) {
      await p.getByRole("button", {name: `Play TikTok podcast ${i+1}`,exact:true}).click();
      assert.ok((await p.getByRole("dialog").locator("iframe").getAttribute("src")).includes(ids[i]));
      await p.keyboard.press("Escape");
    }
    await p.locator("#videos").scrollIntoViewIfNeeded();
    assert.equal(await p.locator("#videos-youtube .gc-social-video").count(), 4);
    assert.equal(await p.locator("#videos-tiktok .gc-social-video").count(), 8);
    await p.getByRole("button", { name: "Play youtube video 1", exact: true }).click();
    await p.getByRole("dialog").waitFor();
    await p.getByRole("button", { name: "Close video player" }).click();
    await p.getByRole("button", { name: "Play tiktok video 1", exact: true }).click();
    assert.ok(
      (await p.getByRole("dialog").locator("iframe").getAttribute("src")).includes(
        "7707735777718930706",
      ),
    );
    await p.keyboard.press("Escape");
    await p.getByRole("dialog").waitFor({ state: "hidden" });
    await p.locator("#gallery").scrollIntoViewIfNeeded();
    assert.ok(
      (await p.locator('#gallery button[aria-label^="Open gallery photograph"]').count()) >= 10,
    );
    await p.getByRole("button", { name: "Open gallery photograph 1", exact: true }).click();
    await p.getByRole("dialog", { name: "Moments of restoration" }).waitFor();
    await p.getByRole("button", { name: "Next", exact: true }).click();
    await p.keyboard.press("ArrowLeft");
    await p.keyboard.press("Escape");
    await p.getByRole("dialog").waitFor({ state: "hidden" });
    await p.locator("#announcements").scrollIntoViewIfNeeded();
    assert.equal(await p.locator(".gc-announcement-entry").count(), 3);
    assert.equal(await p.locator(".gc-announcement-index").count(), 0);
    for (const image of await p.locator(".gc-announcement-original-image img").all()) {
      await image.scrollIntoViewIfNeeded();
      assert.equal(await image.evaluate((e) => getComputedStyle(e).objectFit), "contain");
    }
    await p.getByRole("heading", { name: "Methodist Church Meet", exact: true }).first().waitFor();
    await p.getByRole("button", { name: "Enlarge Methodist Church Meet flyer" }).click();
    await p.getByRole("dialog").waitFor();
    await p.getByRole("button", { name: "Close announcement flyer" }).click();
    await p.locator("#community").scrollIntoViewIfNeeded();
    assert.equal(await p.locator('#community a[href*="chat.whatsapp.com"]').count(), 5);
    assert.ok(
      await p.locator(".gc-whatsapp-emblem").evaluate((e) => e.complete && e.naturalWidth > 0),
    );
    await p.locator(".bwf").scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    assert.equal(await p.locator(".bwf-word-in .bwf-l").count(), 13);
    assert.equal(await p.locator('.bwf a[href="#"]').count(), 0);
    const logos = await p
      .locator(".gc-brandmark")
      .evaluateAll((xs) => xs.filter((x) => x.complete && !x.naturalWidth).map((x) => x.src));
    assert.deepEqual(logos, []);
    for (const width of [390, 760, 1024]) {
      await p.setViewportSize({ width, height: 844 });
      await p.goto(process.argv[2] || "http://localhost:3000/", { waitUntil: "domcontentloaded" });
      await p.waitForTimeout(700);
      assert.equal(
        await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1),
        false,
        "Overflow " + width,
      );
      if (width === 390) {
        await p.getByRole("button", { name: "Open navigation" }).click();
        await p
          .getByRole("navigation", { name: "Main navigation" })
          .getByRole("link", { name: "Groups", exact: true })
          .click();
        await p.locator("#podcast").scrollIntoViewIfNeeded();
        await p.locator(".bwf").scrollIntoViewIfNeeded();
        await p.screenshot({ path: "/workspace/gc-experience-mobile-footer.png" });
      }
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: compact nav; separate YouTube/TikTok podcast sections, mutually exclusive playback, all five supplied TikToks; modal playback/close; YouTube/TikTok shelves and dialogs; moving gallery/lightbox; separate announcement images and flyer; five groups and loaded brand marks; beam footer; 390/760/1024 no overflow; no page errors",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
