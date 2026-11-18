import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const buf = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/.user_uploaded/media_1794660710961_b7ce88ad.xlsx');

function findEndOfCentralDir(buf) {
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i;
  }
  throw new Error('Not a zip');
}

const eocd = findEndOfCentralDir(buf);
const cdOffset = buf.readUInt32LE(eocd + 16);
const cdEntries = buf.readUInt16LE(eocd + 10);

const files = {};
let p = cdOffset;
for (let i = 0; i < cdEntries; i++) {
  if (buf.readUInt32LE(p) !== 0x02014b50) break;
  const compMethod = buf.readUInt16LE(p + 10);
  const compSize = buf.readUInt32LE(p + 20);
  const fnameLen = buf.readUInt16LE(p + 28);
  const extraLen = buf.readUInt16LE(p + 30);
  const commentLen = buf.readUInt16LE(p + 32);
  const localHeaderOffset = buf.readUInt32LE(p + 42);
  const fname = buf.toString('utf8', p + 46, p + 46 + fnameLen);
  
  const lhExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
  const dataOffset = localHeaderOffset + 30 + fnameLen + lhExtraLen;
  const rawData = buf.slice(dataOffset, dataOffset + compSize);
  
  if (compMethod === 0) {
    files[fname] = rawData;
  } else if (compMethod === 8) {
    files[fname] = zlib.inflateRawSync(rawData);
  }
  p += 46 + fnameLen + extraLen + commentLen;
}

let sharedStrings = [];
if (files['xl/sharedStrings.xml']) {
  const ssXml = files['xl/sharedStrings.xml'].toString('utf8');
  const siBlocks = ssXml.match(/<si>[\s\S]*?<\/si>/g) || [];
  sharedStrings = siBlocks.map(si => {
    const tMatches = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
    return tMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
  });
}

function parseSheet(sxml) {
  const rowMatches = sxml.match(/<row [^>]*>([\s\S]*?)<\/row>/g) || [];
  const rows = [];
  for (const r of rowMatches) {
    const cells = r.match(/<c [^>]*>([\s\S]*?)<\/c>/g) || [];
    const cellVals = cells.map(c => {
      const isString = c.includes('t="s"');
      const vMatch = c.match(/<v>(\d+)<\/v>/);
      if (vMatch) {
        const val = vMatch[1];
        return isString ? sharedStrings[parseInt(val, 10)] : val;
      }
      return '';
    }).filter(Boolean);
    if (cellVals.length > 0) {
      rows.push(cellVals);
    }
  }
  return rows;
}

const s1 = parseSheet(files['xl/worksheets/sheet1.xml'].toString('utf8'));
const s2 = parseSheet(files['xl/worksheets/sheet2.xml'].toString('utf8'));

console.log('Sheet 1 rows:', s1.length, 'Sheet 2 rows:', s2.length);

// Parse Sheet 1
// S1[1] is Header: ["PRODUCTS", "250 GRAMS", "500 GRAMS", "1 KG"]
let currentCat = '';
const masalaItems = [];
const s1CatOrder = ['BEVERAGES', 'VEG', 'NON VEG ', 'PASTE'];

for (let i = 1; i < s1.length; i++) {
  const text = s1[i][0].trim();
  if (['BEVERAGES', 'VEG', 'NON VEG', 'PASTE'].includes(text.replace(/\s+/g, ' '))) {
    currentCat = text.replace(/\s+/g, ' ');
  } else {
    masalaItems.push({
      rawName: text,
      category: currentCat,
      collection: 'masala'
    });
  }
}

console.log('Masala items parsed:', masalaItems.length);
const masalaCats = {};
masalaItems.forEach(item => {
  masalaCats[item.category] = (masalaCats[item.category] || 0) + 1;
});
console.log('Masala category counts:', masalaCats);

// Parse Sheet 2
// S2[1]: ["NS DESI GIR COW CULTURED GHEE", "150 GRAM", ...]
const farmItems = [];
let currentFarmCat = 'GHEE';
const s2Cats = ['OIL', 'ATTA', 'NATURAL / SWEETENER', 'IMMUNITY  SUPPORT', 'RICE', 'BREAKFAST & SNACKS', 'GRAIN AND PULSES'];

for (let i = 0; i < s2.length; i++) {
  const text = s2[i][0].trim();
  const normalized = text.replace(/\s+/g, ' ').replace('&amp;', '&');
  if (s2Cats.map(c => c.replace(/\s+/g, ' ')).includes(normalized)) {
    currentFarmCat = normalized;
  } else {
    farmItems.push({
      rawName: text.replace('&amp;', '&'),
      category: currentFarmCat === 'IMMUNITY SUPPORT' ? 'IMMUNITY SUPPORT' : currentFarmCat,
      collection: 'organic'
    });
  }
}

console.log('Farm items parsed (before dedup):', farmItems.length);
// Check for duplicates
const seen = new Set();
const uniqueFarmItems = [];
const duplicates = [];

for (const item of farmItems) {
  const normName = item.rawName.toUpperCase().replace(/\s+/g, ' ').trim();
  if (seen.has(normName)) {
    duplicates.push(item);
  } else {
    seen.add(normName);
    uniqueFarmItems.push(item);
  }
}

console.log('Duplicates found in Farm:', duplicates.length, duplicates.map(d => d.rawName));
console.log('Unique Farm items:', uniqueFarmItems.length);

const farmCats = {};
uniqueFarmItems.forEach(item => {
  farmCats[item.category] = (farmCats[item.category] || 0) + 1;
});
console.log('Farm category counts:', farmCats);

console.log('\n--- TOTAL UNIQUE PRODUCTS ---');
console.log('Masala:', masalaItems.length);
console.log('Farm:', uniqueFarmItems.length);
console.log('Total:', masalaItems.length + uniqueFarmItems.length);

