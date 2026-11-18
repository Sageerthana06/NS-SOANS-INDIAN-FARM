import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Leaf, Sparkles, ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from 'lucide-react';

const commercialScenes = [
  {
    id: 'spices',
    tabLabel: '1. Real Indian Spices',
    badge: 'Scene 01 • Macro Spice Cinematography',
    title: 'Whole Sun-Dried Indian Spices',
    subtitle: 'Red Chillies • Turmeric • Cinnamon • Cardamom • Black Pepper • Star Anise',
    description:
      'Captured in macro detail: whole GI-tagged Byadgi red chillies, high-curcumin turmeric rhizomes, rolled Ceylon cinnamon bark, green cardamom pods, Tellicherry black peppercorns, and star anise.',
    link: '/category/masalas-spices',
    cta: 'Explore Whole Spices',
    shots: [
      {
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Macro Slow-Motion: Whole Red Chillies, Turmeric, Cardamom & Star Anise',
        items: ['Byadgi Red Chillies', 'Lakadong Turmeric', 'Green Cardamom', 'Star Anise']
      },
      {
        url: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1200&q=85',
        caption: 'Hand-Selected Cinnamon Bark, Black Peppercorns & Whole Cloves',
        items: ['Ceylon Cinnamon', 'Tellicherry Black Pepper', 'Roasted Coriander', 'Cumin']
      },
      {
        url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Freshly Stone-Pounded Golden Turmeric & Fiery Chilli Powders',
        items: ['Sun-Dried Chillies', 'Cold-Milled Turmeric', 'Whole Fenugreek', 'Mustard Seeds']
      }
    ]
  },
  {
    id: 'masalas',
    tabLabel: '2. Masala Products',
    badge: 'Scene 02 • Live-Action Culinary Craft',
    title: 'Authentic Coastal & Heritage Masalas',
    subtitle: 'Sambar • Rasam • Chicken Ghee Roast • Chicken Sukka • Butter Chicken • Fish Curry • Puliyogare',
    description:
      'Sizzling spices tempered in hot A2 ghee, natural rising steam, and rich coastal gravies crafted with Soans Home Industries signature Kundapura masala blends.',
    link: '/brand/ns-soans',
    cta: 'Shop NS SOANS Masalas',
    shots: [
      {
        url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=85',
        caption: 'Sizzling Kundapura Chicken Ghee Roast & Mangalore Chicken Sukka',
        items: ['Chicken Ghee Roast Masala', 'Chicken Sukka Masala', 'Butter Chicken Masala']
      },
      {
        url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=1200&q=85',
        caption: 'Steaming Traditional Udupi Sambar, Rasam & Coastal Fish Curry',
        items: ['Sambar Powder', 'Udupi Rasam Powder', 'Coastal Fish Curry Masala']
      },
      {
        url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=85',
        caption: 'Temple-Style Puliyogare Mix & Royal Butter Chicken Gravy',
        items: ['Puliyogare Mix', 'Butter Chicken Masala', 'Dal Chutney Pudi']
      }
    ]
  },
  {
    id: 'organic',
    tabLabel: '3. Organic Farm Products',
    badge: 'Scene 03 • Pure Farm-to-Table Harvest',
    title: 'Natural Farm Goodness & Golden Elixirs',
    subtitle: 'A2 Ghee • Groundnut & Mustard Oil • Khapli Atta • Raw Honey • Jaggery • Black Rice • Millet Crisps',
    description:
      'Golden Bilona A2 Desi Cow Ghee with rich granular texture, cold-pressed oils flowing smoothly, raw wild forest honey pouring in slow motion, stoneground Khapli wheat atta, and heirloom grains.',
    link: '/shop?collection=organic',
    cta: 'Shop Organic Farm Harvest',
    shots: [
      {
        url: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=85',
        caption: 'Granular Golden A2 Desi Cow Cultured Ghee & Raw Wild Forest Honey',
        items: ['A2 Desi Cow Ghee', 'Raw Wild Forest Honey', 'Organic Jaggery Powder']
      },
      {
        url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=85',
        caption: 'Pure Wood-Pressed Groundnut Oil & Kachi Ghani Yellow Mustard Oil Flowing',
        items: ['Groundnut Oil', 'Yellow Mustard Oil', 'Cold-Pressed Sesame Oil']
      },
      {
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1200&q=85',
        caption: 'Stoneground Khapli Emmer Atta, Heritage Black Rice & Baked Millet Crisps',
        items: ['Khapli Wheat Atta', 'Indigenous Black Rice', 'Spiced Millet Crisps']
      }
    ]
  }
];

export default function HeroScene() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [activeShotIndex, setActiveShotIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentScene = commercialScenes[activeSceneIndex];
  const currentShot = currentScene.shots[activeShotIndex];

  useEffect(() => {
    if (!isPlaying) return undefined;
    const interval = setInterval(() => {
      setActiveShotIndex((prevShot) => {
        if (prevShot + 1 < currentScene.shots.length) {
          return prevShot + 1;
        }
        setActiveSceneIndex((prevScene) => (prevScene + 1) % commercialScenes.length);
        return 0;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, activeSceneIndex, currentScene.shots.length]);

  const handleSceneSelect = (index) => {
    setActiveSceneIndex(index);
    setActiveShotIndex(0);
  };

  const handlePrevShot = () => {
    if (activeShotIndex > 0) {
      setActiveShotIndex(activeShotIndex - 1);
    } else {
      const prevScene = (activeSceneIndex - 1 + commercialScenes.length) % commercialScenes.length;
      setActiveSceneIndex(prevScene);
      setActiveShotIndex(commercialScenes[prevScene].shots.length - 1);
    }
  };

  const handleNextShot = () => {
    if (activeShotIndex + 1 < currentScene.shots.length) {
      setActiveShotIndex(activeShotIndex + 1);
    } else {
      const nextScene = (activeSceneIndex + 1) % commercialScenes.length;
      setActiveSceneIndex(nextScene);
      setActiveShotIndex(0);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-forest-950 border border-gold-500/35 shadow-2xl">
      {/* Top Scene Selector Tabs */}
      <div className="grid grid-cols-3 border-b border-gold-500/25 bg-forest-950/95 backdrop-blur-md">
        {commercialScenes.map((scene, idx) => (
          <button
            key={scene.id}
            type="button"
            onClick={() => handleSceneSelect(idx)}
            className={`py-3 px-2 text-[11px] sm:text-xs font-bold tracking-wide transition-all border-b-2 ${
              activeSceneIndex === idx
                ? 'border-gold-400 text-gold-300 bg-forest-900/90'
                : 'border-transparent text-cream-200/75 hover:text-white hover:bg-forest-900/40'
            }`}
          >
            {scene.tabLabel}
          </button>
        ))}
      </div>

      {/* Main Photorealistic Macro Viewport */}
      <div className="relative h-[420px] sm:h-[470px] w-full overflow-hidden bg-black">
        <img
          key={`${currentScene.id}-${activeShotIndex}`}
          src={currentShot.url}
          alt={currentShot.caption}
          className="w-full h-full object-cover object-center transition-transform duration-1000 scale-105 hover:scale-100"
        />

        {/* Natural Lighting & Cinematic Shadow Vignette */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/30"
          aria-hidden="true"
        />

        {/* Top Bar: Live-Action Badge & Playback Control */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-gold-500/40 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-gold-300 uppercase">
              {currentScene.badge}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-full bg-black/70 hover:bg-black text-gold-300 border border-gold-500/30 backdrop-blur-md transition-colors"
            title={isPlaying ? 'Pause Reel' : 'Play Reel'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Left / Right Camera Shot Controls */}
        <button
          type="button"
          onClick={handlePrevShot}
          aria-label="Previous Camera Shot"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleNextShot}
          aria-label="Next Camera Shot"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white border border-white/20 backdrop-blur-sm transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Bottom Caption & Featured Products Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-10 space-y-3">
          {/* Featured Product Pills in Current Shot */}
          <div className="flex flex-wrap gap-1.5">
            {currentShot.items.map((item) => (
              <span
                key={item}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-gold-500/95 text-forest-950 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-black font-serif text-white leading-snug drop-shadow">
              {currentScene.title}
            </h3>
            <p className="text-xs text-gold-300 font-semibold mt-0.5">
              {currentShot.caption}
            </p>
            <p className="text-xs text-cream-100/90 line-clamp-2 mt-1 leading-relaxed">
              {currentScene.description}
            </p>
          </div>

          {/* Shot Progress Indicators & CTA */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/15">
            <div className="flex items-center gap-1.5">
              {currentScene.shots.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveShotIndex(idx)}
                  aria-label={`Shot ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    activeShotIndex === idx ? 'w-7 bg-gold-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <Link
              to={currentScene.link}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-300 hover:text-white transition-colors"
            >
              <span>{currentScene.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
