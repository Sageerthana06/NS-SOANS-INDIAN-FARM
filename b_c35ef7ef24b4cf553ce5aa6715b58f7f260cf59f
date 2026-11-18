import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Reveal } from './LuxuryMotion';

const exploreProductLinks = [
  { label: 'Veg Masalas', to: '/category/veg' },
  { label: 'Coastal Non-Veg Masalas', to: '/category/non-veg' },
  { label: 'A2 Desi Cow Ghee', to: '/category/ghee' },
  { label: 'Cold-Pressed Oils', to: '/category/oil' },
  { label: 'Stone-Ground Atta', to: '/category/atta' },
  { label: 'Natural Sweeteners & Honey', to: '/category/natural-sweetener' }
];

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Shop', to: '/shop' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'My Account', to: '/account' },
  { label: 'Shopping Cart', to: '/cart' }
];

const customerSupportLinks = [
  { label: 'Frequently Asked Questions', to: '/faq' },
  { label: 'Shipping & Delivery', to: '/shipping-policy' },
  { label: 'Returns & Refunds', to: '/refund-policy' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' }
];

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-gold-500/20 pt-16 pb-10 overflow-hidden">
      <Reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" y={20}>
        {/* Main 4-Column Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10 pb-14 border-b border-forest-900/80">
          {/* Section 1: Brand Information */}
          <div className="lg:col-span-3 xl:col-span-3 min-w-0 space-y-5">
            <Link
              to="/"
              className="inline-block p-2.5 rounded-2xl bg-white shadow-lg border border-gold-500/30 group"
            >
              <img
                src="/logo.png"
                alt="NS SOANS INDIAN FARM"
                className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <div className="space-y-2.5">
              <h3 className="text-base sm:text-lg font-serif font-black tracking-wide text-white">
                NS SOANS INDIAN FARM
              </h3>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
                Traditional Flavours. Natural Goodness.
              </p>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm font-light">
                Rooted in the culinary heritage of Kundapura, Karnataka. Bringing authentic Indian spices and carefully selected natural farm products to your home.
              </p>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-forest-900/90 border border-gold-500/30 text-gold-300 text-[11px] font-bold uppercase tracking-wider">
                Soans Home Industries &bull; Since 1920
              </span>
            </div>
          </div>

          {/* Section 2: Explore Our Products */}
          <div className="lg:col-span-3 xl:col-span-3 min-w-0 space-y-4">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Explore Our Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              {exploreProductLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-gold-300 hover:translate-x-0.5 inline-block transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1.5">
                <Link
                  to="/shop"
                  className="text-gold-400 hover:text-gold-300 font-bold inline-flex items-center gap-1.5 group transition-colors"
                >
                  <span>View All Products</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Quick Links */}
          <div className="lg:col-span-2 xl:col-span-2 min-w-0 space-y-4">
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="hover:text-gold-300 hover:translate-x-0.5 inline-block transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Customer Support & Contact Us */}
          <div className="lg:col-span-4 xl:col-span-4 min-w-0 space-y-7">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest">
                Customer Support
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-stone-300">
                {customerSupportLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="hover:text-gold-300 hover:translate-x-0.5 inline-block transition-all duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-5 border-t border-forest-900/80">
              <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest">
                Contact Us
              </h4>
              <div className="space-y-2.5 text-xs text-stone-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">
                      Soans Home Industries
                    </strong>
                    <p className="text-stone-300">
                      &apos;Ashwin&apos;, Opp. Parijatha Hotel, Main Road, Kundapura, Udupi District, Karnataka, India – 576201.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="text-stone-400 shrink-0">Phone:</span>{' '}
                    <a
                      href="tel:+916361578948"
                      className="text-white hover:text-gold-300 font-semibold transition-colors text-[11px] sm:text-xs"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      +91 63615 78948
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs">
                    <span className="text-stone-400 shrink-0" style={{ whiteSpace: 'nowrap' }}>Email:</span>{' '}
                    <a
                      href="mailto:nssoansindianfarm.masala@gmail.com"
                      className="text-white hover:text-gold-300 font-semibold transition-colors text-[11px] sm:text-xs tracking-tight"
                      style={{
                        whiteSpace: 'nowrap',
                        width: 'max-content',
                        maxWidth: 'none'
                      }}
                    >
                      nssoansindianfarm.masala@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 text-center text-xs text-stone-400">
          <p>
            &copy; 2026 NS SOANS INDIAN FARM (Soans Home Industries). All rights reserved.
          </p>
        </div>
      </Reveal>
    </footer>
  );
}


