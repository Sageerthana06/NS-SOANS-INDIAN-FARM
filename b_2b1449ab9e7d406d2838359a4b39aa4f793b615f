import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { Reveal } from '../components/LuxuryMotion';

export default function VisionMission() {
  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        <Reveal className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-forest-100 text-forest-900 inline-block">
            Our Purpose &amp; Guiding Principles
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-forest-950">
            Vision &amp; Mission
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Re-establishing India’s sacred relationship with nutrient-dense soil, indigenous seeds, and ancestral cooking heritage.
          </p>
        </Reveal>

        {/* Vision Card */}
        <Reveal className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden" delay={0.08}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-forest-900 text-gold-400">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-black text-forest-950">
              Our Vision
            </h2>
          </div>
          <p className="text-sm sm:text-base text-stone-700 leading-relaxed font-light mb-6">
            To create an India where clean, whole, unadulterated food is the cornerstone of household vitality. We envision kitchen pantries nourished by regenerative organic ecosystems, where modern families celebrate authentic regional heritage dishes without synthetic shortcuts or pesticide burdens.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-xs">
            <div className="p-3 rounded-xl bg-cream-50">
              <strong className="text-forest-950 block mb-0.5">Ecological Restoration</strong>
              <span className="text-stone-500">Regenerating topsoil through biodiverse farming</span>
            </div>
            <div className="p-3 rounded-xl bg-cream-50">
              <strong className="text-forest-950 block mb-0.5">Heirloom Preservation</strong>
              <span className="text-stone-500">Safeguarding native seed diversity</span>
            </div>
            <div className="p-3 rounded-xl bg-cream-50">
              <strong className="text-forest-950 block mb-0.5">Culinary Legacy</strong>
              <span className="text-stone-500">Preserving slow-roasted artisanal recipes</span>
            </div>
          </div>
        </Reveal>

        {/* Mission Card */}
        <Reveal className="bg-forest-950 text-white rounded-3xl p-8 sm:p-12 border border-gold-500/30 shadow-xl relative overflow-hidden" delay={0.14}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-forest-900 border border-gold-500/30 text-gold-400">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-black text-white">
              Our Mission
            </h2>
          </div>
          <p className="text-sm sm:text-base text-cream-200 leading-relaxed font-light mb-6">
            To supply genuine, lab-verified, freshly prepared spice powders and farm-to-table staples that uphold the highest nutritional integrity. Through Soans Home Industries in Kundapura under NS SOANS INDIAN FARM, we champion fair farmer compensation, transparent traceability, and sustainable packaging.
          </p>
          <div className="space-y-3 pt-2 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold-400" />
              <span>Zero chemical preservatives or synthetic additives across all product lines</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold-400" />
              <span>Ethical procurement directly from organic cultivators</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold-400" />
              <span>Continuous batch testing for aflatoxins and micro-biological safety</span>
            </div>
          </div>
        </Reveal>

        <Reveal className="text-center pt-4" delay={0.18}>
          <Link
            to="/shop"
            className="gold-btn px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
          >
            <span>Explore Our Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}

