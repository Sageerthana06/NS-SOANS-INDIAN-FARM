import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, Eye, Sparkles, ArrowRight, Package, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductViewer3D from '../three/ProductViewer3D';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';
import { getProductImage, PRODUCT_PLACEHOLDER_IMAGE } from '../data/productImageMap';
import { LUXURY_EASE } from './LuxuryMotion';

export default function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  useProductStore((state) => state.priceVersion);
  const addToCart = useCartStore((state) => state.addToCart);

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

  const activeWeightObj =
    (product.weightOptions &&
      product.weightOptions.find((opt) => opt.weight === selectedWeight.weight)) ||
    getInitialWeight();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [view3D, setView3D] = useState(false);

  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 bg-forest-950/75 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-2.5 sm:p-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.38, ease: LUXURY_EASE }}
          className="relative bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full text-left overflow-hidden shadow-2xl border border-gold-500/30 my-4 sm:my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-forest-950 shadow-md backdrop-blur-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Gallery or 3D Stage */}
            <div className="p-4 sm:p-6 bg-cream-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
              <div className="relative">
                {/* 3D vs 2D Mode Toggle */}
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setView3D(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      !view3D
                        ? 'bg-forest-900 text-gold-300 shadow-sm'
                        : 'bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Photos
                  </button>
                  <button
                    onClick={() => setView3D(true)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      view3D
                        ? 'bg-forest-900 text-gold-300 shadow-sm'
                        : 'bg-white text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    Macro Zoom
                  </button>
                </div>

                {view3D ? (
                  <ProductViewer3D product={product} height="320px" />
                ) : (
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-stone-200">
                    <img
                      src={product.images[activeImageIndex] || getProductImage(product)}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 sm:p-4 object-center select-none"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                      }}
                    />
                    {(product.subcategory || product.badge) && (
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-forest-900/90 text-gold-300 backdrop-blur-md border border-gold-500/30">
                        {product.subcategory || product.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail row if multiple images and 2D mode */}
              {!view3D && product.images.length > 1 && (
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                        activeImageIndex === idx
                          ? 'border-gold-500 scale-105 shadow-md'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details & Catalogue Actions */}
            <div className="p-4 sm:p-6 md:p-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-[11px] sm:text-xs mb-1 gap-2">
                  <span className="font-bold tracking-wider uppercase text-gold-700 shrink-0">
                    NS SOANS INDIAN FARM
                  </span>
                  <span className="text-stone-400 truncate">{product.category}</span>
                </div>

                <h2 className="text-base sm:text-lg md:text-xl font-bold font-serif text-forest-950 mb-1.5">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-forest-900 text-gold-300 border border-gold-500/30">
                    {product.category}
                  </span>
                  <span className="text-xs text-stone-300">&bull;</span>
                  <span className="text-xs text-stone-600 font-medium">
                    {product.collectionName || (product.collection === 'masala' ? 'Masala Products' : 'Farm Products')}
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed mb-3">
                  {product.shortDescription || product.description}
                </p>

                {/* Selected Pack Summary & Price */}
                <div className="flex items-center justify-between gap-2 mb-3 p-2.5 sm:p-3 rounded-xl bg-cream-100/80 border border-gold-500/20">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-forest-800 shrink-0" />
                    <span className="text-xs font-bold text-forest-950">
                      Selected Size: {activeWeightObj.weight}
                    </span>
                  </div>
                  {activeWeightObj.price !== null && activeWeightObj.price !== undefined ? (
                    <span className="text-sm sm:text-base font-extrabold text-forest-950">
                      ₹{Number(activeWeightObj.price).toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] text-gold-700 font-bold uppercase tracking-wider">
                      Price Coming Soon
                    </span>
                  )}
                </div>

                {/* Variant Options — Compact & Clean */}
                {product.weightOptions && product.weightOptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-[11px] font-bold text-earth-800 uppercase tracking-wider mb-1.5">
                      Available Sizes / Weights:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {product.weightOptions.map((opt) => (
                        <button
                          key={opt.weight}
                          type="button"
                          onClick={() => setSelectedWeight(opt)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                            activeWeightObj.weight === opt.weight
                              ? 'border-forest-900 bg-forest-900 text-gold-300 shadow-sm'
                              : 'border-stone-200 bg-white text-stone-700 hover:border-gold-500'
                          }`}
                        >
                          <span>{opt.weight}</span>
                          {opt.price !== null && opt.price !== undefined ? (
                            <span className="ml-1 font-bold">
                              &bull; ₹{Number(opt.price).toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="ml-1 opacity-75 text-[10px]">
                              &bull; Price Coming Soon
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* View Details, Add to Cart & Wishlist Buttons */}
              <div className="pt-3 border-t border-stone-200 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  {activeWeightObj.price !== null && activeWeightObj.price !== undefined && (
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, activeWeightObj, 1);
                        onClose();
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl gold-btn font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm min-h-[36px]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Add to Cart &bull; ₹{Number(activeWeightObj.price).toLocaleString('en-IN')}
                      </span>
                    </button>
                  )}

                  <Link
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm min-h-[36px] ${
                      activeWeightObj.price !== null && activeWeightObj.price !== undefined
                        ? 'bg-forest-900 text-gold-300 hover:bg-forest-950'
                        : 'gold-btn'
                    }`}
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Wishlist button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-2 sm:p-2.5 rounded-xl border transition-all min-h-[36px] flex items-center justify-center ${
                      isInWishlist
                        ? 'border-spice-600 bg-spice-50 text-spice-600'
                        : 'border-stone-200 hover:border-spice-400 text-stone-600'
                    }`}
                    title="Save to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


