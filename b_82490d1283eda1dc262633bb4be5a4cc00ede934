import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const dir = path.resolve('public/images/products');
const products = JSON.parse(fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/scratch/product_list.json', 'utf8'));

async function convertAll() {
  console.log(`Converting ${products.length} images to optimized WebP...`);
  const webpHashes = new Map();
  const results = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const jpgPath = path.join(dir, `${p.slug}.jpg`);
    const webpPath = path.join(dir, `${p.slug}.webp`);

    if (!fs.existsSync(jpgPath)) {
      console.error(`Missing JPG: ${jpgPath}`);
      continue;
    }

    // Convert with sharp to 800x800 square WebP
    const webpBuf = await sharp(jpgPath)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    fs.writeFileSync(webpPath, webpBuf);

    const hash = crypto.createHash('sha256').update(webpBuf).digest('hex');
    if (webpHashes.has(hash)) {
      console.warn(`[DUPLICATE HASH] ${p.slug}.webp shares hash with ${webpHashes.get(hash)}!`);
    }
    webpHashes.set(hash, p.slug);

    results.push({
      index: i + 1,
      id: p.id,
      name: p.name,
      slug: p.slug,
      webpFile: `${p.slug}.webp`,
      sizeKB: Math.round(webpBuf.length / 1024),
      hash
    });
  }

  console.log('\n--- WEBP CONVERSION & VERIFICATION REPORT ---');
  console.log(`Total Products: ${products.length}`);
  console.log(`Generated WebP Files: ${results.length}`);
  console.log(`Unique SHA-256 Hashes: ${webpHashes.size}`);
  console.log(`Strict No-Duplicate Rule Met: ${webpHashes.size === products.length}`);

  fs.writeFileSync(
    'C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/scratch/webp_manifest.json',
    JSON.stringify(results, null, 2)
  );
  console.log('Saved webp_manifest.json');
}

convertAll().catch(console.error);

