import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Package,
  Gift,
  Building2,
  Globe,
  FileCheck,
  Phone
} from 'lucide-react';
import { Reveal, StaggerGrid, StaggerItem } from '../components/LuxuryMotion';

export default function Services() {
  const serviceList = [
    {
      icon: Package,
      title: 'Artisanal Direct-to-Consumer Pantry',
      desc: 'Freshly roasted Kundapura masalas, Vedic Bilona Ghee, and ancient flours delivered straight to your home across India and 45+ international countries with vacuum sealing.'
    },
    {
      icon: Gift,
      title: 'Festive & Corporate Luxury Gifting',
      desc: 'Handcrafted wooden keepsake hampers containing cold-pressed oils, wild honey, and custom engraved spice jars for weddings, corporate milestones, and Diwali feasts.'
    },
    {
      icon: Building2,
      title: 'Fine Dining & HoReCa Supply',
      desc: 'Bulk supplies of standardized authentic Coastal Karnataka masala pastes, A2 Ghee, and stoneground flours for acclaimed Indian restaurants, mutts, and banquet caterers.'
    },
    {
      icon: Globe,
      title: 'International Export Facilitation',
      desc: 'APEDA, US-FDA and FSSAI documentation compliance for seamless commercial shipments of pure Indian spices to the USA, UK, UAE, Australia, Canada, and the EU.'
    },
    {
      icon: FileCheck,
      title: 'Third-Party NABL Quality Audits',
      desc: 'Every batch undergoes rigorous chemical and biological tests for pesticide residues, aflatoxins, and heavy metal compliance with downloadable COA certificates.'
    },
    {
      icon: Sparkles,
      title: 'Custom Spice Blending & Private Formulations',
      desc: 'Working with culinary creators and chefs to craft tailored generational spice blends adhering to strict family recipes and roasting temperatures.'
    }
  ];

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        <Reveal className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-forest-100 text-forest-900 inline-block">
            Comprehensive Offerings &amp; Assurances
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-forest-950">
            Our Services &amp; Quality Assurances
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            From single-pantry orders to worldwide institutional exports, Soans Home Industries delivers uncompromising standards.
          </p>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" stagger={0.08}>
          {serviceList.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <StaggerItem
                key={i}
                className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between card-hover-3d"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-forest-50 text-forest-800 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-gold-600" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-forest-950 mb-2">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {svc.desc}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGrid>

        {/* Corporate Inquiries Box */}
        <Reveal className="bg-forest-950 text-white rounded-3xl p-8 sm:p-12 border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-serif font-black">
              Planning Bulk Gifting or Restaurant Supply?
            </h3>
            <p className="text-xs text-cream-200">
              Speak directly with our institutional sales desk at Kundapura headquarters.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="tel:+916361578948"
              className="gold-btn px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call +91 63615 78948</span>
            </a>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-2xl border border-gold-500/40 text-cream-100 hover:bg-forest-900 text-xs font-bold text-center transition-colors"
            >
              Send Online Inquiry
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

