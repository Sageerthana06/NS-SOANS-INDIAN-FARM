import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

const buf = fs.readFileSync('C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/.user_uploaded/media_1794660710961_b7ce88ad.xlsx');

function findEndOfCentralDir(buf) {
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) return i;
  }
  throw new Error('Not a zip');
}

const eocd = findEndOfCentralDir(buf);
const cdOffset = buf.readUInt32LE(eocd + 16);
const cdEntries = buf.readUInt16LE(eocd + 10);

const files = {};
let p = cdOffset;
for (let i = 0; i < cdEntries; i++) {
  if (buf.readUInt32LE(p) !== 0x02014b50) break;
  const compMethod = buf.readUInt16LE(p + 10);
  const compSize = buf.readUInt32LE(p + 20);
  const fnameLen = buf.readUInt16LE(p + 28);
  const extraLen = buf.readUInt16LE(p + 30);
  const commentLen = buf.readUInt16LE(p + 32);
  const localHeaderOffset = buf.readUInt32LE(p + 42);
  const fname = buf.toString('utf8', p + 46, p + 46 + fnameLen);

  const lhExtraLen = buf.readUInt16LE(localHeaderOffset + 28);
  const dataOffset = localHeaderOffset + 30 + fnameLen + lhExtraLen;
  const rawData = buf.slice(dataOffset, dataOffset + compSize);

  if (compMethod === 0) {
    files[fname] = rawData;
  } else if (compMethod === 8) {
    files[fname] = zlib.inflateRawSync(rawData);
  }
  p += 46 + fnameLen + extraLen + commentLen;
}

let sharedStrings = [];
if (files['xl/sharedStrings.xml']) {
  const ssXml = files['xl/sharedStrings.xml'].toString('utf8');
  const siBlocks = ssXml.match(/<si>[\s\S]*?<\/si>/g) || [];
  sharedStrings = siBlocks.map(si => {
    const tMatches = si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || [];
    return tMatches.map(t => t.replace(/<[^>]+>/g, '')).join('');
  });
}

function parseSheet(sxml) {
  const rowMatches = sxml.match(/<row [^>]*>([\s\S]*?)<\/row>/g) || [];
  const rows = [];
  for (const r of rowMatches) {
    const cells = r.match(/<c [^>]*>([\s\S]*?)<\/c>/g) || [];
    const cellVals = cells.map(c => {
      const isString = c.includes('t="s"');
      const vMatch = c.match(/<v>(\d+)<\/v>/);
      if (vMatch) {
        const val = vMatch[1];
        return isString ? sharedStrings[parseInt(val, 10)] : val;
      }
      return '';
    }).filter(Boolean);
    if (cellVals.length > 0) {
      rows.push(cellVals);
    }
  }
  return rows;
}

const s1 = parseSheet(files['xl/worksheets/sheet1.xml'].toString('utf8'));
const s2 = parseSheet(files['xl/worksheets/sheet2.xml'].toString('utf8'));

const toSlug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Parse Masala
let currentMasalaCat = '';
const rawMasalaList = [];
for (let i = 1; i < s1.length; i++) {
  const text = s1[i][0].trim();
  const normalized = text.replace(/\s+/g, ' ');
  if (['BEVERAGES', 'VEG', 'NON VEG', 'PASTE'].includes(normalized)) {
    currentMasalaCat = normalized === 'NON VEG' ? 'Non Veg' : (normalized.charAt(0) + normalized.slice(1).toLowerCase());
  } else {
    rawMasalaList.push({
      name: text,
      category: currentMasalaCat,
      collection: 'masala'
    });
  }
}

// Parse Farm
let currentFarmCat = 'Ghee';
const rawFarmList = [];
const s2CatKeywords = {
  'OIL': 'Oil',
  'ATTA': 'Atta',
  'NATURAL / SWEETENER': 'Natural / Sweetener',
  'IMMUNITY  SUPPORT': 'Immunity Support',
  'IMMUNITY SUPPORT': 'Immunity Support',
  'RICE': 'Rice',
  'BREAKFAST & SNACKS': 'Breakfast & Snacks',
  'BREAKFAST &amp; SNACKS': 'Breakfast & Snacks',
  'GRAIN AND PULSES': 'Grain and Pulses'
};

const seenFarmNames = new Set();
for (let i = 0; i < s2.length; i++) {
  const text = s2[i][0].trim().replace('&amp;', '&');
  const normalized = text.replace(/\s+/g, ' ');
  if (s2CatKeywords[normalized]) {
    currentFarmCat = s2CatKeywords[normalized];
  } else {
    const key = text.toUpperCase().replace(/\s+/g, ' ');
    if (!seenFarmNames.has(key)) {
      seenFarmNames.add(key);
      rawFarmList.push({
        name: text,
        category: currentFarmCat,
        collection: 'organic'
      });
    }
  }
}

console.log(`Parsed ${rawMasalaList.length} Masala products, ${rawFarmList.length} Farm products.`);
console.log(`Total: ${rawMasalaList.length + rawFarmList.length}`);

// Category definitions (Strictly the 12 Excel categories)
const categoryDefinitions = [
  // Masala Collection
  {
    id: 'beverages',
    slug: 'beverages',
    name: 'Beverages',
    collection: 'masala',
    badge: 'Herbal Beverages',
    description: 'Traditional spiced tea, herbal kashaya, and badam milk powders from Kundapura.',
    image: '/images/products/lovers-tea.jpg'
  },
  {
    id: 'veg',
    slug: 'veg',
    name: 'Veg',
    collection: 'masala',
    badge: 'Vegetarian Masalas',
    description: 'Authentic vegetarian curry powders, sambar & rasam blends, pav bhaji, and stemless red chilli powders.',
    image: '/images/products/ns-special-garam-masala.png'
  },
  {
    id: 'non-veg',
    slug: 'non-veg',
    name: 'Non Veg',
    collection: 'masala',
    badge: 'Coastal Non-Veg',
    description: 'Signature coastal Karnataka spice blends for chicken ghee roast, fish curry, biryani, and mutton.',
    image: '/images/products/soans-kundapura-chicken-ghee-roast-masala.jpg'
  },
  {
    id: 'paste',
    slug: 'paste',
    name: 'Paste',
    collection: 'masala',
    badge: 'Culinary Paste',
    description: 'Freshly prepared traditional ginger garlic culinary paste.',
    image: '/images/products/ginger-garlic-paste.webp'
  },

  // Farm Collection
  {
    id: 'ghee',
    slug: 'ghee',
    name: 'Ghee',
    collection: 'organic',
    badge: 'A2 Desi Ghee',
    description: 'Vedic Bilona method A2 Desi Gir cow cultured ghee, buffalo ghee, and Ayurvedic herbal ghees.',
    image: '/images/products/ns-a2-desi-cow-ghee-bilona-method.webp'
  },
  {
    id: 'oil',
    slug: 'oil',
    name: 'Oil',
    collection: 'organic',
    badge: 'Cold-Pressed Oils',
    description: 'Single-filtered cold-pressed groundnut oil, black mustard oil, sunflower oil, and unrefined virgin coconut oil.',
    image: '/images/products/ns-sunflower-oil-i-cold-pressed.webp'
  },
  {
    id: 'atta',
    slug: 'atta',
    name: 'Atta',
    collection: 'organic',
    badge: 'Stone-Ground Flours',
    description: 'High-protein Khapli Emmer wheat atta, multigrain, buckwheat, amaranth, sattu, and millet flours.',
    image: '/images/products/ns-high-protien-khapli-atta.webp'
  },
  {
    id: 'natural-sweetener',
    slug: 'natural-sweetener',
    name: 'Natural / Sweetener',
    collection: 'organic',
    badge: 'Natural Sweeteners',
    description: 'Pure sugarcane jaggery blocks and granules, wild multifloral honey, raw berry honey, and date palm jaggery.',
    image: '/images/products/ns-sugarcane-jaggery-block.webp'
  },
  {
    id: 'immunity-support',
    slug: 'immunity-support',
    name: 'Immunity Support',
    collection: 'organic',
    badge: 'Wellness & Immunity',
    description: 'Amlaprash, authentic Chyawanprash, Lakadong turmeric powder, moringa, and golden milk blend.',
    image: '/images/products/ns-single-origin-lakadong-turmic-powder.webp'
  },
  {
    id: 'rice',
    slug: 'rice',
    name: 'Rice',
    collection: 'organic',
    badge: 'Traditional Rice',
    description: 'Low GI Kalanamak heritage black rice, Ajara Ghansal, Ambemohar, and Indrayani fragrant rice varieties.',
    image: '/images/products/ajara-ghansal-rice-ns.webp'
  },
  {
    id: 'breakfast-snacks',
    slug: 'breakfast-snacks',
    name: 'Breakfast & Snacks',
    collection: 'organic',
    badge: 'Healthy Snacks',
    description: 'Handcrafted sattu and gondh laddoos, roasted vermicelli, millet poha, raw cashews, and artisan nut butters.',
    image: '/images/products/ns-sattu-laddoo.webp'
  },
  {
    id: 'grain-and-pulses',
    slug: 'grain-and-pulses',
    name: 'Grain and Pulses',
    collection: 'organic',
    badge: 'Heritage Harvest',
    description: 'Unpolished desi tur dal, whole green gram, Kundapura rajma, raw peanuts, and Himalayan pink salt.',
    image: '/images/products/ns-tur-pigeon-pea-dal-unpolished-desi-variety.webp'
  }
];

// Generate categories.js
const catCounts = {};
rawMasalaList.forEach(p => {
  const s = toSlug(p.category);
  catCounts[s] = (catCounts[s] || 0) + 1;
});
rawFarmList.forEach(p => {
  const s = toSlug(p.category);
  catCounts[s] = (catCounts[s] || 0) + 1;
});

const generatedCategories = categoryDefinitions.map(cat => ({
  ...cat,
  itemCount: catCounts[cat.slug] || 0
}));

const categoriesFileContent = `// ============================================================================
// NS SOANS INDIAN FARM — PRODUCT CATEGORIES
// Strictly derived from 'products details.xlsx' (12 Excel Categories)
// ============================================================================

export const categories = ${JSON.stringify(generatedCategories, null, 2)};

export const subcategories = categories.map(cat => ({
  id: cat.slug,
  name: cat.name,
  collection: cat.collection,
  categorySlug: cat.slug,
  count: cat.itemCount
}));

export default categories;
`;

fs.writeFileSync('src/data/categories.js', categoriesFileContent, 'utf8');
console.log('Updated src/data/categories.js with all 12 Excel categories!');

// Generate products.js
const allProducts = [];

rawMasalaList.forEach((item, idx) => {
  const slug = toSlug(item.name);
  const catSlug = toSlug(item.category);
  allProducts.push({
    id: `masala-${idx + 1}-${slug}`,
    slug,
    name: item.name,
    brand: 'NS SOANS INDIAN FARM',
    collection: 'masala',
    collectionName: 'Masala Products',
    brandAttribution: 'NS SOANS INDIAN FARM',
    category: item.category,
    categorySlug: catSlug,
    subcategory: item.category,
    subcategorySlug: catSlug,
    price: null,
    originalPrice: null,
    discountPercent: 0,
    badge: item.category,
    isBestSeller: idx < 6,
    isFeatured: idx % 4 === 0,
    isNewArrival: idx % 7 === 0,
    isSpecialOffer: false,
    threeModelType: 'pouch',
    accentColor: '#cf3e21',
    shortDescription: `${item.name} — Authentic preparation from the NS SOANS INDIAN FARM Masala Products collection.`,
    description: `${item.name} is part of the NS SOANS INDIAN FARM Masala Products catalogue (${item.category} range), rooted in the traditional culinary heritage of Kundapura, Karnataka. Available in 250 Grams, 500 Grams, and 1 Kg pack sizes.`,
    images: [`/images/products/${slug}.webp`],
    weightOptions: [
      { weight: '250 Grams', price: null, stock: 100 },
      { weight: '500 Grams', price: null, stock: 100 },
      { weight: '1 Kg', price: null, stock: 100 }
    ],
    origin: 'Kundapura, Udupi District, Karnataka',
    shelfLife: 'Refer to product pack',
    storage: 'Store in a cool, dry, airtight container away from direct sunlight.'
  });
});

rawFarmList.forEach((item, idx) => {
  const slug = toSlug(item.name);
  const catSlug = toSlug(item.category);
  allProducts.push({
    id: `farm-${idx + 1}-${slug}`,
    slug,
    name: item.name,
    brand: 'NS SOANS INDIAN FARM',
    collection: 'organic',
    collectionName: 'Farm Products',
    brandAttribution: 'NS SOANS INDIAN FARM',
    category: item.category,
    categorySlug: catSlug,
    subcategory: item.category,
    subcategorySlug: catSlug,
    price: null,
    originalPrice: null,
    discountPercent: 0,
    badge: item.category,
    isBestSeller: idx < 6,
    isFeatured: idx % 4 === 0,
    isNewArrival: idx % 6 === 0,
    isSpecialOffer: false,
    threeModelType: 'jar',
    accentColor: '#d4af37',
    shortDescription: `${item.name} — Natural offering from the NS SOANS INDIAN FARM Farm Products collection.`,
    description: `${item.name} is part of the NS SOANS INDIAN FARM Farm Products catalogue (${item.category} range). Available across standard pack sizes from 150 Gram to 10 Kg.`,
    images: [`/images/products/${slug}.webp`],
    weightOptions: [
      { weight: '150 Gram', price: null, stock: 100 },
      { weight: '250 Gram', price: null, stock: 100 },
      { weight: '500 Gram', price: null, stock: 100 },
      { weight: '1 Kg', price: null, stock: 100 },
      { weight: '2 Kg', price: null, stock: 100 },
      { weight: '5 Kg', price: null, stock: 100 },
      { weight: '10 Kg', price: null, stock: 100 }
    ],
    origin: 'Kundapura, Karnataka, India',
    shelfLife: 'Refer to product pack',
    storage: 'Store in a clean, cool, dry place in an airtight container.'
  });
});

const productsFileContent = `// ============================================================================
// NS SOANS INDIAN FARM — UNIFIED PRODUCT CATALOGUE (124 UNIQUE PRODUCTS)
// Single source of truth: 'products details.xlsx'
// - Masala Products: 61 items across 4 categories (Beverages, Veg, Non Veg, Paste)
// - Farm Products: 63 unique items across 8 categories (Ghee, Oil, Atta, Natural / Sweetener, Immunity Support, Rice, Breakfast & Snacks, Grain and Pulses)
// - One duplicate in Excel consolidated: NS SPICED JAGGERY CUBES
// ============================================================================

export const products = ${JSON.stringify(allProducts, null, 2)};

export default products;
`;

fs.writeFileSync('src/data/products.js', productsFileContent, 'utf8');
console.log(`Updated src/data/products.js with all ${allProducts.length} verified products!`);

