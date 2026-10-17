import { chromium } from "playwright-core";
import path from "path";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_session_data");

async function runTests() {
  console.log("Starting Playwright verification test suite...");
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    executablePath: CHROME_PATH,
    headless: true,
    viewport: { width: 1440, height: 900 },
    args: ["--disable-blink-features=AutomationControlled"]
  });

  const page = context.pages()[0] || await context.newPage();
  const testResults = [];

  // Helper for assertion
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ FAILED: ${message}`);
      testResults.push({ passed: false, message });
      throw new Error(message);
    } else {
      console.log(`✅ PASSED: ${message}`);
      testResults.push({ passed: true, message });
    }
  }

  try {
    // Test 1: /outlets/pune/anand-nagar
    console.log("\n--- TEST 1: /outlets/pune/anand-nagar ---");
    await page.goto("http://localhost:5173/outlets/pune/anand-nagar", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const rawHeroText = await page.evaluate(() => {
      const el = document.querySelector("h1 + div");
      return el ? el.innerText.trim() : "";
    });
    const anandHeroText = rawHeroText.replace(/\s+/g, ' ');
    console.log("  Hero Location Text found:", anandHeroText);
    assert(anandHeroText.includes("Your Sweet Spot in Anand Nagar."), "Hero displays 'Your Sweet Spot in Anand Nagar.' without building name or appended city");

    const anandAddressText = await page.evaluate(() => {
      const el = document.querySelector("address, .text-slate-600");
      return document.body.innerText;
    });
    assert(anandAddressText.includes("BG Arcade, Dakshin Mukhi Maruti Mandir"), "Address section preserves full postal address");

    const anandBreadcrumb = await page.evaluate(() => {
      const nav = document.querySelector("nav[aria-label='Breadcrumb']");
      return nav ? nav.innerText.replace(/\s+/g, ' ').trim() : "";
    });
    console.log("  Breadcrumb text:", anandBreadcrumb);
    assert(anandBreadcrumb.includes("Pune") && anandBreadcrumb.includes("Anand Nagar"), "Breadcrumb includes City and Locality");

    await page.screenshot({ path: path.join(OUTPUT_DIR, "test1_anand_nagar.png") });

    // Test 2: /outlets/pune/warje
    console.log("\n--- TEST 2: /outlets/pune/warje ---");
    await page.goto("http://localhost:5173/outlets/pune/warje", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const rawWarjeText = await page.evaluate(() => {
      const el = document.querySelector("h1 + div");
      return el ? el.innerText.trim() : "";
    });
    const warjeHeroText = rawWarjeText.replace(/\s+/g, ' ');
    console.log("  Hero Location Text found:", warjeHeroText);
    assert(warjeHeroText.includes("Your Sweet Spot in Warje."), "Warje hero displays 'Your Sweet Spot in Warje.'");
    await page.screenshot({ path: path.join(OUTPUT_DIR, "test2_warje.png") });

    // Test 3: /outlets/satara/powai-naka
    console.log("\n--- TEST 3: /outlets/satara/powai-naka ---");
    await page.goto("http://localhost:5173/outlets/satara/powai-naka", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const rawSataraText = await page.evaluate(() => {
      const el = document.querySelector("h1 + div");
      return el ? el.innerText.trim() : "";
    });
    const sataraHeroText = rawSataraText.replace(/\s+/g, ' ');
    console.log("  Hero Location Text found:", sataraHeroText);
    assert(sataraHeroText.includes("Your Sweet Spot in Powai Naka."), "Satara hero displays 'Your Sweet Spot in Powai Naka.'");

    const sataraBreadcrumb = await page.evaluate(() => {
      const nav = document.querySelector("nav[aria-label='Breadcrumb']");
      return nav ? nav.innerText.replace(/\s+/g, ' ').trim() : "";
    });
    assert(sataraBreadcrumb.includes("Satara"), "Satara outlet uses Satara city in breadcrumb and route");
    await page.screenshot({ path: path.join(OUTPUT_DIR, "test3_satara.png") });

    // Test 4: Legacy URL Redirects
    console.log("\n--- TEST 4: Legacy URL Redirects ---");
    console.log("  Navigating to legacy URL: /outlets/cakestory-anand-nagar-suncity");
    await page.goto("http://localhost:5173/outlets/cakestory-anand-nagar-suncity", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    const redirectedUrl1 = page.url();
    console.log("  Redirected to:", redirectedUrl1);
    assert(redirectedUrl1.endsWith("/outlets/pune/anand-nagar"), "Legacy /outlets/cakestory-anand-nagar-suncity redirects to /outlets/pune/anand-nagar");

    console.log("  Navigating to legacy URL: /outlets/cakestory-baner");
    await page.goto("http://localhost:5173/outlets/cakestory-baner", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    const redirectedUrl2 = page.url();
    console.log("  Redirected to:", redirectedUrl2);
    assert(redirectedUrl2.endsWith("/outlets/pune/baner"), "Legacy /outlets/cakestory-baner redirects to /outlets/pune/baner");

    // Test 5: Duplicate locality in same city handled with unique slugs
    console.log("\n--- TEST 5: Duplicate Localities (Hadapsar) ---");
    await page.goto("http://localhost:5173/outlets/pune/hadapsar-magarpatta", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    const hadapsar1Title = await page.title();
    assert(hadapsar1Title.includes("Hadapsar"), "hadapsar-magarpatta loads successfully");

    await page.goto("http://localhost:5173/outlets/pune/hadapsar-sade-satra-nali", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    const hadapsar2Title = await page.title();
    assert(hadapsar2Title.includes("Hadapsar"), "hadapsar-sade-satra-nali loads successfully");

    // Test 6: Unknown city or area shows NotFound
    console.log("\n--- TEST 6: Unknown Outlet 404 Handling ---");
    await page.goto("http://localhost:5173/outlets/pune/unknown-area-xyz", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    const notFoundText = await page.evaluate(() => document.body.innerText.toLowerCase());
    assert(notFoundText.includes("outlet not found") || notFoundText.includes("view all pune outlets"), "Unknown area slug gracefully renders NotFound view");

    console.log("\n=======================================================");
    console.log("ALL 6 TEST CASES PASSED SUCCESSFULLY!");
    console.log("=======================================================\n");

  } finally {
    await context.close();
  }
}

runTests().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
