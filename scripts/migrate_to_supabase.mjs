import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing environment variables. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
  console.log("Usage: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/migrate_to_supabase.mjs");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  const dataDir = path.resolve("src/data");
  console.log("Starting migration to Supabase:", supabaseUrl);

  // 1. Franchises / Outlets
  const franchises = JSON.parse(fs.readFileSync(path.join(dataDir, "franchises.json"), "utf8"));
  console.log(`Migrating ${franchises.length} outlets...`);
  const franchiseRows = franchises.map((o) => ({
    id: o.id,
    slug: o.slug,
    name: o.name,
    outlet_name: o.outletName,
    zone: o.zone,
    address: o.address,
    city: o.city,
    state: o.state || "Maharashtra",
    country: o.country || "India",
    latitude: o.latitude,
    longitude: o.longitude,
    phone: o.phone,
    email: o.email || "care@cakestorydesserts.com",
    opening_hours: o.openingHours || "10:00 AM - 11:30 PM",
    manager: o.manager,
    services: o.services || [],
    description: o.description,
    image: o.image,
    active: o.active !== false,
    established: o.established || "2021",
    city_slug: o.citySlug || "pune",
    locality: o.locality,
    legacy_slugs: o.legacySlugs || [],
    google_maps_url: o.googleMapsUrl,
  }));

  const { error: fErr } = await supabase.from("franchises").upsert(franchiseRows, { onConflict: "id" });
  if (fErr) console.error("Error migrating franchises:", fErr.message);
  else console.log(`✓ Successfully migrated ${franchises.length} outlets.`);

  // 2. Sweet Scenes Reels
  const reels = JSON.parse(fs.readFileSync(path.join(dataDir, "galleryReels.json"), "utf8"));
  console.log(`Migrating ${reels.length} reels...`);
  const reelRows = reels.map((r) => ({
    id: r.id,
    reel_url: r.reelUrl,
    title: r.title,
    marathi_title: r.marathiTitle,
    video_url: r.videoUrl,
    thumbnail: r.thumbnail,
    category: r.category,
    category_label: r.categoryLabel,
    duration: r.duration,
    description: r.description,
    order_index: r.order || 0,
    enabled: r.enabled !== false,
    featured: Boolean(r.featured),
  }));

  const { error: rErr } = await supabase.from("gallery_reels").upsert(reelRows, { onConflict: "id" });
  if (rErr) console.error("Error migrating gallery reels:", rErr.message);
  else console.log(`✓ Successfully migrated ${reels.length} reels.`);

  // 3. Sweet Scenes Settings
  const { error: sErr } = await supabase.from("gallery_settings").upsert({
    id: "default",
    enabled: true,
    eyebrow: "INSTAGRAM",
    eyebrow_marathi: "इन्स्टाग्राम",
    heading: "Moments That Make Life Sweeter",
    heading_marathi: "आयुष्याला अधिक गोड बनवणारे खास क्षण",
    subtitle: "From custom creations to happy celebrations — catch the latest from CakeStory Desserts on Instagram.",
    subtitle_marathi: "कस्टम केक्सपासून ते प्रत्येक आनंदाच्या क्षणांपर्यंत — पहा केक स्टोरीचे ताजे रील्स आणि सेलिब्रेशन्स.",
    decorative_phrase: "Real Stories, Real Celebrations",
    instagram_url: "https://www.instagram.com/cakestorydesserts/",
    show_categories: false,
    show_highlights: true,
    cta_label: "Follow @cakestorydesserts",
    autoplay: true,
    default_muted: true,
  }, { onConflict: "id" });
  if (sErr) console.error("Error migrating gallery settings:", sErr.message);
  else console.log("✓ Successfully migrated gallery settings.");

  // 4. Categories
  if (fs.existsSync(path.join(dataDir, "categories.json"))) {
    const categories = JSON.parse(fs.readFileSync(path.join(dataDir, "categories.json"), "utf8"));
    const catRows = categories.map((c, i) => ({
      id: c.id,
      name: c.name,
      icon: c.icon || "🎂",
      color: c.color || "from-pink-200 to-rose-200",
      order_index: c.orderIndex ?? i,
    }));
    const { error: cErr } = await supabase.from("categories").upsert(catRows, { onConflict: "id" });
    if (cErr) console.error("Error migrating categories:", cErr.message);
    else console.log(`✓ Successfully migrated ${categories.length} categories.`);
  }

  // 5. Cakes
  if (fs.existsSync(path.join(dataDir, "cakes.json"))) {
    const cakes = JSON.parse(fs.readFileSync(path.join(dataDir, "cakes.json"), "utf8"));
    const cakeRows = cakes.map((ck) => ({
      id: ck.id,
      name: ck.name,
      category: ck.category,
      category_id: ck.categoryId,
      description: ck.description,
      price: ck.price,
      image: ck.image,
      ingredients: ck.ingredients || [],
      flavor: ck.flavor,
      size: ck.size || "500g / 1kg",
      availability: ck.availability || "in-stock",
      featured: Boolean(ck.featured),
      tags: ck.tags || ["eggless"],
      rating: ck.rating || 4.9,
      color: ck.color || "brown",
    }));
    const { error: ckErr } = await supabase.from("cakes").upsert(cakeRows, { onConflict: "id" });
    if (ckErr) console.error("Error migrating cakes:", ckErr.message);
    else console.log(`✓ Successfully migrated ${cakes.length} cakes.`);
  }

  // 6. FAQs
  if (fs.existsSync(path.join(dataDir, "faq.json"))) {
    const faqs = JSON.parse(fs.readFileSync(path.join(dataDir, "faq.json"), "utf8"));
    const faqRows = faqs.map((f, i) => ({
      id: f.id || `faq-${i + 1}`,
      question: f.question,
      question_marathi: f.questionMarathi,
      answer: f.answer,
      answer_marathi: f.answerMarathi,
      category: f.category || "franchise",
      order_index: i + 1,
    }));
    const { error: faqErr } = await supabase.from("faqs").upsert(faqRows, { onConflict: "id" });
    if (faqErr) console.error("Error migrating faqs:", faqErr.message);
    else console.log(`✓ Successfully migrated ${faqs.length} FAQs.`);
  }

  // 7. Testimonials
  if (fs.existsSync(path.join(dataDir, "testimonials.json"))) {
    const testimonials = JSON.parse(fs.readFileSync(path.join(dataDir, "testimonials.json"), "utf8"));
    const testRows = testimonials.map((t, i) => ({
      id: t.id || `testimonial-${i + 1}`,
      name: t.name,
      role: t.role || "Customer",
      outlet: t.outlet || "Pune",
      rating: t.rating || 5,
      comment: t.comment,
      avatar: t.avatar,
    }));
    const { error: tErr } = await supabase.from("testimonials").upsert(testRows, { onConflict: "id" });
    if (tErr) console.error("Error migrating testimonials:", tErr.message);
    else console.log(`✓ Successfully migrated ${testimonials.length} testimonials.`);
  }

  // 8. Site Content
  if (fs.existsSync(path.join(dataDir, "siteContent.json"))) {
    const siteContent = JSON.parse(fs.readFileSync(path.join(dataDir, "siteContent.json"), "utf8"));
    const contentRows = Object.entries(siteContent).map(([k, v]) => ({
      key: k,
      content: v,
    }));
    const { error: scErr } = await supabase.from("site_content").upsert(contentRows, { onConflict: "key" });
    if (scErr) console.error("Error migrating site content:", scErr.message);
    else console.log(`✓ Successfully migrated site content sections.`);
  }

  console.log("\n=======================================================");
  console.log("All JSON data successfully synchronized to Supabase!");
  console.log("=======================================================");
}

migrate().catch(console.error);
