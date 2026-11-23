import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ArrowRight,
  Leaf
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { products } from '../data/products';
import { getProductImage, PRODUCT_PLACEHOLDER_IMAGE } from '../data/productImageMap';
import { LUXURY_EASE } from './LuxuryMotion';

const NAV_LINKS = [
  { label: 'Home', to: '/', match: (pathname) => pathname === '/' },
  {
    label: 'Products',
    to: '/shop',
    hasLeaf: true,
    match: (pathname) =>
      pathname.startsWith('/shop') ||
      pathname.startsWith('/category') ||
      pathname.startsWith('/brand') ||
      pathname.startsWith('/product')
  },
  { label: 'Recipes', to: '/recipes', match: (pathname) => pathname.startsWith('/recipes') },
  { label: 'Farm Stories', to: '/stories', match: (pathname) => pathname.startsWith('/stories') },
  { label: 'About Us', to: '/about', match: (pathname) => pathname === '/about' },
  { label: 'Contact', to: '/contact', match: (pathname) => pathname === '/contact' }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartBump, setCartBump] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const searchInputRef = useRef(null);
  const prevCartCountRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  const totalCartItems = useCartStore((state) => state.getTotalItemsCount());
  const toggleCart = useCartStore((state) => state.toggleCart);
  const wishlistItems = useWishlistStore((state) => state.items);

  // Micro-feedback pulse when cart items increase
  useEffect(() => {
    if (prevCartCountRef.current !== null && totalCartItems > prevCartCountRef.current) {
      setCartBump(true);
      const timer = setTimeout(() => setCartBump(false), 450);
      prevCartCountRef.current = totalCartItems;
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = totalCartItems;
  }, [totalCartItems]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Track scroll for sticky backdrop blur & interactive top gold scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 40);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (y / docHeight) * 100)));
      } else {
        setScrollProgress(0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered search results — show all matching products without artificial cutoff
  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-300 ${
          isScrolled
            ? 'shadow-sm border-b border-[#D4AF37]/25 py-1.5'
            : 'border-b border-stone-200 py-2'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl text-[#143823] hover:text-[#D4AF37] transition-colors duration-250"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Official Logo — Compact 45–50px Height */}
            <Link to="/" className="flex items-center shrink-0 group">
              <img
                src="/logo.png"
                alt="NS SOANS INDIAN FARM and Masala Products — Kundapura"
                className="h-[45px] sm:h-[48px] md:h-[50px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop & Tablet Horizontal Navigation:
                Home | Products | Recipes | Farm Stories | About Us | Contact */}
            <nav
              className="hidden md:flex items-center gap-5 lg:gap-8 xl:gap-9 whitespace-nowrap"
              aria-label="Primary Navigation"
            >
              {NAV_LINKS.map((item) => {
                const isActive = item.match(location.pathname);
                if (item.hasLeaf) {
                  return (
                    <div
                      key={item.to}
                      className="relative"
                      onMouseEnter={() => setProductsMenuOpen(true)}
                      onMouseLeave={() => setProductsMenuOpen(false)}
                    >
                      <Link
                        to={item.to}
                        className={`luxury-nav-link text-[14px] lg:text-[15px] py-1 ${
                          isActive ? 'luxury-nav-link-active' : ''
                        }`}
                      >
                        <Leaf
                          className={`w-3.5 h-3.5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                            productsMenuOpen ? 'rotate-12 scale-110' : ''
                          }`}
                          strokeWidth={2}
                        />
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.span
                            layoutId="activeNavDot"
                            transition={{ duration: 0.35, ease: LUXURY_EASE }}
                            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                            aria-hidden="true"
                          />
                        )}
                      </Link>

                      <AnimatePresence>
                        {productsMenuOpen && (
                          <motion.div
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: LUXURY_EASE }}
                            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-64"
                          >
                            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#D4AF37]/30 p-2 space-y-1">
                              <Link
                                to="/shop"
                                onClick={() => setProductsMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#143823] hover:bg-forest-50 hover:text-[#B88629] transition-colors"
                              >
                                <span>All 124 Products</span>
                                <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                              </Link>
                              <Link
                                to="/shop?collection=masala"
                                onClick={() => setProductsMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-forest-50 hover:text-[#143823] transition-colors"
                              >
                                <span>Masala Collection (61)</span>
                                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                              </Link>
                              <Link
                                to="/shop?collection=organic"
                                onClick={() => setProductsMenuOpen(false)}
                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-forest-50 hover:text-[#143823] transition-colors"
                              >
                                <span>Farm Products (63)</span>
                                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`luxury-nav-link text-[14px] lg:text-[15px] py-1 ${
                      isActive ? 'luxury-nav-link-active' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activeNavDot"
                        transition={{ duration: 0.35, ease: LUXURY_EASE }}
                        className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search Trigger */}
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="p-2 sm:p-2.5 rounded-full text-[#143823] hover:text-[#D4AF37] transition-colors duration-250"
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Wishlist Link */}
              <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }}>
                <Link
                  to="/wishlist"
                  className="relative flex p-2 sm:p-2.5 rounded-full text-[#143823] hover:text-[#D4AF37] transition-colors duration-250"
                  title="Saved Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  <AnimatePresence>
                    {wishlistItems.length > 0 && (
                      <motion.span
                        key={wishlistItems.length}
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{ duration: 0.28, ease: LUXURY_EASE }}
                        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-spice-600 text-white text-[10px] font-bold flex items-center justify-center"
                      >
                        {wishlistItems.length}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* User Account Link */}
              <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }} className="hidden sm:flex">
                <Link
                  to="/account"
                  className="p-2.5 rounded-full text-[#143823] hover:text-[#D4AF37] transition-colors duration-250"
                  title="Customer Account"
                >
                  <User className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Cart Drawer Trigger */}
              <motion.button
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                animate={
                  cartBump && !prefersReducedMotion
                    ? { scale: [1, 1.08, 1] }
                    : { scale: 1 }
                }
                transition={{ duration: 0.32, ease: LUXURY_EASE }}
                onClick={toggleCart}
                className={`relative flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#143823] hover:bg-[#0f291a] text-[#D4AF37] border transition-all duration-250 ${
                  cartBump
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40'
                    : 'border-[#D4AF37]/40'
                }`}
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-semibold tracking-[0.5px] text-[#FAF7F2] hidden sm:inline">
                  Cart
                </span>
                <motion.span
                  key={totalCartItems}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.25, ease: LUXURY_EASE }}
                  className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#143823] text-xs font-bold flex items-center justify-center"
                >
                  {totalCartItems}
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Subtle Gold Scroll Progress Line along Header Bottom Edge */}
        {scrollProgress > 1 && (
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[#143823] via-[#D4AF37] to-[#b88629] transition-[width] duration-150 ease-out pointer-events-none"
            style={{ width: `${scrollProgress}%` }}
            aria-hidden="true"
          />
        )}
      </header>

      {/* Instant Search Overlay Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: LUXURY_EASE }}
            className="fixed inset-0 z-50 bg-forest-950/70 backdrop-blur-md flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.32, ease: LUXURY_EASE }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gold-500/30 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="p-4 border-b border-stone-200 flex items-center gap-3">
                <Search className="w-5 h-5 text-gold-600 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search traditional masalas, A2 ghee, wood-pressed oils, grains..."
                  className="w-full text-base text-earth-900 placeholder:text-stone-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>

              {/* Results Preview */}
              <div className="p-4 max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Matching Products
                    </p>
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-forest-50 transition-colors group"
                      >
                        <div className="w-14 h-14 rounded-xl border border-stone-200 overflow-hidden bg-stone-50 shrink-0">
                          <img
                            src={getProductImage(item)}
                            alt={item.name}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = PRODUCT_PLACEHOLDER_IMAGE;
                            }}
                            className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-gold-700 uppercase tracking-wider">
                            {item.brand}
                          </span>
                          <h4 className="text-sm font-semibold text-earth-900 truncate group-hover:text-forest-800">
                            {item.name}
                          </h4>
                          <p className="text-xs text-stone-500">
                            Category: {item.category} &bull;{' '}
                            {item.price !== null && item.price !== undefined
                              ? `₹${Number(item.price).toLocaleString('en-IN')}`
                              : 'Price Coming Soon'}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-forest-700 shrink-0" />
                      </Link>
                    ))}
                    <div className="pt-2 text-center">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-semibold text-gold-700 hover:underline inline-flex items-center gap-1"
                      >
                        View all results for "{searchQuery}" <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="py-8 text-center text-stone-500 text-sm">
                    No matching products found for "{searchQuery}".
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Popular Searches
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Chicken Ghee Roast', 'A2 Desi Ghee', 'Sambar Powder', 'Khapli Wheat Atta', 'Mustard Oil', 'Wild Honey'].map(
                        (tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              setSearchQuery(tag);
                              navigate(`/shop?search=${encodeURIComponent(tag)}`);
                              setSearchOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-forest-100 hover:text-forest-900 text-xs font-medium text-stone-700 transition-colors"
                          >
                            {tag}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-[#143823]/70"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: LUXURY_EASE }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#FAF7F2] shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <img
                    src="/logo.png"
                    alt="NS SOANS INDIAN FARM Logo"
                    className="h-[46px] w-auto object-contain"
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-stone-500 hover:text-[#143823] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="mt-6 space-y-1" aria-label="Mobile Navigation">
                  {NAV_LINKS.map((item, idx) => {
                    const isActive = item.match(location.pathname);
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + idx * 0.04, duration: 0.3, ease: LUXURY_EASE }}
                      >
                        <Link
                          to={item.to}
                          className={`group flex items-center justify-between py-3 px-2 border-b border-stone-200/70 text-[15px] tracking-[0.5px] transition-colors duration-250 ${
                            isActive
                              ? 'text-[#B88629] font-semibold'
                              : 'text-[#143823] font-medium hover:text-[#D4AF37]'
                          }`}
                        >
                          <span className="luxury-nav-link">
                            {item.hasLeaf && (
                              <Leaf
                                className="w-3.5 h-3.5 text-[#D4AF37] shrink-0"
                                strokeWidth={2}
                              />
                            )}
                            <span>{item.label}</span>
                          </span>
                          {isActive && (
                            <span
                              className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0"
                              aria-hidden="true"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 space-y-1">
                <p className="font-semibold text-forest-900">Soans Home Industries</p>
                <p>'Ashwin', Opp. Parijatha Hotel, Main Road,</p>
                <p>Kundapura, Udupi District, Karnataka, India – 576201.</p>
                <p className="text-gold-700 font-bold pt-1">+91 63615 78948</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

