import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const ARTIFACTS_DIR = "C:/Users/Mahesh/.gemini/antigravity-ide/brain/7e3c9938-a851-4b20-a16c-129db82ebad9/.tempmediaStorage";

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  } catch (e) {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
  }
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleLogs = [];
  page.on("console", (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  const pageErrors = [];
  page.on("pageerror", (err) => {
    pageErrors.push(err.message);
  });

  console.log("Navigating to http://localhost:5173...");
  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000); // Allow GSAP entrance animation to complete

  // 1. Desktop Test (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(1000);

  const desktopScreenshot = path.join(ARTIFACTS_DIR, "hero_desktop_rendered.png");
  await page.screenshot({ path: desktopScreenshot, fullPage: false });
  console.log("Desktop screenshot saved:", desktopScreenshot);

  // Check gold logo visibility
  const goldLogo = page.locator('img[alt="CakeStory Desserts Handcrafted Luxury Gold 3D Emblem"]');
  const isLogoVisible = await goldLogo.isVisible();
  console.log("Gold logo visible on desktop:", isLogoVisible);

  // Check headline visibility
  const headline = page.locator('h1');
  const headlineText = await headline.innerText();
  console.log("Headline text:", headlineText.replace(/\n/g, " "));

  // Check CTA buttons
  const exploreCta = page.getByRole("button", { name: /Explore Growth Story/i });
  const franchiseCta = page.getByRole("button", { name: /Start Your Franchise Journey/i });
  console.log("Explore CTA visible:", await exploreCta.isVisible());
  console.log("Franchise CTA visible:", await franchiseCta.isVisible());

  // Check WhatsApp button
  const whatsappBtn = page.locator('a[href*="wa.me/918623940744"]');
  console.log("WhatsApp button visible:", (await whatsappBtn.count()) > 0);

  // Test opening franchise modal
  console.log("Testing Franchise modal open...");
  await franchiseCta.click();
  await page.waitForTimeout(600);
  const modalHeader = page.locator('#franchise-modal-title');
  console.log("Franchise modal open visible:", await modalHeader.isVisible());

  // Close modal
  const closeBtn = page.locator('button[aria-label="Close dialog"], button[aria-label="Close modal"]');
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(500);
  } else {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }

  // 2. Tablet Test (768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(1000);
  const tabletScreenshot = path.join(ARTIFACTS_DIR, "hero_tablet_rendered.png");
  await page.screenshot({ path: tabletScreenshot, fullPage: false });
  console.log("Tablet screenshot saved:", tabletScreenshot);

  // 3. Mobile Test (375x812)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);
  const mobileScreenshot = path.join(ARTIFACTS_DIR, "hero_mobile_rendered.png");
  await page.screenshot({ path: mobileScreenshot, fullPage: false });
  console.log("Mobile screenshot saved:", mobileScreenshot);

  // Check horizontal overflow on mobile
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, hasOverflow: ${scrollWidth > clientWidth}`);

  // Check errors
  console.log("Page Errors:", pageErrors);
  const fatalErrors = consoleLogs.filter(l => l.type === "error");
  console.log("Console Errors:", fatalErrors);

  await browser.close();
  console.log("Verification completed successfully!");
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
