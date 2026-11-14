import test from "node:test";
import assert from "node:assert/strict";
import { maintenanceExempt } from "../src/lib/maintenance-paths.ts";
import { HERO_PATHS, MOBILE_HERO_PATHS } from "../src/components/site/hero-shapes.ts";
import { readFile } from "node:fs/promises";
test("maintenance blocks every public page including receipts, retaining protected recovery", () => {
  for (const path of [
    "/admin",
    "/auth",
    "/client-admin",
    "/client-admin/books",
    "/_serverFn/action",
    "/assets/app.js",
    "/images/gc-logo-transparent.png",
  ])
    assert.equal(maintenanceExempt(path), true, path);
  for (const path of [
    "/",
    "/store",
    "/store/receipt/example",
    "/administrator",
    "/admin-copy",
    "/contact",
  ])
    assert.equal(maintenanceExempt(path), false, path);
  assert.equal(maintenanceExempt("/api/public/paynow-result", "POST"), true);
  assert.equal(maintenanceExempt("/api/public/paynow-result", "GET"), false);
});
test("hero paths have compatible interpolation topology and distinct compositions", () => {
  const paths = Object.values(HERO_PATHS);
  assert.ok(
    paths.every((path) => /C/.test(path)),
    "Hero compositions use curved Bézier masks",
  );
  assert.equal(new Set(Object.values(MOBILE_HERO_PATHS)).size, 4);
  assert.equal(new Set(paths).size, 4);
  const topology = paths[0].replace(/[-.\d\s]/g, "");
  for (const path of paths) {
    assert.equal(path.replace(/[-.\d\s]/g, ""), topology);
    for (const number of path.match(/-?\d*\.?\d+/g))
      assert.ok(Number(number) >= 0 && Number(number) <= 1);
  }
});
test("all five original live-site hero headings are retained", async () => {
  const slides = JSON.parse(
    await readFile(new URL("../src/data/hero-slides.json", import.meta.url), "utf8"),
  );
  assert.deepEqual(
    slides.map((slide) => slide.title),
    [
      "Building & Promoting Marriage Foundations",
      "Marriage Counselling Sessions",
      "Pre-Marital Counselling",
      "Prison & Community Outreach",
      "You Deserve to Enjoy Your Marriage",
    ],
  );
  assert.ok(slides.every((slide) => slide.active && slide.image.startsWith("/cdn/")));
});
