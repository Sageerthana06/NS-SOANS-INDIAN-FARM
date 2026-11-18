import fs from 'fs';
import assert from 'assert';
import { products } from '../src/data/products.js';
import {
  parseXlsxBuffer,
  parseXlsBuffer,
  parseCsvText,
  buildBulkPricePreview,
  generatePriceTemplateXlsx,
  generatePriceTemplateCsv
} from '../src/utils/excelPriceParser.js';
import {
  computeNonPriceCatalogueFingerprint,
  useProductStore
} from '../src/store/productStore.js';
import { useCartStore } from '../src/store/cartStore.js';

console.log('================================================================');
console.log('   NS SOANS INDIAN FARM — PRICE-ONLY BULK UPLOAD VERIFICATION   ');
console.log('================================================================');

// 1. Pre-flight catalogue integrity fingerprint
const initialFingerprint = computeNonPriceCatalogueFingerprint(products);
assert.strictEqual(products.length, 124, 'Catalogue must contain exactly 124 products');
console.log('[1] Pre-Import Catalogue Integrity Fingerprint Captured (124 Products)');

// 2. Test User's Existing Excel File ('products details.xlsx')
const userExcelPath =
  'C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/.user_uploaded/media_1794660710961_b7ce88ad.xlsx';
if (fs.existsSync(userExcelPath)) {
  const buf = new Uint8Array(fs.readFileSync(userExcelPath));
  const sheets = parseXlsxBuffer(buf);
  const preview = buildBulkPricePreview(sheets, products);
  assert.strictEqual(preview.summary.unmatched, 0, 'All 124 products in user Excel must match');
  assert.strictEqual(
    preview.summary.duplicates,
    7,
    'Duplicate NS SPICED JAGGERY CUBES row in Sheet 2 must be detected'
  );
  console.log(
    `[2] User Excel ('products details.xlsx') Verified: ${preview.summary.totalRows} variant rows parsed, ${preview.summary.duplicates} duplicates flagged, 0 unmatched.`
  );
}

// 3. Test Sample Products Bulk Price Update via .xlsx Template
const sampleProductsClone = structuredClone(products);
// Populate sample prices for Masala & Farm products
// Product 0: LOVER'S TEA (250 Grams, 500 Grams, 1 Kg)
sampleProductsClone[0].weightOptions[0].price = 195;
sampleProductsClone[0].weightOptions[1].price = 370;
sampleProductsClone[0].weightOptions[2].price = 710;
// Product 61: NS DESI GIR COW CULTURED GHEE (150 Gram, 250 Gram, 500 Gram, 1 Kg)
sampleProductsClone[61].weightOptions[0].price = 420;
sampleProductsClone[61].weightOptions[1].price = 690;
sampleProductsClone[61].weightOptions[2].price = 1350;
sampleProductsClone[61].weightOptions[3].price = 2650;

const xlsxTemplateBytes = generatePriceTemplateXlsx(sampleProductsClone);
const parsedTemplateSheets = parseXlsxBuffer(xlsxTemplateBytes);
const samplePreview = buildBulkPricePreview(parsedTemplateSheets, products);

assert.strictEqual(samplePreview.summary.readyToUpdate, 7, 'Must have 7 matched variant prices ready to update');
assert.strictEqual(samplePreview.summary.unmatched, 0, 'Must have 0 unmatched rows');
console.log('[3] .xlsx Template Generation & Preview Verification Passed (7 Sample Variant Prices Ready)');

// 4. Execute Transactional Import & Verify ONLY Price Fields Changed
const importRes = await useProductStore.getState().executeBulkPriceImport({
  fileName: 'Sample-Test-Prices.xlsx',
  previewRows: samplePreview.rows,
  summary: samplePreview.summary
});

assert.strictEqual(importRes.success, true, 'Transactional import must succeed');
assert.strictEqual(importRes.historyEntry.counts.successful, 7, 'Must record 7 successful updates');

const postImportFingerprint = computeNonPriceCatalogueFingerprint(products);
assert.strictEqual(
  initialFingerprint,
  postImportFingerprint,
  'CRITICAL: Non-price catalogue fingerprint must be 100% identical after price import!'
);

assert.strictEqual(products[0].weightOptions[0].price, 195, "LOVER'S TEA 250 Grams price must be 195");
assert.strictEqual(products[0].weightOptions[1].price, 370, "LOVER'S TEA 500 Grams price must be 370");
assert.strictEqual(products[0].weightOptions[2].price, 710, "LOVER'S TEA 1 Kg price must be 710");
assert.strictEqual(products[61].weightOptions[2].price, 1350, 'Ghee 500 Gram price must be 1350');
console.log('[4] Strict Price-Only Transaction & Non-Price Field Integrity Verified (0 Non-Price Fields Changed)');

// 5. Verify Add to Cart & Cart Synchronization uses the Latest Price in INR
useCartStore.getState().clearCart();
useCartStore.getState().addToCart(products[0], products[0].weightOptions[1], 2);
const cartItem = useCartStore.getState().cart[0];
assert.strictEqual(cartItem.price, 370, 'Cart item must use latest imported variant price (₹370)');
assert.strictEqual(cartItem.currency, 'INR', 'Cart item must preserve INR currency');
assert.strictEqual(useCartStore.getState().getSubtotal(), 740, 'Cart subtotal must be ₹740');
console.log('[5] Add to Cart & INR Price Synchronization Verified');

// 6. Test CSV Format & Rollback Transaction
const csvText = generatePriceTemplateCsv(products);
const csvSheets = parseCsvText(csvText);
assert.ok(csvSheets[0].rows.length > 600, 'CSV template must include all product variants');

const revertRes = await useProductStore.getState().revertImportHistoryEntry(importRes.historyEntry.id);
assert.strictEqual(revertRes.success, true, 'Transaction rollback must succeed');
assert.strictEqual(products[0].weightOptions[0].price, null, 'Reverted variant price must return to null');
assert.strictEqual(
  computeNonPriceCatalogueFingerprint(products),
  initialFingerprint,
  'Fingerprint after revert must remain 100% identical'
);
console.log('[6] CSV Parser & Transaction Rollback Verification Passed');

console.log('================================================================');
console.log('         ALL PRICE-ONLY BULK UPLOAD CHECKS PASSED 100%          ');
console.log('================================================================');
