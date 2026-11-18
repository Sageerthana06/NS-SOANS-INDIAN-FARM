import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';

export default function ProductViewer3D({ product, height = '450px' }) {
  const images = product?.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=85'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [focalPoint, setFocalPoint] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    if (zoomLevel === 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));
    setFocalPoint({ x, y });
  };

  const cycleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.75 : prev === 1.75 ? 2.5 : 1));
  };

  return (
    <div
      style={{ height }}
      onMouseMove={handleMouseMove}
      onClick={cycleZoom}
      className="relative w-full rounded-2xl overflow-hidden bg-stone-950 border border-gold-500/30 shadow-xl cursor-zoom-in select-none group"
    >
      {/* Photorealistic Macro Photograph */}
      <img
        src={images[activeIndex] || images[0]}
        alt={product?.name || 'Authentic Product Macro View'}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: `${focalPoint.x}% ${focalPoint.y}%`
        }}
        className="w-full h-full object-cover object-center transition-transform duration-300 ease-out"
      />

      {/* Subtle Natural Studio Vignette */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Right Macro Lens Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 p-1.5 rounded-xl bg-black/75 border border-gold-500/35 backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.5).toFixed(2))))}
          title="Macro Zoom In"
          className="p-2 rounded-lg text-xs text-cream-100 hover:text-gold-300 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(1, Number((z - 0.5).toFixed(2))))}
          title="Zoom Out"
          className="p-2 rounded-lg text-xs text-cream-100 hover:text-gold-300 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoomLevel(1);
            setFocalPoint({ x: 50, y: 50 });
          }}
          title="Reset View"
          className="p-2 rounded-lg text-xs text-cream-100 hover:text-gold-300 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Top Left Macro Studio Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-gold-500/35 backdrop-blur-md text-[11px] text-gold-300 font-semibold pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-gold-400" />
        <span>Macro Texture Inspection ({zoomLevel}x)</span>
      </div>

      {/* Bottom Camera Angles & Provenance Caption */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/75 border border-white/15 backdrop-blur-md"
      >
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{product?.name}</p>
          <p className="text-[11px] text-gold-300 truncate">
            {product?.origin || 'Kundapura, Karnataka'} • 100% Natural Macro Photography
          </p>
        </div>

        {images.length > 1 && (
          <div className="flex items-center gap-1.5 shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`w-9 h-9 rounded-lg overflow-hidden border-2 transition-all ${activeIndex === idx ? 'border-gold-400 scale-105' : 'border-white/30 opacity-70 hover:opacity-100'
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
