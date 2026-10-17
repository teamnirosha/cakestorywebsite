import fs from 'fs';

const ledger = JSON.parse(fs.readFileSync('scripts/output/extraction_ledger.json', 'utf8'));

console.log('Total entries:', ledger.length);

const summary = ledger.map((item, idx) => {
  let fullAddressFromUrl = '';
  let cid = '';
  if (item.directionsUrl) {
    const match = item.directionsUrl.match(/\/dir\/\/([^/]+)\/data=/);
    if (match) {
      fullAddressFromUrl = decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    const cidMatch = item.directionsUrl.match(/1s(0x[0-9a-f]+:0x[0-9a-f]+)/i);
    if (cidMatch) cid = cidMatch[1];
  }
  let phone = item.phone || '';
  if (!phone) {
    const phoneMatch = item.fullText.match(/0?\d{5}\s*\d{5}|0\d{4}\s*\d{3}\s*\d{3}/);
    if (phoneMatch) phone = phoneMatch[0];
  }

  return {
    index: idx + 1,
    id: item.id,
    name: item.name,
    batch: item.batch,
    phone,
    addressSnippet: item.address,
    fullAddressFromUrl,
    cid,
    hasDirections: !!item.directionsUrl,
    fullText: item.fullText
  };
});

fs.writeFileSync('scripts/output/ledger_summary.json', JSON.stringify(summary, null, 2), 'utf8');

summary.forEach(s => {
  console.log(`[${s.index}] ${s.name} | Phone: ${s.phone || 'N/A'} | HasDir: ${s.hasDirections}`);
  if (s.fullAddressFromUrl) {
    console.log(`    Address: ${s.fullAddressFromUrl}`);
  } else if (s.addressSnippet) {
    console.log(`    Snippet: ${s.addressSnippet}`);
  } else {
    console.log(`    FullText: ${s.fullText}`);
  }
});
