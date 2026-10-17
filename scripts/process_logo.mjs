import fs from "fs";
import { chromium } from "playwright-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const INPUT_JPG = "d:/CakeStory - Website/src/assets/logo/gold-logo-raw.jpg";
const OUTPUT_PNG = "d:/CakeStory - Website/src/assets/logo/gold-logo-transparent.png";

async function processTransparency() {
  const b64 = fs.readFileSync(INPUT_JPG).toString("base64");
  const dataUri = "data:image/jpeg;base64," + b64;

  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.goto("about:blank");

  const pngDataUri = await page.evaluate(async (uri) => {
    const img = new Image();
    img.src = uri;
    await img.decode();

    const canvas = document.createElement("canvas");
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // BFS Flood Fill from all outer boundaries
    // We only make exterior pixels transparent, preserving any interior drop-shadows
    const visited = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;

    // Helper to get index
    const idx = (x, y) => y * w + x;

    // Push all boundary pixels
    for (let x = 0; x < w; x++) {
      queue[tail++] = idx(x, 0);
      visited[idx(x, 0)] = 1;
      queue[tail++] = idx(x, h - 1);
      visited[idx(x, h - 1)] = 1;
    }
    for (let y = 1; y < h - 1; y++) {
      queue[tail++] = idx(0, y);
      visited[idx(0, y)] = 1;
      queue[tail++] = idx(w - 1, y);
      visited[idx(w - 1, y)] = 1;
    }

    const BLACK_THRESHOLD = 32;

    while (head < tail) {
      const curr = queue[head++];
      const cx = curr % w;
      const cy = Math.floor(curr / w);
      const pIdx = curr * 4;

      const r = data[pIdx];
      const g = data[pIdx + 1];
      const b = data[pIdx + 2];
      const maxBrightness = Math.max(r, g, b);

      if (maxBrightness < BLACK_THRESHOLD) {
        // Connected to outside and dark -> mark as exterior
        data[pIdx + 3] = 0; // Transparent

        // Expand to 4 neighbors
        const neighbors = [
          cx > 0 ? idx(cx - 1, cy) : -1,
          cx < w - 1 ? idx(cx + 1, cy) : -1,
          cy > 0 ? idx(cx, cy - 1) : -1,
          cy < h - 1 ? idx(cx, cy + 1) : -1,
        ];

        for (const n of neighbors) {
          if (n !== -1 && !visited[n]) {
            visited[n] = 1;
            queue[tail++] = n;
          }
        }
      }
    }

    // Now anti-alias the transition edge between exterior (alpha 0) and logo
    // Smooth falloff for edge pixels (brightness between 10 and 65 adjacent to transparent)
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const c = idx(x, y);
        const pIdx = c * 4;
        if (data[pIdx + 3] !== 0) {
          // Check if adjacent to a transparent pixel
          const hasTransparentNeighbor =
            data[idx(x - 1, cy = y) * 4 + 3] === 0 ||
            data[idx(x + 1, y) * 4 + 3] === 0 ||
            data[idx(x, y - 1) * 4 + 3] === 0 ||
            data[idx(x, y + 1) * 4 + 3] === 0;

          if (hasTransparentNeighbor) {
            const maxVal = Math.max(data[pIdx], data[pIdx + 1], data[pIdx + 2]);
            if (maxVal < 60) {
              const alpha = Math.min(255, Math.max(0, Math.round(((maxVal - 8) / 52) * 255)));
              data[pIdx + 3] = alpha;
              // Clean up color fringe by boosting warm gold tones slightly
              if (alpha > 0) {
                const scale = 255 / alpha;
                data[pIdx] = Math.min(255, Math.round(data[pIdx] * scale));
                data[pIdx + 1] = Math.min(255, Math.round(data[pIdx + 1] * scale));
                data[pIdx + 2] = Math.min(255, Math.round(data[pIdx + 2] * scale));
              }
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL("image/png");
  }, dataUri);

  await browser.close();

  const pngBase64 = pngDataUri.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync(OUTPUT_PNG, Buffer.from(pngBase64, "base64"));
  console.log("Created transparent PNG:", OUTPUT_PNG);
  console.log("File size:", fs.statSync(OUTPUT_PNG).size);
}

processTransparency().catch(console.error);
