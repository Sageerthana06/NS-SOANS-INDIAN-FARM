import fs from 'fs';
import path from 'path';
import { products } from '../src/data/products.js';

const publicDir = path.resolve('public');

console.log('=== FULL PRODUCT IMAGE AUDIT ===');
const missing = [];
const valid = [];

for (const p of products) {
  const img = p.images && p.images[0];
  if (!img) {
    missing.push({ id: p.id, name: p.name, reason: 'No image specified' });
    continue;
  }
  const rel = img.replace(/^\//, '');
  const full = path.join(publicDir, rel);
  if (!fs.existsSync(full)) {
    missing.push({ id: p.id, name: p.name, img, full, reason: 'File does not exist' });
  } else {
    const stat = fs.statSync(full);
    valid.push({ id: p.id, name: p.name, img, size: stat.size });
  }
}

console.log(`Valid images on disk: ${valid.length} / ${products.length}`);
console.log(`Missing images on disk: ${missing.length}`);
if (missing.length > 0) {
  console.log('Missing items:', missing);
}
