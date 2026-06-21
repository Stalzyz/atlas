"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CategoryStripSection({ content, style }: { content: Record<string, any>, style?: any }) {
  const defaultCategories = [
    { label: "Kurtis", link: "/collections/kurtis", image: "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=600&auto=format&fit=crop" },
    { label: "Sets", link: "/collections/sets", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop" },
    { label: "Under ₹999", link: "/collections/under-999", image: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=600&auto=format&fit=crop" },
    { label: "Best Sellers", link: "/collections/best-sellers", image: "https://images.unsplash.com/photo-1608226068884-bbdddef12f17?q=80&w=600&auto=format&fit=crop" },
    { label: "New Arrivals", link: "/collections/new-arrivals", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop" },
  ];

  const categories = content.categories || defaultCategories;

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex gap-10 md:gap-16 overflow-x-auto py-8 scrollbar-hide snap-x md:snap-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((cat: any, i: number) => (
          <Link 
            key={i} 
            href={cat.link || cat.url || (cat.handle ? `/collections/${cat.handle}` : "#")}
            className="flex-none group flex flex-col items-center gap-6 snap-center"
          >
            <div 
              className="w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden relative shadow-2xl group-hover:shadow-primary/30 transition-all duration-700 ring-1 ring-primary/5 group-hover:ring-primary/20"
            >
              <motion.div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{ backgroundImage: `url('${cat.image}')` }}
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-primary opacity-40 group-hover:opacity-100 transition-all duration-500">
                Shop
              </span>
              <h4 className="text-base md:text-lg font-serif tracking-tighter text-theme-text group-hover:text-primary transition-colors duration-500">
                {cat.label}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
