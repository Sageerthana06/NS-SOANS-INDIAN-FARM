import fs from 'fs';
import path from 'path';
import { products } from '../src/data/products.js';

const publicDir = path.resolve('public');

const mapEntries = {};
let verifiedCount = 0;
let placeholderCount = 0;

for (const p of products) {
  const currentImg = p.images && p.images[0] ? p.images[0] : '/images/products/placeholder-product.svg';
  const diskPath = path.join(publicDir, currentImg.replace(/^\//, ''));
  const exists = fs.existsSync(diskPath);
  const isPlaceholder = currentImg.includes('placeholder') || p.id === 'farm-31-ns-indian-berry-honey-raw-mono-floral-unfiltered';

  mapEntries[p.id] = {
    id: p.id,
    sku: p.id,
    name: p.name,
    category: p.category,
    image: currentImg,
    fallbackImage: '/images/products/placeholder-product.svg',
    verified: exists && !isPlaceholder,
    isPlaceholder: isPlaceholder
  };

  if (exists && !isPlaceholder) {
    verifiedCount++;
  } else {
    placeholderCount++;
  }
}

const fileContent = `// ============================================================================
// NS SOANS INDIAN FARM — CENTRAL PRODUCT IMAGE MAPPING SYSTEM
// Single source of truth for all 124 product images.
// Maps stable product IDs to verified image assets with automatic fallbacks.
// ============================================================================

export const PRODUCT_PLACEHOLDER_IMAGE = '/images/products/placeholder-product.svg';
export const PRODUCT_PLACEHOLDER_PNG = '/images/products/placeholder-product.png';

export const PRODUCT_IMAGE_MAP = ${JSON.stringify(mapEntries, null, 2)};

/**
 * Returns the primary verified image for a product or product ID.
 * Falls back to the official NS SOANS luxury SVG placeholder if missing.
 */
export function getProductImage(productOrId) {
  if (!productOrId) return PRODUCT_PLACEHOLDER_IMAGE;
  const id = typeof productOrId === 'string' ? productOrId : productOrId.id;
  const entry = PRODUCT_IMAGE_MAP[id];
  if (entry && entry.image) return entry.image;
  if (typeof productOrId === 'object' && productOrId.images && productOrId.images[0]) {
    return productOrId.images[0];
  }
  return PRODUCT_PLACEHOLDER_IMAGE;
}

/**
 * Checks whether the product has a verified packaging photo.
 */
export function isProductImageVerified(productId) {
  const entry = PRODUCT_IMAGE_MAP[productId];
  return Boolean(entry && entry.verified);
}

export default PRODUCT_IMAGE_MAP;
`;

fs.writeFileSync('src/data/productImageMap.js', fileContent, 'utf8');
console.log(`Generated src/data/productImageMap.js:`);
console.log(`- Total mapped products: ${Object.keys(mapEntries).length}`);
console.log(`- Verified packaging photos: ${verifiedCount}`);
console.log(`- Branded placeholder photos: ${placeholderCount}`);
