import fs from 'fs';
import path from 'path';

function findImages(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        findImages(fullPath, fileList);
      }
    } else {
      if (/\.(jpg|jpeg|png|webp|svg)$/i.test(entry.name)) {
        fileList.push({
          fullPath,
          relPath: path.relative(process.cwd(), fullPath),
          name: entry.name,
          size: fs.statSync(fullPath).size
        });
      }
    }
  }
  return fileList;
}

const allImages = findImages(process.cwd());
console.log('Total images found in project (outside node_modules/dist):', allImages.length);

const dirs = {};
for (const img of allImages) {
  const d = path.dirname(img.relPath);
  dirs[d] = (dirs[d] || 0) + 1;
}

console.log('\nDirectories containing images:');
for (const [d, count] of Object.entries(dirs)) {
  console.log(`- ${d}: ${count} images`);
}

const nonProduct = allImages.filter(img => !img.relPath.includes('products'));
console.log('\nNon-product images:');
for (const img of nonProduct) {
  console.log(`- ${img.relPath} (${img.size} bytes)`);
}
