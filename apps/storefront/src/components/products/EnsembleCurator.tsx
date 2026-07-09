"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, Plus, Check, Loader2, ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import { API_URL } from "@/lib/api";


interface EnsembleProduct {
  id: string;
  handle: string;
  title: string;
  type: string;
  stylistNote: string;
  images: { url: string }[];
  variants: { price: number }[];
}

interface EnsembleData {
  reasoning: string;
  ensemble: EnsembleProduct[];
}

export default function EnsembleCurator({ productId }: { productId: string }) {
  const [data, setData] = useState<EnsembleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingAll, setAddingAll] = useState(false);
  const { addItem, toggleDrawer } = useCart();

  useEffect(() => {
    async function fetchEnsemble() {
      try {
        const res = await fetch(`${API_URL}/api/v1/ai/ensemble/${productId}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load ensemble:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEnsemble();
  }, [productId]);

  const addEnsembleToCart = async () => {
    if (!data) return;
    setAddingAll(true);
    
    // Luxury choreographed sequence: 1.2s delay to mimic 'AI Curation'
    await new Promise(r => setTimeout(r, 1200));

    data.ensemble.forEach(p => {
      addItem({
        id: p.id,
        variantId: p.id,
        title: p.title,
        price: p.variants[0]?.price || 0,
        quantity: 1,
        image: p.images[0]?.url || "",
        handle: p.handle,
      });
    });

    setAddingAll(false);
    
    // Choreographed Handshake: Open drawer after items are added
    toggleDrawer(true);
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center text-theme-text/20">
      <Loader2 className="animate-spin text-primary mb-4" size={40} />
      <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Our AI Stylist is curating your ensemble...</p>
    </div>
  );

  if (!data || !data.ensemble || data.ensemble.length === 0) return null;

  return (
    <div className="space-y-12">
      <div className="bg-theme-surface border border-theme-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Sparkles size={120} className="text-primary rotate-12" />
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          
          {/* List of complementary items */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-serif text-theme-text">The Editorial Match</h3>
              <p className="text-sm text-theme-text-muted leading-relaxed max-w-xl italic">
                "{data.reasoning}"
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {data.ensemble.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative"
                >
                  <Link href={`/products/${product.handle}`} className="block aspect-[3/4] rounded-2xl overflow-hidden bg-theme-bg border border-theme-border shadow-sm">
                    <img 
                      src={product.images[0]?.url} 
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-theme-text/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-[10px] items-center gap-1 font-bold uppercase tracking-widest hidden group-hover:flex">
                        View Product <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                  
                  <div className="mt-4 space-y-1">
                    <p className="text-[9px] uppercase tracking-widest text-primary font-bold">{product.type}</p>
                    <h4 className="text-sm font-bold text-theme-text truncate">{product.title}</h4>
                    <p className="text-xs font-bold text-theme-text-muted">₹{product?.variants?.[0]?.price ? product.variants[0].price.toLocaleString() : "---"}</p>
                    
                    {/* Stylist Note */}
                    <div className="pt-2 flex gap-2 items-start">
                      <div className="p-1 bg-primary/10 text-primary rounded-md shrink-0">
                        <Info size={10} />
                      </div>
                      <p className="text-[10px] text-theme-text-muted italic leading-tight">{product.stylistNote}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Box */}
          <div className="lg:sticky lg:top-4 bg-theme-text text-theme-bg rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="space-y-2 text-center pb-4 border-b border-theme-bg/10">
              <Sparkles className="mx-auto text-primary" size={32} />
              <h4 className="text-lg font-serif">Buy the Ensemble</h4>
              <p className="text-[10px] uppercase font-bold tracking-widest text-theme-bg/40">3 Expert-Matched Items</p>
            </div>

            <div className="space-y-4">
              {data.ensemble.map(p => (
                <div key={p.id} className="flex justify-between items-center text-xs">
                  <span className="text-theme-bg/60 truncate pr-4">{p.title}</span>
                  <span className="font-bold">₹{p.variants?.[0]?.price ? p.variants[0].price.toLocaleString() : "0"}</span>
                </div>
              ))}
              <div className="pt-4 border-t border-theme-bg/10 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-serif">Bundle Total</span>
                  <span className="text-[9px] text-green-400 uppercase font-bold tracking-widest">Includes 5% Set Reward</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xl font-bold text-primary">
                    ₹{Math.floor(data.ensemble.reduce((acc, p) => acc + (p.variants[0]?.price || 0), 0) * 0.95).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-theme-bg/30 line-through">
                    ₹{data.ensemble.reduce((acc, p) => acc + (p.variants[0]?.price || 0), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={addEnsembleToCart}
              disabled={addingAll}
              className="w-full bg-primary text-white py-4 rounded-xl uppercase font-bold text-xs tracking-[0.2em] hover:bg-theme-bg hover:text-primary transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {addingAll ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Curation in Progress...</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add Look to Cart</span>
                </>
              )}
            </button>
            <p className="text-[9px] text-theme-bg/40 text-center uppercase tracking-widest">Complimentary Styling by AI Concierge</p>
          </div>

        </div>
      </div>
    </div>
  );
}
