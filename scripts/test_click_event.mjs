import { chromium } from "playwright-core";

async function testClickEvent() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  
  page.on("console", (msg) => console.log("PAGE:", msg.text()));

  await page.goto("http://localhost:5173", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    const stage = document.querySelector("#gallery [style*='perspective']");
    if (stage) stage.scrollIntoView({ behavior: "instant", block: "center" });

    const activeCard = document.querySelector("#gallery [role='button'].border-\\[\\#d4af37\\]");
    if (activeCard) {
      activeCard.addEventListener("click", (e) => {
        console.log("NATIVE CLICK DETECTED ON activeCard, target:", e.target.tagName, e.target.className);
      });
    }
  });

  const activeCard = page.locator("#gallery [role='button'].border-\\[\\#d4af37\\]").first();
  console.log("Calling Playwright activeCard.click()...");
  await activeCard.click();
  await page.waitForTimeout(500);

  await browser.close();
}

testClickEvent().catch(console.error);
