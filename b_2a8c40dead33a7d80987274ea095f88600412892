import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { Reveal, StaggerGrid, StaggerItem } from '../components/LuxuryMotion';
import { recipes } from '../data/recipes';

export default function Recipes() {
  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Recipes Page Brand Banner */}
        <Reveal className="rounded-3xl bg-forest-950 text-white border border-gold-500/30 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-6 p-8 sm:p-12 space-y-4 text-center lg:text-left">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-forest-900 text-gold-300 border border-gold-500/30 inline-block">
              Heirloom Kitchen Archives
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-serif text-white leading-tight">
              Authentic Recipes &amp; Culinary Guides
            </h1>
            <p className="text-sm text-cream-200 leading-relaxed">
              Recreate celebrated coastal classics and Ayurvedic wellness elixirs using genuine NS SOANS INDIAN FARM spices and organic farm ingredients.
            </p>
          </div>
          <div className="lg:col-span-6 aspect-video w-full h-full overflow-hidden group">
            <img
              src="/images/brand/ns-soans-brand-banner.png"
              alt="NS SOANS INDIAN FARM — Complete Brand Collection Banner"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.1}>
          {recipes.map((recipe) => (
            <StaggerItem key={recipe.id} className="h-full">
              <Link
                to={`/recipes/${recipe.slug}`}
                className="group h-full bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between card-hover-3d"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={`${recipe.title} — NS SOANS INDIAN FARM`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-forest-900 text-gold-300">
                      {recipe.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {recipe.totalTime ? `Total: ${recipe.totalTime}` : recipe.prepTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {recipe.servings}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-forest-950 group-hover:text-forest-700 transition-colors mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {recipe.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-bold text-gold-700">
                  <span>View Full Recipe &amp; Ingredients</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </div>
  );
}

