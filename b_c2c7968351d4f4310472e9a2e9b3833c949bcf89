import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Truck,
  Package,
  Calendar,
  MapPin,
  Printer,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Reveal } from '../components/LuxuryMotion';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#143823', '#CF3E21', '#E5C068']
      });
    } catch (e) {
      console.log('Confetti effect');
    }

    // Retrieve order data from localStorage
    try {
      const saved = localStorage.getItem('ns_soans_last_order');
      if (saved) {
        setOrderData(JSON.parse(saved));
      }
    } catch (err) {
      console.error(err);
    }
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <Reveal className="max-w-3xl mx-auto space-y-8">
        {/* Top Success Badge */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-gold-700 block">
            Thank you for ordering with NS SOANS INDIAN FARM
          </span>

          <h1 className="text-2xl sm:text-3xl font-black font-serif text-forest-950">
            Order #{orderId || 'NS-783921'} Confirmed!
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
            A confirmation email has been dispatched to{' '}
            <strong className="text-forest-950 font-bold">
              {orderData?.customer?.email || 'your email'}
            </strong>
            . We have begun batch packing your artisanal masalas and farm goods.
          </p>

          {/* Stepper Status Tracking */}
          <div className="pt-6 border-t border-stone-100">
            <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-6">
              Live Fulfillment Status (Demo)
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto font-bold">
                  ✓
                </div>
                <p className="font-bold text-forest-950">Order Placed</p>
                <span className="text-stone-400 text-[9px]">Today</span>
              </div>
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-gold-500 text-forest-950 flex items-center justify-center mx-auto font-bold animate-pulse">
                  2
                </div>
                <p className="font-bold text-forest-950">Packing</p>
                <span className="text-stone-400 text-[9px]">Kundapura Unit</span>
              </div>
              <div className="space-y-1.5 opacity-60">
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mx-auto font-bold">
                  3
                </div>
                <p className="font-medium text-stone-600">Dispatched</p>
                <span className="text-stone-400 text-[9px]">In Transit</span>
              </div>
              <div className="space-y-1.5 opacity-60">
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center mx-auto font-bold">
                  4
                </div>
                <p className="font-medium text-stone-600">Delivered</p>
                <span className="text-stone-400 text-[9px]">Doorstep</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        {orderData && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-serif font-black text-forest-950">
                  Parcel Breakdown
                </h3>
                <p className="text-xs text-stone-500">
                  Ordered on {orderData.date}
                </p>
              </div>
              <button
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Invoice
              </button>
            </div>

            {/* Items */}
            <div className="divide-y divide-stone-100">
              {orderData.items.map((item) => (
                <div key={item.cartItemId} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || '/images/products/placeholder-product.svg'}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-contain p-0.5 bg-stone-50 border border-stone-200 shrink-0"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/images/products/placeholder-product.svg';
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-forest-950 truncate">{item.name}</p>
                      <p className="text-[10px] text-stone-500">
                        {item.weight} &times; {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-forest-950 shrink-0">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
              <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200">
                <span className="font-bold text-forest-950 block mb-1">
                  Delivery Destination:
                </span>
                <p className="text-stone-700">
                  {orderData.customer?.firstName} {orderData.customer?.lastName}
                </p>
                <p className="text-stone-600">{orderData.customer?.address}</p>
                <p className="text-stone-600">
                  {orderData.customer?.city}, {orderData.customer?.state} – {orderData.customer?.postalCode}
                </p>
                <p className="text-stone-600 font-semibold">{orderData.customer?.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-stone-200 space-y-1.5">
                <span className="font-bold text-forest-950 block mb-1">
                  Payment Summary:
                </span>
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{orderData.subtotal}</span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span>-₹{orderData.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping:</span>
                  <span className="font-semibold">
                    {orderData.shipping === 0 ? 'FREE' : `₹${orderData.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-forest-950 font-black text-sm pt-1 border-t border-stone-200">
                  <span>Total Paid:</span>
                  <span>₹{orderData.grandTotal}</span>
                </div>
                <p className="text-[10px] text-stone-400 pt-1">
                  Method: {orderData.paymentMethod.toUpperCase()} (Demo Simulator)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Back to Shop */}
        <div className="text-center">
          <Link
            to="/shop"
            className="gold-btn px-8 py-3.5 rounded-2xl text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 shadow-lg"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

