import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Reveal, LUXURY_EASE } from '../components/LuxuryMotion';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { products } from '../data/products';
import { categories } from '../data/categories';
import { useProductStore } from '../store/productStore';

const ITEMS_PER_PAGE = 200;

export default function Shop() {
  useProductStore((state) => state.priceVersion);
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  // Read initial states from URL query
  const initialCategory = searchParams.get('category') || 'all';
  const initialCollection = searchParams.get('collection') || searchParams.get('brand') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedCollection, setSelectedCollection] = useState(
    initialCollection === 'masala' || initialCollection === 'ns-soans'
      ? 'masala'
      : (initialCollection === 'farm' || initialCollection === 'organic' || initialCollection === 'two-brothers'
          ? 'organic'
          : initialCollection)
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync state if URL query changes
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    const colParam = searchParams.get('collection') || searchParams.get('brand') || 'all';
    setSelectedCollection(
      colParam === 'masala' || colParam === 'ns-soans'
        ? 'masala'
        : (colParam === 'farm' || colParam === 'organic' || colParam === 'two-brothers'
            ? 'organic'
            : colParam)
    );
    setSearchQuery(searchParams.get('search') || '');
    setCurrentPage(1);
  }, [searchParams]);

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCollection, selectedCategory, searchQuery, sortBy]);

  // Visible categories based on selected collection
  const availableCategories = useMemo(() => {
    if (selectedCollection === 'masala') {
      return categories.filter((c) => c.collection === 'masala');
    }
    if (selectedCollection === 'organic' || selectedCollection === 'farm') {
      return categories.filter((c) => c.collection === 'organic');
    }
    return categories;
  }, [selectedCollection]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Collection filter
        if (selectedCollection === 'masala' && p.collection !== 'masala') return false;
        if ((selectedCollection === 'organic' || selectedCollection === 'farm') && p.collection !== 'organic') return false;

        // Category filter (Excel categories)
        if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return 0; // default / featured
      });
  }, [selectedCollection, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const masalaCount = useMemo(() => products.filter((p) => p.collection === 'masala').length, []);
  const farmCount = useMemo(() => products.filter((p) => p.collection === 'organic').length, []);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream-50 py-6 sm:py-10 px-2.5 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <Reveal className="mb-6 sm:mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-stone-200 pb-6 sm:pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              NS SOANS INDIAN FARM
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif text-forest-950">
              Product Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
              Authentic Indian masalas and natural farm products rooted in the culinary tradition of Kundapura, Karnataka.
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex flex-col sm:items-end justify-center gap-1">
            <span className="text-xs font-bold text-stone-500">
              Showing <span className="text-forest-950 font-black">{filteredProducts.length}</span> of {products.length} Products
            </span>
            <span className="text-[11px] text-gold-700 font-semibold">
              {masalaCount} Masala Products &bull; {farmCount} Farm Products
            </span>
          </div>
        </Reveal>

        {/* Category Quick Filter Pill Bar */}
        <Reveal className="mb-6 sm:mb-8" delay={0.05}>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-stone-200 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-950">
                Collection Filter:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {[
                  { id: 'all', label: `All (${products.length})` },
                  { id: 'masala', label: `Masala (${masalaCount})` },
                  { id: 'organic', label: `Farm (${farmCount})` }
                ].map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      setSelectedCollection(col.id);
                      setSelectedCategory('all');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCollection === col.id
                        ? 'bg-forest-900 text-gold-300 shadow-sm'
                        : 'bg-cream-100 text-stone-700 hover:bg-forest-50 hover:text-forest-950'
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 pt-2 border-t border-stone-100 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gold-500 text-forest-950 font-bold shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All Categories ({filteredProducts.length})
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                    selectedCategory === cat.slug
                      ? 'bg-forest-900 text-gold-300 font-bold shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.name} ({cat.itemCount})
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Search, Sort & Mobile Filter Toggle Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 bg-white rounded-2xl p-3 sm:p-4 border border-stone-200 shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0 w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search products or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-cream-50 border border-stone-200 rounded-xl text-xs font-medium text-forest-950 focus:outline-none focus:border-gold-500 transition-colors placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                aria-label="Clear Search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-stone-600 flex-1 sm:flex-initial">
              <span className="hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto bg-cream-50 border border-stone-200 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-medium text-forest-950 focus:outline-none focus:border-gold-500 cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3 py-2 rounded-xl border border-stone-200 bg-cream-50 text-stone-700 hover:bg-cream-100 flex items-center gap-1.5 text-xs font-bold shrink-0 min-h-[36px]"
              aria-label="Open Filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Grid & Desktop Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-950 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gold-600" />
                  Catalogue Filters
                </span>
                {(selectedCategory !== 'all' || selectedCollection !== 'all' || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-[11px] font-bold text-spice-600 hover:underline"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Collection Selection */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  Collection
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Collections', count: products.length },
                    { id: 'masala', label: 'Masala Products', count: masalaCount },
                    { id: 'organic', label: 'Farm Products', count: farmCount }
                  ].map((col) => (
                    <label
                      key={col.id}
                      className="flex items-center justify-between gap-2 text-xs font-medium text-stone-700 hover:text-forest-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="colSidebar"
                          checked={selectedCollection === col.id}
                          onChange={() => {
                            setSelectedCollection(col.id);
                            setSelectedCategory('all');
                          }}
                          className="text-forest-800 focus:ring-gold-500"
                        />
                        <span>{col.label}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">{col.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Excel Categories */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  Excel Categories ({availableCategories.length})
                </h4>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  <label className="flex items-center justify-between gap-2 text-xs font-medium text-stone-700 hover:text-forest-900 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="catSidebar"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                        className="text-forest-800 focus:ring-gold-500"
                      />
                      <span>All Categories</span>
                    </div>
                    <span className="text-[10px] text-stone-400">{filteredProducts.length}</span>
                  </label>
                  {availableCategories.map((c) => (
                    <label
                      key={c.id}
                      className="flex items-center justify-between gap-2 text-xs font-medium text-stone-700 hover:text-forest-900 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <input
                          type="radio"
                          name="catSidebar"
                          checked={selectedCategory === c.slug}
                          onChange={() => setSelectedCategory(c.slug)}
                          className="text-forest-800 focus:ring-gold-500 shrink-0"
                        />
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 shrink-0">{c.itemCount}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Cards Grid & Pagination */}
          <div className="lg:col-span-9 space-y-8 min-w-0 w-full">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm space-y-4">
                <span className="text-4xl block">🔍</span>
                <h3 className="text-lg font-bold text-forest-950 font-serif">
                  No matching products found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  We couldn't find any items matching your active search and filter criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="gold-btn px-6 py-2.5 rounded-xl text-xs font-bold inline-block"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="product-grid-with-sidebar grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 w-full">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={(p) => setQuickViewProduct(p)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6 border-t border-stone-200">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === page
                          ? 'bg-forest-900 text-gold-300 shadow-sm'
                          : 'bg-white border border-stone-200 text-stone-700 hover:bg-cream-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFilterOpen(false)}
                className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3, ease: LUXURY_EASE }}
                className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <h3 className="text-sm font-bold text-forest-950">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Collection Filter */}
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Collection
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'All Collections' },
                      { id: 'masala', label: 'Masala Products' },
                      { id: 'organic', label: 'Farm Products' }
                    ].map((col) => (
                      <label key={col.id} className="flex items-center gap-2 text-xs font-medium text-stone-700">
                        <input
                          type="radio"
                          name="colMobile"
                          checked={selectedCollection === col.id}
                          onChange={() => {
                            setSelectedCollection(col.id);
                            setSelectedCategory('all');
                          }}
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Category Filter */}
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                    Categories
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                      <input
                        type="radio"
                        name="catMobile"
                        checked={selectedCategory === 'all'}
                        onChange={() => setSelectedCategory('all')}
                      />
                      <span>All Categories</span>
                    </label>
                    {availableCategories.map((c) => (
                      <label key={c.id} className="flex items-center justify-between text-xs font-medium text-stone-700">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="catMobile"
                            checked={selectedCategory === c.slug}
                            onChange={() => setSelectedCategory(c.slug)}
                          />
                          <span>{c.name}</span>
                        </div>
                        <span className="text-[10px] text-stone-400">{c.itemCount}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex gap-2">
                  <button
                    onClick={handleClearFilters}
                    className="flex-1 py-2 rounded-xl text-xs font-bold border border-stone-200 text-stone-600"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold bg-forest-900 text-gold-300"
                  >
                    Apply
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Quick View Modal */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </div>
    </div>
  );
}
