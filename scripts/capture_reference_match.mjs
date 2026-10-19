import { chromium } from "playwright-core";
import fs from "fs";

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  // Viewport sized to fit entire section from header to floor
  const page = await browser.newPage({ viewport: { width: 1440, height: 1150 } });

  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to show full gallery section cleanly below fixed navbar
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 85;
      window.scrollTo({ top: y, behavior: "instant" });
    }
  });
  await page.waitForTimeout(1500);

  // Capture desktop screenshot
  await page.screenshot({ path: "scratch/matched_ref_full_desktop.png" });
  console.log("Captured scratch/matched_ref_full_desktop.png");

  // Hover over active card to show controls & auto-hide
  const activeCard = page.locator("#gallery [role='button'].border-\\[\\#e6b86a\\]").first();
  if (await activeCard.count() > 0) {
    await activeCard.hover();
    await page.waitForTimeout(600);
    await page.screenshot({ path: "scratch/matched_ref_hover_full.png" });
    console.log("Captured scratch/matched_ref_hover_full.png");
  }

  await browser.close();
  console.log("Full view captured successfully!");
}

run().catch(console.error);
