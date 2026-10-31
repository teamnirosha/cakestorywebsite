import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env", "utf8");
const urlMatch = env.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncOutlets() {
  console.log("Connecting to Supabase at:", supabaseUrl);

  const authenticOutlets = JSON.parse(fs.readFileSync("src/data/franchises.json", "utf8"));
  console.log(`Loaded ${authenticOutlets.length} authentic outlets from src/data/franchises.json`);

  const authenticIds = new Set(authenticOutlets.map(o => o.id));

  // 1. Fetch current outlets from Supabase
  const { data: currentRows, error: fetchErr } = await supabase.from("franchises").select("id, name");
  if (fetchErr) {
    console.error("Error fetching franchises from Supabase:", fetchErr.message);
    return;
  }

  console.log(`Current franchises in Supabase: ${currentRows.length}`);

  // 2. Identify fake/unverified rows to remove
  const toDelete = currentRows.filter(r => !authenticIds.has(r.id)).map(r => r.id);
  console.log(`Identified ${toDelete.length} unverified/fake outlets to delete:`, toDelete);

  if (toDelete.length > 0) {
    const { error: delErr } = await supabase.from("franchises").delete().in("id", toDelete);
    if (delErr) {
      console.error("Error deleting fake outlets:", delErr.message);
    } else {
      console.log(`✓ Successfully deleted ${toDelete.length} unverified outlets from Supabase!`);
    }
  }

  // 3. Upsert all 47 authentic rows
  const rowsToUpsert = authenticOutlets.map(o => ({
    id: o.id,
    slug: o.slug,
    name: o.name,
    outlet_name: o.outletName || o.name,
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
    manager: o.manager || null,
    services: o.services || [],
    description: o.description || null,
    image: o.image || null,
    active: o.active !== false,
    established: o.established || "2021",
    city_slug: o.citySlug || "pune",
    locality: o.locality || null,
    legacy_slugs: o.legacySlugs || [],
    google_maps_url: o.googleMapsUrl || null,
    updated_at: new Date().toISOString()
  }));

  const { error: upsertErr } = await supabase.from("franchises").upsert(rowsToUpsert, { onConflict: "id" });
  if (upsertErr) {
    console.error("Error upserting authentic outlets:", upsertErr.message);
  } else {
    console.log(`✓ Successfully upserted all ${rowsToUpsert.length} authentic outlets in Supabase!`);
  }

  // 4. Verify exact final count
  const { data: finalRows, error: verifyErr } = await supabase.from("franchises").select("id, name, manager, phone, address");
  if (verifyErr) {
    console.error("Error verifying final count:", verifyErr.message);
  } else {
    console.log(`✓ Final verified count in Supabase: ${finalRows.length} outlets.`);
  }
}

syncOutlets().catch(console.error);
