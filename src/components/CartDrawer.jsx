import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LUXURY_EASE } from './LuxuryMotion';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    promoCode,
    discountPercent,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getGrandTotal,
    getTotalItemsCount
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingCost = getShippingCost();
  const grandTotal = getGrandTotal();
  const totalItems = getTotalItemsCount();

  // Free shipping progress logic (Pan-India threshold: ₹999)
  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyPromoCode(inputCoupon);
    setCouponFeedback(res);
    if (res.success) {
      setInputCoupon('');
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-forest-950/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: LUXURY_EASE }}
              className="w-screen max-w-md bg-cream-50 shadow-2xl flex flex-col justify-between border-l border-gold-500/20"
            >
          {/* Header */}
          <div className="p-5 border-b border-stone-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-forest-900 text-gold-300">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-forest-950 font-serif">
                    Your Shopping Cart
                  </h2>
                  <p className="text-xs text-stone-500 font-medium">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-stone-400 hover:text-forest-900 hover:bg-forest-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator (Only when cart has items) */}
            {cart.length > 0 && (
              <div className="mt-4 p-3 rounded-2xl bg-forest-50 border border-forest-200/60">
                <div className="flex items-center justify-between text-xs font-semibold text-forest-900 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-forest-700" />
                    {amountNeeded > 0
                      ? `Add ₹${amountNeeded} more for Free Pan-India Delivery`
                      : '🎉 You have unlocked FREE Pan-India Delivery!'}
                  </span>
                  <span className="text-[11px] text-forest-700 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-gold-500 to-forest-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-base font-bold text-forest-950 mb-1">
                  Your cart is currently empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Discover authentic Kundapura masalas, A2 Vedic ghee, and certified organic farm staples.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="gold-btn px-6 py-2.5 rounded-2xl text-xs font-bold"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-sm relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 aspect-square rounded-xl border border-stone-100 bg-stone-50 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img
                      src={item.image || '/images/products/placeholder-product.svg'}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/products/placeholder-product.svg';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] font-bold tracking-wider uppercase text-gold-700">
                            {item.brand}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-forest-950 truncate max-w-[180px]">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 font-medium">
                            Variant: {item.weight}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-stone-300 hover:text-spice-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between pt-2 mt-1 border-t border-stone-100">
                      <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-cream-50">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-1 sm:p-1.5 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-forest-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-1 sm:p-1.5 hover:bg-stone-200 text-stone-700 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-extrabold text-forest-950">
                          ₹{item.price * item.quantity}
                        </span>
                        <span className="block text-[10px] text-stone-400">
                          ₹{item.price} each
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Calculations (Only if items exist) */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-stone-200 space-y-3.5">
              {/* Promo code field */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gold-50 border border-gold-300 text-xs">
                    <div className="flex items-center gap-2 text-forest-900 font-semibold">
                      <Tag className="w-3.5 h-3.5 text-gold-600" />
                      <span>{promoCode} Applied ({discountPercent}% OFF)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-spice-600 text-[11px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="Coupon code (e.g. SOANS10)"
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-900 text-gold-300 hover:bg-forest-950 transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponFeedback && (
                  <p
                    className={`text-[11px] mt-1 font-medium ${
                      couponFeedback.success ? 'text-emerald-700' : 'text-spice-600'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-earth-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-semibold">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping (India Standard)</span>
                  <span className="font-semibold text-earth-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">Free</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-extrabold text-forest-950 pt-2 border-t border-stone-100">
                  <span>Estimated Total</span>
                  <span className="text-forest-900">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 rounded-2xl gold-btn flex items-center justify-center gap-2 text-sm font-bold shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between text-xs">
                  <Link
                    to="/cart"
                    onClick={closeCart}
                    className="text-forest-800 hover:text-gold-700 font-semibold underline"
                  >
                    View Full Cart Page
                  </Link>
                  <button
                    onClick={closeCart}
                    className="text-stone-500 hover:text-earth-900 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Frontend Demo • No real payment collected</span>
              </div>
            </div>
          )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

