import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { categories } from '../src/data/categories.js';
import { CATEGORY_IMAGE_MAP, getCategoryImage } from '../src/data/categoryImageMap.js';

const publicDir = path.resolve('public');

async function verifyCategories() {
  console.log('================================================================');
  console.log('     NS SOANS INDIAN FARM — CATEGORY IMAGE VERIFICATION REPORT   ');
  console.log('================================================================');

  const rows = [];
  const imageCounts = {};

  for (const cat of categories) {
    const resolvedPath = getCategoryImage(cat);
    const diskPath = path.join(publicDir, resolvedPath.replace(/^\//, ''));
    const exists = fs.existsSync(diskPath);

    let meta = null;
    let sizeKb = 0;
    if (exists) {
      sizeKb = (fs.statSync(diskPath).size / 1024).toFixed(1);
      meta = await sharp(diskPath).metadata();
    }

    imageCounts[resolvedPath] = (imageCounts[resolvedPath] || 0) + 1;

    rows.push({
      category: cat.name,
      slug: cat.slug,
      imageFile: path.basename(resolvedPath),
      pngOriginal: path.basename(CATEGORY_IMAGE_MAP[cat.slug]?.pngImage || ''),
      status: exists ? 'Matched' : 'Missing',
      dimensions: meta ? `${meta.width}x${meta.height}` : 'N/A',
      size: `${sizeKb} KB`
    });
  }

  console.table(rows);

  const duplicates = Object.entries(imageCounts).filter(([k, v]) => v > 1);

  console.log(`\nTotal Categories Checked    : ${categories.length}`);
  console.log(`Total Categories Matched    : ${rows.filter(r => r.status === 'Matched').length} / 12`);
  console.log(`Missing Category Images     : ${rows.filter(r => r.status === 'Missing').length}`);
  console.log(`Duplicate Image Assignments : ${duplicates.length}`);
  console.log('================================================================');
}

verifyCategories();
