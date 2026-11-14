#!/usr/bin/env node

/**
 * prerender-routes.mjs
 * Generates static HTML files for all 47 active outlet routes and key public pages
 * after Vite build, ensuring that social crawlers (WhatsApp, Facebook, Twitter, LinkedIn)
 * and search engines receive genuine route-specific Open Graph tags (og:title, og:description,
 * og:image, og:url), page titles, canonical tags, and JSON-LD structured data directly
 * from server-side HTML responses without requiring client-side JavaScript execution.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const templatePath = path.join(distDir, 'index.html');

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

function escapeAttr(str) {
  return String(str || '')
    .replace(/"/g, '&quot;');
}

function escapeTitle(str) {
  return String(str || '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getLocality(outlet) {
  if (outlet.locality && outlet.locality.trim()) return outlet.locality.trim();
  if (outlet.outletName && outlet.outletName.trim()) return outlet.outletName.split('/')[0].trim();
  if (outlet.name) return outlet.name.replace(/^CakeStory Desserts\s*—\s*/i, '').split('(')[0].trim();
  return '';
}

function generatePageHtml(baseHtml, { title, description, canonical, ogImage, ogType = 'article', jsonLd }) {
  let html = baseHtml;

  // 1. Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeTitle(title)}</title>`);

  // 2. Replace or update <meta name="description" ...>
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeAttr(description)}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="description" content="${escapeAttr(description)}" />\n</head>`);
  }

  // 3. Replace or update <link rel="canonical" ...>
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${escapeAttr(canonical)}" />`);
  } else {
    html = html.replace('</head>', `  <link rel="canonical" href="${escapeAttr(canonical)}" />\n</head>`);
  }

  // 4. Replace or update Open Graph tags
  const ogTags = [
    { prop: 'og:title', val: title },
    { prop: 'og:description', val: description },
    { prop: 'og:url', val: canonical },
    { prop: 'og:type', val: ogType },
    { prop: 'og:image', val: ogImage },
  ];

  for (const { prop, val } of ogTags) {
    if (!val) continue;
    const regex = new RegExp(`<meta\\s+property=["']${prop}["'][^>]*>`, 'i');
    if (regex.test(html)) {
      html = html.replace(regex, `<meta property="${prop}" content="${escapeAttr(val)}" />`);
    } else {
      html = html.replace('</head>', `  <meta property="${prop}" content="${escapeAttr(val)}" />\n</head>`);
    }
  }

  // 5. Inject JSON-LD Schema
  if (jsonLd) {
    const jsonLdScript = `  <script type="application/ld+json" id="cakestory-schema-jsonld">\n${JSON.stringify(jsonLd, null, 2)}\n  </script>\n`;
    html = html.replace('</head>', `${jsonLdScript}</head>`);
  }

  return html;
}

function writeHtmlFiles(relativeRoute, html) {
  // 1. Directory index: dist/{route}/index.html
  const targetDir = path.join(distDir, relativeRoute);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');

  // 2. Direct HTML file: dist/{route}.html (for cleanUrls on Vercel without trailing slash)
  const targetFile = path.join(distDir, `${relativeRoute}.html`);
  const parentOfTarget = path.dirname(targetFile);
  if (!fs.existsSync(parentOfTarget)) {
    fs.mkdirSync(parentOfTarget, { recursive: true });
  }
  fs.writeFileSync(targetFile, html, 'utf8');
}

function main() {
  if (!fs.existsSync(templatePath)) {
    console.error(`[prerender] Error: Base template not found at ${templatePath}. Run vite build first.`);
    process.exit(1);
  }

  const baseHtml = fs.readFileSync(templatePath, 'utf8');
  const franchisesPath = path.join(rootDir, 'src', 'data', 'franchises.json');
  const franchises = JSON.parse(fs.readFileSync(franchisesPath, 'utf8'));

  const activeOutlets = franchises.filter(f => f.active !== false && f.slug && f.slug.trim());
  console.log(`[prerender] Prerendering ${activeOutlets.length} active outlet routes...`);

  let count = 0;
  for (const outlet of activeOutlets) {
    const citySlug = outlet.citySlug || (outlet.city ? slugify(outlet.city) : 'pune');
    const areaSlug = outlet.slug.trim();
    const route = `outlets/${citySlug}/${areaSlug}`;
    const canonical = `${PRIMARY_DOMAIN}/${route}`;

    const locality = getLocality(outlet);
    const city = outlet.city || 'Pune';
    const title = `Best Cakes in ${locality}, ${city} | CakeStory Desserts`;
    const description = `${outlet.description || 'Official CakeStory Desserts boutique offering 100% pure vegetarian cakes and artisanal pastries.'} ${outlet.address || ''}. Call ${outlet.phone || ''}.`.trim();
    const ogImage = `${PRIMARY_DOMAIN}${outlet.image || '/images/outlets/baner.jpg'}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Bakery',
      name: outlet.name,
      image: ogImage,
      telephone: outlet.phone,
      url: canonical,
      address: {
        '@type': 'PostalAddress',
        streetAddress: outlet.address,
        addressLocality: outlet.zone || outlet.city,
        addressRegion: outlet.state || 'Maharashtra',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: outlet.latitude,
        longitude: outlet.longitude,
      },
      openingHours: outlet.openingHours,
      servesCuisine: 'Pure Vegetarian Bakery, Cakes, Pastries, Desserts',
      priceRange: '₹₹',
    };

    const outletHtml = generatePageHtml(baseHtml, {
      title,
      description,
      canonical,
      ogImage,
      ogType: 'article',
      jsonLd,
    });

    writeHtmlFiles(route, outletHtml);
    count++;
  }

  console.log(`[prerender] Successfully generated static HTML files for ${count} active outlets!`);
}

main();
