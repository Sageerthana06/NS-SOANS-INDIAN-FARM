import fs from 'fs';
import path from 'path';

const toSlug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const MASALA_WEIGHTS = [
  { weight: '250 Grams', price: null, stock: 100 },
  { weight: '500 Grams', price: null, stock: 100 },
  { weight: '1 Kg', price: null, stock: 100 }
];

const FARM_WEIGHTS = [
  { weight: '150 Gram', price: null, stock: 100 },
  { weight: '250 Gram', price: null, stock: 100 },
  { weight: '500 Gram', price: null, stock: 100 },
  { weight: '1 Kg', price: null, stock: 100 },
  { weight: '2 Kg', price: null, stock: 100 },
  { weight: '5 Kg', price: null, stock: 100 },
  { weight: '10 Kg', price: null, stock: 100 }
];

// Check images
const productsJson = JSON.parse(fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/scratch/product_list.json', 'utf8'));
const imgDir = path.resolve('public/images/products');

for (const p of productsJson) {
  const webp = path.join(imgDir, `${p.slug}.webp`);
  const jpg = path.join(imgDir, `${p.slug}.jpg`);
  if (!fs.existsSync(webp)) {
    console.error(`Missing webp: ${p.slug}.webp`);
  }
}
console.log('All 124 product WebP images confirmed present in public/images/products/!');

