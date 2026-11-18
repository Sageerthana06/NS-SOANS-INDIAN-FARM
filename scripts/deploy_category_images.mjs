import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const catDir = path.resolve('public/images/categories');
const files = [
  'atta.png',
  'beverages.png',
  'breakfast-snacks.png',
  'ghee.png',
  'grains-pulses.png',
  'immunity-support.png',
  'natural-sweetener.png',
  'non-veg.png',
  'oil.png',
  'paste.png',
  'rice.png',
  'veg.png'
];

async function processCategories() {
  console.log('--- GENERATING OPTIMIZED WEBP & JPG FOR CATEGORIES ---');

  for (const f of files) {
    const src = path.join(catDir, f);
    if (!fs.existsSync(src)) {
      console.error(`Missing file: ${src}`);
      continue;
    }

    const baseName = f.replace(/\.png$/i, '');
    const dstWebp = path.join(catDir, `${baseName}.webp`);
    const dstJpg = path.join(catDir, `${baseName}.jpg`);

    // Webp
    await sharp(src)
      .webp({ quality: 88 })
      .toFile(dstWebp);
    console.log(`Generated: ${baseName}.webp (${(fs.statSync(dstWebp).size / 1024).toFixed(1)} KB)`);

    // Jpg
    await sharp(src)
      .jpeg({ quality: 90 })
      .toFile(dstJpg);
    console.log(`Generated: ${baseName}.jpg (${(fs.statSync(dstJpg).size / 1024).toFixed(1)} KB)`);
  }

  // Also support grain-and-pulses alias matching the exact category slug
  fs.copyFileSync(path.join(catDir, 'grains-pulses.png'), path.join(catDir, 'grain-and-pulses.png'));
  fs.copyFileSync(path.join(catDir, 'grains-pulses.webp'), path.join(catDir, 'grain-and-pulses.webp'));
  fs.copyFileSync(path.join(catDir, 'grains-pulses.jpg'), path.join(catDir, 'grain-and-pulses.jpg'));
  console.log('Created grain-and-pulses alias files (.png, .webp, .jpg)');

  console.log('--- CATEGORY ASSET PREPARATION COMPLETE ---');
}

processCategories();
