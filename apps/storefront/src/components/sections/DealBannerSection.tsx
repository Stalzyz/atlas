"use client";

import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";

export function DealBannerSection({ content }: { content: Record<string, any> }) {
  const style = content.style || {};
  
  const sectionStyle = {
    backgroundColor: style.backgroundColor || "var(--primary)", 
    paddingTop: `${style.paddingTop || 16}px`, 
    paddingBottom: `${style.paddingBottom || 16}px`,
  };

  const textColor = style.textColor || "var(--theme-bg)";

  return (
    <section 
      style={sectionStyle} 
      className="w-full relative overflow-hidden transition-all duration-500"
    >
      {/* Texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" 
      />
      
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left px-6">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
            style={{ backgroundColor: `${textColor}1A`, color: textColor }}
          >
            <Tag size={18} />
          </div>
          <div className="flex flex-col">
            <h3 
              className="font-serif text-xl sm:text-2xl transition-colors duration-500"
              style={{ color: textColor }}
            >
              {content.headline || "Everyday Essentials – Starting ₹599"}
            </h3>
            <p 
              className="text-xs font-sans tracking-widest uppercase mt-0.5 transition-colors duration-500"
              style={{ color: `${textColor}B3` }}
            >
              {content.subtext || "Only for Today: Flat ₹100 Off"}
            </p>
          </div>
        </div>
        
        <Link 
          href={content.ctaLink || "/collections/sale"}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all duration-300 bg-theme-bg text-primary hover:opacity-90"
          style={{ 
            borderRadius: style.buttonRadius || "0px"
          }}
        >
          {content.ctaText || "Claim Offer"} <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
