/**
 * outletRouting.ts
 * Centralized city-based URL routing helpers and locality text formatters for CakeStory Desserts outlets.
 * 
 * Reference structure: /outlets/:citySlug/:areaSlug (e.g. /outlets/pune/anand-nagar, /outlets/pune/warje)
 */

export interface RoutableOutlet {
  id: string;
  slug: string;
  citySlug?: string;
  city?: string;
  locality?: string;
  outletName?: string;
  name: string;
  legacySlugs?: string[];
}

/**
 * Complete Marathi translation map for all 52 outlet localities
 */
export const MARATHI_LOCALITY_MAP: Record<string, string> = {
  "Anand Nagar": "आनंद नगर",
  "Aundh": "औंध",
  "Balewadi": "बालेवाडी",
  "Baner": "बाणेर",
  "Bavdhan": "बावधन",
  "Bhosari": "भोसरी",
  "Bibwewadi": "बिबवेवाडी",
  "Camp": "कॅम्प",
  "Chakan": "चाकण",
  "Chikhali": "चिखली",
  "Chinchwad": "चिंचवड",
  "Dhanori": "धानोरी",
  "Dhayari": "धायरी",
  "Dattanagar": "दत्तनगर",
  "Hadapsar": "हडपसर",
  "Highway Junction": "हायवे जंक्शन",
  "Hinjawadi": "हिंजवडी",
  "Karve Nagar": "कर्वे नगर",
  "Katraj": "कात्रज",
  "Keshav Nagar": "केशव नगर",
  "Kharadi": "खराडी",
  "Kolhewadi": "कोल्हेवाडी",
  "Kondhwa": "कोंढवा",
  "Kothrud": "कोथरूड",
  "Lohegaon": "लोहगाव",
  "Loni Kalbhor": "लोणी काळभोर",
  "Manjri": "मांजरी",
  "Moshi": "मोशी",
  "Mundhwa": "मुंढवा",
  "Narhe": "नऱ्हे",
  "New Sangavi": "नवी सांगवी",
  "Nigdi": "निगडी",
  "Phursungi": "फुरसुंगी",
  "Pimple Gurav": "पिंपळे गुरव",
  "Pimple Saudagar": "पिंपळे सौदागर",
  "Pimpri": "पिंपरी",
  "Powai Naka": "पोवई नाका",
  "Rahatani": "रहाटणी",
  "Ravet": "रावेत",
  "Saswad": "सासवड",
  "Shirwal": "शिरवळ",
  "Shivane": "शिवणे",
  "Sinhgad Road": "सिंहगड रोड",
  "Swargate": "स्वारगेट",
  "Talegaon": "तळेगाव",
  "Undri": "उंड्री",
  "Vadgaon Sheri": "वडगाव शेरी",
  "Viman Nagar": "विमान नगर",
  "Vishrantwadi": "विश्रांतवाडी",
  "Wagholi": "वाघोली",
  "Wakad": "वाकड",
  "Wanowrie": "वानवडी",
  "Warje": "वारजे",
  "Jejuri": "जेजुरी",
  "Nasrapur": "नसरापूर",
  "Uruli Kanchan": "उरुळी कांचन",
  "Khandala": "खंडाळा",
  "Khed Shivapur": "खेड शिवापूर",
  "Lonand": "लोणंद",
  "Shewalwadi": "शेवाळवाडी",
  "Dange Chowk": "डांगे चौक",
  "Gangadham Chowk": "गंगाधाम चौक",
  "Malwadi": "माळवाडी",
  "Kalewadi": "काळेवाडी",
  // Common compound variants
  "Baner Road": "बाणेर रोड",
  "Camp Pune": "कॅम्प",
  "Hinjawadi Phase 1": "हिंजवडी फेज १",
  "Hinjawadi Phase 3": "हिंजवडी फेज ३",
  "Nigdi Sector 25": "निगडी सेक्टर २५",
  "Nigdi Yamuna Nagar": "निगडी यमुना नगर",
  "Chikhali Jadhav Wadi": "चिखली जाधव वाडी",
  "Chikhali Sane Chowk": "चिखली साने चौक",
  "Hadapsar Sasane Nagar": "हडपसर साने नगर",
  "Hadapsar Kalepadal": "हडपसर काळेपडळ",
  "Hadapsar Factory Outlet": "हडपसर सेंट्रल फॅक्टरी",
  "Wanowrie Sacred Heart": "वानवडी सेक्रेड हार्ट",
  "Kondhwa Tilekar Nagar": "कोंढवा टिळेकर नगर",
  "Phursungi Ganganagar": "फुरसुंगी गंगानगर",
  "Powai Naka Flagship": "पोवई नाका",
};

/**
 * Marathi translation map for cities
 */
export const MARATHI_CITY_MAP: Record<string, string> = {
  "Pune": "पुणे",
  "Pimpri-Chinchwad": "पिंपरी-चिंचवड",
  "Satara": "सातारा",
  "Shirwal": "शिरवळ",
  "Talegaon": "तळेगाव",
  "Chakan": "चाकण",
  "Jejuri": "जेजुरी",
  "Nasrapur": "नसरापूर",
  "Uruli Kanchan": "उरुळी कांचन",
  "Khandala": "खंडाळा",
  "Khed Shivapur": "खेड शिवापूर",
  "Lonand": "लोणंद",
};

/**
 * Marathi translation map for zones
 */
export const MARATHI_ZONE_MAP: Record<string, string> = {
  "West Pune": "पश्चिम पुणे",
  "PCMC": "पिंपरी-चिंचवड (PCMC)",
  "East Pune": "पूर्व पुणे",
  "South Pune": "दक्षिण पुणे",
  "Satara": "सातारा",
};

/**
 * Normalizes text to a clean URL slug:
 * - Converts to lowercase
 * - Replaces spaces and underscores with hyphens
 * - Removes non-alphanumeric characters
 * - Strips leading/trailing hyphens
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns canonical city-based outlet URL: /outlets/:citySlug/:areaSlug
 * e.g., /outlets/pune/anand-nagar or /outlets/pune/warje
 */
export function getOutletUrl(outlet: {
  citySlug?: string;
  city?: string;
  slug: string;
}): string {
  if (!outlet) return "/outlets";
  const city = outlet.citySlug || (outlet.city ? slugify(outlet.city) : "pune");
  const area = outlet.slug;
  return `/outlets/${city}/${area}`;
}

/**
 * Resolves short locality/area name for hero, titles, and breadcrumbs.
 * Supports language translation (English & Marathi).
 */
export function getOutletLocality(
  outlet?: {
    locality?: string;
    outletName?: string;
    name?: string;
    slug?: string;
  },
  lang: "en" | "mr" = "en"
): string {
  if (!outlet) return "";
  let en = "";
  if (outlet.locality && outlet.locality.trim()) {
    en = outlet.locality.trim();
  } else if (outlet.outletName && outlet.outletName.trim()) {
    en = outlet.outletName.split("/")[0].trim();
  } else if (outlet.name) {
    en = outlet.name.replace(/^CakeStory Desserts\s*—\s*/i, "").split("(")[0].trim();
  }

  if (lang === "mr" && en) {
    // 1. Direct key match
    if (MARATHI_LOCALITY_MAP[en]) {
      return MARATHI_LOCALITY_MAP[en];
    }
    // 2. Case-insensitive key match
    const lower = en.toLowerCase();
    for (const [key, val] of Object.entries(MARATHI_LOCALITY_MAP)) {
      if (key.toLowerCase() === lower) return val;
    }
    // 3. Slug match
    if (outlet.slug) {
      for (const [key, val] of Object.entries(MARATHI_LOCALITY_MAP)) {
        if (slugify(key) === outlet.slug) return val;
      }
    }
  }

  return en;
}

/**
 * Translates city name to Marathi when lang === "mr"
 */
export function getOutletCity(city?: string, lang: "en" | "mr" = "en"): string {
  if (!city) return lang === "mr" ? "पुणे" : "Pune";
  if (lang === "mr") {
    return MARATHI_CITY_MAP[city] || city;
  }
  return city;
}

/**
 * Translates zone name to Marathi when lang === "mr"
 */
export function getOutletZone(zone?: string, lang: "en" | "mr" = "en"): string {
  if (!zone) return "";
  if (lang === "mr") {
    return MARATHI_ZONE_MAP[zone] || zone;
  }
  return zone;
}

/**
 * Formats the hero location sentence strictly as requested:
 * English: "Your Sweet Spot in <Locality>." (e.g. "Your Sweet Spot in Baner.")
 * Marathi: "<Locality> मधील आपला आवडता डेझर्ट स्पॉट." (e.g. "बाणेर मधील आपला आवडता डेझर्ट स्पॉट.")
 * Note: Does NOT append the city to this specific hero sentence.
 */
export function formatHeroLocation(
  outlet?: {
    locality?: string;
    outletName?: string;
    name?: string;
    slug?: string;
  },
  lang: "en" | "mr" = "en"
): { leadText: string; locationText: string; trailText?: string } {
  const locality = getOutletLocality(outlet, lang);

  if (lang === "mr") {
    return {
      leadText: "",
      locationText: locality,
      trailText: "मधील आपला आवडता डेझर्ट स्पॉट.",
    };
  }

  return {
    leadText: "Your Sweet Spot in",
    locationText: `${locality}.`,
  };
}
