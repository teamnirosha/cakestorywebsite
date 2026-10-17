import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = "https://www.google.com/search?q=cakestory&sca_esv=7c1e84b1a6318645&udm=local&biw=1920&bih=1431&sxsrf=APpeQnu9FNU_CjzWzUZ9pgkAH-xWAotqXg%3A1792117547422&ei=K4vRarqWGayz4-EP3fXtiAs&ved=0ahUKEwj617yOvr2XAxWs2TgGHd16G7EQ4dUDCBA&uact=5&oq=cakestory&gs_lp=EhZnd3Mtd2l6LW1vZGVsZXNzLWxvY2FsIgljYWtlc3RvcnkyChAAGIAEGBQYhwIyBRAAGIAEMgUQABiABDIFEAAYgAQyCBAAGIAEGMkDMggQABiABBiSAzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARI7JwBUPh9WI-WAXADeACQAQCYAacBoAGYCaoBAzAuObgBA8gBAPgBAZgCDKACzwnCAgcQIxiuAhgnwgICECbCAgUQABjvBcICCBAAGIAEGKIEwgIEECMYJ8ICCxAAGIAEGIoFGJECwgIIEAAYgAQYsQPCAgsQABiABBixAxiDAcICChAAGIAEGIoFGEPCAhAQABiABBiKBRhDGLEDGIMBwgINEAAYgAQYigUYQxi0B8ICDRAAGIAEGIoFGEMYsQPCAhAQABiABBiKBRhDGLEDGMkDwgILEAAYgAQYigUYkgOYAwCIBgGSBwMzLjmgB7M0sgcDMC45uAfDCcIHBTAuNy41yAclgAgB&sclient=gws-wiz-modeless-local";

const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function inspectSearch() {
  console.log("Launching Playwright with normal Chrome browser interface...");
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: false,
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox"
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  });

  const page = await context.newPage();

  console.log("Navigating to exact mandatory starting URL...");
  try {
    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 45000 });
  } catch (e) {
    console.log("Navigation timeout or load notice:", e.message);
  }

  await page.waitForTimeout(4000);

  // Check for CAPTCHA / bot detection
  const pageTitle = await page.title();
  const pageContent = await page.content();
  const isCaptcha = 
    pageTitle.toLowerCase().includes("captcha") ||
    pageTitle.toLowerCase().includes("unusual traffic") ||
    pageContent.includes("unusual traffic from your computer network") ||
    pageContent.includes("recaptcha") ||
    pageContent.includes("verify you're human") ||
    (await page.$("#captcha-form")) !== null ||
    (await page.$("iframe[src*='recaptcha']")) !== null;

  const screenshotPath = path.join(OUTPUT_DIR, "google_search_initial.png");
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log("Initial screenshot saved to:", screenshotPath);

  if (isCaptcha) {
    console.log("=== CAPTCHA DETECTED ===");
    console.log("Google has presented a CAPTCHA or human verification challenge.");
    console.log("Automated navigation stopped in compliance with instructions.");
    // Write status file
    fs.writeFileSync(
      path.join(OUTPUT_DIR, "inspection_status.json"),
      JSON.stringify({ status: "CAPTCHA_REQUIRED", title: pageTitle, screenshot: screenshotPath }, null, 2)
    );
    // Keep browser open for user or close after saving status
    await page.waitForTimeout(5000);
    await browser.close();
    return;
  }

  console.log("No CAPTCHA detected on initial load. Title:", pageTitle);

  // Check for consent popups
  try {
    const consentButtons = await page.$$("button, [role='button']");
    for (const btn of consentButtons) {
      const text = (await btn.innerText()).toLowerCase();
      if (text.includes("accept all") || text.includes("i agree") || text.includes("agree")) {
        console.log("Dismissing consent dialog with:", text);
        await btn.click();
        await page.waitForTimeout(2000);
        break;
      }
    }
  } catch (err) {
    console.log("Consent check notice:", err.message);
  }

  // Inspect page structure and extract visible local search listings
  const extracted = await page.evaluate(() => {
    const results = [];
    
    // Look for local search listing containers
    // Common Google local search selectors:
    // [data-cid], [jsaction*='mouseover:pane'], .VkpGBb, div[role='article'], .rllt__details, etc.
    const items = document.querySelectorAll("[data-cid], .VkpGBb, div.cXedhc, div.u9S4Re, div[jscontroller][data-mid]");
    
    items.forEach((item, index) => {
      const text = item.innerText || "";
      const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
      
      const linkElem = item.querySelector("a[href*='maps'], a[href*='search'], a[data-cid]");
      const link = linkElem ? linkElem.href : "";
      
      const titleElem = item.querySelector("[role='heading'], .fontHeadlineSmall, .OSrXXb, .dbg0pd, .BNeawe");
      const name = titleElem ? titleElem.innerText.trim() : (lines[0] || "");
      
      results.push({
        index: index + 1,
        name: name,
        fullText: lines.join(" | "),
        lines: lines,
        link: link,
        htmlSnippet: item.outerHTML.slice(0, 300)
      });
    });

    return {
      title: document.title,
      totalFoundElements: items.length,
      results: results,
      bodyTextSnippet: document.body.innerText.slice(0, 2000)
    };
  });

  console.log(`Found ${extracted.totalFoundElements} candidate local listing elements.`);
  
  const resultsPath = path.join(OUTPUT_DIR, "extracted_raw.json");
  fs.writeFileSync(resultsPath, JSON.stringify(extracted, null, 2));
  console.log("Raw extraction saved to:", resultsPath);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "inspection_status.json"),
    JSON.stringify({
      status: "SUCCESS",
      title: pageTitle,
      totalFound: extracted.totalFoundElements,
      screenshot: screenshotPath,
      resultsCount: extracted.results.length
    }, null, 2)
  );

  await page.waitForTimeout(3000);
  await browser.close();
  console.log("Inspection script finished.");
}

inspectSearch().catch(err => {
  console.error("Inspection error:", err);
  process.exit(1);
});
