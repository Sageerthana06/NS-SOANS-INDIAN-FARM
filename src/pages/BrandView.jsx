import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Reveal } from '../components/LuxuryMotion';
import { products } from '../data/products';
import { subcategories } from '../data/categories';

export default function BrandView() {
  const { slug } = useParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState('all');

  const isSoans = slug === 'ns-soans' || slug?.includes('soans') || slug?.includes('masala');
  const brandName = isSoans
    ? 'NS SOANS INDIAN FARM — Masala Products'
    : 'NS SOANS INDIAN FARM — Farm Products';

  const collectionSubcategories = useMemo(
    () => subcategories.filter((s) => (isSoans ? s.collection === 'masala' : s.collection === 'organic')),
    [isSoans]
  );

  const brandFiltered = useMemo(() => {
    return products.filter((p) => {
      const inCollection = isSoans ? p.collection === 'masala' : p.collection === 'organic';
      if (!inCollection) return false;
      if (activeSubcategory !== 'all' && p.subcategorySlug !== activeSubcategory) return false;
      return true;
    });
  }, [isSoans, activeSubcategory]);

  return (
    <div className="min-h-screen bg-cream-50 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Brand Hero Header */}
        <Reveal
          className={`rounded-2xl sm:rounded-3xl p-4 sm:p-12 lg:p-14 border shadow-xl relative overflow-hidden ${
            isSoans
              ? 'bg-forest-950 text-white border-gold-500/30'
              : 'bg-stone-900 text-white border-gold-500/30'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <span className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-white/10 text-gold-300 inline-block border border-gold-500/30">
                {isSoans ? 'Coastal Karnataka Heritage' : 'Natural Farm Collection'}
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif">
                {brandName}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-cream-200 leading-relaxed font-light">
                {isSoans
                  ? 'Explore our complete Masala Products collection from NS SOANS INDIAN FARM — featuring Beverages, Veg Masalas, Non-Veg Coastal Masalas, and Culinary Pastes.'
                  : 'Explore our complete Farm Products collection from NS SOANS INDIAN FARM — featuring Ghee, Cold-Pressed Oils, Stone-Ground Atta, Natural Sweeteners, Immunity Support, Rice, Breakfast & Snacks, and Grains & Pulses.'}
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-gold-500/30 shadow-xl bg-forest-900/50 aspect-video group">
                <img
                  src={isSoans ? '/images/brand/ns-soans-masala.webp' : '/images/brand/ns-soans-organic.webp'}
                  alt={brandName}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Subcategory Filter Pills */}
        <Reveal className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveSubcategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubcategory === 'all'
                ? 'bg-forest-900 text-gold-300 shadow-sm'
                : 'bg-cream-100 text-stone-700 hover:bg-forest-50'
            }`}
          >
            All {isSoans ? 'Masala Products' : 'Farm Products'}
          </button>
          {collectionSubcategories.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setActiveSubcategory(sub.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubcategory === sub.id
                  ? 'bg-forest-900 text-gold-300 shadow-sm'
                  : 'bg-cream-100 text-stone-700 hover:bg-forest-50'
              }`}
            >
              {sub.name} ({sub.count})
            </button>
          ))}
        </Reveal>

        {/* Product Grid */}
        <div>
          <Reveal className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-forest-950">
              Catalogue Products ({brandFiltered.length})
            </h2>
            <Link
              to="/shop"
              className="text-xs font-bold text-forest-900 hover:text-gold-700 inline-flex items-center gap-1 group"
            >
              <span>View Unified Catalogue</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>

          <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 w-full">
            {brandFiltered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setQuickViewProduct(prod)}
              />
            ))}
          </div>
        </div>
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


