import { chromium } from "playwright-core";

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  page.on("console", (msg) => console.log("BROWSER:", msg.text()));

  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Scroll to gallery
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(800);

  const initialStatus = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return {
      paused: video?.paused,
      currentTime: video?.currentTime,
      readyState: video?.readyState
    };
  });
  console.log("Initial status in gallery:", initialStatus);

  // Trigger togglePlayPause by clicking the card
  console.log("Attempting click on active card...");
  await page.evaluate(() => {
    const card = document.querySelector("#gallery [role='button'].border-\\[\\#d4af37\\]");
    if (card) {
      console.log("Found card, dispatching click event...");
      card.click();
    } else {
      console.log("Card NOT found!");
    }
  });
  await page.waitForTimeout(500);

  const statusAfterCardClick = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return {
      paused: video?.paused,
      currentTime: video?.currentTime
    };
  });
  console.log("Status after card click:", statusAfterCardClick);

  // Attempt click on bottom play button
  console.log("Attempting click on bottom play/pause button...");
  await page.evaluate(() => {
    const btn = document.querySelector("#gallery [role='button'].border-\\[\\#d4af37\\] button[aria-label='Pause video'], #gallery [role='button'].border-\\[\\#d4af37\\] button[aria-label='Play video']");
    if (btn) {
      console.log("Found button with label:", btn.getAttribute("aria-label"), "dispatching click...");
      btn.click();
    } else {
      console.log("Bottom button NOT found!");
    }
  });
  await page.waitForTimeout(500);

  const statusAfterBtnClick = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return {
      paused: video?.paused,
      currentTime: video?.currentTime
    };
  });
  console.log("Status after button click:", statusAfterBtnClick);

  await browser.close();
}

run().catch(console.error);
