"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { getAssetUrl } from "@/lib/utils/assets";

export function FeaturedCollectionSection({ content, style }: { content: any, style?: any }) {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCollections() {
      try {
        const res = await fetch(`${API_URL}/api/v1/products/collections`);
        if (res.ok) {
          const data = await res.json();
          // CMS may save collections as objects {handle, title} or plain strings — normalise both
          const rawHandles: string[] = (content.collections || []).map((c: any) =>
            typeof c === 'string' ? c : c?.handle
          ).filter(Boolean);
          const filtered = rawHandles.length > 0
            ? data.filter((c: any) => rawHandles.includes(c.handle))
            : data.slice(0, 3);
          
          setCollections(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch featured collections:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, [content.collections]);

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className={`mb-16 flex flex-col gap-6 ${style?.textAlign === 'center' ? 'items-center text-center' : style?.textAlign === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
        <div className="inline-flex items-center gap-4">
          <div className="h-[1px] w-8 bg-primary/30" />
          <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] text-primary">The Curation</span>
          <div className="h-[1px] w-8 bg-primary/30" />
        </div>
        <h2 className="text-4xl md:text-6xl font-serif leading-none text-theme-text">
          {content.title || "The Editorial Selection"}
        </h2>
        {content.description && (
          <p className="max-w-xl text-lg text-theme-text-muted font-sans italic">
            {content.description}
          </p>
        )}
      </div>

      {/* Collection Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading ? (
           [1,2,3].map(i => (
             <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
           ))
        ) : collections.map((col, idx) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.7 }}
            className="group"
          >
            <Link 
              href={`/collections/${col.handle}`} 
              className="block relative overflow-hidden bg-primary/5 aspect-[3/4] rounded-2xl"
            >
              <img
                src={getAssetUrl(col.image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1000")}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 pt-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 mb-2">
                  {col.description || "Designer Ensembles"}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-2">
                  {col.title}
                </h3>
                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  <div className="h-px flex-1 bg-white/30" />
                  <span className="text-[10px] uppercase font-bold text-white tracking-widest">Discover</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
