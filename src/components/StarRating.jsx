import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 5, reviewCount = null, size = 'sm' }) {
  const starSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-earth-800">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== null && (
        <span className="text-xs text-stone-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

