import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Eye,
  MapPin,
  ArrowRight,
  ChevronRight,
  Phone,
  Package,
  ShoppingBag
} from 'lucide-react';
import ProductViewer3D from '../three/ProductViewer3D';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Reveal, LUXURY_EASE } from '../components/LuxuryMotion';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { products } from '../data/products';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { getProductImage, PRODUCT_PLACEHOLDER_IMAGE } from '../data/productImageMap';

export default function ProductDetails() {
  const { slug } = useParams();
  const prefersReducedMotion = useReducedMotion();

  // Subscribe to priceVersion for real-time bulk price synchronization
  const priceVersion = useProductStore((state) => state.priceVersion);
  const addToCart = useCartStore((state) => state.addToCart);

  const product = products.find((p) => p.slug === slug) || products[0];

  const getInitialWeight = (prod) => {
    if (!prod.weightOptions || prod.weightOptions.length === 0) {
      return { weight: 'Standard', price: prod.price ?? null };
    }
    const firstPriced = prod.weightOptions.find(
      (opt) => opt.price !== null && opt.price !== undefined && opt.price > 0
    );
    return firstPriced || prod.weightOptions[0];
  };

  const [selectedWeight, setSelectedWeight] = useState(() => getInitialWeight(product));

  // If prices hydrate after mount, auto-select the first priced variant if current has no price
  useEffect(() => {
    const liveCurrent = product.weightOptions?.find((opt) => opt.weight === selectedWeight?.weight);
    if (!liveCurrent || liveCurrent.price === null || liveCurrent.price === undefined) {
      const nextInitial = getInitialWeight(product);
      if (nextInitial && nextInitial.weight !== selectedWeight?.weight) {
        setSelectedWeight(nextInitial);
      }
    }
  }, [priceVersion, product.id]);

  // Always read the live variant object from product.weightOptions so updated prices appear immediately
  const activeWeightObj =
    (product.weightOptions &&
      product.weightOptions.find((opt) => opt.weight === selectedWeight.weight)) ||
    getInitialWeight(product);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeViewMode, setActiveViewMode] = useState('2d'); // '2d' or '3d'
  const [activeTab, setActiveTab] = useState('description');
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  // Reset variant and view mode on slug change
  useEffect(() => {
    if (product.weightOptions && product.weightOptions.length > 0) {
      setSelectedWeight(getInitialWeight(product));
    }
    setActiveImageIndex(0);
    setActiveViewMode('2d');
    window.scrollTo(0, 0);
  }, [slug, product]);

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincodeInput || pincodeInput.trim().length < 6) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available to ${pincodeInput.trim()} in 2–4 business days.`
    });
  };

  // Related products from same subcategory or category
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.subcategorySlug === product.subcategorySlug || p.categorySlug === product.categorySlug)
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-50 py-6 sm:py-8 px-2.5 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-forest-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/shop" className="hover:text-forest-900 transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to={`/category/${product.categorySlug}`} className="hover:text-forest-900 transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-forest-950 font-bold truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Top Product Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left Column: Image Gallery or 3D Stage */}
          <Reveal className="lg:col-span-6 space-y-4">
            {/* View Mode Switcher Pills */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-white border border-stone-200 shadow-sm">
                <button
                  onClick={() => setActiveViewMode('2d')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeViewMode === '2d'
                      ? 'bg-forest-900 text-gold-300 shadow-md'
                      : 'text-stone-600 hover:text-forest-950'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Product Photos
                </button>
                <button
                  onClick={() => setActiveViewMode('3d')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    activeViewMode === '3d'
                      ? 'bg-forest-900 text-gold-300 shadow-md'
                      : 'text-stone-600 hover:text-forest-950'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  Macro Close-Up Zoom
                </button>
              </div>

              {(product.subcategory || product.badge) && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-forest-900 text-gold-300 border border-gold-500/30">
                  {product.subcategory || product.badge}
                </span>
              )}
            </div>

            {/* Visual Viewport */}
            {activeViewMode === '3d' ? (
              <ProductViewer3D product={product} height="520px" />
            ) : (
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-md group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.02 }}
                    animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.35, ease: LUXURY_EASE }}
                    src={product.images[activeImageIndex] || getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 sm:p-6 object-center group-hover:scale-105 transition-transform duration-700 ease-out select-none"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                    }}
                  />
                </AnimatePresence>

                {/* Wishlist Button Overlay */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                    isInWishlist
                      ? 'bg-spice-600 text-white scale-110'
                      : 'bg-white/80 text-earth-900 hover:bg-white hover:text-spice-600'
                  }`}
                  title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>
            )}

            {/* Thumbnail Row (For 2D mode) */}
            {activeViewMode === '2d' && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-gold-500 scale-105 shadow-md'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Origin & Traceability Tag */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                Origin: <strong className="text-forest-950 font-bold">{product.origin}</strong>
              </span>
              <span className="text-[11px] text-stone-400">
                NS SOANS INDIAN FARM
              </span>
            </div>
          </Reveal>

          {/* Right Column: Specifications, Pack Sizes & Catalogue Inquiry */}
          <Reveal className="lg:col-span-6 space-y-4 sm:space-y-5" delay={0.1}>
            {/* Brand Attribution Pill */}
            <div>
              <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-gold-700 block mb-1">
                NS SOANS INDIAN FARM &bull; {product.collectionName || (product.collection === 'masala' ? 'Masala Products' : 'Farm Products')}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-serif text-forest-950 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Category and Collection Badges */}
            <div className="flex flex-wrap items-center gap-2.5 border-b border-stone-200/80 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-forest-900 text-gold-300 border border-gold-500/30">
                {product.category}
              </span>
              <span className="text-xs text-stone-300">&bull;</span>
              <span className="text-xs font-semibold text-stone-600">
                {product.collectionName || (product.collection === 'masala' ? 'Masala Products' : 'Farm Products')}
              </span>
            </div>

            {/* Pack Size & Live Price Banner */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-gold-500/25 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-forest-900 text-gold-300 flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest-950 block">
                    Selected Pack Size: {activeWeightObj.weight}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    {activeWeightObj.price !== null && activeWeightObj.price !== undefined
                      ? 'Inclusive of all taxes • Currency: INR (₹)'
                      : 'Official NS SOANS INDIAN FARM Catalogue'}
                  </span>
                </div>
              </div>
              {activeWeightObj.price !== null && activeWeightObj.price !== undefined ? (
                <div className="text-right shrink-0">
                  <span className="text-lg sm:text-xl font-extrabold text-forest-950 block">
                    ₹{Number(activeWeightObj.price).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-700">
                    In Stock
                  </span>
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-50 text-gold-800 border border-gold-400/50 shrink-0">
                  Price Coming Soon
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Weight / Pack Options — Compact, Clean & Instant-Syncing */}
            {product.weightOptions && product.weightOptions.length > 0 && (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-forest-950 uppercase tracking-wider">
                  Available Pack Sizes / Weights:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {product.weightOptions.map((opt) => (
                    <button
                      key={opt.weight}
                      type="button"
                      onClick={() => setSelectedWeight(opt)}
                      className={`px-3 py-2 rounded-xl border text-center transition-all ${
                        activeWeightObj.weight === opt.weight
                          ? 'border-forest-900 bg-forest-900 text-gold-200 shadow-sm ring-1 ring-gold-500/40'
                          : 'border-stone-200/90 bg-white text-stone-700 hover:border-gold-400 hover:bg-cream-50/50'
                      }`}
                    >
                      <span className="block text-xs font-bold">{opt.weight}</span>
                      {opt.price !== null && opt.price !== undefined ? (
                        <span
                          className={`block text-[11px] font-semibold mt-0.5 ${
                            activeWeightObj.weight === opt.weight
                              ? 'text-white'
                              : 'text-forest-900'
                          }`}
                        >
                          ₹{Number(opt.price).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span
                          className={`block text-[10px] font-medium mt-0.5 ${
                            activeWeightObj.weight === opt.weight
                              ? 'text-gold-300/90'
                              : 'text-stone-400'
                          }`}
                        >
                          Price Coming Soon
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Actions (Add to Cart when priced + Inquiry & Wishlist) */}
            <div className="space-y-2.5 pt-1">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                {activeWeightObj.price !== null && activeWeightObj.price !== undefined ? (
                  <button
                    type="button"
                    onClick={() => addToCart(product, activeWeightObj, 1)}
                    className="flex-1 py-3 px-5 rounded-xl gold-btn font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>
                      Add to Cart ({activeWeightObj.weight}) &bull; ₹
                      {Number(activeWeightObj.price).toLocaleString('en-IN')}
                    </span>
                  </button>
                ) : (
                  <Link
                    to="/contact"
                    className="flex-1 py-3 px-5 rounded-xl gold-btn font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Inquire About This Product ({activeWeightObj.weight})</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isInWishlist
                      ? 'border-spice-600 bg-spice-50 text-spice-600'
                      : 'border-stone-200 bg-white text-forest-950 hover:border-gold-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                  <span>{isInWishlist ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  to={`/category/${product.categorySlug}`}
                  className="font-bold text-forest-800 hover:text-gold-700 inline-flex items-center gap-1"
                >
                  <span>More in {product.category}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/shop"
                  className="font-semibold text-stone-500 hover:text-forest-950"
                >
                  Back to Full Catalogue
                </Link>
              </div>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="p-4 rounded-3xl bg-white border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-forest-950">
                <Truck className="w-4 h-4 text-forest-800" />
                <span>Estimate Pan-India Delivery Timeline</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit PIN code (e.g. 576201)"
                  className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-100 hover:bg-forest-100 hover:text-forest-900 transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <p
                  className={`text-[11px] font-medium pt-1 ${
                    pincodeStatus.valid ? 'text-emerald-700' : 'text-spice-600'
                  }`}
                >
                  {pincodeStatus.message}
                </p>
              )}
            </div>

            {/* Quality Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-[10px] text-stone-500">
              <div className="p-3 rounded-2xl bg-cream-100/60 border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                <span className="font-bold text-earth-900 block">Authentic Quality</span>
                <span>NS SOANS INDIAN FARM</span>
              </div>
              <div className="p-3 rounded-2xl bg-cream-100/60 border border-stone-200">
                <RotateCcw className="w-4 h-4 text-gold-700 mx-auto mb-1" />
                <span className="font-bold text-earth-900 block">Traditional Craft</span>
                <span>Since 1920</span>
              </div>
              <div className="p-3 rounded-2xl bg-cream-100/60 border border-stone-200">
                <Truck className="w-4 h-4 text-forest-800 mx-auto mb-1" />
                <span className="font-bold text-earth-900 block">Careful Packaging</span>
                <span>Kundapura, Karnataka</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* =========================================================================
            DETAILED TABBED SPECIFICATIONS
        ========================================================================= */}
        <Reveal className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 mb-16">
          <div className="flex border-b border-stone-200 gap-6 overflow-x-auto pb-1 mb-8">
            {[
              { id: 'description', label: 'Product Overview' },
              { id: 'specifications', label: 'Category & Pack Sizes' },
              { id: 'storage', label: 'Storage & Care' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-forest-900 border-b-2 border-gold-600'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'description' && (
            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
              <h3 className="text-lg font-serif font-bold text-forest-950">
                {product.name}
              </h3>
              <p>{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200">
                  <strong className="block text-forest-950 font-bold mb-1">Brand:</strong>
                  <p>NS SOANS INDIAN FARM</p>
                </div>
                <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200">
                  <strong className="block text-forest-950 font-bold mb-1">Origin:</strong>
                  <p>{product.origin}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-forest-950 uppercase tracking-wider">
                  Catalogue Classification
                </h4>
                <div className="rounded-2xl border border-stone-200 overflow-hidden">
                  <div className="flex justify-between p-3 bg-cream-50">
                    <span className="text-stone-600">Brand</span>
                    <strong className="text-forest-950">NS SOANS INDIAN FARM</strong>
                  </div>
                  <div className="flex justify-between p-3 bg-white">
                    <span className="text-stone-600">Collection</span>
                    <strong className="text-forest-950">
                      {product.collectionName || (product.collection === 'masala' ? 'Masala Products' : 'Farm Products')}
                    </strong>
                  </div>
                  <div className="flex justify-between p-3 bg-cream-50">
                    <span className="text-stone-600">Category</span>
                    <strong className="text-forest-950">{product.category}</strong>
                  </div>
                  {product.subcategory && (
                    <div className="flex justify-between p-3 bg-white">
                      <span className="text-stone-600">Subcategory</span>
                      <strong className="text-forest-950">{product.subcategory}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-forest-950 uppercase tracking-wider mb-3">
                  Available Pack Sizes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.weightOptions?.map((opt) => (
                    <span
                      key={opt.weight}
                      className="px-3.5 py-2 rounded-xl bg-cream-50 border border-stone-200 text-xs font-bold text-forest-950"
                    >
                      {opt.weight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Storage */}
          {activeTab === 'storage' && (
            <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-stone-600">
              <h4 className="text-base font-serif font-bold text-forest-950">
                Storage &amp; Handling Instructions
              </h4>
              <p>{product.storage}</p>
              <div className="p-5 rounded-2xl bg-gold-50 border border-gold-300">
                <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block mb-1">
                  Kitchen Care Tip:
                </span>
                <p className="text-xs text-earth-800">
                  Always use a clean, dry spoon and keep the container tightly closed after every use to preserve natural aroma and freshness.
                </p>
              </div>
            </div>
          )}
        </Reveal>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-serif font-bold text-forest-950 mb-6">
              More From This Category
            </h3>
            <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 w-full">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}


