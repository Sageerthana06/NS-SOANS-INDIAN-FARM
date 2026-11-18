import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Reveal, LUXURY_EASE } from '../components/LuxuryMotion';

const faqCategories = [
  {
    category: 'NS SOANS Masalas & Spices',
    items: [
      {
        q: 'What makes NS SOANS Kundapura Masalas different from supermarket brands?',
        a: 'Commercial brands pulverize spices at high speeds which generates excessive friction heat, burning volatile essential aroma oils. We slow-roast individual whole spices over gentle heat and cold-grind them. We also never use MSG, preservatives, anticaking silica, or artificial red dyes.'
      },
      {
        q: 'How are the Byadgi chillies sourced and roasted?',
        a: 'We directly procure GI-tagged Byadgi chillies from Karnataka farmers. The chillies are sun-dried to optimal moisture content and roasted in small batches to deliver rich deep crimson color without harsh blistering pungency.'
      },
      {
        q: 'How should I store the spice blends after opening?',
        a: 'Store them in an airtight glass or steel jar in a cool, dark kitchen cupboard away from steam or direct stove heat. Always use a dry spoon.'
      }
    ]
  },
  {
    category: 'NS SOANS INDIAN FARM — A2 Ghee & Organic Harvests',
    items: [
      {
        q: 'What is Vedic Bilona Churning and why does it matter?',
        a: 'Industrial ghee is made by melting centrifugated cream. Authentic Vedic Bilona begins by culturing A2 cow milk into whole curd, then churning it bidirectionally with a wooden bilona to harvest makkhan before slow simmering. This preserves gut-friendly enzymes and produces granular aromatic ghee.'
      },
      {
        q: 'Are NS SOANS INDIAN FARM cold-pressed oils unrefined?',
        a: 'Yes, 100%. They are extracted using wooden expellers (Marachekku) at temperatures below 40°C. They contain natural healthy sediments, authentic aroma, and zero bleaching chemicals.'
      },
      {
        q: 'Why does your Raw Forest Honey crystallize over time?',
        a: 'Natural, unprocessed honey with live pollen and enzymes crystallizes naturally in cold weather. It is proof that the honey has never been ultra-heated or cut with corn syrup. Place the jar in warm water to reliquefy.'
      }
    ]
  },
  {
    category: 'Shipping, Delivery & Returns',
    items: [
      {
        q: 'What are the domestic delivery timelines and charges in India?',
        a: 'We offer FREE Standard Shipping across India on all orders of ₹999 and above. Orders below ₹999 incur a nominal fee of ₹70. Deliveries take 3–5 business days.'
      },
      {
        q: 'Do you ship to the USA, UK, UAE, and other countries?',
        a: 'Yes! We ship globally to over 45 countries via DHL / FedEx Cross-Border with complete tracking and phytosanitary clearance.'
      },
      {
        q: 'What is your replacement or refund policy for transit damage?',
        a: 'If any glass jar or seal arrives compromised during transit, simply share photos with our helpline (+91 63615 78948) within 48 hours for an instant free replacement or refund.'
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({ '0-0': true });

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <Reveal className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-forest-100 text-forest-900 inline-block">
            Answers &amp; Guidance
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-forest-950">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Everything you need to know about our sourcing, preparation, Vedic bilona method, storage, and global deliveries.
          </p>
        </Reveal>

        <div className="space-y-10">
          {faqCategories.map((cat, catIdx) => (
            <Reveal key={catIdx} className="space-y-4" delay={catIdx * 0.06}>
              <h3 className="text-lg font-serif font-black text-forest-950 flex items-center gap-2 border-b border-stone-200 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gold-500" />
                {cat.category}
              </h3>

              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const key = `${catIdx}-${itemIdx}`;
                  const isOpen = !!openItems[key];
                  return (
                    <div
                      key={itemIdx}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm transition-all"
                    >
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-forest-950 hover:text-forest-700 transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-forest-900' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: LUXURY_EASE }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

