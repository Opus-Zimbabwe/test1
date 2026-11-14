// Verify genuine intermediate geometry in both directions with normal motion enabled.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  try {
    for (const width of [1440, 390]) {
      const p = await b.newPage({
        viewport: { width, height: 1000 },
        deviceScaleFactor: 2,
        reducedMotion: "no-preference",
      });
      await p.route("https://**/*", (r) => r.abort());
      await p.goto(process.argv[2] || "http://localhost:3000");
      await p.getByRole("button", { name: "Show hero slide 1", exact: true }).click();
      await p.waitForTimeout(1700);
      const selector =
        width > 700 ? '.gc-mask-desktop path[fill="white"]' : '.gc-mask-mobile path[fill="white"]';
      const measure = () =>
        p.locator(".gc-morph-photograph").evaluate((el) => {
          const r = el.getBoundingClientRect();
          return {
            left: r.left + scrollX,
            top: r.top - el.closest("section").getBoundingClientRect().top,
            width: r.width,
            height: r.height,
            mask: getComputedStyle(el).maskImage,
          };
        });
      const rect = await measure();
      for (const slide of [2, 3, 4, 5, 1, 5, 4, 3, 2, 1]) {
        const before = await p.locator(selector).getAttribute("d");
        await p.getByRole("button", { name: `Show hero slide ${slide}`, exact: true }).click();
        await p.waitForTimeout(450);
        const during = await p.locator(selector).getAttribute("d");
        const duringRect = await measure();
        await p.waitForTimeout(1250);
        const after = await p.locator(selector).getAttribute("d");
        assert.notEqual(during, before, "path must change continuously");
        assert.notEqual(during, after, "path must have intermediate geometry");
        assert.deepEqual(duringRect, rect, "image drawing space and mask must remain stable");
      }
      console.log(
        width +
          "px: forward, reverse, wrap-around morphs have intermediate paths and stable layout",
      );
      await p.getByRole("button", { name: "Show hero slide 5", exact: true }).click();
      await p.waitForTimeout(1700);
      await p.close();
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
