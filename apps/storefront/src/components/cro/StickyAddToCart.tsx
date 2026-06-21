"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function StickyAddToCart({ product, isVisible }: { product: any, isVisible: boolean }) {
  const { addItem, toggleDrawer } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky bar only if main CTA is NOT in view
        setShouldShow(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const mainCta = document.getElementById('main-cta');
    if (mainCta) {
      observer.observe(mainCta);
    }

    return () => {
      if (mainCta) observer.unobserve(mainCta);
    };
  }, []);

  const handleAdd = async () => {
    setIsAdding(true);
    // Mimic premium processing
    await new Promise(r => setTimeout(r, 600));
    
    addItem({
      id: product.variantId || product.id,
      variantId: product.variantId || product.id,
      title: product.name,
      price: typeof product.price === 'number' ? product.price : parseInt(String(product.price).replace(/[^0-9]/g, "")) || 0,
      quantity: 1,
      image: product.image,
      handle: product.handle || "",
    });

    setIsAdding(false);
    toggleDrawer(true);
  };

  return (
    <AnimatePresence>
      {(isVisible && shouldShow) && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-24 md:bottom-12 left-4 right-4 md:left-auto md:right-12 md:w-[450px] z-[100] bg-theme-surface/95 backdrop-blur-2xl border border-theme-border/50 p-4 flex items-center gap-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[2rem]"
        >
          <div className="flex-shrink-0 w-16 h-20 bg-theme-bg rounded-xl overflow-hidden hidden md:block">
             <img src={product.image} className="w-full h-full object-cover" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[9px] uppercase font-bold tracking-[0.3em] text-wine mb-1">In your sights</p>
            <p className="text-sm font-serif text-theme-text truncate leading-tight">{product?.name || "Product Name"}</p>
            <p className="text-xs font-mono text-theme-text-muted mt-1">{product?.price || "₹8,990"}</p>
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={isAdding || product.isOutOfStock}
            className={`shrink-0 px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50 transition-all relative overflow-hidden ${
              product.isOutOfStock ? "bg-zinc-200 text-zinc-400" : "bg-wine text-ivory"
            }`}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <Loader2 className="animate-spin" size={14} />
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <ShoppingBag size={14} /> 
                  <span>{product.isOutOfStock ? "Sold Out" : "Bag it"}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
