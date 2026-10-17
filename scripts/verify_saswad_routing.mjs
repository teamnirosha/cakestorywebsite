import { chromium } from "playwright-core";
import path from "path";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_session_data");

async function runSaswadTests() {
  console.log("Starting Saswad routing and hero verification...");
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    executablePath: CHROME_PATH,
    headless: true,
    viewport: { width: 1440, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"]
  });

  const page = context.pages()[0] || await context.newPage();

  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      throw new Error(message);
    } else {
      console.log(`✅ PASSED: ${message}`);
    }
  }

  try {
    // Test 1: Direct navigation to canonical /outlets/pune/saswad
    console.log("\n--- TEST 1: Direct canonical route /outlets/pune/saswad ---");
    await page.goto("http://localhost:5173/outlets/pune/saswad", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    console.log("  Current URL:", currentUrl);
    assert(currentUrl.endsWith("/outlets/pune/saswad"), "URL is canonical /outlets/pune/saswad");

    const heroText = await page.evaluate(() => {
      const el = document.querySelector("h1 + div");
      return el ? el.innerText.replace(/\s+/g, ' ').trim() : "";
    });
    console.log("  Hero Location Text found:", heroText);
    assert(heroText.includes("Your Sweet Spot in Saswad."), "Hero displays 'Your Sweet Spot in Saswad.'");

    const breadcrumb = await page.evaluate(() => {
      const nav = document.querySelector("nav[aria-label='Breadcrumb']");
      return nav ? nav.innerText.replace(/\s+/g, ' ').trim() : "";
    });
    console.log("  Breadcrumb found:", breadcrumb);
    assert(breadcrumb.includes("Pune") && breadcrumb.includes("Saswad"), "Breadcrumb includes 'Pune' and 'Saswad'");

    const bodyText = await page.evaluate(() => document.body.innerText);
    assert(bodyText.includes("Shop No. 15, Anand Plaza"), "Address contains Anand Plaza");
    assert(bodyText.includes("+91 80105 47012") || bodyText.includes("80105 47012"), "Contains Saswad phone number");

    await page.screenshot({ path: path.join(OUTPUT_DIR, "test_saswad_canonical.png") });

    // Test 2: Legacy 2-segment redirect /outlets/saswad/anand-plaza -> /outlets/pune/saswad
    console.log("\n--- TEST 2: Old 2-segment URL /outlets/saswad/anand-plaza redirect ---");
    await page.goto("http://localhost:5173/outlets/saswad/anand-plaza", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    const redirectedUrl1 = page.url();
    console.log("  Redirected to:", redirectedUrl1);
    assert(redirectedUrl1.endsWith("/outlets/pune/saswad"), "Old /outlets/saswad/anand-plaza redirects to /outlets/pune/saswad");

    // Test 3: Legacy flat redirect /outlets/cakestory-saswad -> /outlets/pune/saswad
    console.log("\n--- TEST 3: Legacy flat slug /outlets/cakestory-saswad redirect ---");
    await page.goto("http://localhost:5173/outlets/cakestory-saswad", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);
    const redirectedUrl2 = page.url();
    console.log("  Redirected to:", redirectedUrl2);
    assert(redirectedUrl2.endsWith("/outlets/pune/saswad"), "Legacy /outlets/cakestory-saswad redirects to /outlets/pune/saswad");

    // Test 4: Check Outlets listing links for Saswad
    console.log("\n--- TEST 4: Outlets directory link test ---");
    await page.goto("http://localhost:5173/outlets", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const saswadLinkFound = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a[href*='saswad']"));
      return links.map(a => a.getAttribute("href"));
    });
    console.log("  Saswad links found on /outlets page:", saswadLinkFound);
    assert(saswadLinkFound.some(href => href.includes("/outlets/pune/saswad")), "Outlets page links directly to /outlets/pune/saswad");

    console.log("\n=======================================================");
    console.log("ALL SASWAD TESTS PASSED PERFECTLY!");
    console.log("=======================================================\n");

  } finally {
    await context.close();
  }
}

runSaswadTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
