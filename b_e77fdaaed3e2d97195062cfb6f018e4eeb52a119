import fs from 'fs';
import path from 'path';

const dir = path.resolve('public/images/products');

const mapping = {
  'ns-special-sambar-powder': 'soans-traditional-sambar-powder',
  'ns-special-rasam-powder': 'soans-authentic-rasam-powder',
  'ns-special-puliogare-powder': 'soans-traditional-puliyogare-mix',
  'kundapura-special-chicken-sukka-masala': 'soans-mangalore-chicken-sukka-masala',
  'kundapura-butter-chicken': 'soans-royal-butter-chicken-masala',
  'kundapura-chicken-ghee-roast': 'soans-kundapura-chicken-ghee-roast-masala',
  'kundapura-special-fish-curry-masala': 'soans-coastal-fish-curry-masala',
  'ns-desi-gir-cow-cultured-ghee': 'two-brothers-a2-desi-gir-cow-cultured-ghee',
  'ns-groundnut-oil-cold-pressed-single-filitered': 'two-brothers-cold-pressed-groundnut-oil',
  'ns-black-mustard-oil-i-cold-pressed': 'two-brothers-cold-pressed-yellow-mustard-oil',
  'ns-khapli-whet-atta-emmer-wheat-flour': 'two-brothers-khapli-emmer-wheat-stoneground-atta',
  'ns-sugarcane-jaggery-crushed-granular': 'two-brothers-organic-sugarcane-jaggery-powder',
  'ns-forest-honey-multifloral': 'two-brothers-raw-wild-forest-honey',
  'low-gi-rice-kalanamak-varity-ns': 'two-brothers-indigenous-heritage-black-rice',
  'ns-khapli-mathri-sticks-ns': 'two-brothers-spiced-organic-millet-crisps'
};

for (const [newSlug, oldSlug] of Object.entries(mapping)) {
  for (const ext of ['.webp', '.jpg']) {
    const src = path.join(dir, oldSlug + ext);
    const dest = path.join(dir, newSlug + ext);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${oldSlug + ext} -> ${newSlug + ext}`);
    } else {
      console.error(`Missing source: ${src}`);
    }
  }
}
console.log('All 15 mapped files aligned to exact Excel slugs!');

