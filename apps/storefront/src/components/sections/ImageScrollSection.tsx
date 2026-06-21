import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetUrl } from '@/lib/utils/assets';

interface ScrollImage {
  image: string;
  link: string;
  title: string;
}

export function ImageScrollSection({ content, settings }: { content: any; settings?: any }) {
  const images: ScrollImage[] = content?.images || [];
  const headline = content?.headline;
  const shapeMap: Record<string, string> = {
    full: 'rounded-full',
    '2xl': 'rounded-2xl',
    xl: 'rounded-xl',
    lg: 'rounded-lg',
    none: 'rounded-none',
    // legacy alias
    square: 'rounded-2xl',
  };
  const shape = shapeMap[settings?.shape] ?? 'rounded-full';
  const hideScrollbar = settings?.hideScrollbar !== false; // default true

  if (images.length === 0) return null;

  return (
    <div className="py-12 bg-transparent overflow-hidden">
      {headline && (
        <div className="px-6 md:px-12 mb-8 flex justify-between items-end">
          <h2 className="text-3xl font-serif text-charcoal">{headline}</h2>
        </div>
      )}
      
      <div className={`flex gap-6 overflow-x-auto px-6 md:px-12 pb-8 pt-4 snap-x ${hideScrollbar ? 'scrollbar-hide' : ''}`}>
        {images.map((img, idx) => (
          <Link 
            href={img.link || '#'} 
            key={idx} 
            className="snap-start shrink-0 group flex flex-col items-center gap-4"
          >
            <div className={`relative w-48 h-48 md:w-64 md:h-64 ${shape} overflow-hidden shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-xl`}>
              {img.image ? (
                <Image 
                  src={getAssetUrl(img.image)} 
                  alt={img.title || `Image ${idx + 1}`} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Image</div>
              )}
            </div>
            {img.title && (
              <span className="text-sm font-bold uppercase tracking-widest text-charcoal group-hover:text-wine transition-colors">
                {img.title}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
