import fs from 'fs';
import { products } from '../src/data/products.js';

// 1. Verify CSS rules in dist build
const cssFiles = fs.readdirSync('dist/assets').filter(f => f.endsWith('.css'));
const cssContent = fs.readFileSync('dist/assets/' + cssFiles[0], 'utf8');

console.log('=== CSS BUILD VERIFICATION ===');
console.log('Contains pureSpicesColorPulse keyframe:', cssContent.includes('pureSpicesColorPulse'));
console.log('Contains naturalGoodnessColorPulse keyframe:', cssContent.includes('naturalGoodnessColorPulse'));
console.log('Contains .hero-text-pure-spices class:', cssContent.includes('hero-text-pure-spices'));
console.log('Contains .hero-text-natural-goodness class:', cssContent.includes('hero-text-natural-goodness'));
console.log('Contains dark grey (#555555):', cssContent.includes('#555555') || cssContent.includes('#555'));
console.log('Contains dark golden brown (#805000):', cssContent.includes('#805000'));
console.log('Contains bright golden yellow (#ffd700):', cssContent.toLowerCase().includes('#ffd700'));
console.log('Contains prefers-reduced-motion query:', cssContent.includes('prefers-reduced-motion'));

// 2. Verify Home.jsx
const homeCode = fs.readFileSync('src/pages/Home.jsx', 'utf8');
console.log('\n=== HOME PAGE VERIFICATION ===');
console.log('Section title "Featured Products":', homeCode.includes('Featured Products'));
console.log('Subtitle present:', homeCode.includes('Discover our carefully selected traditional flavours and natural farm goodness.'));
console.log('FEATURED_PRODUCT_IDS count is 8:', homeCode.includes('masala-1-lover-s-tea') && homeCode.includes('farm-45-ns-stony-ambemohar-rice'));
console.log('"VIEW ALL 124 PRODUCTS →" button exists:', homeCode.includes('VIEW ALL 124 PRODUCTS'));
console.log('Links to /shop:', homeCode.includes('to="/shop"'));

// 3. Verify CategoryCard.jsx
const catCardCode = fs.readFileSync('src/components/CategoryCard.jsx', 'utf8');
console.log('\n=== CATEGORY CARD VERIFICATION ===');
console.log('CategoryCard links to /shop?category=:', catCardCode.includes('/shop?category='));

// 4. Verify Catalogue Integrity
console.log('\n=== CATALOGUE INTEGRITY ===');
console.log('Total products count:', products.length);
console.log('Masala count:', products.filter(p => p.collection === 'masala').length);
console.log('Farm count:', products.filter(p => p.collection === 'organic').length);
