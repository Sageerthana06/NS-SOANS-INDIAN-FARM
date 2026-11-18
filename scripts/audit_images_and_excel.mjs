import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// 1. Check current active products in src/data/products.js
const productsModule = await import('file://' + path.resolve('src/data/products.js').replace(/\\/g, '/'));
const activeProducts = productsModule.products;

console.log('--- 1. ACTIVE PRODUCTS ---');
console.log('Active products in src/data/products.js:', activeProducts.length);

// 2. Check all product image files in public/images/products
const imgDir = path.resolve('public/images/products');
const allImageFiles = fs.readdirSync(imgDir);
console.log('\n--- 2. IMAGE FILES IN DISK ---');
console.log('Image directory:', imgDir);
console.log('Total files in directory:', allImageFiles.length);

const webpFiles = allImageFiles.filter(f => f.endsWith('.webp'));
const jpgFiles = allImageFiles.filter(f => f.endsWith('.jpg'));
console.log(`WebP files: ${webpFiles.length}, JPG files: ${jpgFiles.length}`);

// 3. Hash checking for duplicates
console.log('\n--- 3. HASH DUPLICATE DETECTION ---');
const fileHashMap = new Map(); // hash -> array of filenames
const webpHashMap = new Map();

for (const f of allImageFiles) {
  const fullPath = path.join(imgDir, f);
  const buf = fs.readFileSync(fullPath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  if (!fileHashMap.has(hash)) {
    fileHashMap.set(hash, []);
  }
  fileHashMap.get(hash).push(f);

  if (f.endsWith('.webp')) {
    if (!webpHashMap.has(hash)) webpHashMap.set(hash, []);
    webpHashMap.get(hash).push(f);
  }
}

console.log('Unique hashes across all files:', fileHashMap.size);
console.log('Unique hashes across WebP files:', webpHashMap.size);

const duplicateWebp = [];
for (const [hash, files] of webpHashMap.entries()) {
  if (files.length > 1) {
    duplicateWebp.push({ hash, files });
  }
}
console.log('Duplicate WebP image files (identical hash):', duplicateWebp.length);
if (duplicateWebp.length > 0) {
  console.log('Duplicates:', JSON.stringify(duplicateWebp, null, 2));
}

// 4. Verify each active product mapping
console.log('\n--- 4. PRODUCT-TO-IMAGE MAPPING & MISSING CHECK ---');
let missingCount = 0;
const productHashes = new Map(); // hash -> [product names]
const productsWithoutImages = [];

for (const p of activeProducts) {
  const imgPath = p.images?.[0];
  if (!imgPath) {
    productsWithoutImages.push({ name: p.name, reason: 'No image field in product record' });
    missingCount++;
    continue;
  }
  const diskPath = path.join(path.resolve('public'), imgPath.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    productsWithoutImages.push({ name: p.name, path: imgPath, reason: 'File does not exist on disk' });
    missingCount++;
    continue;
  }
  const buf = fs.readFileSync(diskPath);
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  if (!productHashes.has(hash)) {
    productHashes.set(hash, []);
  }
  productHashes.get(hash).push(p.name);
}

console.log('Total active products:', activeProducts.length);
console.log('Missing / broken product images:', missingCount);
console.log('Unique images assigned across active products:', productHashes.size);

const duplicateProductAssignments = [];
for (const [hash, pNames] of productHashes.entries()) {
  if (pNames.length > 1) {
    duplicateProductAssignments.push(pNames);
  }
}
console.log('Products sharing identical images:', duplicateProductAssignments.length);

// 5. Why the user mentioned "Expected: 127 unique product photos"
// Let's check Excel raw rows again to see if there were 127 items or if Sheet 1 had more items!

