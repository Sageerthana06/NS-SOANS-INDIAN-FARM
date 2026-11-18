import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Leaf,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';
import { Reveal, StaggerGrid, StaggerItem } from '../components/LuxuryMotion';

export default function About() {
  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Banner */}
        <Reveal className="rounded-3xl bg-stone-950 text-white p-8 sm:p-14 lg:p-20 relative overflow-hidden border border-gold-500/30 shadow-2xl min-h-[380px] sm:min-h-[440px] lg:min-h-[480px] flex items-center">
          {/* Heritage Spice Photographic Background */}
          <div
            className="absolute inset-0 bg-cover bg-no-repeat bg-[position:78%_center] sm:bg-[position:84%_center] lg:bg-[position:right_center]"
            style={{ backgroundImage: "url('/images/about-spices-bg.png')" }}
            aria-hidden="true"
          />
          {/* Cinematic Left-to-Right Readability Gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#0c0805]/95 via-[#0c0805]/85 sm:via-[#0c0805]/70 lg:via-[#0c0805]/50 to-[#0c0805]/30 lg:to-transparent"
            aria-hidden="true"
          />
          {/* Subtle Top/Bottom Vignette for Luxury Depth */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/25 pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-xl lg:max-w-2xl space-y-6 relative z-10">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-black/55 backdrop-blur-sm border border-gold-500/40 text-gold-300 inline-block">
              Since 1920 • Kundapura, Karnataka
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif leading-tight drop-shadow-sm">
              A Legacy of Tradition, Flavour &amp; <span className="gold-gradient-text">Natural Goodness</span>
            </h1>
            <p className="text-sm sm:text-base text-cream-100 leading-relaxed font-light drop-shadow-sm">
              Welcome to NS SOANS INDIAN FARM, a brand by Soans Home Industries, rooted in the rich culinary heritage of Kundapura, Karnataka, India.
            </p>
            <p className="text-sm sm:text-base text-cream-100 leading-relaxed font-light drop-shadow-sm">
              For generations, we have valued traditional flavours, quality ingredients and the timeless connection between food, culture and nature.
            </p>
          </div>
        </Reveal>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-7 space-y-6 text-sm text-stone-700 leading-relaxed">
            <span className="text-xs font-bold text-gold-700 uppercase tracking-widest block">
              The Story of Soans Home Industries
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-forest-950">
              Preserving the Flavours of Coastal Karnataka
            </h2>
            <p>
              With a heritage dating back to 1920, Soans Home Industries celebrates the traditional food culture and distinctive flavours of coastal Karnataka.
            </p>
            <p>
              Inspired by the culinary traditions of Kundapura, our Masala Collection brings together the familiar aromas and flavours of traditional Indian cooking.
            </p>
            <p>
              From aromatic spice blends to everyday kitchen essentials, we aim to bring authentic culinary experiences into modern homes.
            </p>

            <div className="space-y-4 pt-2">
              <h3 className="text-lg sm:text-xl font-black font-serif text-forest-950">
                Beyond Spices – A World of Natural Goodness
              </h3>
              <p>
                NS SOANS INDIAN FARM brings together two important food collections under one brand identity:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5">
                  <h4 className="text-sm font-bold text-forest-950">
                    Traditional Masala Collection
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    A selection of traditional Indian spice blends inspired by the rich culinary heritage of coastal Karnataka.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1.5">
                  <h4 className="text-sm font-bold text-forest-950">
                    Organic Farm Collection
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    A range of farm-inspired food products, including A2 Desi Cow Ghee, cold-pressed oils, traditional grains, honey and natural sweeteners.
                  </p>
                </div>
              </div>
              <p>
                Our philosophy is to value tradition, appreciate nature and offer carefully selected food products for everyday kitchens.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <span className="text-xs font-bold text-gold-700 uppercase tracking-widest block">
                Our Heritage &amp; Identity
              </span>
              <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-stone-100 pb-4">
                <img
                  src="/logo.png"
                  alt="Official NS SOANS INDIAN FARM Logo"
                  className="h-24 w-auto object-contain"
                />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                    Official NS SOANS INDIAN FARM Logo
                  </p>
                  <h4 className="text-base font-serif font-black text-forest-950 mt-0.5">
                    NS SOANS INDIAN FARM
                  </h4>
                  <p className="text-xs text-gold-700 font-semibold">
                    A Brand by Soans Home Industries
                  </p>
                </div>
              </div>

              <h4 className="text-sm font-bold text-forest-950">
                Visit Our Home in Kundapura
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>Soans Home Industries</strong><br />
                &apos;Ashwin&apos;<br />
                Opp. Parijatha Hotel, Main Road,<br />
                Kundapura, Udupi District,<br />
                Karnataka, India – 576201.
              </p>
              <p className="text-xs text-stone-600">
                <strong>Phone:</strong> +91 63615 78948 &bull; <strong>Email:</strong>{' '}
                <a
                  href="mailto:nssoansindianfarm.masala@gmail.com"
                  className="text-forest-900 hover:text-gold-700 font-semibold underline transition-colors"
                >
                  nssoansindianfarm.masala@gmail.com
                </a>
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-5 grid grid-cols-2 gap-4" delay={0.12}>
            <div className="overflow-hidden rounded-3xl shadow-md group">
              <img
                src="/images/heritage-spices.png"
                alt="Whole Spices"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <div className="overflow-hidden rounded-3xl shadow-md translate-y-6 group">
              <img
                src="/images/farm-natural-goodness.png"
                alt="Organic Farm"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </Reveal>
        </div>

        {/* Our Commitment */}
        <div className="space-y-6 pt-6">
          <Reveal className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-forest-950">
              Our Commitment
            </h2>
          </Reveal>
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-4 gap-6" stagger={0.08}>
            <StaggerItem className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-luxury-hover transition-all duration-300 text-center card-hover-3d">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-forest-950 mb-1">Traditional Flavours</h3>
              <p className="text-xs text-stone-500">
                Celebrating the culinary heritage and distinctive spice traditions of Kundapura.
              </p>
            </StaggerItem>

            <StaggerItem className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-luxury-hover transition-all duration-300 text-center card-hover-3d">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-forest-950 mb-1">Natural Goodness</h3>
              <p className="text-xs text-stone-500">
                Appreciating traditional food ingredients and nature-inspired products.
              </p>
            </StaggerItem>

            <StaggerItem className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-luxury-hover transition-all duration-300 text-center card-hover-3d">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-forest-950 mb-1">Quality &amp; Care</h3>
              <p className="text-xs text-stone-500">
                Giving importance to product quality, careful selection and customer satisfaction.
              </p>
            </StaggerItem>

            <StaggerItem className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm hover:shadow-luxury-hover transition-all duration-300 text-center card-hover-3d">
              <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-forest-950 mb-1">Authentic Heritage</h3>
              <p className="text-xs text-stone-500">
                Carrying forward a legacy associated with Soans Home Industries since 1920.
              </p>
            </StaggerItem>
          </StaggerGrid>
        </div>

        {/* CTA Banner */}
        <Reveal className="bg-cream-100 rounded-3xl p-8 sm:p-12 border border-gold-500/30 text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl font-serif font-black text-forest-950">
            Discover the Authentic Difference
          </h3>
          <p className="text-xs text-stone-600 max-w-lg mx-auto">
            Explore the traditional flavours of our Masala Collection and the natural food products of NS SOANS INDIAN FARM.
          </p>
          <Link
            to="/shop"
            className="gold-btn px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
          >
            <span>Explore Our Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

