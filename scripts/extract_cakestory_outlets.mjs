import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const TARGET_URL = "https://www.google.com/search?q=cakestory&sca_esv=7c1e84b1a6318645&udm=local&biw=1920&bih=1431&sxsrf=APpeQnu9FNU_CjzWzUZ9pgkAH-xWAotqXg%3A1792117547422&ei=K4vRarqWGayz4-EP3fXtiAs&ved=0ahUKEwj617yOvr2XAxWs2TgGHd16G7EQ4dUDCBA&uact=5&oq=cakestory&gs_lp=EhZnd3Mtd2l6LW1vZGVsZXNzLWxvY2FsIgljYWtlc3RvcnkyChAAGIAEGBQYhwIyBRAAGIAEMgUQABiABDIFEAAYgAQyCBAAGIAEGMkDMggQABiABBiSAzIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgARI7JwBUPh9WI-WAXADeACQAQCYAacBoAGYCaoBAzAuObgBA8gBAPgBAZgCDKACzwnCAgcQIxiuAhgnwgICECbCAgUQABjvBcICCBAAGIAEGKIEwgIEECMYJ8ICCxAAGIAEGIoFGJECwgIIEAAYgAQYsQPCAgsQABiABBixAxiDAcICChAAGIAEGIoFGEPCAhAQABiABBiKBRhDGLEDGIMBwgINEAAYgAQYigUYQxi0B8ICDRAAGIAEGIoFGEMYsQPCAhAQABiABBiKBRhDGLEDGMkDwgILEAAYgAQYigUYkgOYAwCIBgGSBwMzLjmgB7M0sgcDMC45uAfDCcIHBTAuNy41yAclgAgB&sclient=gws-wiz-modeless-local";

const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_session_data");

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(USER_DATA_DIR)) fs.mkdirSync(USER_DATA_DIR, { recursive: true });

function extractCoordinatesFromUrl(url) {
  if (!url) return null;
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { latitude: parseFloat(atMatch[1]), longitude: parseFloat(atMatch[2]) };
  const paramMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (paramMatch) return { latitude: parseFloat(paramMatch[1]), longitude: parseFloat(paramMatch[2]) };
  return null;
}

async function runExtraction() {
  console.log("Launching persistent Chrome browser session...");
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    executablePath: CHROME_PATH,
    headless: false,
    viewport: { width: 1920, height: 1080 },
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox"
    ],
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  });

  const page = context.pages()[0] || await context.newPage();

  console.log("Navigating to starting Google Local Search URL...");
  try {
    await page.goto(TARGET_URL, { waitUntil: "domcontentloaded", timeout: 60000 });
  } catch (err) {
    console.log("Navigation notice:", err.message);
  }

  const checkCaptcha = async () => {
    try {
      const title = (await page.title()).toLowerCase();
      const content = (await page.content()).toLowerCase();
      return (
        title.includes("captcha") ||
        title.includes("unusual traffic") ||
        content.includes("unusual traffic from your computer network") ||
        content.includes("recaptcha") ||
        content.includes("verify you're human") ||
        (await page.$("#captcha-form")) !== null ||
        (await page.$("iframe[src*='recaptcha']")) !== null
      );
    } catch {
      return false;
    }
  };

  let isCaptcha = await checkCaptcha();
  if (isCaptcha) {
    console.log("\n========================================================");
    console.log(">>> CAPTCHA CHALLENGE DETECTED IN CHROME WINDOW <<<");
    console.log("Please complete the 'I'm not a robot' verification checkbox in the open Chrome window.");
    console.log("Waiting for user verification (up to 15 minutes)...");
    console.log("========================================================\n");

    const maxWaitTime = 900000; // 15 minutes
    const startTime = Date.now();

    while (isCaptcha && Date.now() - startTime < maxWaitTime) {
      await page.waitForTimeout(3000);
      isCaptcha = await checkCaptcha();
    }

    if (isCaptcha) {
      console.log("Verification not completed within window. Halting automated process.");
      await context.close();
      process.exit(2);
    }

    console.log("\n>>> CAPTCHA RESOLVED! Results are now accessible. Continuing extraction... <<<\n");
    await page.waitForTimeout(4000);
  }

  // Handle consent popup if present
  try {
    const buttons = await page.$$("button, [role='button']");
    for (const b of buttons) {
      const text = (await b.innerText()).toLowerCase();
      if (text.includes("accept all") || text.includes("i agree") || text.includes("agree")) {
        console.log("Dismissing consent dialog...");
        await b.click();
        await page.waitForTimeout(2000);
        break;
      }
    }
  } catch (e) {}

  const allCollected = [];
  let pageNumber = 1;
  const maxPages = 15;

  while (pageNumber <= maxPages) {
    console.log(`\n--- Inspecting Local Results Batch/Page ${pageNumber} ---`);
    await page.waitForTimeout(3000);

    // Scroll to load all listings in the results pane
    for (let scroll = 0; scroll < 8; scroll++) {
      await page.evaluate(() => {
        window.scrollBy(0, 800);
        const feed = document.querySelector("div[role='feed'], div.m6QErb, #search");
        if (feed) feed.scrollTop += 800;
      });
      await page.waitForTimeout(800);
    }

    const pageScreenshot = path.join(OUTPUT_DIR, `results_page_${pageNumber}.png`);
    await page.screenshot({ path: pageScreenshot });
    console.log(`Saved screenshot of page ${pageNumber} to:`, pageScreenshot);

    const pageItems = await page.evaluate(() => {
      const cards = document.querySelectorAll(
        "div[data-cid], .VkpGBb, div.cXedhc, div.u9S4Re, div[jscontroller][data-mid], div.rllt__details"
      );
      
      const items = [];
      cards.forEach((card, idx) => {
        const text = card.innerText || "";
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return;

        const heading = card.querySelector("[role='heading'], .fontHeadlineSmall, .OSrXXb, .dbg0pd, .BNeawe");
        const name = heading ? heading.innerText.trim() : lines[0];

        const allLinks = Array.from(card.querySelectorAll("a")).map(a => ({
          href: a.href,
          text: a.innerText.trim(),
          ariaLabel: a.getAttribute("aria-label") || ""
        }));

        const dirLink = allLinks.find(l => l.href.includes("/dir/") || l.ariaLabel.toLowerCase().includes("directions") || l.text.toLowerCase().includes("directions"));
        const mapsLink = allLinks.find(l => l.href.includes("google.com/maps") || l.href.includes("/maps/place/"));

        const phoneMatch = text.match(/(?:\+91[\s-]?)?[6789]\d{4}[\s-]?\d{5}|(?:\+91[\s-]?)?\d{10}|0\d{2,4}[\s-]?\d{6,8}/);
        const phone = phoneMatch ? phoneMatch[0] : "";

        const hoursMatch = text.match(/(?:Open|Closed)[\s·•]?(?:until|opens)?[\s\d:]+(?:AM|PM|am|pm)?|10:00\s?(?:AM|am)\s?-\s?11:00\s?(?:PM|pm)|24 hours/i);
        const openingHours = hoursMatch ? hoursMatch[0] : "";

        let address = "";
        for (const line of lines) {
          if (
            (line.includes("Road") || line.includes("Chowk") || line.includes("Nagar") || line.includes("Pune") || line.includes("PCMC") || line.includes("Lane") || line.includes("Sector") || line.includes("Survey") || line.includes("Shop") || line.includes("Floor") || line.includes("Opp") || line.includes("Near")) &&
            !line.includes("Open") && !line.includes("Closed") && !line.includes("CakeStory") && line.length > 8
          ) {
            address = line;
            break;
          }
        }

        items.push({
          pageIndex: idx + 1,
          name,
          address,
          phone,
          openingHours,
          fullText: lines.join(" | "),
          links: allLinks.map(l => l.href).filter(Boolean),
          directionsUrl: dirLink ? dirLink.href : "",
          mapsUrl: mapsLink ? mapsLink.href : (allLinks[0]?.href || "")
        });
      });

      return items;
    });

    console.log(`Page ${pageNumber}: Found ${pageItems.length} candidate listings.`);

    for (const item of pageItems) {
      let coords = null;
      for (const link of item.links) {
        coords = extractCoordinatesFromUrl(link);
        if (coords) break;
      }

      allCollected.push({
        ...item,
        page: pageNumber,
        coordinates: coords,
        source: "Google Local Search"
      });
    }

    // Try clicking next page button or "More results"
    const nextButton = await page.$("a#pnnext, a[aria-label='Next page'], [role='button'][aria-label='Next'], #botstuff a[aria-label*='Next']");
    if (nextButton) {
      console.log(`Navigating to page ${pageNumber + 1}...`);
      await nextButton.click();
      pageNumber++;
      await page.waitForTimeout(4000);
    } else {
      console.log("Reached end of accessible pagination for this query.");
      break;
    }
  }

  console.log(`\n======================================================`);
  console.log(`Total listings collected: ${allCollected.length}`);
  console.log(`======================================================\n`);

  const ledgerPath = path.join(OUTPUT_DIR, "extraction_ledger.json");
  fs.writeFileSync(ledgerPath, JSON.stringify(allCollected, null, 2));
  console.log("Extraction ledger saved to:", ledgerPath);

  await page.waitForTimeout(2000);
  await context.close();
  console.log("Extraction process finished.");
}

runExtraction().catch(err => {
  console.error("Extraction error:", err);
  process.exit(1);
});
