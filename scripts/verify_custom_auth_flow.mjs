import { chromium } from "playwright-core";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_custom_auth_test");

async function testCustomAuthFlow() {
  console.log("Starting Custom Auth Flow Test with Pure SHA-256 & Zero Displayed Credentials...");
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

    // Verify initial setup login option is NOT visible on the login page
    const pill = await page.$("div:has-text('Initial Setup Login')");
    assert(pill === null, "No initial setup option / credential pill on login page (100% clean)");

    // Step 2: Login with initial credentials: admin / CakeStory#Admin2026
    console.log("  Logging in with new initial credentials (admin / CakeStory#Admin2026)...");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "CakeStory#Admin2026");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");
    assert(page.url().endsWith("/admin/dashboard"), "Logged in to dashboard with initial credentials");

    // Step 3: Go to settings and change username & password
    console.log("  Navigating to Settings to change username and password...");
    await page.goto("http://localhost:5173/admin/settings?tab=security", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("form");

    // Change Username to 'mahesh_admin'
    console.log("  Changing username to 'mahesh_admin'...");
    await page.fill('input[placeholder="e.g. admin.cakestory"]', "mahesh_admin");
    await page.fill('input[placeholder="Re-enter new username"]', "mahesh_admin");
    await page.click('button:has-text("Update Username")');
    await page.waitForTimeout(1000);

    // After updating username, it logs out to login page
    assert(page.url().endsWith("/admin/login"), "Changing username logs out and redirects to login");

    // Log in with new username 'mahesh_admin' and current initial password
    console.log("  Logging in with updated username 'mahesh_admin'...");
    await page.fill('input[type="text"]', "mahesh_admin");
    await page.fill('input[type="password"]', "CakeStory#Admin2026");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");

    // Now change password to 'CakeStory@Secure2026!'
    console.log("  Changing password in Settings to personal custom password...");
    await page.goto("http://localhost:5173/admin/settings?tab=security", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("form");

    await page.fill('input[placeholder="Enter current password to verify"]', "CakeStory#Admin2026");
    await page.fill('input[placeholder="Min 6 characters"]', "CakeStory@Secure2026!");
    await page.fill('input[placeholder="Re-enter new password"]', "CakeStory@Secure2026!");
    await page.click('button:has-text("Change Password")');
    await page.waitForTimeout(1000);

    // After updating password, it logs out to login page
    assert(page.url().endsWith("/admin/login"), "Changing password logs out and redirects to login");

    // Step 4: Verify default / initial credentials are REJECTED
    console.log("  Attempting login with old initial 'admin' / 'CakeStory#Admin2026'...");
    await page.fill('input[type="text"]', "admin");
    await page.fill('input[type="password"]', "CakeStory#Admin2026");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);

    const errorMsg1 = await page.evaluate(() => {
      const el = document.querySelector(".bg-rose-50");
      return el ? el.innerText : "";
    });
    console.log("  Rejection message for initial credentials:", errorMsg1);
    assert(errorMsg1.includes("Invalid username or password"), "Initial credentials are permanently REJECTED!");
    assert(page.url().endsWith("/admin/login"), "User remains on login page (rejected)");

    // Step 5: Test that custom credentials SUCCEED
    console.log("  Logging in with custom credentials 'mahesh_admin' / 'CakeStory@Secure2026!'...");
    await page.fill('input[type="text"]', "mahesh_admin");
    await page.fill('input[type="password"]', "CakeStory@Secure2026!");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/admin/dashboard");
    assert(page.url().endsWith("/admin/dashboard"), "Custom credentials successfully authenticate and open dashboard!");

    // Step 6: Check settings page displays custom credentials active banner
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
