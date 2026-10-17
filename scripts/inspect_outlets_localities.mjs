import fs from 'fs';

const outlets = JSON.parse(fs.readFileSync('src/data/franchises.json', 'utf8'));
console.log(`Inspecting ${outlets.length} outlets for city and locality normalization...\n`);

outlets.forEach((o, i) => {
  console.log(`[#${i + 1}] ID: ${o.id} | Slug: ${o.slug}`);
  console.log(`  Name: ${o.name}`);
  console.log(`  OutletName: ${o.outletName}`);
  console.log(`  City: ${o.city} | Zone: ${o.zone}`);
  console.log(`  Address: ${o.address}`);
  console.log('---');
});
