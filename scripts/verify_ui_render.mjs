import { chromium } from "playwright-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_session_data");

async function verifyUi() {
  console.log("Launching installed Chrome to verify http://localhost:5173/outlets...");
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    executablePath: CHROME_PATH,
    headless: true,
    viewport: { width: 1440, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"]
  });

  const page = context.pages()[0] || await context.newPage();

  // 1. Outlets List & Map
  console.log("Navigating to http://localhost:5173/outlets...");
  await page.goto("http://localhost:5173/outlets", { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  const outletsScreenshot = path.join(OUTPUT_DIR, "outlets_page_verified.png");
  await page.screenshot({ path: outletsScreenshot, fullPage: false });
  console.log("Saved outlets directory screenshot to:", outletsScreenshot);

  // 2. Outlet Detail Page
  const detailUrl = "http://localhost:5173/outlets/cakestory-hadapsar-sade-satra-nali";
  console.log("Navigating to detail page:", detailUrl);
  await page.goto(detailUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForTimeout(3000);
  const detailScreenshot = path.join(OUTPUT_DIR, "outlet_detail_verified.png");
  await page.screenshot({ path: detailScreenshot, fullPage: false });
  console.log("Saved outlet detail screenshot to:", detailScreenshot);

  await context.close();
  console.log("UI verification complete!");
}

verifyUi().catch(err => {
  console.error("Verification error:", err);
  process.exit(1);
});
