import fs from 'fs';
import path from 'path';
import { products } from '../src/data/products.js';

console.log('Total products in src/data/products.js:', products.length);

const imageCounts = {};
const missingFiles = [];

for (const p of products) {
  const img = p.images && p.images[0];
  if (!img) {
    console.log('Product has no image array or empty:', p.id, p.name);
    continue;
  }
  imageCounts[img] = (imageCounts[img] || 0) + 1;
  const diskPath = path.join(process.cwd(), 'public', img.replace(/^\//, ''));
  if (!fs.existsSync(diskPath)) {
    missingFiles.push({ id: p.id, name: p.name, img, diskPath });
  }
}

console.log('Unique image paths currently referenced:', Object.keys(imageCounts).length);
console.log('Broken/missing image paths on disk:', missingFiles.length);
if (missingFiles.length > 0) {
  console.log('Detail of broken paths:', missingFiles);
}

const duplicatedImages = Object.entries(imageCounts).filter(([k, v]) => v > 1);
console.log('\nNumber of image files reused across multiple products:', duplicatedImages.length);
for (const [img, count] of duplicatedImages) {
  const matched = products.filter(p => p.images && p.images[0] === img).map(p => p.name);
  console.log(`\nImage: ${img} (${count} products):\n  -> ` + matched.join('\n  -> '));
}
