import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles, Send } from 'lucide-react';
import { Reveal } from './LuxuryMotion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-forest-950 text-cream-50 overflow-hidden border-t border-gold-500/20">
      {/* Decorative Gold Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-radial-gradient from-gold-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />

      <Reveal className="max-w-4xl mx-auto relative z-10 text-center" y={24}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          The Kundapura Farm Dispatch
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold font-serif tracking-tight text-white mb-3">
          Join Our Family of Mindful Food Lovers
        </h2>

        <p className="text-sm sm:text-base text-cream-200 max-w-xl mx-auto mb-8 font-light leading-relaxed">
          Receive grandmother’s secret heirloom recipes, seasonal harvesting notes, Vedic nutritional wisdom, and an instant ₹150 welcome gift voucher.
        </p>

        {subscribed ? (
          <div className="p-6 rounded-3xl bg-forest-900/90 border border-gold-500/50 max-w-md mx-auto animate-scaleIn">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">
              Welcome to the NS SOANS Family!
            </h3>
            <p className="text-xs text-cream-200 mb-3">
              Your coupon code for ₹150 OFF is:
            </p>
            <div className="inline-block px-4 py-2 rounded-xl bg-gold-500 text-forest-950 font-black tracking-widest text-sm shadow-md">
              SOANS150
            </div>
            <p className="text-[11px] text-gold-300/80 mt-3">
              We also dispatched our signature Kundapura Ghee Roast Recipe booklet to your inbox.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-forest-900/80 border border-gold-500/30 text-white placeholder:text-stone-400 text-sm focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="gold-btn py-3.5 px-8 rounded-2xl text-xs font-bold tracking-wider uppercase shrink-0 flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Subscribe</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            No Spam Ever
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Unsubscribe in 1-Click
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Exclusive Harvest Drops
          </span>
        </div>
      </Reveal>
    </section>
  );
}

