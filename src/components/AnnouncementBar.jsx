import React from 'react';
import { Phone, Truck, ShieldCheck, Globe, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    icon: ShieldCheck,
    text: 'NS SOANS INDIAN FARM • Soans Home Industries, Kundapura — Legacy Since 1920',
    cta: 'Explore Products',
    link: '/shop'
  },
  {
    icon: ShieldCheck,
    text: 'NS SOANS INDIAN FARM • Soans Home Industries, Kundapura — Legacy Since 1920',
    cta: 'Explore Products',
    link: '/shop'
  }
];

function MarqueeSequence({ hidden = false }) {
  return (
    <div
      className="flex items-center shrink-0 w-max whitespace-nowrap"
      aria-hidden={hidden || undefined}
    >
      {announcements.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <div key={idx} className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 whitespace-nowrap">
            <IconComponent className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            <span className="tracking-wide text-cream-100 whitespace-nowrap">
              {item.text}
            </span>
            <Link
              to={item.link}
              tabIndex={hidden ? -1 : undefined}
              className="hidden sm:inline-flex items-center gap-0.5 text-gold-400 hover:text-gold-200 underline font-semibold ml-1 shrink-0 whitespace-nowrap transition-colors"
            >
              {item.cta}
              <ChevronRight className="w-3 h-3" />
            </Link>
            <span className="text-gold-500/50 pl-3 sm:pl-4 select-none" aria-hidden="true">
              •
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="w-full bg-forest-950 text-gold-200 border-b border-forest-900 py-1.5 px-3 sm:px-4 text-xs font-medium overflow-hidden">
      <style>{`
        @keyframes announcementScrollLeftToRight {
          0% {
            transform: translate3d(-50%, 0, 0);
          }
          100% {
            transform: translate3d(0%, 0, 0);
          }
        }
        .announcement-marquee-ltr {
          display: flex;
          width: max-content;
          will-change: transform;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translate3d(-50%, 0, 0);
          animation-name: announcementScrollLeftToRight !important;
          animation-duration: 18s !important;
          animation-timing-function: linear !important;
          animation-iteration-count: infinite !important;
          animation-direction: normal !important;
        }
        .announcement-marquee-ltr:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Helpline */}
        <div className="hidden xl:flex items-center gap-2 text-stone-300 shrink-0 whitespace-nowrap">
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

        {/* Center Continuous Left-to-Right Complete Announcement Track */}
        <div className="flex-1 w-full min-w-0 overflow-hidden relative flex items-center">
          <div className="announcement-marquee-ltr flex items-center w-max whitespace-nowrap">
            <MarqueeSequence />
            <MarqueeSequence hidden />
          </div>
        </div>

        {/* Right Info */}
        <div className="hidden lg:flex items-center gap-4 text-stone-300 shrink-0 whitespace-nowrap">
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
