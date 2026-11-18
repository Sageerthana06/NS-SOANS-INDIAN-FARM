import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadedDir = 'C:/Users/HP/.gemini/antigravity/brain/860ec9bf-6dac-483d-a909-3d4dc4219463/.user_uploaded';
const targetDir = path.resolve('public/images/products');

// 1. Define the 12 uploaded files mapping
const uploadMap = [
  {
    src: 'media_1794907257815_e62f4eb8.jpg',
    baseName: 'ns-stony-ambemohar-rice',
    title: 'NS STONY AMBEMOHAR RICE'
  },
  {
    src: 'media_1794907257824_13c7fded.jpg',
    baseName: 'ajara-ghansal-rice-ns',
    title: 'AJARA GHANSAL RICE NS'
  },
  {
    src: 'media_1794907257822_56fa7c8b.jpg',
    baseName: 'low-gi-rice-kalanamak-varity-ns',
    title: 'LOW GI RICE | KALANAMAK VARITY NS'
  },
  {
    src: 'media_1794907257822_d3f9282a.jpg',
    baseName: 'ns-single-origin-lakadong-turmic-powder',
    title: 'NS SINGLE ORIGIN LAKADONG TURMERIC POWDER'
  },
  {
    src: 'media_1794907257830_1a946a91.jpg',
    baseName: 'ns-golden-honeymoon-milk-mix',
    title: 'NS GOLDEN HONEYMOON MILK MIX'
  },
  {
    src: 'media_1794907257837_102d998a.jpg',
    baseName: 'ns-amlaparsh-limited-edition-chyawanprash',
    title: 'NS AMLAPARSH (Limited Edition Chyawanprash)'
  },
  {
    src: 'media_1794907257846_79eba5b5.jpg',
    baseName: 'ns-chyawanprash',
    title: 'NS CHYAWANPRASH'
  },
  {
    src: 'media_1794907257847_0b520e15.jpg',
    baseName: 'ns-haldi-ground-turmic',
    title: 'NS HALDI (Ground Turmeric)'
  },
  {
    src: 'media_1794907257848_577c47f0.jpg',
    baseName: 'ns-moringa-powder',
    title: 'NS MORINGA POWDER'
  },
  {
    src: 'media_1794907257850_d3b6256e.jpg',
    baseName: 'ns-loversmoto-ketchup',
    title: 'NS LOVERSMOTO KETCHUP'
  },
  {
    src: 'media_1794907257852_7d94dc3b.jpg',
    baseName: 'ns-indarayani-rice',
    title: 'NS INDARAYANI INDRAYANI RICE'
  },
  {
    src: 'media_1794907257853_39e782b6.jpg',
    baseName: 'ns-breakfast-and-snacks',
    title: 'BREAKFAST & SNACKS'
  }
];

async function deploy() {
  console.log('--- DEPLOYING NEW PACKAGING IMAGES ---');

  for (const item of uploadMap) {
    const srcPath = path.join(uploadedDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.error(`Source not found: ${srcPath}`);
      continue;
    }

    const dstJpg = path.join(targetDir, `${item.baseName}.jpg`);
    const dstWebp = path.join(targetDir, `${item.baseName}.webp`);
    const dstPng = path.join(targetDir, `${item.baseName}.png`);

    // Copy to .jpg
    fs.copyFileSync(srcPath, dstJpg);
    console.log(`Copied: ${item.src} -> ${item.baseName}.jpg (${fs.statSync(dstJpg).size} bytes)`);

    // Convert to optimized .webp
    await sharp(srcPath)
      .webp({ quality: 90 })
      .toFile(dstWebp);
    console.log(`Generated: ${item.baseName}.webp (${fs.statSync(dstWebp).size} bytes)`);

    // Also write .png for ketchup
    if (item.baseName === 'ns-loversmoto-ketchup') {
      await sharp(srcPath)
        .png({ compressionLevel: 8 })
        .toFile(dstPng);
      console.log(`Generated: ${item.baseName}.png (${fs.statSync(dstPng).size} bytes)`);
    }
  }

  // Generate ns-bajra.webp from ns-bajra.jpg
  const bajraJpg = path.join(targetDir, 'ns-bajra.jpg');
  const bajraWebp = path.join(targetDir, 'ns-bajra.webp');
  if (fs.existsSync(bajraJpg) && !fs.existsSync(bajraWebp)) {
    await sharp(bajraJpg).webp({ quality: 90 }).toFile(bajraWebp);
    console.log(`Generated missing ns-bajra.webp from ns-bajra.jpg`);
  }

  // Create clean luxury SVG placeholder
  const svgPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF7F2" />
      <stop offset="100%" stop-color="#F3ECE1" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D4AF37" />
      <stop offset="50%" stop-color="#F3E5AB" />
      <stop offset="100%" stop-color="#B88629" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="url(#bgGrad)" />

  <!-- Outer Elegant Border -->
  <rect x="24" y="24" width="752" height="752" rx="32" fill="none" stroke="#D4AF37" stroke-width="2" stroke-opacity="0.35" />
  <rect x="36" y="36" width="728" height="728" rx="24" fill="none" stroke="#102D20" stroke-width="1" stroke-opacity="0.15" />

  <!-- Corner Flourishes -->
  <circle cx="48" cy="48" r="4" fill="#D4AF37" opacity="0.6" />
  <circle cx="752" cy="48" r="4" fill="#D4AF37" opacity="0.6" />
  <circle cx="48" cy="752" r="4" fill="#D4AF37" opacity="0.6" />
  <circle cx="752" cy="752" r="4" fill="#D4AF37" opacity="0.6" />

  <!-- Central Crest Container -->
  <g transform="translate(400, 320)">
    <!-- Soft glow ring -->
    <circle cx="0" cy="0" r="140" fill="#102D20" fill-opacity="0.04" />
    <circle cx="0" cy="0" r="115" fill="#FFFFFF" stroke="#D4AF37" stroke-width="2.5" />

    <!-- Leaf & Grain Emblem -->
    <path d="M 0 -70 C 40 -40 50 10 0 50 C -50 10 -40 -40 0 -70 Z" fill="#102D20" opacity="0.9" />
    <path d="M 0 -60 C 25 -30 30 10 0 40 C -30 10 -25 -30 0 -60 Z" fill="url(#goldGrad)" opacity="0.85" />
    <line x1="0" y1="-55" x2="0" y2="45" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />

    <!-- Packaging Silhouette -->
    <rect x="-35" y="-10" width="70" height="90" rx="8" fill="#102D20" />
    <path d="M -30 -10 L -20 -25 L 20 -25 L 30 -10 Z" fill="#D4AF37" />
    <circle cx="0" cy="35" r="14" fill="#D4AF37" />
    <circle cx="0" cy="35" r="8" fill="#102D20" />
  </g>

  <!-- Typography -->
  <text x="400" y="520" text-anchor="middle" font-family="serif" font-size="28" font-weight="bold" fill="#102D20" letter-spacing="3">
    NS SOANS INDIAN FARM
  </text>
  <text x="400" y="555" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#B88629" letter-spacing="4">
    PREMIUM NATURAL FOODS
  </text>

  <rect x="330" y="575" width="140" height="2" fill="url(#goldGrad)" rx="1" />

  <text x="400" y="620" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="600" fill="#2B1E16" opacity="0.85">
    Official Packaging Photo
  </text>
  <text x="400" y="648" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="500" fill="#8C7E72">
    Coming Soon
  </text>
</svg>`;

  const placeholderPath = path.join(targetDir, 'placeholder-product.svg');
  fs.writeFileSync(placeholderPath, svgPlaceholder, 'utf8');
  console.log(`Created luxury placeholder SVG: ${placeholderPath}`);

  // Convert to PNG placeholder
  const placeholderPngPath = path.join(targetDir, 'placeholder-product.png');
  await sharp(Buffer.from(svgPlaceholder)).png().toFile(placeholderPngPath);
  console.log(`Created luxury placeholder PNG: ${placeholderPngPath}`);

  console.log('--- DEPLOYMENT COMPLETE ---');
}

deploy();
