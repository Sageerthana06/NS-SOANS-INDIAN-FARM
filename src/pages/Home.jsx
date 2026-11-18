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
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import QuickViewModal from '../components/QuickViewModal';
import { Reveal, StaggerGrid, StaggerItem, LUXURY_EASE } from '../components/LuxuryMotion';
import { products } from '../data/products';
import { categories } from '../data/categories';

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

export default function Home() {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const heroVideoRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Curated 8 products for Home Page showcase
  const featuredProducts = FEATURED_PRODUCT_IDS.map((id) =>
    products.find((p) => p.id === id)
  ).filter(Boolean);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      const playPromise = video.play();
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
        {/* Full-Width Full-Screen Background Video & Poster — Bright, Vivid & Vibrant */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <motion.video
            ref={heroVideoRef}
            src="/videos/homepage-brand-video.mp4"
            poster="/images/about-spices-bg.png"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            initial={prefersReducedMotion ? false : { scale: 1.02 }}
            animate={prefersReducedMotion ? undefined : { scale: 1 }}
            transition={{ duration: 1.15, ease: LUXURY_EASE }}
            style={{ filter: 'brightness(1.15) contrast(1.05)' }}
            className="w-full h-full object-cover object-center brightness-[1.15] contrast-[1.05]"
          />
          {/* Static fallback for ultra-smooth initialization & zero white flash */}
          <img
            src="/images/about-spices-bg.png"
            alt="NS SOANS Indian Farm authentic spices"
            style={{ filter: 'brightness(1.15) contrast(1.05)' }}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none -z-10 brightness-[1.15] contrast-[1.05]"
          />
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
                className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#c29d2b] text-[#102D20] text-xs sm:text-sm font-extrabold tracking-widest uppercase shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                <span>Explore Masalas</span>
                <ArrowRight className="w-4 h-4 text-[#102D20]" />
              </Link>

              <Link
                to="/shop?collection=organic"
                className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#102D20]/90 hover:bg-[#102D20] text-white hover:text-[#FAF8F3] text-xs sm:text-sm font-extrabold tracking-widest uppercase border border-[#D4AF37]/50 hover:border-[#D4AF37] shadow-lg backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
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
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Since 1920</h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Kundapura Heritage</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">100% Pure</h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Authentic Spices</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">A2 &amp; Natural</h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Ghee, Honey &amp; Oils</p>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-black font-serif text-[#D4AF37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">124 Items</h4>
                <p className="text-[10px] sm:text-[11px] text-white/95 font-semibold drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">Verified Catalogue</p>
              </div>
            </motion.div>
          </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
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

          <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 w-full">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          <Reveal className="text-center mt-12 sm:mt-14">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-forest-900 hover:bg-forest-950 text-[#FAF8F3] hover:text-[#D4AF37] text-xs sm:text-sm font-extrabold tracking-widest uppercase border border-gold-500/40 shadow-xl hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group"
            >
              <span>VIEW ALL 124 PRODUCTS →</span>
            </Link>
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
            <div className="overflow-hidden rounded-3xl shadow-md group">
              <img
                src="/images/heritage-spices.png"
                alt="NS SOANS Heritage Spices"
                className="w-full aspect-square object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-3xl shadow-md sm:translate-y-6 group">
              <img
                src="/images/farm-natural-goodness.png"
                alt="NS SOANS Farm Natural Goodness"
                className="w-full aspect-square object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
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
