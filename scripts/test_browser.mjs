import { chromium } from "playwright-core";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\Edge\\Application\\msedge.exe";

async function main() {
  const exePath = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
  console.log("Using browser executable:", exePath);

  const browser = await chromium.launch({
    executablePath: exePath,
    headless: false, // Normal browser interface so user can see and complete CAPTCHA if prompted
    args: ["--start-maximized"]
  });

  const context = await browser.newContext({
    viewport: null
  });

  const page = await context.newPage();
  console.log("Browser opened successfully!");
  await browser.close();
  console.log("Test passed!");
}

main().catch(err => {
  console.error("Browser launch error:", err);
  process.exit(1);
});
