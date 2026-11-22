import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { getProductImage, PRODUCT_PLACEHOLDER_IMAGE } from '../data/productImageMap';
import { LUXURY_EASE } from './LuxuryMotion';

export default function ProductCard({ product, onQuickView }) {
  // Subscribe to priceVersion so bulk price imports re-render cards immediately
  const priceVersion = useProductStore((state) => state.priceVersion);

  const getInitialWeight = () => {
    if (!product.weightOptions || product.weightOptions.length === 0) {
      return { weight: 'Standard', price: product.price ?? null };
    }
    const firstPriced = product.weightOptions.find(
      (opt) => opt.price !== null && opt.price !== undefined && opt.price > 0
    );
    return firstPriced || product.weightOptions[0];
  };

  const [selectedWeight, setSelectedWeight] = useState(getInitialWeight);
  const [justAdded, setJustAdded] = useState(false);

  // If prices hydrate asynchronously or update via HMR, auto-select the first priced variant
  // when the currently selected variant has no price.
  useEffect(() => {
    const liveCurrent = product.weightOptions?.find((opt) => opt.weight === selectedWeight?.weight);
    if (!liveCurrent || liveCurrent.price === null || liveCurrent.price === undefined) {
      const nextInitial = getInitialWeight();
      if (nextInitial && nextInitial.weight !== selectedWeight?.weight) {
        setSelectedWeight(nextInitial);
      }
    }
  }, [priceVersion, product.id]);

  // Resolve active weight option from live product.weightOptions to reflect latest imported price
  const activeWeightObj =
    (product.weightOptions &&
      product.weightOptions.find((opt) => opt.weight === selectedWeight.weight)) ||
    getInitialWeight();

  const addToCart = useCartStore((state) => state.addToCart);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, activeWeightObj, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 950);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: LUXURY_EASE }}
      className="product-card group relative flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 md:p-4 border border-stone-200/80 shadow-xs hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 card-hover-3d min-w-0 w-full h-full"
    >
      {/* Top Media & Badges */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50 border border-stone-100/80 mb-2 sm:mb-2.5">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-500 ease-out select-none"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
              }}
            />
          </Link>

          {/* Floating Top Badges (Subcategory / Collection Badge) */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none max-w-[65%] sm:max-w-none">
            {(product.subcategory || product.badge) && (
              <span className="px-2 py-0.5 rounded-full text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase bg-forest-900/90 text-gold-300 backdrop-blur-md shadow-xs border border-gold-500/30 truncate">
                {product.subcategory || product.badge}
              </span>
            )}
          </div>

          {/* Wishlist Button (Top Right) */}
          <motion.button
            whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
            animate={
              isInWishlist && !prefersReducedMotion
                ? { scale: [1, 1.28, 0.94, 1] }
                : { scale: 1 }
            }
            transition={{ duration: 0.35, ease: LUXURY_EASE }}
            onClick={handleWishlistClick}
            className={`absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-colors duration-200 shadow-md ${
              isInWishlist
                ? 'bg-spice-600 text-white'
                : 'bg-white/85 text-earth-800 hover:bg-white hover:text-spice-600'
            }`}
            title={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
            aria-label={isInWishlist ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${isInWishlist ? 'fill-current scale-110' : ''}`} />
          </motion.button>

          {/* Quick View Button (Reveals on Desktop Hover) */}
          {onQuickView && (
            <button
              onClick={handleQuickViewClick}
              className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-950/85 hover:bg-forest-950 text-gold-200 border border-gold-500/30 backdrop-blur-md text-[11px] font-semibold shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            >
              <Eye className="w-3.5 h-3.5 text-gold-400" />
              Quick View
            </button>
          )}
        </div>

        {/* Brand & Category */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] mb-1 gap-1">
          <span className="font-bold tracking-wider uppercase text-gold-700 truncate">
            NS SOANS
          </span>
          <span className="text-stone-400 truncate text-right font-medium">
            {product.category}
          </span>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.slug}`} className="block mb-1.5 group-hover:text-forest-700 transition-colors">
          <h3 className="text-xs sm:text-[13px] font-bold text-forest-950 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.25rem]">
            {product.name}
          </h3>
        </Link>

        {/* Weight / Size Selector Pills — Compact, Elegant & Responsive */}
        {product.weightOptions && product.weightOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-2.5">
            {product.weightOptions.map((opt) => (
              <button
                key={opt.weight}
                type="button"
                onClick={() => setSelectedWeight(opt)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-medium border transition-all duration-150 ${
                  activeWeightObj.weight === opt.weight
                    ? 'border-forest-800 bg-forest-800 text-gold-200 shadow-xs'
                    : 'border-stone-200/90 bg-cream-50/70 text-stone-700 hover:border-gold-400 hover:bg-cream-100/60'
                }`}
              >
                {opt.weight}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Pack Info, Price & View Details CTA */}
      <div className="pt-2 sm:pt-2.5 border-t border-stone-100/90 mt-auto flex flex-col gap-2">
        {/* Selected Weight & Price Row (Full Width - Zero Truncation) */}
        <div className="flex items-baseline justify-between gap-1.5">
          <div className="min-w-0 flex items-center gap-1">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-stone-400 whitespace-nowrap">
              Pack &bull;
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-forest-900 truncate">
              {activeWeightObj.weight}
            </span>
          </div>

          <div className="text-right shrink-0">
            {activeWeightObj?.price !== null && activeWeightObj?.price !== undefined ? (
              <motion.span
                key={activeWeightObj.weight}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: LUXURY_EASE }}
                className="inline-block text-xs sm:text-[13px] font-black text-forest-950 whitespace-nowrap"
              >
                ₹{Number(activeWeightObj.price).toLocaleString('en-IN')}
              </motion.span>
            ) : (
              <span className="text-[10px] sm:text-[11px] font-bold text-gold-700 whitespace-nowrap">
                Price Coming Soon
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-1.5 w-full">
          {activeWeightObj?.price !== null && activeWeightObj?.price !== undefined && (
            <motion.button
              type="button"
              whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
              whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
              onClick={handleAddToCartClick}
              title={`Add ${product.name} (${activeWeightObj.weight}) to Cart`}
              aria-label={`Add ${product.name} (${activeWeightObj.weight}) to Cart`}
              className={`p-1.5 sm:p-2 rounded-xl border transition-all duration-250 shrink-0 min-h-[32px] sm:min-h-[34px] flex items-center justify-center px-2.5 ${
                justAdded
                  ? 'bg-emerald-700 text-gold-200 border-gold-400 shadow-md'
                  : 'bg-forest-900 hover:bg-forest-950 text-gold-300 border-gold-500/30'
              }`}
            >
              {justAdded ? (
                <Check className="w-3.5 h-3.5 text-gold-300" />
              ) : (
                <ShoppingBag className="w-3.5 h-3.5" />
              )}
            </motion.button>
          )}
          <Link
            to={`/product/${product.slug}`}
            className="gold-btn flex-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl font-bold text-[10.5px] sm:text-[11px] tracking-wide inline-flex items-center justify-center gap-1 shrink-0 transition-all duration-300 min-h-[32px] sm:min-h-[34px]"
          >
            <span>View Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}


