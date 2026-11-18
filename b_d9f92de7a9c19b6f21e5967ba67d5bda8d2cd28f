import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const catDir = path.resolve('public/images/categories');
const files = fs.readdirSync(catDir).filter(f => f.endsWith('.png'));

async function inspectImages() {
  for (const f of files) {
    const full = path.join(catDir, f);
    const meta = await sharp(full).metadata();
    const stats = await sharp(full).stats();
    console.log(`File: ${f}`);
    console.log(`  Dimensions: ${meta.width}x${meta.height}`);
    console.log(`  Channels: ${meta.channels}, Space: ${meta.space}`);
    console.log(`  Dominant channel means: R:${Math.round(stats.channels[0].mean)} G:${Math.round(stats.channels[1].mean)} B:${Math.round(stats.channels[2].mean)}`);
  }
}

inspectImages();
