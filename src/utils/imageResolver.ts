/**
 * imageResolver.ts — Centralized CakeStory Image Asset Management & Resolution
 * 
 * Maps JSON image filenames to actual assets in the admin/images folder.
 * Supports graceful fallback, format normalisation, and multiple usage across
 * Catalog, Recipe, and Public pages.
 */

// Available actual CakeStory image filenames in public/admin/images/
export const CAKESTORY_FILENAMES = [
  "1.jpg",
  "12.jpg",
  "14.JPG",
  "5.png",
  "A7401344.jpeg",
  "AZ_01460.JPG",
  "AZ_01683.JPG",
  "AZ_01692.JPG",
  "DSC03187.JPG",
  "DSC08534.JPG",
  "DSC08617.JPG",
] as const;

export type CakeStoryFilename = typeof CAKESTORY_FILENAMES[number];

// Descriptive semantic mapping for reuse across the app
export const cakeImages = {
  chocolateTruffle: "1.jpg",
  strawberryCelebration: "12.jpg",
  artisanalPastry: "14.JPG",
  layeredSignature: "5.png",
  gourmetSlice: "A7401344.jpeg",
  celebrationTier: "AZ_01460.JPG",
  freshFruitGateau: "AZ_01683.JPG",
  festiveBake: "AZ_01692.JPG",
  royalChocolate: "DSC03187.JPG",
  freshCreamBake: "DSC08534.JPG",
  pistachioVelvet: "DSC08617.JPG",
};

// Default fallback image if reference is missing or broken
export const DEFAULT_FALLBACK_IMAGE = "/admin/images/1.jpg";

/**
 * Resolves a product or recipe image path.
 * Concept: JSON filename -> image resolver -> /admin/images/<filename>
 * 
 * @param imageRef - Filename, key, or relative path stored in JSON
 * @returns Valid browser image URL
 */
export function getProductImage(imageRef?: string | null): string {
  if (!imageRef || typeof imageRef !== "string" || !imageRef.trim()) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  const trimmed = imageRef.trim();

  // If already a full URL or root-relative path
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (trimmed.startsWith("admin/images/")) {
    return `/${trimmed}`;
  }

  // If semantic key was passed (e.g. "chocolateTruffle")
  if (trimmed in cakeImages) {
    const matched = cakeImages[trimmed as keyof typeof cakeImages];
    return `/admin/images/${matched}`;
  }

  // Strip leading slashes and construct admin/images path
  const cleanName = trimmed.replace(/^[\/\\]+/, "").replace(/^(admin\/images\/|assets\/cake-pic\/)/, "");
  return `/admin/images/${cleanName}`;
}

/**
 * Direct helper for admin catalog & recipes
 */
export function getAdminImage(imageName?: string | null): string {
  return getProductImage(imageName);
}

export const SVG_FALLBACK =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23fff0f5'/><circle cx='200' cy='200' r='120' fill='%23ffe4ed'/><text x='200' y='195' font-size='56' text-anchor='middle' dominant-baseline='middle'>🎂</text><text x='200' y='260' font-family='sans-serif' font-size='15' font-weight='bold' fill='%23ff5c97' text-anchor='middle'>CakeStory Desserts Standard</text></svg>";

/**
 * Reusable image error handler to prevent broken image icons
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallback: string = DEFAULT_FALLBACK_IMAGE
): void {
  const target = event.currentTarget;
  if (target.src !== fallback && !target.src.endsWith(fallback)) {
    target.src = fallback;
  } else {
    target.src = SVG_FALLBACK;
  }
}
