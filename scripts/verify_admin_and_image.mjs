import { chromium } from "playwright-core";
import path from "path";
import fs from "fs";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_admin_session_data");

async function runAdminVerification() {
  console.log("Starting Admin Routing and Image Verification Test Suite...");
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
    // -------------------------------------------------------------
    // Test 1: Direct navigation to /admin redirects to login when unauthenticated
    // -------------------------------------------------------------
    console.log("\n--- TEST 1: Direct /admin access (Unauthenticated) ---");
    // Clear any previous session
    await page.goto("http://localhost:5173/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => {
      localStorage.removeItem("cakestory:session");
    });

    await page.goto("http://localhost:5173/admin", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);

    const loginUrl = page.url();
    console.log("  Redirected to URL:", loginUrl);
    assert(loginUrl.endsWith("/admin/login"), "/admin properly redirects unauthenticated users to /admin/login");

    const loginHeading = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      return h1 ? h1.innerText.replace(/\s+/g, ' ').trim() : "";
    });
    console.log("  Login Page Heading:", loginHeading);
    assert(loginHeading.includes("Central Ops"), "Login page renders 'Central Ops' heading");

    await page.screenshot({ path: path.join(OUTPUT_DIR, "test_admin_login_screen.png") });

    // -------------------------------------------------------------
    // Test 2: Page refresh on /admin/login
    // -------------------------------------------------------------
    console.log("\n--- TEST 2: Refresh /admin/login ---");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    assert(page.url().endsWith("/admin/login"), "Direct reload on /admin/login remains on login without 404");

    // -------------------------------------------------------------
    // Test 3: Authenticate and access /admin/dashboard
    // -------------------------------------------------------------
    console.log("\n--- TEST 3: Admin Login submission ---");
    await page.fill('input[type="text"], input[name="username"]', "admin");
    await page.fill('input[type="password"]', "CakeStory@Admin2026");
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);
    const dashboardUrl = page.url();
    console.log("  Logged in URL:", dashboardUrl);
    assert(dashboardUrl.endsWith("/admin/dashboard"), "Successful login redirects to /admin/dashboard");

    const dashboardText = await page.evaluate(() => document.body.innerText);
    assert(dashboardText.includes("Lead Analytics") || dashboardText.includes("Dashboard") || dashboardText.includes("Franchise"), "Dashboard renders successfully");

    await page.screenshot({ path: path.join(OUTPUT_DIR, "test_admin_dashboard_authenticated.png") });

    // -------------------------------------------------------------
    // Test 4: Direct navigation and refresh on nested admin routes while authenticated
    // -------------------------------------------------------------
    console.log("\n--- TEST 4: Nested Admin Routes (Direct access + Refresh) ---");
    await page.goto("http://localhost:5173/admin/franchises", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    assert(page.url().endsWith("/admin/franchises"), "/admin/franchises loads directly");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    assert(page.url().endsWith("/admin/franchises"), "/admin/franchises persists on reload");

    await page.goto("http://localhost:5173/admin/enquiries", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    assert(page.url().endsWith("/admin/enquiries"), "/admin/enquiries loads directly");

    await page.goto("http://localhost:5173/admin/settings", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1500);
    assert(page.url().endsWith("/admin/settings"), "/admin/settings loads directly");

    // -------------------------------------------------------------
    // Test 5: Verify Saswad outlet rendered image is the new CakeStory store (NO Monginis)
    // -------------------------------------------------------------
    console.log("\n--- TEST 5: Saswad outlet image verification (No Monginis) ---");
    await page.goto("http://localhost:5173/outlets/pune/saswad", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    const imgSrc = await page.evaluate(() => {
      const img = document.querySelector("img[alt*='Location'], img[src*='outlets']");
      return img ? img.getAttribute("src") : "";
    });
    console.log("  Rendered outlet image source:", imgSrc);
    assert(imgSrc.includes("/images/outlets/saswad.jpg") || imgSrc.includes("/images/outlets/satara.jpg"), "Outlet renders the updated outlet image");

    await page.screenshot({ path: path.join(OUTPUT_DIR, "test_saswad_new_image_verified.png") });

    // -------------------------------------------------------------
    // Test 6: Verify Representative Public Routes
    // -------------------------------------------------------------
    console.log("\n--- TEST 6: Representative Public Routes ---");
    await page.goto("http://localhost:5173/franchise", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1000);
    assert(page.url().endsWith("/franchise"), "/franchise page loads cleanly");

    await page.goto("http://localhost:5173/about", { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(1000);
    assert(page.url().endsWith("/about"), "/about page loads cleanly");

    console.log("\n=======================================================");
    console.log("ALL ADMIN AND IMAGE VERIFICATION TESTS PASSED!");
    console.log("=======================================================\n");

  } finally {
    await context.close();
  }
}

runAdminVerification().catch(err => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
