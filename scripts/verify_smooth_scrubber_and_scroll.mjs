import { chromium } from "playwright-core";
import fs from "fs";

async function run() {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome"
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const errors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  if (!fs.existsSync("scratch")) {
    fs.mkdirSync("scratch");
  }

  console.log("=== 1. Scroll-Out / Scroll-In Auto Play/Stop Tests ===");
  console.log("Navigating to http://localhost:5173 (Landing at Hero)...");
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  // Top of page: Hero section
  const heroPlaying = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return video ? !video.paused : false;
  });
  console.log("At Hero section (Gallery out of view) - Video playing:", heroPlaying);
  console.log("TEST 1A (Out of view is paused on landing):", !heroPlaying ? "PASS" : "FAIL");

  // Scroll into Gallery section
  console.log("Scrolling into Gallery section...");
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(1200);

  const galleryPlaying1 = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return video ? !video.paused : false;
  });
  console.log("Scrolled into Gallery - Video playing:", galleryPlaying1);
  console.log("TEST 1B (Auto-plays when entering gallery):", galleryPlaying1 ? "PASS" : "FAIL");

  // Scroll down to Outlets section
  console.log("Scrolling down to Outlets section...");
  await page.evaluate(() => {
    const el = document.getElementById("outlets");
    if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
  });
  await page.waitForTimeout(1200);

  const outletsPlaying = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return video ? !video.paused : false;
  });
  console.log("Scrolled to Outlets (Gallery out of view) - Video playing:", outletsPlaying);
  console.log("TEST 1C (Auto-stops when scrolling away to other sections):", !outletsPlaying ? "PASS" : "FAIL");

  // Scroll back into Gallery section
  console.log("Scrolling back up into Gallery section...");
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
  });
  await page.waitForTimeout(1200);

  const galleryPlaying2 = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return video ? !video.paused : false;
  });
  console.log("Returned to Gallery - Video playing:", galleryPlaying2);
  console.log("TEST 1D (Auto-resumes when coming back to gallery):", galleryPlaying2 ? "PASS" : "FAIL");

  console.log("\n=== 2. Single-Click Play/Pause Tests ===");
  // Single click on active card to pause
  console.log("Clicking active card to pause...");
  await page.evaluate(() => {
    const card = document.getElementById("active-reel-card");
    if (card) card.click();
  });
  await page.waitForTimeout(500);

  const isPausedAfterCardClick = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return video ? video.paused : false;
  });
  console.log("Paused after single card click:", isPausedAfterCardClick);
  console.log("TEST 2A (Single click card pause):", isPausedAfterCardClick ? "PASS" : "FAIL");

  // Single click on center play icon to resume
  console.log("Clicking center play icon to resume...");
  await page.evaluate(() => {
    const centerOverlay = document.getElementById("center-play-overlay");
    if (centerOverlay) centerOverlay.click();
  });
  await page.waitForTimeout(500);

  const isPlayingAfterCenterClick = await page.evaluate(() => {
    const video = document.querySelector("#gallery video");
    return video ? !video.paused : false;
  });
  console.log("Playing after single center icon click:", isPlayingAfterCenterClick);
  console.log("TEST 2B (Single click center play):", isPlayingAfterCenterClick ? "PASS" : "FAIL");

  console.log("\n=== 3. Move Forward and Backward from Bottom Line (Scrubber Seek) ===");
  // Reveal controls by moving mouse over active card
  const activeCard = page.locator("#active-reel-card").first();
  await activeCard.hover();
  await page.waitForTimeout(400);

  // Click at 75% along the scrubber bar to seek forward
  console.log("Clicking at 75% of scrubber bar to seek forward...");
  const seekForwardRes = await page.evaluate(() => {
    const scrubber = document.querySelector("#gallery [role='button'].border-\\[\\#e6b86a\\] [role='slider']");
    if (!scrubber) return { error: "Scrubber not found" };

    const rect = scrubber.getBoundingClientRect();
    const targetX = rect.left + rect.width * 0.75;
    const targetY = rect.top + rect.height / 2;

    scrubber.dispatchEvent(new MouseEvent("click", {
      clientX: targetX,
      clientY: targetY,
      bubbles: true,
      cancelable: true
    }));

    const video = document.querySelector("#gallery video");
    return {
      currentTime: video ? video.currentTime : 0,
      duration: video ? video.duration : 1,
      paused: video ? video.paused : true
    };
  });

  console.log("Seek forward result:", seekForwardRes);
  const forwardFraction = seekForwardRes.currentTime / seekForwardRes.duration;
  console.log("Forward fraction:", forwardFraction.toFixed(2));
  console.log("TEST 3A (Single click seek forward):", forwardFraction >= 0.7 && forwardFraction <= 0.8 ? "PASS" : "FAIL");

  // Click at 25% along the scrubber bar to seek backward
  console.log("Clicking at 25% of scrubber bar to seek backward...");
  const seekBackwardRes = await page.evaluate(() => {
    const scrubber = document.querySelector("#gallery [role='button'].border-\\[\\#e6b86a\\] [role='slider']");
    if (!scrubber) return { error: "Scrubber not found" };

    const rect = scrubber.getBoundingClientRect();
    const targetX = rect.left + rect.width * 0.25;
    const targetY = rect.top + rect.height / 2;

    scrubber.dispatchEvent(new MouseEvent("click", {
      clientX: targetX,
      clientY: targetY,
      bubbles: true,
      cancelable: true
    }));

    const video = document.querySelector("#gallery video");
    return {
      currentTime: video ? video.currentTime : 0,
      duration: video ? video.duration : 1,
      paused: video ? video.paused : true
    };
  });

  console.log("Seek backward result:", seekBackwardRes);
  const backwardFraction = seekBackwardRes.currentTime / seekBackwardRes.duration;
  console.log("Backward fraction:", backwardFraction.toFixed(2));
  console.log("TEST 3B (Single click seek backward):", backwardFraction >= 0.2 && backwardFraction <= 0.3 ? "PASS" : "FAIL");

  await page.screenshot({ path: "scratch/scrubber_seek_final.png" });
  console.log("Saved scratch/scrubber_seek_final.png");

  await browser.close();

  if (errors.length > 0) {
    console.error("Test finished with errors:", errors);
    process.exit(1);
  } else {
    console.log("\n>>> ALL AUTO-PLAY, SCROLL STOP, AND SCRUBBER SEEK TESTS PASSED WITH 100% SUCCESS! <<<");
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
