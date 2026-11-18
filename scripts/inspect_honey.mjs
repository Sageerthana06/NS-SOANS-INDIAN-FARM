import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.resolve('public/images/products');
const files = fs.readdirSync(dir);

console.log('Total files in products dir:', files.length);

async function inspectHoneyFiles() {
  const honeyFiles = files.filter(f => f.includes('honey') || f.includes('berry'));
  console.log('Honey / Berry files:', honeyFiles);
  for (const h of honeyFiles) {
    const meta = await sharp(path.join(dir, h)).metadata();
    console.log(`- ${h}: ${meta.width}x${meta.height}, format: ${meta.format}, size: ${fs.statSync(path.join(dir, h)).size} bytes`);
  }
}

inspectHoneyFiles();
