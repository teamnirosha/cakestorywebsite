import { chromium } from "playwright-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_custom_auth_test");

async function testCustomAuthFlow() {
  console.log("Starting Custom Auth Flow Test...");
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
    // Step 1: Clear state and open login
    await page.goto("http://localhost:5173/admin/login", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("form");

    // Verify initial setup pill is visible initially
    const initialPill = await page.$("div:has-text('Initial Setup Login')");
    assert(initialPill !== null, "Initial setup pill is visible on first setup");

    // Step 2: Login with default credentials
    console.log("  Logging in with default credentials...");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "CakeStory@Admin2026");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");
    assert(page.url().endsWith("/admin/dashboard"), "Logged in to dashboard with default credentials");

    // Step 3: Go to settings and change username & password
    console.log("  Navigating to Settings to change username and password...");
    await page.goto("http://localhost:5173/admin/settings?tab=security", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("form");

    // Change Username to 'mycustomadmin'
    console.log("  Changing username to 'mycustomadmin'...");
    await page.fill('input[placeholder="e.g. admin.cakestory"]', "mycustomadmin");
    await page.fill('input[placeholder="Re-enter new username"]', "mycustomadmin");
    await page.click('button:has-text("Update Username")');
    await page.waitForTimeout(1000);

    // After updating username, it logs out to login page
    assert(page.url().endsWith("/admin/login"), "Changing username redirects to login");

    // Log in with new username 'mycustomadmin' and current default password
    console.log("  Logging in with updated username 'mycustomadmin'...");
    await page.fill('input[type="text"]', "mycustomadmin");
    await page.fill('input[type="password"]', "CakeStory@Admin2026");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");

    // Now change password to 'MyCustomPass@2026'
    console.log("  Changing password in Settings...");
    await page.goto("http://localhost:5173/admin/settings?tab=security", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("form");

    await page.fill('input[placeholder="Enter current password to verify"]', "CakeStory@Admin2026");
    await page.fill('input[placeholder="Min 6 characters"]', "MyCustomPass@2026");
    await page.fill('input[placeholder="Re-enter new password"]', "MyCustomPass@2026");
    await page.click('button:has-text("Change Password")');
    await page.waitForTimeout(1000);

    // After updating password, it logs out to login page
    assert(page.url().endsWith("/admin/login"), "Changing password redirects to login");

    // Step 4: Verify default credentials pill is GONE
    console.log("  Verifying initial setup pill is now completely GONE...");
    const pillAfterCustom = await page.$("div:has-text('Initial Setup Login')");
    assert(pillAfterCustom === null, "Default login pill is NOT rendered after custom credentials are set");

    // Step 5: Test that default credentials are REJECTED
    console.log("  Attempting login with old default 'admin' / 'CakeStory@Admin2026'...");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "CakeStory@Admin2026");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const errorMsg1 = await page.evaluate(() => {
      const el = document.querySelector(".bg-rose-50");
      return el ? el.innerText : "";
    });
    console.log("  Rejection message for default credentials:", errorMsg1);
    assert(errorMsg1.includes("Invalid username or password"), "Default credentials are strictly REJECTED!");
    assert(page.url().endsWith("/admin/login"), "User remains on login page (rejected)");

    // Step 6: Test that custom credentials SUCCEED
    console.log("  Logging in with custom credentials 'mycustomadmin' / 'MyCustomPass@2026'...");
    await page.fill('input[type="text"]', "mycustomadmin");
    await page.fill('input[type="password"]', "MyCustomPass@2026");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");
    assert(page.url().endsWith("/admin/dashboard"), "Custom credentials successfully log in to dashboard!");

    // Step 7: Check settings page displays custom credentials active banner
    await page.goto("http://localhost:5173/admin/settings?tab=security", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("div:has-text('Custom Administrator Credentials Active')");
    const customCallout = await page.$("div:has-text('Custom Administrator Credentials Active')");
    assert(customCallout !== null, "Custom credentials active callout is visible in settings");

    await page.screenshot({ path: path.join(OUTPUT_DIR, "test_custom_credentials_verified.png") });

    console.log("\n=======================================================");
    console.log("CUSTOM CREDENTIAL ENFORCEMENT TEST PASSED 100%!");
    console.log("=======================================================\n");

  } finally {
    await context.close();
  }
}

testCustomAuthFlow().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
