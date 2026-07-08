"use client";

import { motion } from "framer-motion";

import { getAssetUrl } from "@/lib/utils/assets";

const InstagramIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export function SocialProofSection({ content, style: sectionStyle }: { content: Record<string, any>, style?: any }) {
  const defaultItems = [
    { image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", name: "Ananya S.", city: "Mumbai" },
    { image: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=800&auto=format&fit=crop", name: "Kritika D.", city: "Delhi" },
    { image: "https://images.unsplash.com/photo-1608226068884-bbdddef12f17?q=80&w=800&auto=format&fit=crop", name: "Meera R.", city: "Hyderabad" },
    { image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", name: "Sneha P.", city: "Ahmedabad" },
    { image: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=800&auto=format&fit=crop", name: "Divya K.", city: "Bangalore" },
  ];

  const items = (content.items?.length > 0 ? content.items : defaultItems).map((item: any) => {
    const name = item.name && String(item.name).toLowerCase() !== "undefined" && String(item.name).toLowerCase() !== "null" 
      ? item.name 
      : "Atlas Client";
    const city = item.city && String(item.city).toLowerCase() !== "undefined" && String(item.city).toLowerCase() !== "null" 
      ? item.city 
      : "India";
      
    return {
      ...item,
      image: getAssetUrl(item.image),
      name,
      city
    };
  });

  return (
    <section className="w-full py-20 md:py-28 px-6 md:px-12 bg-theme-bg">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-primary" />
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60">
                Community
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-theme-text leading-tight">
              {content.headline || "Styled by Real Women"}
            </h2>
          </div>
          <p className="text-sm font-sans text-theme-text-muted max-w-xs leading-relaxed md:text-right">
            {content.subtext || "Tag @atlas_clothing to be featured in our monthly style edit."}
          </p>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className={`group relative overflow-hidden bg-primary/5 ${
                i === 0 || i === 3 ? "md:row-span-2 aspect-[3/5]" : "aspect-square"
              }`}
            >
              <img
                src={item.image}
                alt={`Styled by ${item.name}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />

              {/* Instagram Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                <InstagramIcon
                  size={24}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                />
              </div>

              {/* Name tag */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white text-[11px] font-bold uppercase tracking-widest">{item.name}</p>
                <p className="text-white/60 text-[9px] tracking-widest uppercase">{item.city}</p>
                {item.comment && (
                  <p className="text-white/80 text-[10px] italic mt-2 line-clamp-2 leading-tight">"{item.comment}"</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram Handle */}
        <div className="text-center">
          <a
            href="https://instagram.com/atlas_clothing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-theme-text-muted hover:text-primary transition-colors duration-300 border-b border-theme-border hover:border-primary pb-1"
          >
            <InstagramIcon size={12} />
            {content.handleText || "@atlas_clothing"}
          </a>
        </div>
      </div>
    </section>
  );
}
