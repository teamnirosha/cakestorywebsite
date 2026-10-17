import { chromium } from "playwright-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_auth_test");

async function testAuthVariations() {
  console.log("Testing Admin Credentials & Auto-Fill...");
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
    // Navigate to login page
    await page.goto("http://localhost:5173/admin/login", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1000);

    // Verify Default Login pill is visible
    const pillText = await page.evaluate(() => {
      const el = document.querySelector(".bg-amber-50\\/90, div:has(strong)");
      return el ? el.innerText : "";
    });
    console.log("  Pill Text found:", pillText);
    assert(pillText.includes("CakeStory@Admin2026"), "Default login credentials pill is displayed");

    // Click "Fill Credentials" button
    console.log("  Clicking 'Fill Credentials' button...");
    await page.click("button:has-text('Fill Credentials')");
    await page.waitForTimeout(500);

    const filledUsername = await page.inputValue('input[type="text"]');
    const filledPassword = await page.inputValue('input[type="password"]');
    console.log(`  Auto-filled username: '${filledUsername}', password length: ${filledPassword.length}`);
    assert(filledUsername === "admin", "Username auto-filled with 'admin'");
    assert(filledPassword === "CakeStory@Admin2026", "Password auto-filled with 'CakeStory@Admin2026'");

    // Submit form
    console.log("  Submitting auto-filled credentials...");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    assert(page.url().endsWith("/admin/dashboard"), "Auto-filled credentials log in successfully to dashboard");
    console.log("✅ Auto-Fill login test passed!");

    // Test alias login: logout and try with cakestory@123
    console.log("  Testing logout & alternate password (cakestory@123)...");
    await page.evaluate(() => localStorage.removeItem("cakestory:session"));
    await page.goto("http://localhost:5173/admin/login", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "cakestory@123");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    assert(page.url().endsWith("/admin/dashboard"), "Login with cakestory@123 also succeeds!");

    // Test alias login: admin123
    console.log("  Testing logout & alternate password (admin123)...");
    await page.evaluate(() => localStorage.removeItem("cakestory:session"));
    await page.goto("http://localhost:5173/admin/login", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    await page.fill('input[type="text"]', "admin@cakestorydesserts.in");
    await page.fill('input[type="password"]', "admin123");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    assert(page.url().endsWith("/admin/dashboard"), "Login with email + admin123 succeeds!");

    console.log("\n=======================================================");
    console.log("ALL CREDENTIAL COMBINATIONS TESTED AND VERIFIED!");
    console.log("=======================================================\n");

  } finally {
    await context.close();
  }
}

testAuthVariations().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
