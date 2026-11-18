import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal, StaggerGrid, StaggerItem } from '../components/LuxuryMotion';
import { stories } from '../data/stories';

export default function FarmStories() {
  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <Reveal className="text-center max-w-2xl mx-auto space-y-3">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-forest-100 text-forest-900 inline-block">
            Chronicles of Soil &amp; Hearth
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-serif text-forest-950">
            Farm Stories &amp; Heritage Dispatches
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Deep dives into Kundapura spice heritage, regenerative soil biodiversity, and ancient Vedic food preparation.
          </p>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-8" stagger={0.1}>
          {stories.map((story) => (
            <StaggerItem key={story.id} className="h-full">
              <Link
                to={`/stories/${story.slug}`}
                className="group h-full bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-luxury-hover hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between card-hover-3d"
              >
                <div>
                  <div className="relative aspect-video w-full overflow-hidden rounded-t-3xl bg-forest-950/5">
                    <img
                      src={story.image}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-serif font-bold text-forest-950 group-hover:text-forest-700 transition-colors mb-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {story.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs font-bold text-gold-700">
                  <span>Read Full Dispatch</span>
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

