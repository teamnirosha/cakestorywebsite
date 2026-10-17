import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = "d:\\CakeStory - Website\\scripts\\output";
const USER_DATA_DIR = path.join(OUTPUT_DIR, "chrome_session_data");
const LEDGER_FILE = path.join(OUTPUT_DIR, "extraction_ledger.json");

function extractCoordinates(str) {
  if (!str) return null;
  const atMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { latitude: parseFloat(atMatch[1]), longitude: parseFloat(atMatch[2]) };
  const paramMatch = str.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (paramMatch) return { latitude: parseFloat(paramMatch[1]), longitude: parseFloat(paramMatch[2]) };
  return null;
}

async function runClusterExtraction() {
  console.log("Starting targeted cluster extraction using persistent Chrome session...");
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

  let masterLedger = [];
  if (fs.existsSync(LEDGER_FILE)) {
    try {
      masterLedger = JSON.parse(fs.readFileSync(LEDGER_FILE, "utf8"));
    } catch (e) {
      masterLedger = [];
    }
  }

  const queries = [
    "cakestory desserts pune",
    "cakestory desserts pcmc",
    "cakestory desserts kothrud",
    "cakestory desserts sinhgad road",
    "cakestory desserts wagholi pune",
    "cakestory desserts satara",
    "cakestory desserts hinjawadi",
    "cakestory desserts katraj pune",
    "cakestory desserts pimple saudagar",
    "cakestory desserts bhosari",
    "cakestory desserts akurdi",
    "cakestory desserts baner"
  ];

  for (let qIdx = 0; qIdx < queries.length; qIdx++) {
    const q = queries[qIdx];
    const targetUrl = `https://www.google.com/search?q=${encodeURIComponent(q)}&udm=local&biw=1920&bih=1431`;
    console.log(`\n======================================================`);
    console.log(`[${qIdx + 1}/${queries.length}] Query: "${q}"`);
    console.log(`======================================================`);

    try {
      await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(3000);
    } catch (err) {
      console.log(`Notice while loading query "${q}":`, err.message);
    }

    // Scroll left results pane
    await page.evaluate(() => {
      window.scrollBy(0, 1000);
      const scrollable = document.querySelectorAll("div[role='feed'], div.m6QErb, #search, div.gws-localresults");
      scrollable.forEach(el => el.scrollTop += 1500);
    });
    await page.waitForTimeout(1500);

    // Extract listing cards
    const batchListings = await page.evaluate(() => {
      const results = [];
      const cards = Array.from(document.querySelectorAll("div.VkpGBb, div.cXedhc, div.u9S4Re, [data-cid]"));
      
      cards.forEach((card, idx) => {
        const text = card.innerText || "";
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length < 2) return;

        const firstLine = lines[0] || "";
        if (firstLine.toLowerCase().includes("filters") || firstLine.toLowerCase().includes("results")) return;

        const heading = card.querySelector("[role='heading'], .fontHeadlineSmall, .OSrXXb, .dbg0pd, .BNeawe");
        const name = heading ? heading.innerText.trim() : firstLine;

        const anchors = Array.from(card.querySelectorAll("a")).map(a => ({
          href: a.href,
          text: a.innerText.trim(),
          ariaLabel: a.getAttribute("aria-label") || ""
        }));

        const directionsAnchor = anchors.find(a => 
          a.href.includes("/dir/") || 
          a.ariaLabel.toLowerCase().includes("direction") || 
          a.text.toLowerCase().includes("direction")
        );

        const mapsAnchor = anchors.find(a => 
          a.href.includes("google.com/maps") || 
          a.href.includes("/maps/place/")
        );

        const phoneMatch = text.match(/(?:\+91[\s-]?)?[6789]\d{4}[\s-]?\d{5}|(?:\+91[\s-]?)?\d{10}|0\d{2,4}[\s-]?\d{6,8}/);
        const phone = phoneMatch ? phoneMatch[0] : "";

        const hoursMatch = text.match(/(?:Open|Closed)[\s·•]?(?:until|opens)?[\s\d:]+(?:AM|PM|am|pm)?|10:00\s?(?:AM|am)\s?-\s?11:00\s?(?:PM|pm)|24 hours/i);
        const openingHours = hoursMatch ? hoursMatch[0] : "";

        let address = "";
        for (const line of lines) {
          if (
            (line.includes("Road") || line.includes("Chowk") || line.includes("Nagar") || line.includes("Pune") || line.includes("PCMC") || line.includes("Lane") || line.includes("Sector") || line.includes("Survey") || line.includes("Shop") || line.includes("Floor") || line.includes("Opp") || line.includes("Near") || line.includes("Apartment") || line.includes("Society") || line.includes("Commercial")) &&
            !line.includes("Open") && !line.includes("Closed") && !line.toLowerCase().includes("cakestory") && line.length > 6
          ) {
            address = line;
            break;
          }
        }

        results.push({
          rawIndex: idx,
          name,
          address,
          phone,
          openingHours,
          fullLines: lines,
          directionsUrl: directionsAnchor ? directionsAnchor.href : "",
          mapsUrl: mapsAnchor ? mapsAnchor.href : (anchors[0]?.href || ""),
          allLinks: anchors.map(a => a.href)
        });
      });

      return results;
    });

    console.log(`Found ${batchListings.length} raw cards for "${q}".`);

    let newCount = 0;
    for (const item of batchListings) {
      let coords = null;
      if (item.directionsUrl) coords = extractCoordinates(item.directionsUrl);
      if (!coords && item.mapsUrl) coords = extractCoordinates(item.mapsUrl);
      if (!coords) {
        for (const l of item.allLinks) {
          coords = extractCoordinates(l);
          if (coords) break;
        }
      }

      // Check duplicate against masterLedger
      const isExisting = masterLedger.some(m => {
        if (m.directionsUrl && item.directionsUrl && m.directionsUrl === item.directionsUrl) return true;
        if (m.mapsUrl && item.mapsUrl && m.mapsUrl === item.mapsUrl) return true;
        if (m.name.toLowerCase() === item.name.toLowerCase() && m.address && item.address && m.address.toLowerCase() === item.address.toLowerCase()) return true;
        if (m.fullText && item.fullLines && m.fullText === item.fullLines.join(" | ")) return true;
        return false;
      });

      if (!isExisting) {
        masterLedger.push({
          id: `cand-${masterLedger.length + 1}`,
          name: item.name,
          address: item.address,
          phone: item.phone,
          openingHours: item.openingHours,
          directionsUrl: item.directionsUrl,
          mapsUrl: item.mapsUrl,
          coordinates: coords,
          source: `Google Local Search ("${q}")`,
          fullText: item.fullLines.join(" | "),
          batch: `cluster-${qIdx + 1}`,
          collectedAt: new Date().toISOString()
        });
        newCount++;
      }
    }

    console.log(`Added ${newCount} new unique candidates from query "${q}". Total in Ledger: ${masterLedger.length}`);
    fs.writeFileSync(LEDGER_FILE, JSON.stringify(masterLedger, null, 2), "utf8");
  }

  await context.close();
  console.log(`\n======================================================`);
  console.log(`Cluster extraction complete. Final Ledger count: ${masterLedger.length}`);
  console.log(`======================================================`);
}

runClusterExtraction().catch(err => {
  console.error("Cluster extraction failed:", err);
  process.exit(1);
});
