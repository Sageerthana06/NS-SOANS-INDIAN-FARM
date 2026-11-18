import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Reveal } from '../components/LuxuryMotion';
import { stories } from '../data/stories';

export default function StoryDetails() {
  const { slug } = useParams();
  const story = stories.find((s) => s.slug === slug) || stories[0];

  return (
    <div className="min-h-screen bg-cream-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link to="/" className="hover:text-forest-900">Home</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <Link to="/stories" className="hover:text-forest-900">Farm Stories</Link>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-forest-950 font-bold truncate max-w-xs">{story.title}</span>
        </nav>

        {/* Header */}
        <Reveal className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-black font-serif text-forest-950 leading-tight">
            {story.title}
          </h1>

          <div className="rounded-3xl overflow-hidden shadow-xl aspect-video w-full group">
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </Reveal>

        {/* Content Body */}
        <Reveal className="bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-sm text-sm sm:text-base text-stone-700 leading-relaxed space-y-6" delay={0.1}>
          <p className="font-serif italic text-lg text-forest-900 border-l-4 border-gold-500 pl-4 py-1">
            "{story.excerpt}"
          </p>
          <div className="whitespace-pre-line font-light text-stone-600">
            {story.content}
          </div>
        </Reveal>

        {/* Back Link */}
        <div className="text-center pt-4">
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 text-xs font-bold text-forest-900 hover:text-gold-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Stories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

