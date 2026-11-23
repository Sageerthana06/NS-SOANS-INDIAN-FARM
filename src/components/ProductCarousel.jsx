import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import ProductCard from './ProductCard';
import { LUXURY_EASE } from './LuxuryMotion';

/**
 * Smooth Auto-Moving Product Carousel with Manual Controls (Prev / Next / Pause / Dots).
 * Uses only real catalogue products passed via props.
 */
export default function ProductCarousel({
  products = [],
  onQuickView,
  autoPlayInterval = 3800
}) {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const totalItems = products.length;

  const updateScrollButtons = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 8);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8);

    // Estimate active card index for progress dots
    const firstCard = el.querySelector('[data-carousel-card]');
    if (firstCard) {
      const cardWidth = firstCard.offsetWidth + 16;
      const idx = Math.min(
        totalItems - 1,
        Math.max(0, Math.round(scrollLeft / Math.max(1, cardWidth)))
      );
      setActiveIndex(idx);
    }
  }, [totalItems]);

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener('resize', updateScrollButtons);
    return () => window.removeEventListener('resize', updateScrollButtons);
  }, [updateScrollButtons]);

  const scrollByCards = useCallback(
    (direction = 1) => {
      const el = trackRef.current;
      if (!el) return;
      const firstCard = el.querySelector('[data-carousel-card]');
      const step = firstCard ? firstCard.offsetWidth + 16 : 280;
      const { scrollLeft, scrollWidth, clientWidth } = el;

      if (direction > 0 && scrollLeft + clientWidth >= scrollWidth - 12) {
        // Loop smoothly back to start
        el.scrollTo({ left: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      } else if (direction < 0 && scrollLeft <= 12) {
        // Loop smoothly to end
        el.scrollTo({ left: scrollWidth - clientWidth, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      } else {
        el.scrollBy({ left: direction * step, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    },
    [prefersReducedMotion]
  );

  const scrollToCardIndex = (idx) => {
    const el = trackRef.current;
    if (!el) return;
    const firstCard = el.querySelector('[data-carousel-card]');
    const step = firstCard ? firstCard.offsetWidth + 16 : 280;
    el.scrollTo({ left: idx * step, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setActiveIndex(idx);
  };

  // Auto-advance timer
  useEffect(() => {
    if (prefersReducedMotion || isPaused || userPaused || totalItems <= 1) return;
    const timer = setInterval(() => {
      scrollByCards(1);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, isPaused, userPaused, totalItems, autoPlayInterval, scrollByCards]);

  if (!products || products.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/5 border border-gold-500/30 text-forest-900 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          <span>Interactive Harvest Showcase &bull; {totalItems} Curated Classics</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Play / Pause Auto-Scroll Toggle */}
          {!prefersReducedMotion && (
            <button
              type="button"
              onClick={() => setUserPaused((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white hover:bg-cream-100 text-forest-900 border border-stone-200/90 hover:border-gold-500/50 text-xs font-semibold shadow-xs transition-all"
              title={userPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
              aria-label={userPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
            >
              {userPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-gold-600 fill-current" />
                  <span className="hidden sm:inline">Auto-Slide</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-gold-600" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>
          )}

          {/* Previous Button */}
          <motion.button
            type="button"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
            onClick={() => scrollByCards(-1)}
            aria-label="Previous product"
            title="Previous product"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all shadow-sm ${
              canScrollLeft
                ? 'bg-forest-900 text-gold-300 border-gold-500/40 hover:bg-forest-950'
                : 'bg-white text-forest-900 border-stone-200 hover:border-gold-500/40'
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            type="button"
            whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
            onClick={() => scrollByCards(1)}
            aria-label="Next product"
            title="Next product"
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all shadow-sm ${
              canScrollRight
                ? 'bg-forest-900 text-gold-300 border-gold-500/40 hover:bg-forest-950'
                : 'bg-white text-forest-900 border-stone-200 hover:border-gold-500/40'
            }`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={trackRef}
        onScroll={updateScrollButtons}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-0.5 no-scrollbar snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-carousel-card
            className="snap-start shrink-0 w-[230px] sm:w-[260px] md:w-[275px] lg:w-[285px]"
          >
            <ProductCard product={product} onQuickView={onQuickView} />
          </div>
        ))}
      </div>

      {/* Interactive Progress Pill Dots */}
      <div className="flex items-center justify-center gap-1.5 mt-3" role="tablist" aria-label="Carousel pagination">
        {products.map((p, idx) => {
          const isCurrent = idx === activeIndex;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => scrollToCardIndex(idx)}
              aria-label={`Go to ${p.name}`}
              aria-selected={isCurrent}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'w-7 bg-forest-900'
                  : 'w-2 bg-stone-300 hover:bg-gold-500'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
