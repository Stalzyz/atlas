"use client";

import React from 'react';
import { getAssetUrl } from '@/lib/utils/assets';

interface TextBlockSectionProps {
  content: {
    headline?: string;
    body?: string;
    alignment?: 'left' | 'center' | 'right';
    image?: string;
  };
}

export function TextBlockSection({ content }: TextBlockSectionProps) {
  const alignment = content.alignment || 'center';
  const textAlignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[alignment];

  return (
    <div className="max-w-5xl mx-auto px-4 py-20">
      <div className={`flex flex-col ${textAlignClass} gap-8`}>
        {content.image && (
          <div className="w-full max-w-md mx-auto mb-4 overflow-hidden rounded-3xl shadow-xl">
             <img 
               src={getAssetUrl(content.image)} 
               alt={content.headline || "Illustration"} 
               className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
             />
          </div>
        )}
        
        <div className="max-w-2xl space-y-6">
          {content.headline && (
            <h2 className="text-4xl md:text-5xl font-serif text-theme-text leading-tight">
              {content.headline}
            </h2>
          )}
          
          {content.body && (
            <div 
              className="text-lg text-theme-text-muted leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: content.body.replace(/\n/g, '<br/>') }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
