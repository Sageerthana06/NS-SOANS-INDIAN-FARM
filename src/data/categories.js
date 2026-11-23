// ============================================================================
// NS SOANS INDIAN FARM — PRODUCT CATEGORIES
// Strictly derived from 'products details.xlsx' (12 Excel Categories)
// ============================================================================

export const categories = [
  {
    "id": "beverages",
    "slug": "beverages",
    "name": "Beverages",
    "collection": "masala",
    "badge": "Herbal Beverages",
    "description": "Traditional spiced tea, herbal kashaya, and badam milk powders from Kundapura.",
    "image": "/images/categories/beverages.webp",
    "itemCount": 3
  },
  {
    "id": "veg",
    "slug": "veg",
    "name": "Veg",
    "collection": "masala",
    "badge": "Vegetarian Masalas",
    "description": "Authentic vegetarian curry powders, sambar & rasam blends, pav bhaji, and stemless red chilli powders.",
    "image": "/images/categories/veg.webp",
    "itemCount": 23
  },
  {
    "id": "non-veg",
    "slug": "non-veg",
    "name": "Non Veg",
    "collection": "masala",
    "badge": "Coastal Non-Veg",
    "description": "Signature coastal Karnataka spice blends for chicken ghee roast, fish curry, biryani, and mutton.",
    "image": "/images/categories/non-veg.webp",
    "itemCount": 34
  },
  {
    "id": "paste",
    "slug": "paste",
    "name": "Paste",
    "collection": "masala",
    "badge": "Culinary Paste",
    "description": "Freshly prepared traditional ginger garlic culinary paste.",
    "image": "/images/categories/paste.webp",
    "itemCount": 1
  },
  {
    "id": "ghee",
    "slug": "ghee",
    "name": "Ghee",
    "collection": "organic",
    "badge": "A2 Desi Ghee",
    "description": "Vedic Bilona method A2 Desi Gir cow cultured ghee, buffalo ghee, and Ayurvedic herbal ghees.",
    "image": "/images/categories/ghee.webp",
    "itemCount": 8
  },
  {
    "id": "oil",
    "slug": "oil",
    "name": "Oil",
    "collection": "organic",
    "badge": "Cold-Pressed Oils",
    "description": "Single-filtered cold-pressed groundnut oil, black mustard oil, sunflower oil, and unrefined virgin coconut oil.",
    "image": "/images/categories/oil.webp",
    "itemCount": 6
  },
  {
    "id": "atta",
    "slug": "atta",
    "name": "Atta",
    "collection": "organic",
    "badge": "Stone-Ground Flours",
    "description": "High-protein Khapli Emmer wheat atta, multigrain, buckwheat, amaranth, sattu, and millet flours.",
    "image": "/images/categories/atta.webp",
    "itemCount": 12
  },
  {
    "id": "natural-sweetener",
    "slug": "natural-sweetener",
    "name": "Natural / Sweetener",
    "collection": "organic",
    "badge": "Natural Sweeteners",
    "description": "Pure sugarcane jaggery blocks and granules, wild multifloral honey, raw berry honey, and date palm jaggery.",
    "image": "/images/categories/natural-sweetener.webp",
    "itemCount": 9
  },
  {
    "id": "immunity-support",
    "slug": "immunity-support",
    "name": "Immunity Support",
    "collection": "organic",
    "badge": "Wellness & Immunity",
    "description": "Amlaprash, authentic Chyawanprash, Lakadong turmeric powder, moringa, and golden milk blend.",
    "image": "/images/categories/immunity-support.webp",
    "itemCount": 6
  },
  {
    "id": "rice",
    "slug": "rice",
    "name": "Rice",
    "collection": "organic",
    "badge": "Traditional Rice",
    "description": "Low GI Kalanamak heritage black rice, Ajara Ghansal, Ambemohar, and Indrayani fragrant rice varieties.",
    "image": "/images/categories/rice.webp",
    "itemCount": 4
  },
  {
    "id": "breakfast-snacks",
    "slug": "breakfast-snacks",
    "name": "Breakfast & Snacks",
    "collection": "organic",
    "badge": "Healthy Snacks",
    "description": "Handcrafted sattu and gondh laddoos, roasted vermicelli, millet poha, raw cashews, and artisan nut butters.",
    "image": "/images/categories/breakfast-snacks.webp",
    "itemCount": 12
  },
  {
    "id": "grain-and-pulses",
    "slug": "grain-and-pulses",
    "name": "Grain and Pulses",
    "collection": "organic",
    "badge": "Heritage Harvest",
    "description": "Unpolished desi tur dal, whole green gram, Kundapura rajma, raw peanuts, and Himalayan pink salt.",
    "image": "/images/categories/grains-pulses.webp",
    "itemCount": 5
  }
];

export const subcategories = categories.map(cat => ({
  id: cat.slug,
  name: cat.name,
  collection: cat.collection,
  categorySlug: cat.slug,
  count: cat.itemCount
}));

export default categories;
