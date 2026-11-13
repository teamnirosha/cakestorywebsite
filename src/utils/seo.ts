import { useEffect, type DependencyList } from "react";

export const PRIMARY_DOMAIN = "https://www.cakestorydesserts.in";
export const DEFAULT_TITLE = "CakeStory Desserts | Franchise Opportunity in Pune";
export const DEFAULT_DESCRIPTION =
  "CakeStory Desserts is a growing Pune bakery brand offering scalable franchise opportunities. Centralized production, standard hygiene, and turnkey operational support.";
export const DEFAULT_OG_IMAGE = `${PRIMARY_DOMAIN}/assets/logo/cs-final-logo.png`;

export interface SEOOptions {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: "index, follow" | "noindex, nofollow" | "noindex, follow" | string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article" | string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  jsonLdId?: string;
}

function ensureAbsoluteUrl(pathOrUrl?: string): string {
  if (!pathOrUrl) return PRIMARY_DOMAIN;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const cleanPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${PRIMARY_DOMAIN}${cleanPath}`;
}

function setMetaTag(attrName: "name" | "property", attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonicalTag(url: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export function updateSEO(options: SEOOptions) {
  if (typeof document === "undefined") return;

  const title = options.title ? `${options.title}` : DEFAULT_TITLE;
  const description = options.description || DEFAULT_DESCRIPTION;
  const canonical = ensureAbsoluteUrl(options.canonical);
  const ogImage = ensureAbsoluteUrl(options.ogImage || DEFAULT_OG_IMAGE);
  const ogType = options.ogType || "website";
  const robots = options.robots || "index, follow";

  // 1. Document Title
  document.title = title;

  // 2. Meta Description
  setMetaTag("name", "description", description);

  // 3. Self-Referencing Canonical URL
  setCanonicalTag(canonical);

  // 4. Meta Robots Directive
  setMetaTag("name", "robots", robots);

  // 5. Open Graph Metadata
  setMetaTag("property", "og:title", options.ogTitle || title);
  setMetaTag("property", "og:description", options.ogDescription || description);
  setMetaTag("property", "og:url", canonical);
  setMetaTag("property", "og:type", ogType);
  setMetaTag("property", "og:image", ogImage);

  // 6. JSON-LD Structured Data
  if (options.jsonLd) {
    const scriptId = options.jsonLdId || "cakestory-schema-jsonld";
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(options.jsonLd);
  }
}

/**
 * React hook to synchronize document head metadata, canonical URL, and indexing directives.
 */
export function useSEO(options: SEOOptions, deps: DependencyList = []) {
  useEffect(() => {
    updateSEO(options);

    return () => {
      if (options.jsonLdId) {
        const script = document.getElementById(options.jsonLdId);
        if (script) script.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

