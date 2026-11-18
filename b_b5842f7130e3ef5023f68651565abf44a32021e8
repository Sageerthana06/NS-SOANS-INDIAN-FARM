import fs from 'fs';
import path from 'path';
import { products } from '../src/data/products.js';

const publicDir = path.resolve('public');
const productsImgDir = path.resolve('public/images/products');

// 1. Get all files in public/images/products
const existingFiles = fs.readdirSync(productsImgDir);
console.log('Total files in public/images/products:', existingFiles.length);

// 2. Audit each product
const results = [];
const usedFiles = new Set();
const missingOnDisk = [];

for (const p of products) {
  const currentImg = p.images && p.images[0] ? p.images[0] : null;
  let fileExists = false;
  let diskPath = '';
  if (currentImg) {
    diskPath = path.join(publicDir, currentImg.replace(/^\//, ''));
    fileExists = fs.existsSync(diskPath);
    if (fileExists) {
      usedFiles.add(path.basename(diskPath));
    } else {
      missingOnDisk.push({ id: p.id, name: p.name, currentImg, diskPath });
    }
  }
  results.push({
    id: p.id,
    name: p.name,
    category: p.category,
    currentImg,
    fileExists
  });
}

console.log('\n--- AUDIT SUMMARY ---');
console.log('Total products:', products.length);
console.log('Products with valid file on disk:', results.filter(r => r.fileExists).length);
console.log('Products with MISSING file on disk:', missingOnDisk.length);
if (missingOnDisk.length > 0) {
  console.log('Missing detail:', missingOnDisk);
}

// 3. Find files in public/images/products not used by ANY product
const unreferencedFiles = existingFiles.filter(f => !usedFiles.has(f));
console.log('\nFiles in public/images/products NOT referenced in products.js:', unreferencedFiles.length);
console.log(unreferencedFiles);
