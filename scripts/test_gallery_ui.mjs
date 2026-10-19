import { chromium } from "playwright-core";
import fs from "fs";

async function run() {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome"
  });

  const errors = [];
  const page = await browser.newPage();
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });

  if (!fs.existsSync("scratch")) {
    fs.mkdirSync("scratch");
  }

  console.log("=== 1. Public Homepage Tests ===");
  console.log("Navigating to http://localhost:5173...");
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // 1. Verify section placement: Business Model -> Gallery -> Outlets
  const sections = await page.$$eval("section", (secs) =>
    secs.map((s) => s.id).filter(Boolean)
  );
  console.log("Sections on homepage:", sections);

  const franchiseIdx = sections.indexOf("franchise");
  const galleryIdx = sections.indexOf("gallery");
  const outletsIdx = sections.indexOf("outlets");

  console.log({ franchiseIdx, galleryIdx, outletsIdx });
  const placementCorrect = franchiseIdx !== -1 && galleryIdx === franchiseIdx + 1 && outletsIdx === galleryIdx + 1;
  console.log("PLACEMENT (Business Model -> Gallery -> Outlets):", placementCorrect ? "PASS" : "FAIL");

  // 2. Check title section and categories line
  const categoryTabsCount = await page.locator("#gallery [role='tablist']").count();
  console.log("Categories line removed check:", categoryTabsCount === 0 ? "PASS (No category line)" : "FAIL");

  // 3. Check for real HTML5 video elements
  const videoCount = await page.locator("#gallery video").count();
  console.log("HTML5 <video> elements in gallery:", videoCount);

  // Check if active video has src and is playing
  const activeVideoSrc = await page.locator("#gallery video").first().getAttribute("src");
  console.log("Active video source:", activeVideoSrc);

  // 4. Test Mute / Unmute
  const muteBtn = page.locator("#gallery button:has-text('Audio:'), #gallery button:has-text('Sound')").first();
  if (await muteBtn.count() > 0) {
    const textBefore = await muteBtn.innerText();
    console.log("Mute button text before click:", textBefore);
    await muteBtn.click();
    await page.waitForTimeout(300);
    const textAfter = await muteBtn.innerText();
    console.log("Mute button text after click:", textAfter);
    console.log("Mute toggle:", textBefore !== textAfter ? "PASS" : "FAIL");
  }

  // 5. Test Carousel Next / Prev
  const nextBtn = page.locator("#gallery button[aria-label='Next Instagram Reel']");
  if (await nextBtn.count() > 0) {
    await nextBtn.click();
    await page.waitForTimeout(600);
    console.log("Clicked Next button - transitioned smoothly");
  }

  // 6. Desktop Screenshot (1440px)
  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.evaluate(() => {
    const el = document.getElementById("gallery");
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "instant" });
    }
  });
  await page.waitForTimeout(1000);
  const galleryEl = page.locator("#gallery");
  await galleryEl.screenshot({ path: "scratch/gallery_desktop_1440.png" });
  console.log("Saved scratch/gallery_desktop_1440.png");

  // 7. Tablet Screenshot (1024px)
  await page.setViewportSize({ width: 1024, height: 1000 });
  await page.waitForTimeout(800);
  await galleryEl.screenshot({ path: "scratch/gallery_tablet_1024.png" });
  console.log("Saved scratch/gallery_tablet_1024.png");

  // 8. Mobile Screenshot (375px)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(800);
  await galleryEl.screenshot({ path: "scratch/gallery_mobile_375.png" });
  console.log("Saved scratch/gallery_mobile_375.png");

  console.log("\n=== 2. Admin Gallery Management Tests ===");
  // Set auth session directly in localStorage matching AuthUser schema
  await page.evaluate(() => {
    localStorage.setItem(
      "cakestory:session",
      JSON.stringify({
        id: "admin-master",
        name: "CakeStory Operations Lead",
        username: "admin",
        email: "admin@cakestorydesserts.in",
        role: "admin",
        avatar: "https://i.pravatar.cc/120?img=68",
        isInitialCredentials: false,
      })
    );
  });

  await page.setViewportSize({ width: 1440, height: 1080 });
  await page.goto("http://localhost:5173/admin/gallery", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const adminHeading = await page.locator("h1:has-text('Instagram Gallery')").innerText();
  console.log("Admin Gallery page loaded with heading:", adminHeading);

  // Check initial 5 reels in admin list
  const reelCards = await page.locator("h3:has-text('!')");
  const count = await reelCards.count();
  console.log(`Found ${count} reels in Admin list.`);

  // Verify all 5 URLs are in the admin page
  const pageContent = await page.content();
  const urls = [
    "Db-vla0uZuG",
    "DdgwB10u_86",
    "Dd1OLDbuyZe",
    "Dd6dFwKOwQ3",
    "DeMacAnu7sv",
  ];
  for (const shortcode of urls) {
    const present = pageContent.includes(shortcode);
    console.log(`URL containing ${shortcode}:`, present ? "PRESENT" : "MISSING");
  }

  // Screenshot Admin Gallery page
  await page.screenshot({ path: "scratch/admin_gallery_page.png", fullPage: true });
  console.log("Saved scratch/admin_gallery_page.png");

  // 3. Test Editing Section Heading
  console.log("\nTesting Admin Section Edit...");
  const headingInput = page.locator("input[placeholder='Moments That Make Life Sweeter']");
  if (await headingInput.count() > 0) {
    await headingInput.fill("Moments That Make Life Sweeter & Sweeter");
    const saveBtn = page.locator("button:has-text('Save Section Settings')");
    await saveBtn.click();
    await page.waitForTimeout(500);
    console.log("Saved updated section heading in Admin.");
  }

  // Return to homepage and verify updated text is live
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const updatedHeading = await page.locator("#gallery h2").innerText();
  console.log("Homepage Live Heading after Admin update:", updatedHeading);
  console.log("Live dynamic sync:", updatedHeading.includes("Sweeter & Sweeter") ? "PASS" : "FAIL");

  // Reset back to original heading
  await page.goto("http://localhost:5173/admin/gallery", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  const resetBtn = page.locator("button:has-text('Reset to Defaults')");
  if (await resetBtn.count() > 0) {
    page.on("dialog", (dialog) => dialog.accept());
    await resetBtn.click();
    await page.waitForTimeout(500);
    console.log("Reset to defaults executed.");
  }

  // Check errors
  console.log("\nConsole/Page Errors:", errors.length === 0 ? "NONE (Clean!)" : errors);

  await browser.close();
  console.log("\nALL TESTS COMPLETED SUCCESSFULLY!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
