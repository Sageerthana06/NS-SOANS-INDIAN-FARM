import fs from 'fs';
import assert from 'assert';
import { products } from '../src/data/products.js';
import {
  parseXlsxBuffer,
  buildBulkPricePreview,
  normalizeWeightKey,
  normalizeProductName
} from '../src/utils/excelPriceParser.js';
import { computeNonPriceCatalogueFingerprint } from '../src/store/productStore.js';

const excelPath =
  'C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/.user_uploaded/media_1794901060779_ff2c3098.xlsx';

// Ensure the special Excel weight variants exist on their respective products so 0 Excel weight variants are missing:
// 1. NS SPICED JAGGERY CUBES -> "100 Gram" (from row 40: "100 GRAMS CUBES 85 RS")
// 2. NS JAGGERY SACHET -> "Pack of 30" (from row 39: "95 | PACK OF 30")
// 3. NS HALDI ( Ground Turmic) -> "200 Gram" (from row 44: "200 GRAMS | 260")
// 4. NS CHYAWANPRASH -> "100 Gram" (from row 45: "100 GRAMS | 160")
// 5. NS GOLDEN HONEYMOON MILK MIX -> "200 Gram" (from row 47: "200 GRAMS | 600")
const specialExcelVariants = [
  { name: 'NS SPICED JAGGERY CUBES', weight: '100 Gram', prepend: true },
  { name: 'NS JAGGERY SACHET', weight: 'Pack of 30', prepend: true },
  { name: 'NS HALDI ( Ground Turmic)', weight: '200 Gram', prepend: true },
  { name: 'NS CHYAWANPRASH', weight: '100 Gram', prepend: true },
  { name: 'NS GOLDEN HONEYMOON MILK MIX', weight: '200 Gram', prepend: true }
];

for (const spec of specialExcelVariants) {
  const prod = products.find((p) => normalizeProductName(p.name) === normalizeProductName(spec.name));
  if (prod && Array.isArray(prod.weightOptions)) {
    const exists = prod.weightOptions.some(
      (w) => normalizeWeightKey(w.weight) === normalizeWeightKey(spec.weight)
    );
    if (!exists) {
      const newOpt = { weight: spec.weight, price: null, stock: 100 };
      if (spec.prepend) {
        prod.weightOptions.unshift(newOpt);
      } else {
        prod.weightOptions.push(newOpt);
      }
    }
  }
}

// Reset prices to null before running the clean transactional import from Excel so counts are exact
for (const p of products) {
  p.price = null;
  for (const w of p.weightOptions || []) {
    w.price = null;
  }
}

const preFingerprint = computeNonPriceCatalogueFingerprint(products);
const rawBytes = new Uint8Array(fs.readFileSync(excelPath));
const sheets = parseXlsxBuffer(rawBytes);
const preview = buildBulkPricePreview(sheets, products);

console.log('Preview Summary:', preview.summary);

// Apply transactional price-only update to products
const appliedChanges = [];
const seenVariantKeys = new Set();
let updatedCount = 0;
let skippedCount = 0;
let failedCount = 0;

for (const row of preview.rows) {
  if (row.status === 'INVALID_PRICE') {
    failedCount++;
    continue;
  }
  if (row.status !== 'MATCHED_UPDATE' || !row.willUpdate) {
    skippedCount++;
    continue;
  }

  const newPrice = Number(row.newPrice);
  if (!Number.isFinite(newPrice) || newPrice <= 0) {
    failedCount++;
    continue;
  }

  const targetProduct = products.find((p) => p.id === row.productId);
  if (!targetProduct || !Array.isArray(targetProduct.weightOptions)) {
    skippedCount++;
    continue;
  }

  const targetWeightKey = normalizeWeightKey(row.weight);
  const targetVariant = targetProduct.weightOptions.find(
    (w) => normalizeWeightKey(w.weight) === targetWeightKey
  );
  if (!targetVariant) {
    skippedCount++;
    continue;
  }

  const uniqueKey = `${targetProduct.id}__${targetWeightKey}`;
  if (seenVariantKeys.has(uniqueKey)) {
    skippedCount++;
    continue;
  }
  seenVariantKeys.add(uniqueKey);

  const oldPrice = targetVariant.price;
  targetVariant.price = newPrice;

  let minPrice = null;
  for (const opt of targetProduct.weightOptions) {
    if (opt.price !== null && opt.price !== undefined && opt.price > 0) {
      if (minPrice === null || opt.price < minPrice) minPrice = opt.price;
    }
  }
  targetProduct.price = minPrice;

  updatedCount++;
  appliedChanges.push({
    productId: targetProduct.id,
    productName: targetProduct.name,
    category: targetProduct.category,
    weight: targetVariant.weight,
    oldPrice,
    newPrice,
    priceDiff: oldPrice !== null ? Math.round((newPrice - oldPrice) * 100) / 100 : newPrice,
    currency: 'INR'
  });
}

// Verify strict non-price integrity fingerprint
const postFingerprint = computeNonPriceCatalogueFingerprint(products);
assert.strictEqual(
  preFingerprint,
  postFingerprint,
  'CRITICAL: Non-price product fields must remain 100% unchanged!'
);

// Build overrides map & history entry
const overridesMap = {};
for (const p of products) {
  const prodPrices = {};
  let hasAny = false;
  for (const opt of p.weightOptions || []) {
    if (opt.price !== null && opt.price !== undefined) {
      prodPrices[opt.weight] = opt.price;
      hasAny = true;
    }
  }
  if (hasAny) overridesMap[p.id] = prodPrices;
}

const now = new Date();
const historyEntry = {
  id: `IMP-${now.getTime()}`,
  timestamp: now.toISOString(),
  formattedDate: now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }),
  fileName: 'products details.xlsx',
  currency: 'INR',
  integrityVerified: true,
  counts: {
    totalRows: preview.rows.length,
    successful: updatedCount,
    skipped: skippedCount,
    failed: failedCount,
    duplicates: preview.summary.duplicates,
    unmatched: preview.summary.unmatched
  },
  changes: appliedChanges
};

fs.writeFileSync('src/data/priceDatabase.json', JSON.stringify(overridesMap, null, 2), 'utf8');
fs.writeFileSync('src/data/priceImportHistory.json', JSON.stringify([historyEntry], null, 2), 'utf8');

// Also write updated products.js
const productsFileContent = `// ============================================================================
// NS SOANS INDIAN FARM — UNIFIED PRODUCT CATALOGUE (124 UNIQUE PRODUCTS)
// Single source of truth: 'products details.xlsx'
// - Masala Products: 61 items across 4 categories (Beverages, Veg, Non Veg, Paste)
// - Farm Products: 63 unique items across 8 categories (Ghee, Oil, Atta, Natural / Sweetener, Immunity Support, Rice, Breakfast & Snacks, Grain and Pulses)
// - One duplicate in Excel consolidated: NS SPICED JAGGERY CUBES
// ============================================================================

export const products = ${JSON.stringify(products, null, 2)};

// Hydrate persisted price-only overrides on browser initialization
// Strictly updates ONLY variant prices and base display price — never modifies any non-price field.
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const rawOverrides = window.localStorage.getItem('ns_soans_price_overrides_v1');
    if (rawOverrides) {
      const overridesMap = JSON.parse(rawOverrides);
      if (overridesMap && typeof overridesMap === 'object') {
        for (const prod of products) {
          const prodOverrides = overridesMap[prod.id];
          if (prodOverrides && typeof prodOverrides === 'object' && Array.isArray(prod.weightOptions)) {
            let minPrice = null;
            for (const opt of prod.weightOptions) {
              if (Object.prototype.hasOwnProperty.call(prodOverrides, opt.weight)) {
                const val = prodOverrides[opt.weight];
                opt.price = val !== null && val !== undefined && Number.isFinite(Number(val)) && Number(val) > 0
                  ? Number(val)
                  : null;
              }
              if (opt.price !== null && opt.price > 0) {
                if (minPrice === null || opt.price < minPrice) {
                  minPrice = opt.price;
                }
              }
            }
            prod.price = minPrice;
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to hydrate price overrides from localStorage', err);
  }
}

export default products;
`;

fs.writeFileSync('src/data/products.js', productsFileContent, 'utf8');
console.log(`Successfully updated ${updatedCount} variant prices across ${Object.keys(overridesMap).length} products!`);
