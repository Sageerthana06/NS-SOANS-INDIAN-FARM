import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { products } from '../src/data/products.js';

const productsImgDir = path.resolve('public/images/products');
const allDiskFiles = fs.readdirSync(productsImgDir);

async function run() {
  const report = [];

  for (const p of products) {
    const curImg = p.images && p.images[0] ? p.images[0] : '';
    const curBase = path.basename(curImg);
    const curFullPath = path.join(productsImgDir, curBase);
    const exists = fs.existsSync(curFullPath);

    let meta = null;
    let size = 0;
    if (exists) {
      size = fs.statSync(curFullPath).size;
      try {
        meta = await sharp(curFullPath).metadata();
      } catch (e) {
        meta = { error: e.message };
      }
    }

    // Check disk for other candidate matches
    const slug = p.slug;
    const directMatches = allDiskFiles.filter(f => {
      const b = f.replace(/\.(jpg|jpeg|png|webp)$/i, '');
      return b === slug;
    });

    report.push({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      collection: p.collection,
      curImg,
      exists,
      size,
      width: meta ? meta.width : null,
      height: meta ? meta.height : null,
      format: meta ? meta.format : null,
      directMatches
    });
  }

  // Summary counts
  const total = report.length;
  const existingCount = report.filter(r => r.exists).length;
  const missingCount = report.filter(r => !r.exists).length;

  console.log(`Total Products: ${total}`);
  console.log(`Existing images: ${existingCount}`);
  console.log(`Missing images: ${missingCount}`);

  const missing = report.filter(r => !r.exists);
  if (missing.length > 0) {
    console.log('\nMissing Image List:');
    missing.forEach(m => console.log(`- [${m.id}] "${m.name}" => ${m.curImg}`));
  }

  // Check if any product has directMatches on disk that differ from curImg
  const hasBetter = report.filter(r => {
    if (!r.exists) return true;
    // e.g. webp vs jpg, or bajra poha pointing to bajra.jpg
    if (r.id === 'farm-51-ns-bajra-poha' && r.curImg.includes('ns-bajra.jpg')) return true;
    return false;
  });
  console.log('\nProducts needing fix/better match:');
  hasBetter.forEach(h => console.log(`- [${h.id}] "${h.name}" => current: ${h.curImg}, directMatches on disk: ${h.directMatches.join(', ')}`));
}

run();
