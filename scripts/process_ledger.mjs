import fs from "fs";
import path from "path";

const LEDGER_FILE = "scripts/output/extraction_ledger.json";
const EXISTING_FILE = "src/data/franchises.json";

const rawLedger = JSON.parse(fs.readFileSync(LEDGER_FILE, "utf8"));
const existingOutlets = JSON.parse(fs.readFileSync(EXISTING_FILE, "utf8"));

console.log(`Processing ${rawLedger.length} raw candidates against ${existingOutlets.length} existing outlets...`);

// Helper to decode address from directionsUrl
function extractFullAddressFromUrl(url) {
  if (!url) return "";
  const match = url.match(/\/dir\/\/([^/]+)\/data=/);
  if (match) {
    let raw = decodeURIComponent(match[1].replace(/\+/g, " "));
    // Remove leading Plus codes like "FXP3+55C " or "JQ7P+V7J " or "GW88+7R4 "
    raw = raw.replace(/^[A-Z0-9]{4}\+[A-Z0-9]{3,5}\s*,?\s*/i, "");
    return raw.trim();
  }
  return "";
}

function extractCidFromUrl(url) {
  if (!url) return "";
  const match = url.match(/1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
  return match ? match[1] : "";
}

function extractCoordinates(str) {
  if (!str) return null;
  const atMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { latitude: parseFloat(atMatch[1]), longitude: parseFloat(atMatch[2]) };
  const paramMatch = str.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (paramMatch) return { latitude: parseFloat(paramMatch[1]), longitude: parseFloat(paramMatch[2]) };
  return null;
}

// 1. Clean & normalize raw candidate cards
const candidates = rawLedger.map((item, idx) => {
  const fullAddressFromUrl = extractFullAddressFromUrl(item.directionsUrl || item.mapsUrl);
  const cid = extractCidFromUrl(item.directionsUrl || item.mapsUrl);
  
  let coords = item.coordinates;
  if (!coords) coords = extractCoordinates(item.directionsUrl || item.mapsUrl || "");

  // Phone clean
  let phone = item.phone ? item.phone.trim() : "";
  if (!phone) {
    const phoneMatch = (item.fullText || "").match(/(?:0|\+91[\s-]?)?([6789]\d{4}[\s-]?\d{5}|0\d{2,4}[\s-]?\d{6,8})/);
    if (phoneMatch) phone = phoneMatch[0].trim();
  }
  if (phone) {
    phone = phone.replace(/^0/, "+91 ").replace(/^[789]\d{9}$/, (m) => `+91 ${m.slice(0, 5)} ${m.slice(5)}`);
    if (!phone.startsWith("+91 ") && phone.startsWith("+91")) {
      phone = phone.replace("+91", "+91 ");
    }
  }

  // Address
  let cleanAddress = fullAddressFromUrl || item.address || "";
  // If cleanAddress starts with outlet name like "Cakestory Desserts, ", strip it
  cleanAddress = cleanAddress.replace(/^(Cake\s*Story|CakeStory Desserts|Cakestory Desserts|CAKE STORY DESSERTS|Cake story)\s*,?\s*/i, "");

  // Detect pincode
  const pinMatch = cleanAddress.match(/\b41[0-9]{4}\b/);
  const pincode = pinMatch ? pinMatch[0] : "";

  return {
    rawId: item.id,
    index: idx + 1,
    name: item.name,
    rawAddress: item.address,
    fullAddressFromUrl,
    cleanAddress,
    phone,
    openingHours: item.openingHours,
    fullText: item.fullText,
    directionsUrl: item.directionsUrl,
    mapsUrl: item.mapsUrl,
    cid,
    coordinates: coords,
    batch: item.batch,
    pincode
  };
});

// 2. Identify Non-Brand Exclusions
const NON_BRAND_PATTERNS = [
  /sanket classes/i,
  /by rashmi/i,
  /cheesecake story by aakriti/i,
  /by megha/i,
  /achal/i,
  /cake story and cafe.*behind axis bank/i // Unrelated generic cafe
];

const excludedEntities = [];
const brandCandidates = [];

candidates.forEach(cand => {
  const isExcluded = NON_BRAND_PATTERNS.some(pat => pat.test(cand.name) || pat.test(cand.fullText));
  if (isExcluded) {
    excludedEntities.push({
      ...cand,
      exclusionReason: "Non-brand competitor, individual home baker, or unrelated entity"
    });
  } else {
    brandCandidates.push(cand);
  }
});

console.log(`Brand candidates: ${brandCandidates.length}, Excluded competitors: ${excludedEntities.length}`);

// 3. Cluster and Deduplicate brand candidates
// Two candidate cards belong to the same outlet if:
// - They share the same CID
// - OR they share the same non-empty phone and similar address/locality
// - OR they share the same fullAddressFromUrl
const uniqueOutletsMap = new Map();
const duplicates = [];

brandCandidates.forEach(cand => {
  // Determine unique key
  let matchKey = null;

  for (const [key, existing] of uniqueOutletsMap.entries()) {
    // 1. Same CID
    if (cand.cid && existing.cid && cand.cid === existing.cid) {
      matchKey = key;
      break;
    }
    // 2. Same directions URL
    if (cand.directionsUrl && existing.directionsUrl && cand.directionsUrl === existing.directionsUrl) {
      matchKey = key;
      break;
    }
    // 3. Same clean address (normalized)
    const normCandAddr = cand.cleanAddress.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normExistAddr = existing.cleanAddress.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normCandAddr && normExistAddr && (normCandAddr === normExistAddr || normCandAddr.includes(normExistAddr) || normExistAddr.includes(normCandAddr))) {
      matchKey = key;
      break;
    }
    // 4. Same phone (not generic 02115 299 144 central helpline unless address matches)
    const isCentralHelpline = cand.phone.includes("2115") || cand.phone.includes("98819 14444");
    if (cand.phone && existing.phone && cand.phone === existing.phone && !isCentralHelpline) {
      matchKey = key;
      break;
    }
  }

  if (matchKey) {
    duplicates.push({
      duplicateCandidate: cand,
      mergedIntoKey: matchKey
    });
    // Merge any missing fields into the primary record
    const existing = uniqueOutletsMap.get(matchKey);
    if (!existing.phone && cand.phone) existing.phone = cand.phone;
    if (!existing.cleanAddress && cand.cleanAddress) existing.cleanAddress = cand.cleanAddress;
    if (!existing.cid && cand.cid) existing.cid = cand.cid;
    if (!existing.directionsUrl && cand.directionsUrl) existing.directionsUrl = cand.directionsUrl;
    if (!existing.coordinates && cand.coordinates) existing.coordinates = cand.coordinates;
    if (cand.openingHours && (!existing.openingHours || existing.openingHours.length < cand.openingHours.length)) {
      existing.openingHours = cand.openingHours;
    }
    existing.mergedRawIds.push(cand.rawId);
  } else {
    const key = cand.cid || (cand.cleanAddress ? cand.cleanAddress.slice(0, 40) : `cand-${cand.index}`);
    uniqueOutletsMap.set(key, {
      ...cand,
      mergedRawIds: [cand.rawId]
    });
  }
});

const distinctDiscovered = Array.from(uniqueOutletsMap.values());
console.log(`Distinct unique discovered brand outlets: ${distinctDiscovered.length}`);
console.log(`Duplicate candidate cards merged: ${duplicates.length}`);

// Write intermediate ledger analysis
fs.writeFileSync("scripts/output/discovered_unique_outlets.json", JSON.stringify(distinctDiscovered, null, 2), "utf8");
fs.writeFileSync("scripts/output/excluded_entities.json", JSON.stringify(excludedEntities, null, 2), "utf8");
fs.writeFileSync("scripts/output/merged_duplicates.json", JSON.stringify(duplicates, null, 2), "utf8");

distinctDiscovered.forEach((item, i) => {
  console.log(`[${i + 1}] ${item.name} | Phone: ${item.phone || 'N/A'}`);
  console.log(`    Address: ${item.cleanAddress || item.fullText}`);
});
