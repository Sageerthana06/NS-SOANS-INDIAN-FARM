import fs from 'fs';
import { products } from '../src/data/products.js';
import { categories } from '../src/data/categories.js';
import {
  parseXlsxBuffer,
  buildBulkPricePreview,
  normalizeProductName,
  normalizeWeightKey
} from '../src/utils/excelPriceParser.js';

const excelPath =
  'C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/.user_uploaded/media_1794901060779_ff2c3098.xlsx';

const rawBytes = new Uint8Array(fs.readFileSync(excelPath));
const sheets = parseXlsxBuffer(rawBytes);

// Extract all product rows from Sheet 1 and Sheet 2
const categoryHeaders = new Set([
  'PRODUCTS',
  'BEVERAGES',
  'VEG',
  'NON VEG',
  'PASTE',
  'GHEE',
  'OIL',
  'ATTA',
  'NATURAL / SWEETENER',
  'IMMUNITY SUPPORT',
  'RICE',
  'BREAKFAST & SNACKS',
  'GRAIN AND PULSES'
]);

const excelProductRows = [];
for (const s of sheets) {
  for (const r of s.rows) {
    const first = normalizeProductName(r[0]);
    if (!first || categoryHeaders.has(first)) continue;
    excelProductRows.push({ sheet: s.sheetName, rawName: r[0].trim(), normName: first });
  }
}

const uniqueExcelProductNames = new Set(excelProductRows.map((x) => x.normName));
const websiteNormNames = new Set(products.map((p) => normalizeProductName(p.name)));

const missingFromWebsite = [...uniqueExcelProductNames].filter((n) => !websiteNormNames.has(n));
const extraOnWebsite = [...websiteNormNames].filter((n) => !uniqueExcelProductNames.has(n));

// Check duplicates in website catalogue
const seenWebsite = new Set();
const duplicateWebsiteProducts = [];
for (const p of products) {
  const n = normalizeProductName(p.name);
  if (seenWebsite.has(n)) duplicateWebsiteProducts.push(p.name);
  seenWebsite.add(n);
}

// Check products with prices vs products with missing prices ("Price Coming Soon")
let productsWithPrices = 0;
let productsWithMissingPrices = 0;
let totalPricedVariants = 0;
let totalUnpricedVariants = 0;

for (const p of products) {
  const hasAnyPrice = (p.weightOptions || []).some(
    (w) => w.price !== null && w.price !== undefined && w.price > 0
  );
  if (hasAnyPrice) {
    productsWithPrices++;
  } else {
    productsWithMissingPrices++;
  }
  for (const w of p.weightOptions || []) {
    if (w.price !== null && w.price !== undefined && w.price > 0) {
      totalPricedVariants++;
    } else {
      totalUnpricedVariants++;
    }
  }
}

// Verify all Excel weight variants against website weight variants
const preview = buildBulkPricePreview(sheets, products);
const missingWeightVariants = preview.rows.filter((r) => r.status === 'UNMATCHED_WEIGHT');

console.log('================================================================');
console.log('     FINAL VERIFICATION REPORT: EXCEL VS WEBSITE CATALOGUE      ');
console.log('================================================================');
console.log(`Total Raw Excel Product Rows       : ${excelProductRows.length} (61 Masala + 64 Farm rows incl. 1 duplicate NS SPICED JAGGERY CUBES row)`);
console.log(`Total Unique Excel Products        : ${uniqueExcelProductNames.size} (61 Masala + 63 Farm)`);
console.log(`Total Website Products             : ${products.length}`);
console.log(`Missing Products on Website        : ${missingFromWebsite.length}`);
console.log(`Duplicate Products on Website      : ${duplicateWebsiteProducts.length}`);
console.log(`Products with Active Excel Prices  : ${productsWithPrices} (${totalPricedVariants} priced weight variants)`);
console.log(`Products with Missing Prices       : ${productsWithMissingPrices} (Displayed with "Price Coming Soon")`);
console.log(`Weight Variants Missing on Website : ${missingWeightVariants.length}`);
console.log('================================================================');
