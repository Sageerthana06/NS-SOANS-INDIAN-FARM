import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Leaf,
  Flame,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  MessageCircle,
  ShieldCheck,
  Award,
  HeartHandshake,
  PackageCheck,
  Star,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import CategoryCard from '../components/CategoryCard';
import QuickViewModal from '../components/QuickViewModal';
import { Reveal, StaggerGrid, StaggerItem, AnimatedCounter, LUXURY_EASE } from '../components/LuxuryMotion';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { reviews } from '../data/reviews';
import { getProductImage, PRODUCT_PLACEHOLDER_IMAGE } from '../data/productImageMap';

// Curated 8 Featured Products: Balanced 4 Masala + 4 Farm Products
const FEATURED_PRODUCT_IDS = [
  // 4 Authentic Masala Products
  'masala-1-lover-s-tea',
  'masala-12-ns-special-garam-masala',
  'masala-29-kundapura-chicken-ghee-roast',
  'masala-21-ns-special-sambar-powder',
  // 4 Pure Farm Harvest Products
  'farm-2-ns-a2-desi-cow-ghee-bilona-method',
  'farm-12-ns-sunflower-oil-i-cold-pressed',
  'farm-41-ns-single-origin-lakadong-turmic-powder',
  'farm-45-ns-stony-ambemohar-rice'
];

// Curated 12 Signature Products for the Interactive Auto-Moving Carousel (6 Masala + 6 Farm)
const CAROUSEL_PRODUCT_IDS = [
  'masala-1-lover-s-tea',
  'farm-2-ns-a2-desi-cow-ghee-bilona-method',
  'masala-4-ns-special-black-salt',
  'farm-30-ns-forest-honey-multifloral',
  'masala-5-ns-special-kabooli-chhole-masala',
  'farm-15-virgin-coconut-oil',
  'masala-44-kundapura-chicken-angara',
  'farm-43-low-gi-rice-kalanamak-varity-ns',
  'masala-53-kundapura-biryani-kit',
  'farm-57-ns-creamy-peanut-butter',
  'masala-61-ginger-garlic-paste',
  'farm-63-ns-pink-salt-himalaya'
];

// 3 Hero Spotlight Products (Real Catalogue Items)
const HERO_SPOTLIGHT_IDS = [
  'masala-1-lover-s-tea',
  'farm-2-ns-a2-desi-cow-ghee-bilona-method',
  'masala-53-kundapura-biryani-kit'
];

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const heroVideoRef = useRef(null);
  const brandVideoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Curated 8 products for Home Page showcase
  const featuredProducts = FEATURED_PRODUCT_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter(Boolean);

  // Curated 12 products for the interactive auto-moving carousel
  const carouselProducts = CAROUSEL_PRODUCT_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter(Boolean);

  // 3 Hero spotlight products
  const heroSpotlightProducts = HERO_SPOTLIGHT_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter(Boolean);

  // Real catalogue counts for animated counters
  const totalCatalogueCount = products.length;
  const masalaCatalogueCount = products.filter((p) => p.collection === 'masala').length;
  const farmCatalogueCount = products.filter((p) => p.collection === 'organic').length;

  useEffect(() => {
    const heroVid = heroVideoRef.current;
    if (heroVid) {
      heroVid.defaultMuted = true;
      heroVid.muted = true;
      const playPromise = heroVid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser blocks autoplay
        });
      }
    }

    const brandVid = brandVideoRef.current;
    if (brandVid) {
      brandVid.defaultMuted = true;
      brandVid.muted = true;
      const playPromise = brandVid.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser blocks autoplay
        });
      }
    }

    // Dynamic header height measurement to ensure 100% full-screen coverage below navigation
    const updateHeaderHeight = () => {
      const headerEl = document.querySelector('header');
      const announcementEl = document.querySelector('.bg-forest-950.text-gold-200');
      let totalHeaderHeight = 100;
      if (headerEl) {
        totalHeaderHeight = headerEl.offsetHeight;
        if (announcementEl) {
          totalHeaderHeight += announcementEl.offsetHeight;
        }
      }
      document.documentElement.style.setProperty('--header-height', `${totalHeaderHeight}px`);
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 overflow-hidden">
      {/* =========================================================================
          1. PREMIUM HERO SECTION — FULL-SCREEN BELOW NAVIGATION HEADER
      ========================================================================= */}
      <section
        style={{ minHeight: 'calc(100vh - var(--header-height, 100px))' }}
        className="hero-fullscreen relative w-full flex items-center py-10 sm:py-14 md:py-16 px-4 sm:px-6 lg:px-8 bg-forest-950/20 overflow-hidden"
      >
        {/* Full-Width Full-Screen Background Video & Poster — Bright, Vivid & Vibrant with Subtle Cinematic Zoom */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <div className={`w-full h-full ${prefersReducedMotion ? '' : 'hero-cinematic-zoom'}`}>
            {/* Static fallback behind the video for smooth initialization */}
            <img
              src="/images/about-spices-bg.webp"
              alt="NS SOANS Indian Farm authentic spices"
              style={{ filter: 'brightness(1.15) contrast(1.05)' }}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 brightness-[1.15] contrast-[1.05]"
            />
            <motion.video
              ref={heroVideoRef}
              src="/videos/homepage-brand-video.mp4"
              poster="/images/about-spices-bg.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onLoadedMetadata={(e) => {
                e.currentTarget.defaultMuted = true;
                e.currentTarget.muted = true;
                e.currentTarget.play().catch(() => {});
              }}
              onCanPlay={(e) => {
                e.currentTarget.defaultMuted = true;
                e.currentTarget.muted = true;
                e.currentTarget.play().catch(() => {});
              }}
              initial={prefersReducedMotion ? false : { scale: 1.03, opacity: 0.85 }}
              animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: LUXURY_EASE }}
              style={{ filter: 'brightness(1.15) contrast(1.05)' }}
              className="relative z-[1] w-full h-full object-cover object-center brightness-[1.15] contrast-[1.05]"
            >
              <source src="/videos/homepage-brand-video.mp4" type="video/mp4" />
            </motion.video>
          </div>
        </div>

        {/* Subtle 10–15% Ambient & Directional Gradient Overlay for Optimal Text Readability & Natural Video Colors */}
        <div
          className="absolute inset-0 bg-black/10 z-[1] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-forest-950/30 via-forest-950/15 to-transparent z-[1] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle Floating Decorative Accents */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden="true">
            <motion.div
              animate={{ y: [-8, 8, -8], opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:block absolute top-16 right-16 w-28 h-28 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/5 backdrop-blur-[1px]"
            />
            <motion.div
              animate={{ y: [6, -10, 6], opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="hidden lg:block absolute bottom-20 right-32 w-16 h-16 rounded-full border border-[#D4AF37]/25 bg-forest-900/20"
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="max-w-2xl space-y-5 sm:space-y-6 text-center lg:text-left">
            {/* Company Name Badge */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: LUXURY_EASE }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 sm:py-2 rounded-full bg-[#102D20]/90 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>NS SOANS INDIAN FARM</span>
            </motion.div>

            {/* Main Headline & Second Headline — Clean, No Box */}
            <motion.h1
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.18, ease: LUXURY_EASE }}
              className="text-[34px] sm:text-[48px] lg:text-[64px] leading-[1.08] tracking-tight"
            >
              <span className="font-sans font-black uppercase tracking-tight hero-text-pure-spices">
                PURE SPICES.
              </span>
              <span className="font-serif italic font-medium hero-text-natural-goodness mt-1 sm:mt-1.5">
                Natural Goodness.
                {/* Gold decorative underline */}
                <span
                  className="absolute left-0 -bottom-1 w-full h-[2px] rounded-full hero-gold-underline"
                  aria-hidden="true"
                />
              </span>
            </motion.h1>

            {/* Shortened Supporting Description */}
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: LUXURY_EASE }}
              className="text-[13.5px] sm:text-[15px] lg:text-[17px] text-[#FAF8F3] max-w-[520px] mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]"
            >
              Experience authentic Indian spices and natural farm goodness, rooted in Kundapura's heritage.
            </motion.p>

            {/* Primary Call-to-Actions */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: LUXURY_EASE }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-1"
            >
              <Link
                to="/shop?collection=masala"
                className="cta-sheen-btn inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#c29d2b] text-[#102D20] text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                <span>Explore Masalas</span>
                <ArrowRight className="w-4 h-4 text-[#102D20] transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>

              <Link
                to="/shop?collection=organic"
                className="cta-sheen-btn inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#102D20]/90 hover:bg-[#102D20] text-white hover:text-[#FAF8F3] text-xs sm:text-sm font-extrabold tracking-widest uppercase border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-lg backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                <span>Shop Organic Foods</span>
                <Leaf className="w-4 h-4 text-[#D4AF37]" />
              </Link>
            </motion.div>

            {/* Authentic Heritage Highlights */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: LUXURY_EASE }}
              className="pt-4 sm:pt-5 border-t border-[#D4AF37]/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center lg:text-left"
            >
              <div>
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Since <AnimatedCounter target={1920} duration={1.4} />
                </h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Kundapura Heritage</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  <AnimatedCounter target={100} suffix="%" duration={1.4} /> Pure
                </h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Authentic Spices</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">A2 &amp; Natural</h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Ghee, Honey &amp; Oils</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  <AnimatedCounter target={totalCatalogueCount} duration={1.4} /> Items
                </h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Verified Catalogue</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Interactive Floating Signature Product Showcase Cards */}
          {heroSpotlightProducts.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, x: 24 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
              transition={{ duration: 0.85, delay: 0.35, ease: LUXURY_EASE }}
              className="hidden xl:flex flex-col gap-3.5 absolute right-0 top-1/2 -translate-y-1/2 w-[310px]"
            >
              {heroSpotlightProducts.map((sp, idx) => (
                <Link
                  key={sp.id}
                  to={`/product/${sp.slug}`}
                  className={`group flex items-center gap-3.5 p-3 rounded-2xl bg-[#102D20]/85 hover:bg-[#102D20]/95 border border-[#D4AF37]/40 hover:border-[#D4AF37] backdrop-blur-md shadow-2xl transition-all duration-300 hover:-translate-x-1.5 ${
                    idx % 2 === 0 ? 'animate-float-slow' : 'animate-float-slow-delayed'
                  }`}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/95 p-1 shrink-0 overflow-hidden border border-[#D4AF37]/30">
                    <img
                      src={getProductImage(sp)}
                      alt={sp.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#D4AF37] block truncate">
                      {sp.category}
                    </span>
                    <h4 className="text-xs font-extrabold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                      {sp.name}
                    </h4>
                    <span className="text-[11px] font-bold text-[#FAF8F3]/90">
                      {sp.price !== null && sp.price !== undefined
                        ? `From ₹${Number(sp.price).toLocaleString('en-IN')}`
                        : 'Explore Pack'}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* =========================================================================
          2. PRODUCT CATEGORIES (BASED STRICTLY ON EXCEL — 12 CATEGORIES)
      ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <span className="text-xs font-bold text-gold-700 uppercase tracking-widest block mb-2">
            Authentic Inventory
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-forest-950 mb-2 sm:mb-3">
            Product Categories
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-stone-600">
            Explore our 12 genuine categories defined directly in our inventory, featuring traditional Kundapura masalas and pure natural farm harvests.
          </p>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" stagger={0.05}>
          {categories.map((cat) => (
            <StaggerItem key={cat.id} className="h-full">
              <CategoryCard category={cat} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* =========================================================================
          3. FEATURED PRODUCTS (EXACTLY 8 SAMPLE SELECTION)
      ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-cream-100/70 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-gold-700 uppercase tracking-widest block mb-1 sm:mb-2">
              Curated Harvest & Spice Collection
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-forest-950 mb-3">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-stone-600 font-medium">
              Discover our carefully selected traditional flavours and natural farm goodness.
            </p>
          </Reveal>

          <StaggerGrid className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 w-full" stagger={0.06}>
            {featuredProducts.map((product) => (
              <StaggerItem key={product.id} className="h-full">
                <ProductCard
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Smooth Auto-Moving Interactive Product Carousel with Manual Controls */}
          <Reveal className="mt-12 sm:mt-16 pt-10 border-t border-stone-200/80">
            <ProductCarousel
              products={carouselProducts}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          </Reveal>

          <Reveal className="text-center mt-10 sm:mt-12">
            <Link
              to="/shop"
              className="cta-sheen-btn inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-forest-900 hover:bg-forest-950 text-[#FAF8F3] hover:text-[#D4AF37] text-xs sm:text-sm font-extrabold tracking-widest uppercase border border-gold-500/40 shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
            >
              <span>VIEW ALL {totalCatalogueCount} PRODUCTS →</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          3B. HOMEPAGE BRAND VIDEO SHOWCASE SECTION
      ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-forest-950 text-white relative overflow-hidden border-b border-gold-500/20">
        <div className="max-w-5xl mx-auto relative z-10">
          <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-2">
              Tradition in Motion &bull; Since 1920
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-white mb-2.5">
              NS SOANS INDIAN FARM
            </h2>
            <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed">
              Experience authentic Kundapura spices and pure farm harvests crafted with natural goodness.
            </p>
          </Reveal>

          <Reveal className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-2xl bg-forest-900">
            <video
              ref={brandVideoRef}
              src="/videos/homepage-brand-video.mp4"
              poster="/images/about-spices-bg.webp"
              autoPlay
              muted
              loop
              playsInline
              controls
              preload="auto"
              onLoadedMetadata={(e) => {
                e.currentTarget.defaultMuted = true;
                e.currentTarget.muted = true;
                e.currentTarget.play().catch(() => {});
              }}
              onCanPlay={(e) => {
                e.currentTarget.defaultMuted = true;
                e.currentTarget.muted = true;
                e.currentTarget.play().catch(() => {});
              }}
              className="relative z-10 w-full h-full object-cover"
            >
              <source src="/videos/homepage-brand-video.mp4" type="video/mp4" />
            </video>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          4. SHORT COMPANY INTRODUCTION
      ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <Reveal className="lg:col-span-6 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="NS SOANS INDIAN FARM Logo"
                className="h-10 sm:h-14 w-auto object-contain"
              />
              <span className="text-[11px] sm:text-xs font-bold text-gold-700 uppercase tracking-widest block">
                Since 1920 • Kundapura, Karnataka
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-forest-950 leading-tight">
              A Legacy of Tradition, Flavour &amp; Natural Goodness
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Welcome to <strong className="text-forest-950">NS SOANS INDIAN FARM</strong>, a brand by Soans Home Industries, rooted in the rich culinary heritage of Kundapura, Karnataka, India. For generations, we have valued traditional flavours, quality ingredients and the timeless connection between food, culture and nature.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              With a heritage dating back to 1920, we bring together two distinct collections under one unified catalogue: our authentic <strong className="text-forest-950">Traditional Masala Collection</strong> and our wholesome <strong className="text-forest-950">Natural Farm Products Collection</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5 text-forest-900 font-bold text-sm">
                  <Flame className="w-4 h-4 text-spice-600" />
                  <span>Masala Collection</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Authentic spice blends, vegetarian curries, coastal non-veg preparations, and aromatic kashayas.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5 text-forest-900 font-bold text-sm">
                  <Leaf className="w-4 h-4 text-gold-600" />
                  <span>Farm Products</span>
                </div>
                <p className="text-xs text-stone-500 leading-relaxed">
                  A2 Desi cow ghee, cold-pressed oils, stone-ground flours, raw honey, and traditional grains.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-forest-900 hover:text-gold-700 uppercase tracking-wider group"
              >
                <span>Read Full Origin Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6 grid grid-cols-2 gap-4" delay={0.12}>
            <div className="overflow-hidden rounded-3xl shadow-md group animate-float-slow">
              <img
                src="/images/heritage-spices.webp"
                alt="NS SOANS Heritage Spices"
                className="w-full aspect-square object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-3xl shadow-md sm:translate-y-6 group animate-float-slow-delayed">
              <img
                src="/images/farm-natural-goodness.webp"
                alt="NS SOANS Farm Natural Goodness"
                className="w-full aspect-square object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="luxury-divider max-w-5xl mx-auto" aria-hidden="true" />

      {/* =========================================================================
          4B. WHY CHOOSE NS SOANS & AUTHENTIC QUALITY HIGHLIGHTS
      ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-cream-100/60 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-gold-700 uppercase tracking-widest block mb-2">
              Why Choose NS SOANS INDIAN FARM
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-forest-950 mb-3">
              Authentic Ingredients &amp; Traditional Preparation
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-stone-600">
              Every jar, bottle, and spice pouch carries the trust of Soans Home Industries — crafted with pure whole spices and natural farm harvests.
            </p>
          </Reveal>

          {/* Animated Brand Statistics Counter Bar (Driven by Real Catalogue Data) */}
          <Reveal className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10 sm:mb-12">
            {[
              { value: 1920, suffix: '', label: 'Established Heritage', sub: 'Kundapura, Karnataka' },
              { value: totalCatalogueCount, suffix: '', label: 'Catalogue Products', sub: 'Complete Authentic Range' },
              { value: masalaCatalogueCount, suffix: '', label: 'Traditional Masalas', sub: 'Veg, Non-Veg & Beverages' },
              { value: farmCatalogueCount, suffix: '', label: 'Natural Farm Products', sub: 'Ghee, Oils, Atta & Grains' }
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-gold-500/25 shadow-sm text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-forest-950 mb-1">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1.5} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-gold-700">{stat.label}</div>
                <div className="text-[11px] text-stone-500 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </Reveal>

          {/* 4 Quality Pillar Cards */}
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10" stagger={0.07}>
            <StaggerItem className="h-full">
              <div className="h-full p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 card-hover-3d flex flex-col">
                <div className="w-11 h-11 rounded-2xl bg-forest-900 text-gold-300 flex items-center justify-center mb-4 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-serif text-forest-950 mb-2">
                  Kundapura Heritage Since 1920
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                  Time-tested family recipes from Soans Home Industries in Kundapura, upholding coastal Karnataka’s authentic culinary traditions for over a century.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="h-full">
              <div className="h-full p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 card-hover-3d flex flex-col">
                <div className="w-11 h-11 rounded-2xl bg-forest-900 text-gold-300 flex items-center justify-center mb-4 shadow-sm">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-serif text-forest-950 mb-2">
                  Authentic Roasted Masalas (61 Varieties)
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                  Crafted from carefully cleaned and roasted whole spices, Byadgi chillies, and traditional aromatic blends with natural aroma and colour.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="h-full">
              <div className="h-full p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 card-hover-3d flex flex-col">
                <div className="w-11 h-11 rounded-2xl bg-forest-900 text-gold-300 flex items-center justify-center mb-4 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-serif text-forest-950 mb-2">
                  Pure Natural Farm Goodness (63 Varieties)
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                  Bilona-cultured A2 Desi Cow Ghee, cold-pressed oils, stone-ground Khapli wheat atta, raw honey, Lakadong turmeric, and heritage rice varieties.
                </p>
              </div>
            </StaggerItem>

            <StaggerItem className="h-full">
              <div className="h-full p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 card-hover-3d flex flex-col">
                <div className="w-11 h-11 rounded-2xl bg-forest-900 text-gold-300 flex items-center justify-center mb-4 shadow-sm">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold font-serif text-forest-950 mb-2">
                  Fresh Aroma-Locked Packs
                </h3>
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                  Hygienically packed in convenient household and trade weights including 150g, 250g, 500g, 1Kg, 2Kg, 5Kg, and 10Kg packs.
                </p>
              </div>
            </StaggerItem>
          </StaggerGrid>

          {/* Dual Collection Call-to-Action */}
          <Reveal className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <Link
              to="/shop?collection=masala"
              className="gold-btn inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-extrabold tracking-widest uppercase"
            >
              <span>Shop Masala Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop?collection=organic"
              className="forest-btn inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-extrabold tracking-widest uppercase"
            >
              <span>Shop Farm Products</span>
              <Leaf className="w-4 h-4 text-gold-400" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          4C. CUSTOMER TESTIMONIALS (GENUINE VERIFIED REVIEWS)
      ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 uppercase tracking-widest mb-2">
            <HeartHandshake className="w-4 h-4 text-gold-600" />
            <span>Customer Trust</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-forest-950 mb-2.5">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-stone-600">
            Verified reviews from families and practitioners enjoying NS SOANS traditional masalas and farm harvests.
          </p>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" stagger={0.07}>
          {reviews.map((rev) => (
            <StaggerItem key={rev.id} className="h-full">
              <div className="h-full p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 card-hover-3d flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-0.5 text-gold-500" aria-label={`${rev.rating} out of 5 stars`}>
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-forest-50 text-forest-800 border border-forest-200 text-[10px] font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="inline-block text-[10.5px] font-bold text-gold-700 bg-gold-50 border border-gold-200/70 px-2.5 py-0.5 rounded-lg">
                      {rev.product}
                    </span>
                  </div>

                  <div className="relative mb-4">
                    <Quote className="w-5 h-5 text-gold-300/70 mb-1" aria-hidden="true" />
                    <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-forest-950">{rev.name}</h4>
                    <p className="text-[11px] text-stone-500">{rev.location}</p>
                  </div>
                  <span className="text-[10.5px] text-stone-400 font-medium">{rev.date}</span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* =========================================================================
          5. CONTACT INFORMATION SECTION
      ========================================================================= */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 lg:px-8 bg-forest-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest block mb-2">
              Customer Support &amp; Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-white mb-2 sm:mb-3">
              Contact NS SOANS INDIAN FARM
            </h2>
            <p className="text-xs sm:text-sm text-cream-200">
              Reach out directly to our Kundapura desk for orders, trade supply, or product inquiries.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Address */}
            <Reveal className="p-6 rounded-3xl bg-forest-900/80 border border-gold-500/20 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gold-300">Registered Office</h4>
              <p className="text-xs text-cream-200/90 leading-relaxed">
                'Ashwin', Opp. Parijatha Hotel, Main Road, Kundapura, Udupi District, Karnataka, India – 576201.
              </p>
            </Reveal>

            {/* Direct WhatsApp / Phone */}
            <Reveal className="p-6 rounded-3xl bg-forest-900/80 border border-gold-500/20 text-center space-y-3" delay={0.08}>
              <div className="w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gold-300">Phone &amp; WhatsApp</h4>
              <p className="text-xs text-cream-200/90">
                Direct Desk: <a href="tel:+916361578948" className="text-white font-bold hover:underline">+91 63615 78948</a>
              </p>
              <a
                href="https://wa.me/916361578948?text=Hello%20NS%20SOANS%20INDIAN%20FARM%20Team%2C%20I%20would%20like%20to%20make%20an%20inquiry."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </Reveal>

            {/* Email */}
            <Reveal className="p-6 rounded-3xl bg-forest-900/80 border border-gold-500/20 text-center space-y-3" delay={0.16}>
              <div className="w-12 h-12 rounded-2xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mx-auto text-gold-400">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-gold-300">Official Email</h4>
              <p className="text-xs text-cream-200/90 break-all">
                <a
                  href="mailto:nssoansindianfarm.masala@gmail.com"
                  className="text-white hover:text-gold-300 transition-colors"
                >
                  nssoansindianfarm.masala@gmail.com
                </a>
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-semibold"
              >
                <span>Send Direct Message &rarr;</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
