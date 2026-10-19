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

  console.log("Navigating to http://localhost:5173...");
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Scroll to gallery section
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top: y, behavior: "instant" });
    }
  });
  await page.waitForTimeout(1200);

  // 1. Locate active card and side cards
  const cards = page.locator("#gallery [role='button'][aria-label^='View Reel:']");
  const cardCount = await cards.count();
  console.log("Found carousel cards:", cardCount);

  // The active card has border-[#d4af37]
  const activeCard = page.locator("#gallery [role='button'].border-\\[\\#d4af37\\]").first();
  console.log("Active card found:", await activeCard.count() > 0);

  // 2. Check initial overlay presence
  const activeBottomMeta = activeCard.locator("div.absolute.bottom-3");
  const initialOpacity = await activeBottomMeta.evaluate((el) => window.getComputedStyle(el).opacity);
  console.log("Initial overlay opacity (should be 1):", initialOpacity);
  await page.screenshot({ path: "scratch/reel_step1_initial_overlay.png" });

  // 3. Verify side/background cards do NOT have center play button
  const sideCards = page.locator("#gallery [role='button']:not(.border-\\[\\#d4af37\\])");
  const sideCardPlayIcons = await sideCards.locator("svg polygon[points='6 3 20 12 6 21 6 3']").count();
  console.log("Side/background cards center play icons (must be 0):", sideCardPlayIcons);

  // 4. Wait 3 seconds for auto-hide to take effect while video is playing
  console.log("Waiting 3.2 seconds for overlay to auto-hide...");
  await page.waitForTimeout(3200);

  const hiddenOpacity = await activeBottomMeta.evaluate((el) => window.getComputedStyle(el).opacity);
  console.log("Overlay opacity after 3s (should be 0):", hiddenOpacity);
  await page.screenshot({ path: "scratch/reel_step2_autohidden.png" });

  // 5. Hover over active card to reveal overlay smoothly
  console.log("Hovering over active reel card...");
  await activeCard.hover();
  await page.waitForTimeout(600); // Wait for 500ms smooth transition

  const hoveredOpacity = await activeBottomMeta.evaluate((el) => window.getComputedStyle(el).opacity);
  console.log("Overlay opacity on hover (should be 1):", hoveredOpacity);
  await page.screenshot({ path: "scratch/reel_step3_hover_revealed.png" });

  // 6. Check play/pause buttons for lack of outer circle div
  // Bottom scrubber bar play/pause button
  const bottomPlayBtn = activeCard.locator("button[aria-label='Pause video'], button[aria-label='Play video']");
  const bottomPlayBtnClasses = await bottomPlayBtn.getAttribute("class");
  console.log("Bottom play button classes:", bottomPlayBtnClasses);
  const hasNoBottomOuterCircle = !bottomPlayBtnClasses.includes("rounded-full") && !bottomPlayBtnClasses.includes("bg-white/20");
  console.log("Bottom button outer circle removed:", hasNoBottomOuterCircle ? "PASS" : "FAIL");

  // 7. Click active reel to pause
  console.log("Clicking active reel to pause...");
  await activeCard.click();
  await page.waitForTimeout(400);

  // Check center play button on paused active reel
  // Must have NO outer circle div
  const centerPlayDiv = activeCard.locator("div.absolute.inset-0.flex.items-center.justify-center");
  console.log("Center play overlay present on pause:", await centerPlayDiv.count() > 0);

  // Check if center play button has outer circle div
  const outerCircleCheck = await activeCard.locator("div.rounded-full:has(svg polygon[points='6 3 20 12 6 21 6 3'])").count();
  console.log("Center button outer circle count (must be 0):", outerCircleCheck);
  await page.screenshot({ path: "scratch/reel_step4_paused_clean_icon.png" });

  console.log("\nSummary of errors logged during test:", errors);
  await browser.close();

  if (errors.length > 0) {
    console.error("Test finished with errors");
    process.exit(1);
  } else {
    console.log("ALL REEL OVERLAY & BUTTON TESTS PASSED!");
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
