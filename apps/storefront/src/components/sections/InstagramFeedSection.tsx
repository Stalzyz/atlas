"use client";

import { motion } from "framer-motion";

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export function InstagramFeedSection({ content }: { content: any }) {
  const style = content.style || {};
  const defaultImages = [
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1608226068884-bbdddef12f17?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596455607563-ad6193f76b11?q=80&w=800&auto=format&fit=crop",
  ];

  const images = content.images || defaultImages;
  const instagramId = content.instagramId || "atlas_clothing";
  const handleUrl = `https://www.instagram.com/${instagramId}`;
  const handleText = content.handleText || `@${instagramId}`;

  const sectionStyle = {
    backgroundColor: style.backgroundColor || "var(--bg)", 
    paddingTop: `${style.paddingTop || 64}px`, 
    paddingBottom: `${style.paddingBottom || 0}px`,
  };

  const textColor = style.textColor || "var(--text-primary)";
  const accentColor = style.textColor ? `${style.textColor}` : "var(--primary)";

  const textAlignmentClass = {
    left: "text-left items-start mx-0",
    center: "text-center items-center mx-auto",
    right: "text-right items-end mx-0 ml-auto",
  }[style.textAlign as string] || "text-center items-center mx-auto";

  return (
    <section 
      style={sectionStyle} 
      className="w-full overflow-hidden transition-all duration-500"
    >
      <div className={`flex flex-col space-y-4 mb-12 px-6 ${textAlignmentClass}`}>
        <h2 
          className="text-3xl font-serif transition-colors duration-500"
          style={{ color: textColor }}
        >
          {content.headline || "Atlas on Instagram"}
        </h2>
        <a 
          href={handleUrl} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-2 font-sans transition-all duration-300 hover:opacity-70"
          style={{ color: accentColor }}
        >
          <InstagramIcon size={18} />
          {handleText}
        </a>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
        {images.slice(0, 5).map((img: string, i: number) => (
          <a
            href={handleUrl}
            target="_blank"
            rel="noreferrer"
            key={i} 
            className="group relative aspect-square overflow-hidden bg-charcoal"
          >
            <motion.div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              style={{ backgroundImage: `url('${img}')` }}
            />
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]"
              style={{ backgroundColor: `${accentColor}99` }}
            >
              <InstagramIcon size={32} className="text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
