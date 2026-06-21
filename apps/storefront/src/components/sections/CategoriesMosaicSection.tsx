"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface Category {
  title: string;
  image: string;
  href: string;
}

export function CategoriesMosaicSection({ content }: { content: any }) {
  const style = content.style || {};
  const categories: Category[] = content.categories || [
    { title: "Kalamkari", image: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=2134&auto=format&fit=crop", href: "/collections/kalamkari" },
    { title: "Premium Wear", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1983&auto=format&fit=crop", href: "/collections/premium-wear" },
    { title: "Salwar Sets", image: "https://images.unsplash.com/photo-1608226068884-bbdddef12f17?q=80&w=2603&auto=format&fit=crop", href: "/collections/salwar-sets" },
    { title: "Tunics", image: "https://images.unsplash.com/photo-1596455607563-ad6193f76b11?q=80&w=2574&auto=format&fit=crop", href: "/collections/tunics" },
  ];

  const gridLayouts = [
    "col-span-2 row-span-2", // Large
    "col-span-1 row-span-1",
    "col-span-1 row-span-1",
    "col-span-2 row-span-1"
  ];

  const sectionStyle = {
    backgroundColor: style.backgroundColor || "var(--bg)", 
    paddingTop: `${style.paddingTop || 96}px`, 
    paddingBottom: `${style.paddingBottom || 96}px`,
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
      className="w-full px-4 transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {content.headline && (
          <div className={`flex flex-col space-y-4 ${textAlignmentClass}`}>
            <h2 
              className="text-4xl md:text-5xl font-serif transition-colors duration-500"
              style={{ color: textColor }}
            >
              {content.headline}
            </h2>
            {content.subheadline && (
              <p 
                className="font-sans transition-colors duration-500"
                style={{ color: `${textColor}99` }}
              >
                {content.subheadline}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[250px] gap-4">
          {categories.slice(0, 4).map((cat: any, i) => (
            <Link 
              href={cat.href || `/collections/${cat.handle}`} 
              key={cat.title || cat.label || i}
              className={`relative group overflow-hidden transition-all duration-500 ${gridLayouts[i] || "col-span-1"}`}
              style={{ borderRadius: style.buttonRadius || "0px" }}
            >
              <motion.div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-60 transition-all duration-500" 
                style={{ backgroundColor: accentColor }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 backdrop-blur-[2px]">
                <h3 className="text-2xl font-serif text-white mb-4">{cat.title || cat.label}</h3>
                <span 
                   className="text-[10px] uppercase tracking-[0.2em] font-bold text-white border-b border-white/40 pb-1"
                >
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
