import React, { useState, useEffect } from 'react';
import { Phone, Truck, ShieldCheck, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LUXURY_EASE } from './LuxuryMotion';

const announcements = [
  {
    icon: ShieldCheck,
    text: 'NS SOANS INDIAN FARM • Soans Home Industries, Kundapura — Legacy Since 1920',
    cta: 'Explore Products',
    link: '/shop'
  },
  {
    icon: Globe,
    text: 'Authentic Kundapura Masalas & Organic Farm Harvests from Karnataka, India',
    cta: 'View Recipes',
    link: '/recipes'
  },
  {
    icon: Truck,
    text: 'Visit us at \'Ashwin\', Opp. Parijatha Hotel, Main Road, Kundapura – 576201',
    cta: 'Contact Us',
    link: '/contact'
  }
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="bg-forest-950 text-gold-200 border-b border-gold-500/20 py-2 px-4 text-xs font-medium transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Helpline */}
        <div className="hidden lg:flex items-center gap-2 text-stone-300">
          <Phone className="w-3.5 h-3.5 text-gold-400" />
          <span>Customer Care:</span>
          <a
            href="tel:+916361578948"
            className="text-gold-300 hover:text-white font-semibold transition-colors"
          >
            +91 63615 78948
          </a>
          <span className="text-stone-500">•</span>
          <span className="text-stone-400">Kundapura, Karnataka</span>
        </div>

        {/* Center Rotating Notification */}
        <div className="flex-1 flex items-center justify-center overflow-hidden text-center min-h-[20px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: LUXURY_EASE }}
              className="flex items-center justify-center gap-2"
            >
              <IconComponent className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="tracking-wide text-cream-100">
                {current.text}
              </span>
              <Link
                to={current.link}
                className="inline-flex items-center gap-0.5 text-gold-400 hover:text-gold-200 underline font-semibold ml-1 shrink-0 transition-colors"
              >
                {current.cta}
                <ChevronRight className="w-3 h-3" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Info */}
        <div className="hidden md:flex items-center gap-4 text-stone-300">
          <span className="flex items-center gap-1.5 text-gold-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Currency: <strong className="text-cream-100">₹ INR</strong>
          </span>
          <Link to="/about" className="hover:text-gold-300 transition-colors">
            Our Heritage
          </Link>
          <Link to="/contact" className="hover:text-gold-300 transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

