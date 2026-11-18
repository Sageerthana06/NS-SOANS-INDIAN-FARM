import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Reveal } from '../components/LuxuryMotion';
import { useWishlistStore } from '../store/wishlistStore';
import { products } from '../data/products';

export default function Wishlist() {
  const { items, clearWishlist } = useWishlistStore();

  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <div className="min-h-screen bg-cream-50 py-6 sm:py-12 px-2.5 sm:px-6 lg:px-8 overflow-x-hidden">
      <Reveal className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-forest-950">
              My Saved Wishlist
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {wishlistProducts.length} items saved for future harvest
            </p>
          </div>

          {wishlistProducts.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-spice-700 hover:underline font-semibold shrink-0"
            >
              Clear All Wishlist
            </button>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-stone-200 shadow-sm max-w-md">
              <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h2 className="text-xl font-bold font-serif text-forest-950 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Explore our authentic Kundapura masalas, Vedic Bilona Ghee, and organic farm staples to save your favorites.
              </p>
              <Link
                to="/shop"
                className="gold-btn px-6 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-2"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6 w-full">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Reveal>
    </div>
  );
}

