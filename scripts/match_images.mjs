import fs from 'fs';
import path from 'path';
import { products } from '../src/data/products.js';

const productsImgDir = path.resolve('public/images/products');
const files = fs.readdirSync(productsImgDir);

console.log('--- MATCHING UNREFERENCED FILES TO PRODUCTS ---');

for (const p of products) {
  const currentImg = path.basename(p.images[0] || '');
  const slug = p.slug;
  const id = p.id;
  
  // Find potential files matching this product
  const potential = files.filter(f => {
    const fBase = f.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    return slug.includes(fBase) || fBase.includes(slug) || p.name.toLowerCase().replace(/[^a-z0-9]/g, '').includes(fBase.replace(/[^a-z0-9]/g, ''));
  });

  const exactJpg = `${slug}.jpg`;
  const exactPng = `${slug}.png`;
  const exactWebp = `${slug}.webp`;

  const availableExact = files.filter(f => f === exactJpg || f === exactPng || f === exactWebp);

  console.log(`[${p.id}] ${p.name}`);
  console.log(`   Current: ${currentImg} (exists: ${fs.existsSync(path.join(productsImgDir, currentImg))})`);
  if (availableExact.length > 0) {
    console.log(`   Exact slug files on disk: ${availableExact.join(', ')}`);
  }
}
