import { chromium } from "playwright-core";

async function verifyFullView() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to center gallery carousel
  await page.evaluate(() => {
    const stage = document.querySelector("#gallery [style*='perspective']");
    if (stage) {
      stage.scrollIntoView({ behavior: "instant", block: "center" });
    }
  });
  await page.waitForTimeout(800);

  // 1. Initial State (overlays visible)
  await page.screenshot({ path: "scratch/view1_initial_playing.png" });
  console.log("Captured view1_initial_playing.png");

  // 2. Wait 3.5s for auto-hide
  await page.waitForTimeout(3500);
  await page.screenshot({ path: "scratch/view2_autohidden_playing.png" });
  console.log("Captured view2_autohidden_playing.png");

  // 3. Hover to reveal
  const activeCard = page.locator("#gallery [role='button'].border-\\[\\#d4af37\\]").first();
  await activeCard.hover();
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scratch/view3_hover_revealed.png" });
  console.log("Captured view3_hover_revealed.png");

  // 4. Click to Pause
  const pauseBtn = activeCard.locator("button[aria-label='Pause video']");
  if (await pauseBtn.count() > 0) {
    await pauseBtn.click();
  } else {
    await activeCard.click();
  }
  await page.waitForTimeout(600);
  await page.screenshot({ path: "scratch/view4_paused_clean_icon.png" });
  console.log("Captured view4_paused_clean_icon.png");

  await browser.close();
  console.log("All views captured successfully!");
}

verifyFullView().catch(console.error);
