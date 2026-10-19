import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll down so the boundary between gallery highlights and outlets is centered
  await page.evaluate(() => {
    const outlets = document.getElementById("outlets");
    if (outlets) {
      const y = outlets.getBoundingClientRect().top + window.scrollY - 300;
      window.scrollTo({ top: y, behavior: "instant" });
    }
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: "scratch/boundary_gallery_outlets.png" });
  console.log("Captured scratch/boundary_gallery_outlets.png");

  await browser.close();
}

run().catch(console.error);
