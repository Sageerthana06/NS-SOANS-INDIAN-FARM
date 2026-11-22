import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { getCategoryImage } from '../data/categoryImageMap';
import { LUXURY_EASE } from './LuxuryMotion';

export default function CategoryCard({ category }) {
  const prefersReducedMotion = useReducedMotion();
  const imageUrl = getCategoryImage(category);

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: LUXURY_EASE }}
      className="h-full"
    >
      <Link
        to={`/shop?category=${encodeURIComponent(category.slug)}`}
        className="group relative h-80 rounded-3xl overflow-hidden border border-gold-500/20 shadow-md hover:shadow-luxury-hover transition-all duration-500 flex flex-col justify-end p-6 card-hover-3d"
      >
        {/* Background Image with Zoom on Hover */}
        <img
          src={imageUrl}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out select-none"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = `/images/categories/${category.slug}.webp`;
          }}
        />

        {/* Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Decorative Gold Border Line on hover */}
        <div className="absolute inset-0 border-2 border-gold-400/0 group-hover:border-gold-400/40 rounded-3xl transition-all duration-300 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gold-500 text-forest-950 shadow-sm">
              {category.badge}
            </span>
            <span className="text-xs text-gold-300 font-medium">
              {category.itemCount} Products
            </span>
          </div>

          <h3 className="text-xl font-bold font-serif text-white mb-1.5 group-hover:text-gold-200 transition-colors">
            {category.name}
          </h3>

          <p className="text-xs text-cream-200 line-clamp-2 mb-4 font-normal leading-relaxed opacity-90">
            {category.description}
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-bold text-gold-300 group-hover:text-white transition-colors">
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

