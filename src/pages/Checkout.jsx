import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  Banknote,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Lock,
  Tag,
  Info
} from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { Reveal } from '../components/LuxuryMotion';

const indianStates = [
  'Karnataka',
  'Maharashtra',
  'Goa',
  'Kerala',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Delhi',
  'Gujarat',
  'Rajasthan',
  'West Bengal',
  'Punjab',
  'Haryana',
  'Madhya Pradesh',
  'Uttar Pradesh'
];

const countries = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'DE', name: 'Germany' }
];

export default function Checkout() {
  const navigate = useNavigate();
  const {
    cart,
    clearCart,
    promoCode,
    discountPercent,
    shippingMethod,
    setShippingMethod,
    applyPromoCode,
    removePromoCode,
    getSubtotal,
    getDiscountAmount,
    getShippingCost,
    getGrandTotal
  } = useCartStore();

  // Form State
  const [formData, setFormData] = useState({
    email: 'ananya.sharma@example.com',
    phone: '+91 98450 12345',
    firstName: 'Ananya',
    lastName: 'Sharma',
    address: 'Flat 402, Green Acre Apartments, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'IN'
  });

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingCost = getShippingCost();
  const grandTotal = getGrandTotal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If international country chosen, automatically switch shipping method to 'intl'
    if (name === 'country') {
      if (value !== 'IN') {
        setShippingMethod('intl');
      } else {
        setShippingMethod('standard');
      }
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyPromoCode(couponInput);
    setCouponMsg(res);
    if (res.success) setCouponInput('');
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order placement
    setTimeout(() => {
      const orderId = `NS-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderDetails = {
        orderId,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        items: [...cart],
        customer: formData,
        paymentMethod,
        subtotal,
        discount: discountAmount,
        shipping: shippingCost,
        grandTotal
      };

      try {
        localStorage.setItem('ns_soans_last_order', JSON.stringify(orderDetails));
      } catch (err) {
        console.error(err);
      }

      clearCart();
      setIsSubmitting(false);
      navigate(`/order-confirmation/${orderId}`);
    }, 1200);
  };

  // If cart is empty or contains items without active prices, show catalogue inquiry notice
  const hasPricedCartItems =
    cart.length > 0 &&
    cart.every((item) => item.price !== null && item.price !== undefined && item.price > 0);

  if (!hasPricedCartItems) {
    return (
      <div className="min-h-[70vh] bg-cream-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-gold-500/30 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-forest-900 text-gold-300 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-forest-100 text-forest-900 border border-forest-200 inline-block">
              Catalogue Mode Active
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-serif text-forest-950">
              Online Checkout Temporarily Disabled
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              The NS SOANS INDIAN FARM website is currently in catalogue-only preview while pricing updates are in progress. Direct online payments and checkout actions are temporarily inactive.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200 text-xs text-stone-700 space-y-1 text-left">
            <strong className="block text-forest-950 font-bold mb-1">To Place Orders or Inquire:</strong>
            <p>&bull; <strong>WhatsApp / Phone:</strong> +91 63615 78948</p>
            <p>&bull; <strong>Email:</strong> nssoansindianfarm.masala@gmail.com</p>
            <p>&bull; <strong>Desk:</strong> 'Ashwin', Opp. Parijatha Hotel, Main Road, Kundapura – 576201</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/916361578948?text=Hello%20NS%20SOANS%20INDIAN%20FARM%20Team%2C%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto gold-btn px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Order via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/shop"
              className="w-full sm:w-auto forest-btn px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2"
            >
              <span>Browse Catalogue</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-10 px-4 sm:px-6 lg:px-8">
      <Reveal className="max-w-7xl mx-auto">
        {/* Prominent Demo Notice Banner */}
        <div className="mb-8 p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start sm:items-center gap-3 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <div className="text-xs leading-relaxed">
            <strong className="font-bold">FRONTEND DEMO CHECKOUT ONLY:</strong> No actual monetary transaction, credit card charging, or backend order creation occurs. You can safely test the flow to preview the complete order confirmation experience.
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Form: Customer Details, Address, Shipping, Payment */}
          <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-serif font-black text-forest-950">
                  1. Contact Information
                </h2>
                <span className="text-[11px] text-stone-400">Step 1 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-serif font-black text-forest-950">
                  2. Shipping Address
                </h2>
                <span className="text-[11px] text-stone-400">Step 2 of 4</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Country / Region *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-white focus:border-gold-500 focus:outline-none"
                >
                  {countries.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name} {c.code !== 'IN' ? '(International Shipping)' : '(Domestic)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Street Address &amp; House/Apartment No. *
                </label>
                <input
                  type="text"
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    State / Province *
                  </label>
                  {formData.country === 'IN' ? (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl bg-white focus:border-gold-500 focus:outline-none"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Province / State"
                      className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    PIN / ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-xs border border-stone-200 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Shipping Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-serif font-black text-forest-950">
                  3. Delivery Method
                </h2>
                <span className="text-[11px] text-stone-400">Step 3 of 4</span>
              </div>

              {formData.country === 'IN' ? (
                <div className="space-y-3">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-forest-900 bg-forest-50/60 ring-2 ring-forest-800'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-forest-800"
                      />
                      <div>
                        <strong className="text-xs font-bold text-forest-950 block">
                          Standard Ground Delivery (India)
                        </strong>
                        <span className="text-[11px] text-stone-500">
                          Dispatched from Kundapura, Karnataka • 3–5 business days
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-forest-900">
                      {subtotal >= 999 ? (
                        <span className="text-emerald-700 font-bold uppercase">FREE</span>
                      ) : (
                        '₹70'
                      )}
                    </span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('express')}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-forest-900 bg-forest-50/60 ring-2 ring-forest-800'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-forest-800"
                      />
                      <div>
                        <strong className="text-xs font-bold text-forest-950 block">
                          Express Air Priority Cargo
                        </strong>
                        <span className="text-[11px] text-stone-500">
                          Priority flight dispatch • 24–48 hours to major metros
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-forest-900">₹150</span>
                  </label>
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-forest-800 bg-forest-50/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-xs font-bold text-forest-950 block">
                        International Express Air (DHL / FedEx Cross-Border)
                      </strong>
                      <span className="text-[11px] text-stone-600">
                        Full tracking to {countries.find((c) => c.code === formData.country)?.name} • 5–8 business days
                      </span>
                    </div>
                    <span className="text-xs font-black text-forest-950">₹1,850</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Payment Method UI (Demo Mockup) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="text-base font-serif font-black text-forest-950">
                  4. Payment Options (Demo Simulation)
                </h2>
                <span className="text-[11px] text-stone-400">Step 4 of 4</span>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Cards', icon: CreditCard },
                  { id: 'netbanking', label: 'NetBanking', icon: Building },
                  { id: 'cod', label: 'Cash on Delivery', icon: Banknote }
                ].map((pm) => {
                  const Icon = pm.icon;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        paymentMethod === pm.id
                          ? 'border-forest-900 bg-forest-900 text-gold-300 shadow-sm ring-2 ring-gold-500/30'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-gold-500'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto mb-1 text-gold-500" />
                      <span className="text-xs font-bold block">{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Payment Details Preview */}
              <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200 text-xs">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <p className="font-bold text-forest-950">Instant UPI Payment (Demo)</p>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Virtual Payment Address (e.g. name@okhdfc)"
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white"
                    />
                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
                      <span>Supports: Google Pay</span>
                      <span>•</span>
                      <span>PhonePe</span>
                      <span>•</span>
                      <span>Paytm UPI</span>
                      <span>•</span>
                      <span>BHIM</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <p className="font-bold text-forest-950">Debit &amp; Credit Cards (Demo Mockup)</p>
                    <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-2">
                      <input
                        type="text"
                        disabled
                        value="•••• •••• •••• 4242"
                        className="w-full text-xs font-mono bg-stone-50 p-2 rounded-lg text-stone-600"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          disabled
                          value="12/28"
                          className="w-1/2 text-xs font-mono bg-stone-50 p-2 rounded-lg text-stone-600"
                        />
                        <input
                          type="text"
                          disabled
                          value="•••"
                          className="w-1/2 text-xs font-mono bg-stone-50 p-2 rounded-lg text-stone-600"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      Sandbox demonstration: no real card details collected or stored.
                    </span>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2">
                    <p className="font-bold text-forest-950">Select Bank (Demo)</p>
                    <select className="w-full p-2 text-xs bg-white border border-stone-200 rounded-xl">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                      <option>Canara Bank</option>
                    </select>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-1 text-stone-700">
                    <p className="font-bold text-forest-950">Cash on Delivery</p>
                    <p className="text-[11px]">
                      Pay in cash upon physical parcel receipt at your doorstep.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl gold-btn text-xs font-extrabold tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <span>Generating Demo Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place Order (Frontend Demo) • ₹{grandTotal}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gold-500/30 shadow-md sticky top-24 space-y-5">
              <h3 className="text-base font-serif font-black text-forest-950 pb-3 border-b border-stone-100">
                Order Items ({cart.length})
              </h3>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto space-y-3 pr-1 divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="pt-2 flex items-center gap-3">
                    <img
                      src={item.image || '/images/products/placeholder-product.svg'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-contain p-0.5 bg-stone-50 border border-stone-200 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/products/placeholder-product.svg';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-forest-950 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500">
                        {item.weight} &times; {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-black text-forest-950 shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Form */}
              <div className="pt-2 border-t border-stone-100">
                {promoCode ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-gold-50 border border-gold-300 text-xs">
                    <span className="font-bold text-forest-900">
                      {promoCode} ({discountPercent}% OFF)
                    </span>
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-stone-400 hover:text-spice-600 font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Discount Code"
                      className="flex-1 px-3 py-2 text-xs border border-stone-200 rounded-xl uppercase"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-forest-900 text-gold-300"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p
                    className={`text-[10px] mt-1 ${
                      couponMsg.success ? 'text-emerald-700' : 'text-spice-600'
                    }`}
                  >
                    {couponMsg.message}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-earth-900">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-earth-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      `₹${shippingCost}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-forest-950 pt-2 border-t border-stone-200">
                  <span>Total Amount</span>
                  <span className="text-forest-900">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

