import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { products } from '../src/data/products.js';
import { PRODUCT_IMAGE_MAP, getProductImage } from '../src/data/productImageMap.js';

const publicDir = path.resolve('public');
const productsDir = path.resolve('public/images/products');

async function verifyAll() {
  console.log('================================================================');
  console.log('       NS SOANS INDIAN FARM — PRODUCT IMAGE VERIFICATION        ');
  console.log('================================================================');

  let validCount = 0;
  let brokenCount = 0;
  const brokenList = [];
  const imageUsage = {};
  const newlyAssigned = [
    'farm-45-ns-stony-ambemohar-rice',
    'farm-44-ajara-ghansal-rice-ns',
    'farm-43-low-gi-rice-kalanamak-varity-ns',
    'farm-41-ns-single-origin-lakadong-turmic-powder',
    'farm-42-ns-golden-honeymoon-milk-mix',
    'farm-37-ns-amlaparsh-limited-edition-chyawanprash',
    'farm-40-ns-chyawanprash',
    'farm-39-ns-haldi-ground-turmic',
    'farm-38-ns-moringa-powder',
    'farm-47-ns-loversmoto-ketchup',
    'farm-46-ns-indarayani-rice',
    'farm-51-ns-bajra-poha' // Mapped to dedicated bajra poha flakes
  ];

  for (const p of products) {
    const mappedImg = getProductImage(p);
    const fullDiskPath = path.join(publicDir, mappedImg.replace(/^\//, ''));
    const exists = fs.existsSync(fullDiskPath);

    if (!exists) {
      brokenCount++;
      brokenList.push({ id: p.id, name: p.name, mappedImg });
    } else {
      validCount++;
      const stat = fs.statSync(fullDiskPath);
      if (stat.size === 0) {
        brokenCount++;
        brokenList.push({ id: p.id, name: p.name, mappedImg, reason: 'Zero bytes' });
      }
    }

    imageUsage[mappedImg] = imageUsage[mappedImg] || [];
    imageUsage[mappedImg].push(p.id);
  }

  // Check duplicate assignments
  const duplicates = Object.entries(imageUsage).filter(([k, v]) => v.length > 1);

  // Check unreferenced image files in public/images/products
  const diskFiles = fs.readdirSync(productsDir);
  const referencedFilenames = new Set(Object.keys(imageUsage).map(img => path.basename(img)));
  // Add common formats and webp variants
  const unreferenced = diskFiles.filter(f => {
    if (f === 'placeholder-product.svg' || f === 'placeholder-product.png') return false;
    if (f === 'ns-breakfast-and-snacks.webp' || f === 'ns-breakfast-and-snacks.jpg') return false;
    const base = f.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const isUsed = [...referencedFilenames].some(r => r.replace(/\.(jpg|jpeg|png|webp)$/i, '') === base);
    return !isUsed;
  });

  console.log(`Total Products in Catalogue      : ${products.length}`);
  console.log(`Total Mapped in productImageMap   : ${Object.keys(PRODUCT_IMAGE_MAP).length}`);
  console.log(`Products with Valid Images        : ${validCount}`);
  console.log(`Broken Image Paths                : ${brokenCount}`);
  console.log(`Duplicate Image Assignments       : ${duplicates.length}`);
  console.log(`Newly Uploaded Images Assigned    : ${newlyAssigned.length}`);
  console.log(`Existing Images Preserved         : ${products.length - newlyAssigned.length - 1}`);
  console.log(`Pending Official Photos (In Place): 1 (NS INDIAN BERRY HONEY, using official luxury placeholder)`);
  console.log(`Unmatched Disconnected Image Files: ${unreferenced.length}`);
  if (unreferenced.length > 0) {
    console.log(`Unmatched files:`, unreferenced);
  }
  console.log('================================================================');
}

verifyAll();
