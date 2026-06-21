"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Hotspot {
  x: number; // percentage from left
  y: number; // percentage from top
  productId: string;
  productName: string;
  price: number;
  handle: string;
}

import { useCart } from "@/context/CartContext";
import { Check } from "lucide-react";

interface LookbookScene {
  image: string;
  title: string;
  description?: string;
  hotspots: Array<{
    x: number;
    y: number;
    productId: string;
    productName: string;
    price: number;
    handle: string;
    image: string;
  }>;
}

interface LookbookSectionProps {
  scenes: LookbookScene[];
}

export default function LookbookSection({ scenes }: LookbookSectionProps) {
  const [activeHotspot, setActiveHotspot] = useState<any | null>(null);
  const [showToast, setShowToast] = useState(false);
  const { addItem } = useCart();

  const handleAddToBag = (spot: any) => {
    addItem({
      id: spot.productId,
      variantId: spot.productId, // Mock variant id
      title: spot.productName,
      price: spot.price,
      quantity: 1,
      image: spot.image,
      handle: spot.handle,
    });
    
    setActiveHotspot(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative h-[90vh] md:h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-charcoal text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-ivory/10"
          >
            <div className="bg-green-500 rounded-full p-1"><Check size={12} /></div>
            <span className="text-xs font-bold uppercase tracking-widest">Added to Bag</span>
          </motion.div>
        )}
      </AnimatePresence>

      {scenes.map((scene, sceneIdx) => (
        <section 
          key={sceneIdx} 
          className="relative h-full w-full snap-start overflow-hidden group"
        >
          {/* Background Cinematic Image */}
          <img
            src={scene.image}
            alt={scene.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-80 transition-transform duration-[4000ms] ease-out group-hover:scale-110"
          />

          {/* Title & Editorial Overlay */}
          <div className="absolute top-12 left-6 md:top-32 md:left-20 max-w-xl z-10 pointer-events-none">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-[10px] uppercase font-bold tracking-[0.4em] text-ivory/60 mb-6 block"
            >
              Editorial Story {sceneIdx + 1}/{scenes.length}
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-serif text-ivory leading-tight"
            >
              {scene.title}
            </motion.h2>
            {scene.description && (
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-ivory/70 mt-8 font-sans text-base md:text-xl leading-relaxed max-w-md italic"
              >
                {scene.description}
              </motion.p>
            )}
          </div>

          {/* Interactive Hotspots */}
          {scene.hotspots.map((spot, index) => (
            <div 
              key={index}
              className="absolute z-20"
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            >
              <button
                onClick={() => setActiveHotspot(activeHotspot?.productId === spot.productId ? null : spot)}
                className="group/spot relative flex items-center justify-center w-4 h-4 md:w-6 md:h-6"
              >
                <span className="absolute inset-0 rounded-full border border-ivory/30 animate-ping opacity-75" />
                <span className="relative w-2 h-2 md:w-3 md:h-3 bg-ivory rounded-full shadow-lg transition-transform group-hover/spot:scale-150" />
                
                <AnimatePresence>
                  {activeHotspot?.productId === spot.productId && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-56 md:w-72 bg-white/95 backdrop-blur-xl p-5 shadow-2xl rounded-2xl pointer-events-auto border border-charcoal/5"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-charcoal/5">
                           <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-charcoal/40">The Look</p>
                           <button onClick={() => setActiveHotspot(null)} className="text-charcoal/30 hover:text-charcoal transition-colors">
                             <X size={16} />
                           </button>
                        </div>
                        <div className="flex gap-4 items-center">
                           <div className="w-16 h-20 bg-beige rounded-md overflow-hidden shrink-0">
                              <img src={spot.image} className="w-full h-full object-cover" />
                           </div>
                           <div className="space-y-1">
                             <h4 className="text-sm font-bold text-charcoal font-serif leading-tight">{spot.productName}</h4>
                             <p className="text-wine text-xs font-bold font-sans">₹{spot.price.toLocaleString()}</p>
                           </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                           <Link 
                            href={`/products/${spot.handle}`}
                            className="flex-1 border border-charcoal/10 text-[9px] text-charcoal py-3 text-center uppercase font-bold tracking-widest hover:bg-beige transition-colors"
                           >
                             View Piece
                           </Link>
                           <button 
                            onClick={(e) => { e.stopPropagation(); handleAddToBag(spot); }}
                            className="flex-[2] bg-charcoal text-[9px] text-white py-3 uppercase font-bold tracking-[0.2em] hover:bg-wine transition-all flex items-center justify-center gap-2"
                           >
                              Add to Bag
                              <ShoppingBag size={12} />
                           </button>
                        </div>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white/95" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          ))}

          {/* Progress Indicator */}
          <div className="absolute bottom-12 left-6 md:left-20 z-10 flex gap-2">
             {scenes.map((_, i) => (
               <div 
                key={i} 
                className={`h-1 transition-all duration-500 ${i === sceneIdx ? 'w-12 bg-ivory' : 'w-4 bg-ivory/20'}`} 
               />
             ))}
          </div>
        </section>
      ))}
    </div>
  );
}
