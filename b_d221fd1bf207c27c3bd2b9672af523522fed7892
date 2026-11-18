import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
  Truck,
  ArrowLeft
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Reveal } from '../components/LuxuryMotion';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
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
  const [orderNotes, setOrderNotes] = useState('');

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingCost = getShippingCost();
  const grandTotal = getGrandTotal();
  const totalItems = getTotalItemsCount();

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyPromoCode(inputCoupon);
    setCouponFeedback(res);
    if (res.success) setInputCoupon('');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 border border-stone-200 shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-serif font-black text-forest-950 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-stone-500 mb-8 leading-relaxed">
            Your pantry is waiting for the authentic taste of slow-roasted Kundapura masalas and Vedic farm products.
          </p>
          <Link
            to="/shop"
            className="gold-btn py-3.5 px-8 rounded-2xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-lg"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <Reveal className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black font-serif text-forest-950">
              Shopping Cart
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {totalItems} items from NS SOANS INDIAN FARM
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-spice-700 hover:underline font-semibold"
          >
            Empty Cart
          </button>
        </div>

        {/* Free Shipping Banner */}
        <div className="mb-8 p-4 rounded-3xl bg-white border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-forest-900 mb-2">
            <span className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-forest-800" />
              {amountNeeded > 0
                ? `Add ₹${amountNeeded} more for Free Pan-India Delivery`
                : '🎉 Congratulations! You have qualified for FREE Pan-India Shipping!'}
            </span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-forest-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table / List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl border border-stone-100 bg-stone-50 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
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

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700">
                        {item.brand}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-forest-950 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Size: <span className="font-semibold text-stone-700">{item.weight}</span>
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2">
                        {/* Stepper */}
                        <div className="flex items-center border border-stone-200 rounded-xl bg-cream-50 overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="p-1.5 sm:p-2 text-stone-600 hover:bg-stone-200 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-bold text-forest-950">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="p-1.5 sm:p-2 text-stone-600 hover:bg-stone-200 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-base sm:text-lg font-black text-forest-950 block">
                            ₹{item.price * item.quantity}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            (₹{item.price} each)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="p-2 text-stone-300 hover:text-spice-600 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions / Notes */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm">
              <label className="block text-xs font-bold text-forest-950 uppercase tracking-wider mb-2">
                Order Notes / Custom Gift Message (Optional):
              </label>
              <textarea
                rows={3}
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Write any special packing instructions or festive greetings to be printed on parchment..."
                className="w-full p-3 text-xs border border-stone-200 rounded-2xl focus:border-gold-500 focus:outline-none"
              />
            </div>

            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-forest-800 hover:text-gold-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gold-500/30 shadow-md space-y-4">
              <h3 className="text-base font-serif font-black text-forest-950 border-b border-stone-100 pb-3">
                Order Summary
              </h3>

              {/* Promo input */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-gold-50 border border-gold-300 text-xs">
                    <div className="flex items-center gap-2 text-forest-900 font-semibold">
                      <Tag className="w-4 h-4 text-gold-600" />
                      <span>{promoCode} ({discountPercent}% Discount)</span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-spice-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      placeholder="Coupon Code"
                      className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none uppercase"
                    />
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
                    className={`text-[11px] mt-1.5 font-medium ${
                      couponFeedback.success ? 'text-emerald-700' : 'text-spice-600'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Price rows */}
              <div className="space-y-2 pt-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-earth-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-earth-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-forest-950 pt-3 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-forest-900">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout / Inquiry Button */}
              <button
                onClick={() => navigate('/contact')}
                className="w-full py-4 rounded-2xl gold-btn text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Send Order Inquiry to Kundapura Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Frontend Prototype • Safe Demo Environment</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

