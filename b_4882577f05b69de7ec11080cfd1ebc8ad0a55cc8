import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Lock,
  Mail,
  Phone,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { Reveal } from '../components/LuxuryMotion';
import { BulkPriceUploadPanel } from './AdminDashboard';

export default function Account() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders', 'addresses'

  const wishlistItems = useWishlistStore((state) => state.items);

  const mockUser = {
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98450 12345',
    memberSince: 'March 2023',
    harvestPoints: 480,
    tier: 'Gold Patron'
  };

  const mockPastOrders = [
    {
      id: 'NS-89214',
      date: '14 Oct 2024',
      total: 1985,
      status: 'Delivered',
      items: 'Kundapura Chicken Ghee Roast Masala, A2 Desi Cow Ghee (500ml)'
    },
    {
      id: 'NS-76412',
      date: '28 Aug 2024',
      total: 620,
      status: 'Delivered',
      items: 'Udupi Rasam Powder, Spiced Dal Chutney Pudi'
    }
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-cream-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-forest-900 text-gold-300 flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-black text-forest-950">
              {authMode === 'login' ? 'Patron Sign In' : 'Create Customer Account'}
            </h2>
            <p className="text-xs text-stone-500">
              Access your order history, saved addresses, and loyalty harvest rewards.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedIn(true);
            }}
            className="space-y-4 text-xs"
          >
            {authMode === 'register' && (
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl"
                />
              </div>
            )}

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                defaultValue="ananya.sharma@example.com"
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                defaultValue="••••••••"
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl gold-btn text-xs font-bold uppercase tracking-wider shadow-lg"
            >
              {authMode === 'login' ? 'Sign In (Demo)' : 'Register Account (Demo)'}
            </button>
          </form>

          <div className="text-center pt-2 text-xs">
            {authMode === 'login' ? (
              <p className="text-stone-500">
                Don’t have an account yet?{' '}
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-forest-900 font-bold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-stone-500">
                Already registered?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-forest-900 font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <Reveal className="max-w-6xl mx-auto space-y-10">
        {/* User Card Header */}
        <div className="bg-forest-950 text-white rounded-3xl p-8 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-forest-900 border-2 border-gold-400 text-gold-300 flex items-center justify-center font-bold text-xl shrink-0">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-xl font-bold font-serif text-white">
                  {mockUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gold-500 text-forest-950">
                  {mockUser.tier}
                </span>
              </div>
              <p className="text-xs text-stone-300">{mockUser.email} &bull; {mockUser.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('price-upload')}
              className="px-4 py-2.5 rounded-2xl gold-btn text-xs font-extrabold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Price Management &rarr; Bulk Price Upload</span>
            </button>

            <div className="px-4 py-2 rounded-2xl bg-forest-900 border border-gold-500/30 text-center">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                Harvest Points
              </span>
              <strong className="text-sm text-gold-300">{mockUser.harvestPoints} pts</strong>
            </div>

            <button
              onClick={() => setIsLoggedIn(false)}
              className="p-2.5 rounded-xl border border-stone-700 hover:bg-forest-900 text-stone-300 hover:text-white"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-stone-200 gap-6 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 transition-colors ${
              activeTab === 'profile'
                ? 'text-forest-900 border-b-2 border-gold-600'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors ${
              activeTab === 'orders'
                ? 'text-forest-900 border-b-2 border-gold-600'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Order History
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors ${
              activeTab === 'addresses'
                ? 'text-forest-900 border-b-2 border-gold-600'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('price-upload')}
            className={`pb-3 transition-colors flex items-center gap-1.5 ${
              activeTab === 'price-upload'
                ? 'text-forest-900 border-b-2 border-gold-600'
                : 'text-gold-700 hover:text-forest-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Price Management &rarr; Bulk Price Upload</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Personal Details
              </h4>
              <p className="text-sm font-bold text-forest-950">{mockUser.name}</p>
              <p className="text-xs text-stone-600">{mockUser.email}</p>
              <p className="text-xs text-stone-600">{mockUser.phone}</p>
              <p className="text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                Customer since {mockUser.memberSince}
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Wishlist Summary
              </h4>
              <p className="text-2xl font-black text-forest-950">{wishlistItems.length} Items</p>
              <p className="text-xs text-stone-500">
                Saved items ready for your next order.
              </p>
              <Link
                to="/wishlist"
                className="text-xs font-bold text-forest-900 hover:underline inline-flex items-center gap-1 pt-1"
              >
                Go to Wishlist &rarr;
              </Link>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Reward Vouchers
              </h4>
              <div className="p-3 rounded-2xl bg-gold-50 border border-gold-300 text-xs">
                <span className="font-bold text-forest-950 block">SOANS10 (10% OFF)</span>
                <span className="text-[10px] text-stone-500">Active welcome coupon</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
            {mockPastOrders.map((ord) => (
              <div key={ord.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-sm font-bold text-forest-950">{ord.id}</strong>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {ord.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{ord.date} &bull; {ord.items}</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-sm font-extrabold text-forest-950 block">₹{ord.total}</span>
                  <span className="text-[10px] text-stone-400">Prepaid Delivery</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-gold-500/30 shadow-sm space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-forest-900 text-gold-300 uppercase">
                Default Address
              </span>
              <h4 className="text-sm font-bold text-forest-950">Ananya Sharma (Home)</h4>
              <p className="text-xs text-stone-600">
                Flat 402, Green Acre Apartments, Indiranagar,<br />
                Bangalore, Karnataka – 560038
              </p>
              <p className="text-xs text-stone-600 font-semibold">+91 98450 12345</p>
            </div>
          </div>
        )}

        {activeTab === 'price-upload' && <BulkPriceUploadPanel embedded />}
      </Reveal>
    </div>
  );
}

