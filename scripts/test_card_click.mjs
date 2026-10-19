import { chromium } from "playwright-core";

async function testDispatch() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to gallery
  await page.evaluate(() => {
    const stage = document.querySelector("#gallery [style*='perspective']");
    if (stage) stage.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(500);

  console.log("Triggering click on activeCard via dispatchEvent...");
  const res = await page.evaluate(() => {
    const activeCard = document.querySelector("#gallery [role='button'].border-\\[\\#d4af37\\]");
    if (!activeCard) return "No active card";

    activeCard.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    return "Dispatched click";
  });
  console.log(res);

  await page.waitForTimeout(600);

  const status = await page.evaluate(() => {
    const activeCard = document.querySelector("#gallery [role='button'].border-\\[\\#d4af37\\]");
    const playIcon = activeCard?.querySelector(".z-30 svg polygon[points='6 3 20 12 6 21 6 3']");
    const playBtn = activeCard?.querySelector("button[aria-label='Play video']");
    const pauseBtn = activeCard?.querySelector("button[aria-label='Pause video']");
    return {
      hasCenterPlayIcon: !!playIcon,
      hasPlayBtn: !!playBtn,
      hasPauseBtn: !!pauseBtn
    };
  });

  console.log("Status after clicking activeCard:", status);
  await page.screenshot({ path: "scratch/card_click_result.png" });
  await browser.close();
}

testDispatch().catch(console.error);
