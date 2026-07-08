"use client";

import { motion } from "framer-motion";
import { getAssetUrl } from "@/lib/utils/assets";

export function BrandStorySection({ content, style }: { content: any, style?: any }) {
  const textAlign = style?.textAlign || "left";

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${textAlign === 'right' ? 'lg:flex-row-reverse' : ''}`}>
        
        {/* Left: Premium Image with Asymmetrical Border */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full lg:w-1/2 relative group"
        >
          <div className="absolute -inset-4 border border-theme-border rounded-[4rem] group-hover:-inset-6 transition-all duration-700" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-primary/5 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]">
            <img 
              src={getAssetUrl(content.image)} 
              alt={content.headline || "Our Story"}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          
          {/* Circular Badge Accent */}
          <div className="absolute -bottom-8 -left-8 lg:-left-12 aspect-square w-32 bg-theme-surface rounded-full shadow-xl flex items-center justify-center p-6 z-20">
             <div className="text-center font-serif text-primary">
                <span className="block text-2xl font-bold leading-none">Est.</span>
                <span className="block text-lg leading-tight mt-1">2024</span>
             </div>
          </div>
        </motion.div>
 
        {/* Right: Editorial Narrative */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`w-full lg:w-1/2 space-y-10 ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}`}
        >
          <div className={`space-y-4 ${textAlign === 'center' ? 'flex flex-col items-center' : textAlign === 'right' ? 'flex flex-col items-end' : ''}`}>
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-primary opacity-60">The Luxury</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-none tracking-tighter text-theme-text">
              {content.headline || "Founded by Two Sisters"}
            </h2>
          </div>

          <div className="relative">
            <div className={`absolute -left-6 top-0 bottom-0 w-1 bg-primary/10 ${textAlign !== 'left' ? 'hidden' : ''}`} />
            <p className="text-xl md:text-2xl font-sans leading-relaxed text-theme-text-muted italic font-light">
              {content.body || "Atlas began with a shared passion to weave the luxury of Indian craftsmanship into the modern age. Every stitch carries the legacy of traditional artisans, carefully curated and designed for the contemporary connoisseur of fine ethnic wear."}
            </p>
          </div>
          
          {content.signatureText && (
            <div className="pt-8 border-t border-theme-border flex items-center gap-6">
               <div className="h-px flex-1 bg-primary/5" />
               <p className="font-serif italic text-3xl text-primary font-light opacity-40">
                {content.signatureText}
               </p>
               <div className="h-px flex-1 bg-primary/5" />
            </div>
          )}
        </motion.div>
 
      </div>
    </div>
  );
}
