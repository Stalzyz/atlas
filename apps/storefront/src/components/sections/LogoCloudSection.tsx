import React from 'react';
import Image from 'next/image';
import { getAssetUrl } from '@/lib/utils/assets';

interface Logo {
  image: string;
  alt: string;
}

export function LogoCloudSection({ content, settings }: { content: any; settings?: any }) {
  const logos: Logo[] = content?.logos || [];
  const headline = content?.headline || "Featured In";
  const grayscale = settings?.grayscale !== false; // Default true

  if (logos.length === 0) return null;

  return (
    <div className="py-12 overflow-hidden bg-transparent">
      {headline && (
        <h3 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
          {headline}
        </h3>
      )}
      <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap px-4 max-w-7xl mx-auto">
        {logos.map((logo, idx) => (
          <div key={idx} className={`relative h-12 w-32 ${grayscale ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100' : ''} transition-all duration-300`}>
            {logo.image ? (
              <Image 
                src={getAssetUrl(logo.image)} 
                alt={logo.alt || `Logo ${idx + 1}`} 
                fill 
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 rounded">Logo</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
