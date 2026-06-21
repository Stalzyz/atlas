"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

export function Lightbox({ isOpen, onClose, images, initialIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen, initialIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setScale(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setScale(1);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      >
        {/* Header Actions */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
           <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                {currentIndex + 1} / {images.length}
              </span>
           </div>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setScale(prev => Math.min(prev + 0.5, 3))}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/60 transition-all border border-white/10"
              >
                <ZoomIn size={18} />
              </button>
              <button 
                onClick={() => setScale(1)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/60 transition-all border border-white/10"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={onClose}
                className="p-3 bg-white/10 hover:bg-white text-charcoal rounded-full transition-all shadow-xl"
              >
                <X size={20} />
              </button>
           </div>
        </div>

        {/* Navigation */}
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-6 z-50 p-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all border border-white/5"
            >
              <ChevronLeft size={32} strokeWidth={1} />
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-6 z-50 p-4 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white rounded-full transition-all border border-white/5"
            >
              <ChevronRight size={32} strokeWidth={1} />
            </button>
          </>
        )}

        {/* Main Canvas */}
        <div className="relative w-full h-full flex items-center justify-center p-12 overflow-hidden">
           <motion.img
             key={currentIndex}
             src={images[currentIndex]}
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: scale }}
             exit={{ opacity: 0, scale: 1.1 }}
             transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
             className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
             style={{ cursor: scale > 1 ? 'grab' : 'default' }}
           />
        </div>

        {/* Thumbnails Strip */}
        <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center gap-3 bg-gradient-to-t from-black/60 to-transparent">
           {images.map((img, idx) => (
             <button
               key={idx}
               onClick={() => setCurrentIndex(idx)}
               className={`w-12 h-16 rounded overflow-hidden border-2 transition-all ${idx === currentIndex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
             >
                <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
             </button>
           ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
