import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Reveal } from '../components/LuxuryMotion';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { getCategoryImage } from '../data/categoryImageMap';

export default function CategoryView() {
  const { slug } = useParams();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const category = categories.find((c) => c.slug === slug) || categories[0];
  const catProducts = products.filter((p) => p.categorySlug === category.slug);

  return (
    <div className="min-h-screen bg-cream-50 py-6 sm:py-10 px-2.5 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link to="/" className="hover:text-forest-900">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/shop" className="hover:text-forest-900">Shop</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-forest-950 font-bold">{category.name}</span>
        </nav>

        {/* Category Banner */}
        <Reveal className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-60 sm:h-80 shadow-xl flex flex-col justify-end p-5 sm:p-12 border border-gold-500/30 group">
          <img
            src={getCategoryImage(category)}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out select-none"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `/images/categories/${category.slug}.webp`;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-forest-950 inline-block shadow-sm">
              {category.badge}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-white">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-cream-200 line-clamp-2">
              {category.description}
            </p>
          </div>
        </Reveal>

        {/* Product Grid */}
        <div>
          <Reveal className="flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
            <h2 className="text-lg font-serif font-black text-forest-950">
              {category.name} ({catProducts.length})
            </h2>
            <Link
              to="/shop"
              className="text-xs font-bold text-forest-900 hover:text-gold-700 inline-flex items-center gap-1 group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>

          <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 w-full">
            {catProducts.map((p) => (
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

