import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Users,
  ChefHat,
  ShoppingBag,
  Check,
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { recipes } from '../data/recipes';
import { products } from '../data/products';
import { useCartStore } from '../store/cartStore';
import { Reveal } from '../components/LuxuryMotion';

export default function RecipeDetails() {
  const { slug } = useParams();
  const recipe = recipes.find((r) => r.slug === slug) || recipes[0];
  const featuredProd = products.find((p) => p.id === recipe.featuredProduct);

  const [addedAnimation, setAddedAnimation] = useState(false);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddFeaturedProduct = () => {
    if (featuredProd) {
      addToCart(featuredProd);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link to="/" className="hover:text-forest-900">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/recipes" className="hover:text-forest-900">Recipes</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-forest-950 font-bold truncate max-w-xs">{recipe.title}</span>
        </nav>

        {/* Hero Title & Image */}
        <Reveal className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-100 text-forest-900 inline-block">
              {recipe.category}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500/15 text-forest-900 border border-gold-500/40 inline-block">
              NS SOANS INDIAN FARM • Legacy Since 1920
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-forest-950 leading-tight">
            {recipe.title}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
            {recipe.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3 border-y border-stone-200 text-xs text-stone-600 font-medium">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-600" />
              Preparation: <strong>{recipe.prepTime}</strong>
            </span>
            {recipe.marinationTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-600" />
                Marination: <strong>{recipe.marinationTime}</strong>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gold-600" />
              Cooking: <strong>{recipe.cookTime}</strong>
            </span>
            {recipe.totalTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-600" />
                Total Time: <strong>{recipe.totalTime}</strong>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gold-600" />
              Serves: <strong>{recipe.servings}</strong>
            </span>
            {recipe.author && (
              <span className="flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-gold-600" />
                Recipe by: <strong>{recipe.author}</strong>
              </span>
            )}
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl aspect-video w-full group">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </Reveal>

        {/* Featured Key Ingredient Card (One-click Buy) */}
        {featuredProd && (
          <Reveal className="bg-forest-950 text-white rounded-3xl p-6 sm:p-8 border border-gold-500/30 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6" delay={0.08}>
            <Link to={`/product/${featuredProd.slug}`} className="flex items-center gap-4 group">
              <img
                src={featuredProd.images[0]}
                alt={featuredProd.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border border-gold-500/30 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block mb-0.5">
                  Core Recipe Ingredient • {featuredProd.brand}
                </span>
                <h4 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors mb-1">
                  {featuredProd.name}
                </h4>
                <p className="text-xs text-stone-300">
                  {featuredProd.price !== null && featuredProd.price !== undefined
                    ? `₹${Number(featuredProd.price).toLocaleString('en-IN')}`
                    : 'Price Coming Soon'}{' '}
                  • {featuredProd.weightOptions?.[0]?.weight}
                </p>
              </div>
            </Link>

            <button
              onClick={handleAddFeaturedProduct}
              className={`gold-btn px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-md ${
                addedAnimation ? 'bg-emerald-700 text-white' : ''
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </Reveal>
        )}

        {/* Ingredients & Step by Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Ingredients Column */}
          <Reveal className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4" delay={0.1}>
            <h3 className="text-lg font-serif font-black text-forest-950 border-b border-stone-100 pb-3">
              Ingredients Checklist
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-stone-700">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-gold-500 mt-1.5 shrink-0" />
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Cooking Instructions Column */}
          <Reveal className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6" delay={0.16}>
            <h3 className="text-lg font-serif font-black text-forest-950 border-b border-stone-100 pb-3">
              Step-by-Step Method
            </h3>
            <div className="space-y-6">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-forest-900 text-gold-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Back Link */}
        <div className="text-center pt-6">
          <Link
            to="/recipes"
            className="text-xs font-bold text-forest-900 hover:text-gold-700 underline inline-flex items-center gap-1"
          >
            &larr; Back to all recipes
          </Link>
        </div>
      </div>
    </div>
  );
}

