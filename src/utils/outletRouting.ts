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
 * Prioritizes normalized locality, falling back gracefully to outletName or stripped brand name.
 */
export function getOutletLocality(outlet?: {
  locality?: string;
  outletName?: string;
  name?: string;
}): string {
  if (!outlet) return "";
  if (outlet.locality && outlet.locality.trim()) {
    return outlet.locality.trim();
  }
  if (outlet.outletName && outlet.outletName.trim()) {
    return outlet.outletName.split("/")[0].trim();
  }
  if (outlet.name) {
    return outlet.name.replace(/^CakeStory Desserts\s*—\s*/i, "").split("(")[0].trim();
  }
  return "";
}

/**
 * Formats the hero location sentence strictly as requested:
 * English: "Your Sweet Spot in <Locality>." (e.g. "Your Sweet Spot in Anand Nagar.")
 * Marathi: "<Locality> मधील आपला आवडता डेझर्ट स्पॉट."
 * Note: Does NOT append the city to this specific hero sentence.
 */
export function formatHeroLocation(
  outlet?: {
    locality?: string;
    outletName?: string;
    name?: string;
  },
  lang: "en" | "mr" = "en"
): { leadText: string; locationText: string; trailText?: string } {
  const locality = getOutletLocality(outlet);

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
