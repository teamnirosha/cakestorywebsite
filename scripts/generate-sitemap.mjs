#!/usr/bin/env node

/**
 * generate-sitemap.mjs
 * Automated build-time sitemap generator for CakeStory Desserts.
 * Generates valid XML sitemap at public/sitemap.xml (and dist/sitemap.xml).
 *
 * Architecture alignment:
 * - The main website is a single-page website represented by the canonical homepage (https://www.cakestorydesserts.in/).
 * - Homepage sections (Story, Franchise, FAQ, Contact, Outlets listing) are part of the homepage and excluded from separate sitemap entries.
 * - Dynamic outlet boutiques (all 47 active records in src/data/franchises.json) are included as independent public routes.
 * - Legacy blog routes (/blog, /blog/:id) are excluded from the sitemap and marked obsolete/noindex.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PRIMARY_DOMAIN = 'https://www.cakestorydesserts.in';

function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// 1. Main Canonical Homepage (Represents the entire single-page website)
const HOMEPAGE_ENTRY = [
  {
    path: '/',
    changefreq: 'daily',
    priority: '1.0',
    description: 'Main Canonical Homepage & Single-Page Application'
  }
];

// 2. Dynamic Outlet Boutiques from local source of truth (src/data/franchises.json)
function getOutletUrls() {
  const franchisesFile = path.join(rootDir, 'src', 'data', 'franchises.json');
  if (!fs.existsSync(franchisesFile)) {
    throw new Error(`[sitemap] Error: ${franchisesFile} does not exist!`);
  }

  const franchises = JSON.parse(fs.readFileSync(franchisesFile, 'utf8'));

  // Exclude inactive or invalid outlet records
  const activeOutlets = franchises.filter((f) => f.active !== false && f.slug && f.slug.trim());

  return activeOutlets.map((outlet) => {
    const city = outlet.citySlug || (outlet.city ? slugify(outlet.city) : 'pune');
    const area = outlet.slug.trim();
    return {
      path: `/outlets/${city}/${area}`,
      // No modification date is fabricated; lastmod is omitted per SEO guidelines
      lastmod: null,
      changefreq: 'weekly',
      priority: '0.8',
      description: outlet.name || `${area} Outlet`
    };
  });
}

function buildSitemapXml(entries) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  ];

  for (const entry of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${xmlEscape(PRIMARY_DOMAIN + entry.path)}</loc>`);
    if (entry.lastmod) {
      lines.push(`    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>`);
    }
    if (entry.changefreq) {
      lines.push(`    <changefreq>${xmlEscape(entry.changefreq)}</changefreq>`);
    }
    if (entry.priority) {
      lines.push(`    <priority>${xmlEscape(entry.priority)}</priority>`);
    }
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  return lines.join('\n') + '\n';
}

function main() {
  console.log('[sitemap] Generating production sitemap.xml...');

  const homepage = HOMEPAGE_ENTRY;
  const outletUrls = getOutletUrls();

  // Combine and deduplicate (Core public routes: 1 Homepage + 47 Active Outlets)
  const allEntries = [...homepage, ...outletUrls];

  const seenPaths = new Set();
  const uniqueEntries = [];

  for (const entry of allEntries) {
    const normalized = entry.path.toLowerCase();
    if (seenPaths.has(normalized)) {
      console.warn(`[sitemap] Skipping duplicate URL: ${entry.path}`);
      continue;
    }
    seenPaths.add(normalized);
    uniqueEntries.push(entry);
  }

  const xmlContent = buildSitemapXml(uniqueEntries);

  // Write to public/sitemap.xml (source directory for Vite dev & build)
  const publicDir = path.join(rootDir, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicPath, xmlContent, 'utf8');
  console.log(`[sitemap] Wrote ${uniqueEntries.length} URLs to ${publicPath}`);

  // Also write to dist/sitemap.xml if dist directory exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const distPath = path.join(distDir, 'sitemap.xml');
    fs.writeFileSync(distPath, xmlContent, 'utf8');
    console.log(`[sitemap] Updated build output at ${distPath}`);
  }

  console.log('--------------------------------------------------');
  console.log(`Summary of Generated Sitemap:`);
  console.log(`  - Canonical Production Domain: ${PRIMARY_DOMAIN}`);
  console.log(`  - Canonical Homepage:          ${homepage.length}`);
  console.log(`  - Dynamic Outlet Boutiques:    ${outletUrls.length}`);
  console.log(`  - Legacy Blog URLs:            0 (Excluded per SEO policy)`);
  console.log(`  - Total Sitemap URLs:          ${uniqueEntries.length}`);
  console.log('--------------------------------------------------');
}

main();
