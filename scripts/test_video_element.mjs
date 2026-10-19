import { chromium } from "playwright-core";
import fs from "fs";

async function run() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage();

  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
  page.on("console", (c) => console.log("CONSOLE:", c.text()));

  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Scroll to gallery
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "instant" });
  });
  await page.waitForTimeout(2000);

  const evaluation = await page.evaluate(async () => {
    const video = document.querySelector("#gallery video");
    if (!video) return { found: false };

    // Wait up to 3 seconds for video playback progress
    const initialTime = video.currentTime;
    await new Promise((r) => setTimeout(r, 1500));
    const finalTime = video.currentTime;

    // Check if "Watch Reel" or "View Reel" button exists inside the card
    const watchReelBtn = Array.from(document.querySelectorAll("#gallery button")).find(
      (b) => b.innerText.includes("Watch Reel") || b.innerText.includes("View Reel")
    );

    return {
      found: true,
      src: video.currentSrc,
      duration: video.duration,
      initialTime,
      finalTime,
      isPlaying: finalTime > initialTime || !video.paused,
      paused: video.paused,
      muted: video.muted,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      readyState: video.readyState,
      hasViewReelButton: !!watchReelBtn
    };
  });

  console.log("PLAYBACK TEST RESULT:\n", JSON.stringify(evaluation, null, 2));

  // Take screenshot of gallery active card
  const galleryEl = page.locator("#gallery");
  await galleryEl.screenshot({ path: "scratch/gallery_active_video_verified.png" });
  console.log("Saved scratch/gallery_active_video_verified.png");

  await browser.close();
}

run();
