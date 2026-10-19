import { chromium } from "playwright-core";

async function testClick() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to gallery
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) window.scrollTo({ top: el.offsetTop - 50, behavior: "instant" });
  });
  await page.waitForTimeout(500);

  const activeCard = page.locator("#gallery [role='button'].border-\\[\\#d4af37\\]").first();
  console.log("Hovering active card...");
  await activeCard.hover();
  await page.waitForTimeout(500);

  const pauseBtn = activeCard.locator("button[aria-label='Pause video']");
  console.log("Pause button count:", await pauseBtn.count());
  
  if (await pauseBtn.count() > 0) {
    await pauseBtn.click();
    console.log("Clicked pause button");
    await page.waitForTimeout(500);
    
    // Check if play button is now showing in bottom controls
    const playBtn = activeCard.locator("button[aria-label='Play video']");
    console.log("Play button in bottom controls count:", await playBtn.count());

    // Check if center play icon is now showing
    const centerIcon = activeCard.locator("div.z-30 svg polygon[points='6 3 20 12 6 21 6 3']");
    console.log("Center play icon count when paused:", await centerIcon.count());

    await page.screenshot({ path: "scratch/pause_test_bottom_btn.png" });
  }

  await browser.close();
}

testClick().catch(console.error);
