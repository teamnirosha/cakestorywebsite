import fs from "fs";
import path from "path";

function escapeSql(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return val;
  if (typeof val === "object") {
    return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

function run() {
  const dataDir = path.resolve("src/data");
  let sql = `-- ========================================================================\n`;
  sql += `-- CakeStory Desserts - Initial Data Seeder\n`;
  sql += `-- Paste and Run this in your Supabase SQL Editor AFTER running schema.sql\n`;
  sql += `-- ========================================================================\n\n`;
  sql += `-- Ensure constraints do not block catalog or review imports\n`;
  sql += `ALTER TABLE public.cakes DROP CONSTRAINT IF EXISTS cakes_category_id_fkey;\n`;
  sql += `ALTER TABLE public.testimonials ALTER COLUMN comment DROP NOT NULL;\n\n`;

  // 1. Gallery Settings
  sql += `-- 1. Gallery Settings\n`;
  sql += `INSERT INTO public.gallery_settings (id, enabled, eyebrow, eyebrow_marathi, heading, heading_marathi, subtitle, subtitle_marathi, decorative_phrase, instagram_url, show_categories, show_highlights, cta_label, autoplay, default_muted)\nVALUES (\n`;
  sql += `  'default',\n`;
  sql += `  TRUE,\n`;
  sql += `  'INSTAGRAM',\n`;
  sql += `  'इन्स्टाग्राम',\n`;
  sql += `  'Moments That Make Life Sweeter',\n`;
  sql += `  'आयुष्याला अधिक गोड बनवणारे खास क्षण',\n`;
  sql += `  'From custom creations to happy celebrations — catch the latest from CakeStory Desserts on Instagram.',\n`;
  sql += `  'कस्टम केक्सपासून ते प्रत्येक आनंदाच्या क्षणांपर्यंत — पहा केक स्टोरीचे ताजे रील्स आणि सेलिब्रेशन्स.',\n`;
  sql += `  'Real Stories, Real Celebrations',\n`;
  sql += `  'https://www.instagram.com/cakestorydesserts/',\n`;
  sql += `  FALSE,\n`;
  sql += `  TRUE,\n`;
  sql += `  'Follow @cakestorydesserts',\n`;
  sql += `  TRUE,\n`;
  sql += `  TRUE\n`;
  sql += `) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();\n\n`;

  // 2. Gallery Reels
  const reels = JSON.parse(fs.readFileSync(path.join(dataDir, "galleryReels.json"), "utf8"));
  sql += `-- 2. Sweet Scenes Reels (${reels.length} items)\n`;
  for (const r of reels) {
    sql += `INSERT INTO public.gallery_reels (id, reel_url, title, marathi_title, video_url, thumbnail, category, category_label, duration, description, order_index, enabled, featured)\nVALUES (${escapeSql(r.id)}, ${escapeSql(r.reelUrl)}, ${escapeSql(r.title)}, ${escapeSql(r.marathiTitle)}, ${escapeSql(r.videoUrl)}, ${escapeSql(r.thumbnail)}, ${escapeSql(r.category)}, ${escapeSql(r.categoryLabel)}, ${escapeSql(r.duration)}, ${escapeSql(r.description)}, ${r.order || 0}, ${r.enabled !== false}, ${Boolean(r.featured)})\nON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, video_url = EXCLUDED.video_url, updated_at = NOW();\n\n`;
  }

  // 3. Categories
  const categories = JSON.parse(fs.readFileSync(path.join(dataDir, "categories.json"), "utf8"));
  sql += `-- 3. Categories (${categories.length} items)\n`;
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    sql += `INSERT INTO public.categories (id, name, icon, color, order_index)\nVALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.icon)}, ${escapeSql(c.color)}, ${i})\nON CONFLICT (id) DO NOTHING;\n`;
  }
  sql += `\n`;

  // 4. Cakes
  const cakes = JSON.parse(fs.readFileSync(path.join(dataDir, "cakes.json"), "utf8"));
  sql += `-- 4. Cakes Catalog (${cakes.length} items)\n`;
  for (const k of cakes) {
    sql += `INSERT INTO public.cakes (id, name, category, category_id, description, price, image, ingredients, flavor, size, availability, featured, tags, rating, color)\nVALUES (${escapeSql(k.id)}, ${escapeSql(k.name)}, ${escapeSql(k.category)}, ${escapeSql(k.categoryId)}, ${escapeSql(k.description)}, ${k.price || 500}, ${escapeSql(k.image)}, ${escapeSql(k.ingredients || [])}, ${escapeSql(k.flavor)}, ${escapeSql(k.size)}, ${escapeSql(k.availability)}, ${Boolean(k.featured)}, ${escapeSql(k.tags || [])}, ${k.rating || 4.9}, ${escapeSql(k.color)})\nON CONFLICT (id) DO NOTHING;\n`;
  }
  sql += `\n`;

  // 5. FAQs
  const faqs = JSON.parse(fs.readFileSync(path.join(dataDir, "faq.json"), "utf8"));
  sql += `-- 5. FAQs (${faqs.length} items)\n`;
  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    sql += `INSERT INTO public.faqs (id, question, question_marathi, answer, answer_marathi, category, order_index)\nVALUES (${escapeSql(f.id)}, ${escapeSql(f.question)}, ${escapeSql(f.questionMarathi)}, ${escapeSql(f.answer)}, ${escapeSql(f.answerMarathi)}, ${escapeSql(f.category || 'franchise')}, ${i})\nON CONFLICT (id) DO NOTHING;\n`;
  }
  sql += `\n`;

  // 6. Testimonials
  const testimonials = JSON.parse(fs.readFileSync(path.join(dataDir, "testimonials.json"), "utf8"));
  sql += `-- 6. Testimonials (${testimonials.length} items)\n`;
  for (const t of testimonials) {
    const commentText = t.comment || t.quote || "";
    sql += `INSERT INTO public.testimonials (id, name, role, outlet, rating, comment, avatar)\nVALUES (${escapeSql(t.id)}, ${escapeSql(t.name)}, ${escapeSql(t.role || 'Customer')}, ${escapeSql(t.outlet || 'Pune')}, ${t.rating || 5}, ${escapeSql(commentText)}, ${escapeSql(t.avatar)})\nON CONFLICT (id) DO NOTHING;\n`;
  }
  sql += `\n`;

  // 7. Site Content
  const siteContent = JSON.parse(fs.readFileSync(path.join(dataDir, "siteContent.json"), "utf8"));
  sql += `-- 7. Site Content Config\n`;
  for (const [key, content] of Object.entries(siteContent)) {
    sql += `INSERT INTO public.site_content (key, content)\nVALUES (${escapeSql(key)}, ${escapeSql(content)})\nON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();\n`;
  }
  sql += `\n`;

  // 8. Franchises / Outlets
  const franchises = JSON.parse(fs.readFileSync(path.join(dataDir, "franchises.json"), "utf8"));
  sql += `-- 8. Franchises & Outlets Network (${franchises.length} verified stores)\n`;
  for (const o of franchises) {
    sql += `INSERT INTO public.franchises (id, slug, name, outlet_name, zone, address, city, state, country, latitude, longitude, phone, email, opening_hours, manager, services, description, image, active, established, city_slug, locality, legacy_slugs, google_maps_url)\nVALUES (\n`;
    sql += `  ${escapeSql(o.id)},\n`;
    sql += `  ${escapeSql(o.slug)},\n`;
    sql += `  ${escapeSql(o.name)},\n`;
    sql += `  ${escapeSql(o.outletName)},\n`;
    sql += `  ${escapeSql(o.zone)},\n`;
    sql += `  ${escapeSql(o.address)},\n`;
    sql += `  ${escapeSql(o.city)},\n`;
    sql += `  ${escapeSql(o.state || 'Maharashtra')},\n`;
    sql += `  ${escapeSql(o.country || 'India')},\n`;
    sql += `  ${o.latitude},\n`;
    sql += `  ${o.longitude},\n`;
    sql += `  ${escapeSql(o.phone)},\n`;
    sql += `  ${escapeSql(o.email || 'care@cakestorydesserts.com')},\n`;
    sql += `  ${escapeSql(o.openingHours || '10:00 AM - 11:30 PM')},\n`;
    sql += `  ${escapeSql(o.manager)},\n`;
    sql += `  ${escapeSql(o.services || [])},\n`;
    sql += `  ${escapeSql(o.description)},\n`;
    sql += `  ${escapeSql(o.image)},\n`;
    sql += `  ${o.active !== false},\n`;
    sql += `  ${escapeSql(o.established || '2021')},\n`;
    sql += `  ${escapeSql(o.citySlug || 'pune')},\n`;
    sql += `  ${escapeSql(o.locality)},\n`;
    sql += `  ${escapeSql(o.legacySlugs || [])},\n`;
    sql += `  ${escapeSql(o.googleMapsUrl)}\n`;
    sql += `) ON CONFLICT (id) DO UPDATE SET\n`;
    sql += `  name = EXCLUDED.name,\n`;
    sql += `  address = EXCLUDED.address,\n`;
    sql += `  phone = EXCLUDED.phone,\n`;
    sql += `  google_maps_url = EXCLUDED.google_maps_url,\n`;
    sql += `  updated_at = NOW();\n\n`;
  }

  const outPath = path.resolve("supabase/seed.sql");
  fs.writeFileSync(outPath, sql, "utf8");
  console.log(`Generated ${outPath} successfully (${sql.length} bytes, ${franchises.length} outlets)`);
}

run();
