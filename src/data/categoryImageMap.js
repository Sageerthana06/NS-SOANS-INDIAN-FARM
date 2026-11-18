// ============================================================================
// NS SOANS INDIAN FARM — CENTRAL CATEGORY IMAGE MAPPING SYSTEM
// Single source of truth for all 12 genuine inventory categories.
// Maps each category to its authentic original photograph.
// ============================================================================

export const CATEGORY_IMAGE_MAP = {
  beverages: {
    id: 'beverages',
    slug: 'beverages',
    name: 'Beverages',
    image: '/images/categories/beverages.webp',
    pngImage: '/images/categories/beverages.png',
    jpgImage: '/images/categories/beverages.jpg',
    badge: 'Herbal Beverages',
    description: 'Traditional spiced tea, herbal kashaya, and badam milk powders from Kundapura.',
    verified: true
  },
  veg: {
    id: 'veg',
    slug: 'veg',
    name: 'Veg',
    image: '/images/categories/veg.webp',
    pngImage: '/images/categories/veg.png',
    jpgImage: '/images/categories/veg.jpg',
    badge: 'Vegetarian Masalas',
    description: 'Authentic vegetarian curry powders, sambar & rasam blends, pav bhaji, and stemless red chilli powders.',
    verified: true
  },
  'non-veg': {
    id: 'non-veg',
    slug: 'non-veg',
    name: 'Non Veg',
    image: '/images/categories/non-veg.webp',
    pngImage: '/images/categories/non-veg.png',
    jpgImage: '/images/categories/non-veg.jpg',
    badge: 'Coastal Non-Veg',
    description: 'Signature coastal Karnataka spice blends for chicken ghee roast, fish curry, biryani, and mutton.',
    verified: true
  },
  paste: {
    id: 'paste',
    slug: 'paste',
    name: 'Paste',
    image: '/images/categories/paste.webp',
    pngImage: '/images/categories/paste.png',
    jpgImage: '/images/categories/paste.jpg',
    badge: 'Culinary Paste',
    description: 'Freshly prepared traditional ginger garlic culinary paste.',
    verified: true
  },
  ghee: {
    id: 'ghee',
    slug: 'ghee',
    name: 'Ghee',
    image: '/images/categories/ghee.webp',
    pngImage: '/images/categories/ghee.png',
    jpgImage: '/images/categories/ghee.jpg',
    badge: 'A2 Desi Ghee',
    description: 'Vedic Bilona method A2 Desi Gir cow cultured ghee, buffalo ghee, and Ayurvedic herbal ghees.',
    verified: true
  },
  oil: {
    id: 'oil',
    slug: 'oil',
    name: 'Oil',
    image: '/images/categories/oil.webp',
    pngImage: '/images/categories/oil.png',
    jpgImage: '/images/categories/oil.jpg',
    badge: 'Cold-Pressed Oils',
    description: 'Single-filtered cold-pressed groundnut oil, black mustard oil, sunflower oil, and unrefined virgin coconut oil.',
    verified: true
  },
  atta: {
    id: 'atta',
    slug: 'atta',
    name: 'Atta',
    image: '/images/categories/atta.webp',
    pngImage: '/images/categories/atta.png',
    jpgImage: '/images/categories/atta.jpg',
    badge: 'Stone-Ground Flours',
    description: 'High-protein Khapli Emmer wheat atta, multigrain, buckwheat, amaranth, sattu, and millet flours.',
    verified: true
  },
  'natural-sweetener': {
    id: 'natural-sweetener',
    slug: 'natural-sweetener',
    name: 'Natural / Sweetener',
    image: '/images/categories/natural-sweetener.webp',
    pngImage: '/images/categories/natural-sweetener.png',
    jpgImage: '/images/categories/natural-sweetener.jpg',
    badge: 'Natural Sweeteners',
    description: 'Pure sugarcane jaggery blocks and granules, wild multifloral honey, raw berry honey, and date palm jaggery.',
    verified: true
  },
  'immunity-support': {
    id: 'immunity-support',
    slug: 'immunity-support',
    name: 'Immunity Support',
    image: '/images/categories/immunity-support.webp',
    pngImage: '/images/categories/immunity-support.png',
    jpgImage: '/images/categories/immunity-support.jpg',
    badge: 'Wellness & Immunity',
    description: 'Amlaprash, authentic Chyawanprash, Lakadong turmeric powder, moringa, and golden milk blend.',
    verified: true
  },
  rice: {
    id: 'rice',
    slug: 'rice',
    name: 'Rice',
    image: '/images/categories/rice.webp',
    pngImage: '/images/categories/rice.png',
    jpgImage: '/images/categories/rice.jpg',
    badge: 'Traditional Rice',
    description: 'Low GI Kalanamak heritage black rice, Ajara Ghansal, Ambemohar, and Indrayani fragrant rice varieties.',
    verified: true
  },
  'breakfast-snacks': {
    id: 'breakfast-snacks',
    slug: 'breakfast-snacks',
    name: 'Breakfast & Snacks',
    image: '/images/categories/breakfast-snacks.webp',
    pngImage: '/images/categories/breakfast-snacks.png',
    jpgImage: '/images/categories/breakfast-snacks.jpg',
    badge: 'Healthy Snacks',
    description: 'Handcrafted sattu and gondh laddoos, roasted vermicelli, millet poha, raw cashews, and artisan nut butters.',
    verified: true
  },
  'grain-and-pulses': {
    id: 'grain-and-pulses',
    slug: 'grain-and-pulses',
    name: 'Grain and Pulses',
    image: '/images/categories/grains-pulses.webp',
    pngImage: '/images/categories/grains-pulses.png',
    jpgImage: '/images/categories/grains-pulses.jpg',
    badge: 'Heritage Harvest',
    description: 'Unpolished desi tur dal, whole green gram, Kundapura rajma, raw peanuts, and Himalayan pink salt.',
    verified: true
  }
};

/**
 * Returns the verified original image path for a given category object or slug.
 */
export function getCategoryImage(categoryOrSlug) {
  if (!categoryOrSlug) return '/images/categories/beverages.webp';
  const slug = typeof categoryOrSlug === 'string' ? categoryOrSlug : (categoryOrSlug.slug || categoryOrSlug.id);
  const entry = CATEGORY_IMAGE_MAP[slug];
  if (entry && entry.image) return entry.image;
  if (typeof categoryOrSlug === 'object' && categoryOrSlug.image) return categoryOrSlug.image;
  return '/images/categories/beverages.webp';
}

export default CATEGORY_IMAGE_MAP;
