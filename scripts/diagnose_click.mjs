import { chromium } from "playwright-core";

async function diagnose() {
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

  // Click the active reel to toggle pause
  console.log("Clicking pause button via DOM...");
  await page.evaluate(() => {
    const activeCard = document.querySelector("#gallery [role='button'].border-\\[\\#d4af37\\]");
    const pauseBtn = activeCard?.querySelector("button[aria-label='Pause video']");
    if (pauseBtn) pauseBtn.click();
  });
  await page.waitForTimeout(500);

  // Check center play button
  const centerPlayInfo = await page.evaluate(() => {
    const activeCard = document.querySelector("#gallery [role='button'].border-\\[\\#d4af37\\]");
    if (!activeCard) return { error: "No active card" };

    // Find the center play icon
    const centerIconContainer = activeCard.querySelector(".z-30");
    const hasOuterCircleDiv = centerIconContainer?.classList.contains("rounded-full") || false;
    const centerSvg = centerIconContainer?.querySelector("svg");
    
    return {
      hasCenterIcon: !!centerSvg,
      hasOuterCircleDiv,
      centerIconClasses: centerSvg?.getAttribute("class") || ""
    };
  });

  console.log("Center play button info:", centerPlayInfo);

  await page.screenshot({ path: "scratch/diagnose_paused_state.png" });
  await browser.close();
}

diagnose().catch(console.error);
