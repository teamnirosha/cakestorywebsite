import fs from 'fs';

const EXISTING_FILE = 'src/data/franchises.json';
const outlets = JSON.parse(fs.readFileSync(EXISTING_FILE, 'utf8'));

// Slugify helper
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Locality & city mapping for all 62 outlets
const mappings = [
  // 1-16 Baseline Outlets
  { id: 'franchise-001', locality: 'Baner', city: 'Pune', slug: 'baner', legacy: ['cakestory-baner'] },
  { id: 'franchise-002', locality: 'Kothrud', city: 'Pune', slug: 'kothrud', legacy: ['cakestory-kothrud'] },
  { id: 'franchise-003', locality: 'Karve Nagar', city: 'Pune', slug: 'karve-nagar', legacy: ['cakestory-karve-nagar'] },
  { id: 'franchise-004', locality: 'Wakad', city: 'Pimpri-Chinchwad', slug: 'wakad', legacy: ['cakestory-wakad'] },
  { id: 'franchise-005', locality: 'Pimple Saudagar', city: 'Pimpri-Chinchwad', slug: 'pimple-saudagar', legacy: ['cakestory-pimple-saudagar'] },
  { id: 'franchise-006', locality: 'Chinchwad', city: 'Pimpri-Chinchwad', slug: 'chinchwad', legacy: ['cakestory-chinchwad'] },
  { id: 'franchise-007', locality: 'Ravet', city: 'Pimpri-Chinchwad', slug: 'ravet', legacy: ['cakestory-ravet'] },
  { id: 'franchise-008', locality: 'Camp', city: 'Pune', slug: 'camp', legacy: ['cakestory-camp'] },
  { id: 'franchise-009', locality: 'Viman Nagar', city: 'Pune', slug: 'viman-nagar', legacy: ['cakestory-viman-nagar'] },
  { id: 'franchise-010', locality: 'Vadgaon Sheri', city: 'Pune', slug: 'vadgaon-sheri', legacy: ['cakestory-vadgaon-sheri'] },
  { id: 'franchise-011', locality: 'Kharadi', city: 'Pune', slug: 'kharadi', legacy: ['cakestory-kharadi'] },
  { id: 'franchise-012', locality: 'Phursungi', city: 'Pune', slug: 'phursungi', legacy: ['cakestory-phursungi'] },
  { id: 'franchise-013', locality: 'Wanowrie', city: 'Pune', slug: 'wanowrie-nibm', legacy: ['cakestory-wanwadi'] },
  { id: 'franchise-014', locality: 'Kondhwa', city: 'Pune', slug: 'kondhwa', legacy: ['cakestory-kondhwa'] },
  { id: 'franchise-015', locality: 'Bibwewadi', city: 'Pune', slug: 'bibwewadi', legacy: ['cakestory-bibwewadi'] },
  { id: 'franchise-016', locality: 'Saswad', city: 'Saswad', slug: 'anand-plaza', legacy: ['cakestory-saswad'] },

  // 17-45 Discovered Outlets
  { id: 'franchise-017', locality: 'Hadapsar', city: 'Pune', slug: 'hadapsar-sade-satra-nali', legacy: ['cakestory-hadapsar-sade-satra-nali'] },
  { id: 'franchise-018', locality: 'Hadapsar', city: 'Pune', slug: 'hadapsar-magarpatta', legacy: ['cakestory-hadapsar-magarpatta'] },
  { id: 'franchise-019', locality: 'Lohegaon', city: 'Pune', slug: 'lohegaon', legacy: ['cakestory-lohegaon-porwal'] },
  { id: 'franchise-020', locality: 'Manjri', city: 'Pune', slug: 'manjri', legacy: ['cakestory-manjri-shewalewadi'] },
  { id: 'franchise-021', locality: 'Wanowrie', city: 'Pune', slug: 'wanowrie-sacred-heart', legacy: ['cakestory-wanowrie-sacred-heart'] },
  { id: 'franchise-022', locality: 'Keshav Nagar', city: 'Pune', slug: 'keshav-nagar', legacy: ['cakestory-keshav-nagar'] },
  { id: 'franchise-023', locality: 'Hadapsar', city: 'Pune', slug: 'hadapsar-sasane-nagar', legacy: ['cakestory-hadapsar-sasane-nagar'] },
  { id: 'franchise-024', locality: 'Rahatani', city: 'Pimpri-Chinchwad', slug: 'rahatani', legacy: ['cakestory-rahatani'] },
  { id: 'franchise-025', locality: 'Undri', city: 'Pune', slug: 'undri', legacy: ['cakestory-undri'] },
  { id: 'franchise-026', locality: 'Loni Kalbhor', city: 'Pune', slug: 'loni-kalbhor', legacy: ['cakestory-loni-kalbhor'] },
  { id: 'franchise-027', locality: 'Moshi', city: 'Pimpri-Chinchwad', slug: 'moshi', legacy: ['cakestory-moshi-spine-road'] },
  { id: 'franchise-028', locality: 'Chikhali', city: 'Pimpri-Chinchwad', slug: 'chikhali-jadhav-wadi', legacy: ['cakestory-chikhali-jadhav-wadi'] },
  { id: 'franchise-029', locality: 'New Sangavi', city: 'Pimpri-Chinchwad', slug: 'new-sangavi', legacy: ['cakestory-new-sangavi'] },
  { id: 'franchise-030', locality: 'Hadapsar', city: 'Pune', slug: 'hadapsar-factory-outlet', legacy: ['cakestory-hadapsar-factory-outlet'] },
  { id: 'franchise-031', locality: 'Narhe', city: 'Pune', slug: 'narhe', legacy: ['cakestory-narhe'] },
  { id: 'franchise-032', locality: 'Hadapsar', city: 'Pune', slug: 'hadapsar-kalepadal', legacy: ['cakestory-hadapsar-kalepadal'] },
  { id: 'franchise-033', locality: 'Pimpri', city: 'Pimpri-Chinchwad', slug: 'pimpri', legacy: ['cakestory-pimpri-nehru-nagar'] },
  { id: 'franchise-034', locality: 'Warje', city: 'Pune', slug: 'warje', legacy: ['cakestory-warje-bypass'] },
  { id: 'franchise-035', locality: 'Anand Nagar', city: 'Pune', slug: 'anand-nagar', legacy: ['cakestory-anand-nagar-suncity'] },
  { id: 'franchise-036', locality: 'Kolhewadi', city: 'Pune', slug: 'kolhewadi', legacy: ['cakestory-kolhewadi'] },
  { id: 'franchise-037', locality: 'Shivane', city: 'Pune', slug: 'shivane', legacy: ['cakestory-shivane'] },
  { id: 'franchise-038', locality: 'Nigdi', city: 'Pimpri-Chinchwad', slug: 'nigdi-sector-25', legacy: ['cakestory-nigdi-sector-25'] },
  { id: 'franchise-039', locality: 'Nigdi', city: 'Pimpri-Chinchwad', slug: 'nigdi-yamuna-nagar', legacy: ['cakestory-nigdi-yamuna-nagar'] },
  { id: 'franchise-040', locality: 'Dhayari', city: 'Pune', slug: 'dhayari', legacy: ['cakestory-dhayari'] },
  { id: 'franchise-041', locality: 'Kondhwa', city: 'Pune', slug: 'kondhwa-tilekar-nagar', legacy: ['cakestory-kondhwa-tilekar-nagar'] },
  { id: 'franchise-042', locality: 'Katraj', city: 'Pune', slug: 'katraj', legacy: ['cakestory-katraj-jambhulwadi'] },
  { id: 'franchise-043', locality: 'Chikhali', city: 'Pimpri-Chinchwad', slug: 'chikhali-sane-chowk', legacy: ['cakestory-chikhali-sane-chowk'] },
  { id: 'franchise-044', locality: 'Phursungi', city: 'Pune', slug: 'phursungi-ganganagar', legacy: ['cakestory-phursungi-ganganagar'] },
  { id: 'franchise-045', locality: 'Mundhwa', city: 'Pune', slug: 'mundhwa', legacy: ['cakestory-mundhwa-pratima-palace'] },

  // 46-62 Regional Corridors
  { id: 'franchise-046', locality: 'Wagholi', city: 'Pune', slug: 'wagholi', legacy: ['cakestory-wagholi'] },
  { id: 'franchise-047', locality: 'Hinjawadi', city: 'Pune', slug: 'hinjawadi-phase-1', legacy: ['cakestory-hinjawadi-it-hub'] },
  { id: 'franchise-048', locality: 'Hinjawadi', city: 'Pune', slug: 'hinjawadi-phase-3', legacy: ['cakestory-hinjawadi-megapolis'] },
  { id: 'franchise-049', locality: 'Bhosari', city: 'Pimpri-Chinchwad', slug: 'bhosari', legacy: ['cakestory-bhosari'] },
  { id: 'franchise-050', locality: 'Pimple Gurav', city: 'Pimpri-Chinchwad', slug: 'pimple-gurav', legacy: ['cakestory-pimple-gurav'] },
  { id: 'franchise-051', locality: 'Bavdhan', city: 'Pune', slug: 'bavdhan', legacy: ['cakestory-bavdhan'] },
  { id: 'franchise-052', locality: 'Aundh', city: 'Pune', slug: 'aundh', legacy: ['cakestory-aundh'] },
  { id: 'franchise-053', locality: 'Balewadi', city: 'Pune', slug: 'balewadi', legacy: ['cakestory-balewadi'] },
  { id: 'franchise-054', locality: 'Dhanori', city: 'Pune', slug: 'dhanori', legacy: ['cakestory-dhanori'] },
  { id: 'franchise-055', locality: 'Vishrantwadi', city: 'Pune', slug: 'vishrantwadi', legacy: ['cakestory-vishrantwadi'] },
  { id: 'franchise-056', locality: 'Swargate', city: 'Pune', slug: 'swargate', legacy: ['cakestory-swargate'] },
  { id: 'franchise-057', locality: 'Sinhgad Road', city: 'Pune', slug: 'sinhgad-road', legacy: ['cakestory-sinhgad-road-manik-baug'] },
  { id: 'franchise-058', locality: 'Powai Naka', city: 'Satara', slug: 'powai-naka', legacy: ['cakestory-satara-powai-naka'] },
  { id: 'franchise-059', locality: 'Highway Junction', city: 'Satara', slug: 'highway-junction', legacy: ['cakestory-satara-highway'] },
  { id: 'franchise-060', locality: 'Shirwal', city: 'Shirwal', slug: 'midc-hub', legacy: ['cakestory-shirwal'] },
  { id: 'franchise-061', locality: 'Talegaon', city: 'Talegaon', slug: 'station-road', legacy: ['cakestory-talegaon'] },
  { id: 'franchise-062', locality: 'Chakan', city: 'Chakan', slug: 'ambethan-chowk', legacy: ['cakestory-chakan'] }
];

const normalizedOutlets = outlets.map(outlet => {
  const m = mappings.find(item => item.id === outlet.id);
  if (!m) {
    console.warn(`No mapping found for ${outlet.id} (${outlet.name})`);
    return outlet;
  }

  const city = m.city;
  const citySlug = slugify(city);
  const locality = m.locality;
  const slug = m.slug;

  // Combine any existing legacy slugs
  const legacySlugs = Array.from(new Set([
    ...(outlet.legacySlugs || []),
    ...(m.legacy || []),
    outlet.slug // include old slug as legacy redirect
  ])).filter(s => s && s !== slug);

  return {
    ...outlet,
    city,
    citySlug,
    locality,
    slug,
    legacySlugs
  };
});

// Verify no collisions
const routeSet = new Set();
normalizedOutlets.forEach(o => {
  const route = `/outlets/${o.citySlug}/${o.slug}`;
  if (routeSet.has(route)) {
    throw new Error(`Duplicate canonical route detected: ${route}`);
  }
  routeSet.add(route);
});

console.log(`All ${normalizedOutlets.length} outlets normalized. 0 collisions detected.`);

fs.writeFileSync(EXISTING_FILE, JSON.stringify(normalizedOutlets, null, 2), 'utf8');
console.log(`Saved normalized outlets to ${EXISTING_FILE}`);
