"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import MagneticLink from "@/components/ui/MagneticLink";

import { getAssetUrl } from "@/lib/utils/assets";

export function QuantumMosaic({ content, style: externalStyle, settings }: { content: Record<string, any>, style?: any, settings?: any }) {
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);

  // Combine content.style with externalStyle
  const style = { ...(content.style || {}), ...(externalStyle || {}) };
  const bgColor = style.backgroundColor || "#ffffff";
  const textColor = style.textColor || "#000000";
  const height = style.height ? `${style.height}vh` : "100vh";
  const verticalAlign = style.verticalAlign || "items-center";

  // Fallback defaults
  const videoUrl = getAssetUrl(content.videoUrl); 
  const textureImage = getAssetUrl(content.textureImage || content.image);
  const marqueeText = content.marqueeText || "NEW ERA // SPRING COLLECTION //";
  const productPhoto = getAssetUrl(content.productPhoto || content.backgroundImage);
  
  // Implosion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.5, y: 100 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", damping: 20, stiffness: 100 }
    }
  };

  return (
    <section 
      style={{ backgroundColor: bgColor, color: textColor, minHeight: height }}
      className={`relative w-full flex ${verticalAlign} justify-center overflow-hidden py-24 px-6 md:px-12`}
    >
      {/* Overlay Support */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundColor: style.overlayColor || 'transparent',
          opacity: style.overlayOpacity || 0
        }} 
      />
      {/* Custom Cursor Outline logic can be complex in React without breaking a11y, 
          so we stick to CSS cursor changes on hover for standard panels, but we'll add a subtle global overlay if needed */}

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="w-full max-w-7xl mx-auto h-[80vh] grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-3 md:gap-4"
      >
        {/* Panel 1: Video Loop (Top Left Large) - span 2 cols, 2 rows */}
        <motion.div 
          layout
          variants={panelVariants}
          onMouseEnter={() => setHoveredPanel(1)}
          onMouseLeave={() => setHoveredPanel(null)}
          className={`relative overflow-hidden group bg-gray-100 rounded-3xl ${hoveredPanel === 1 ? 'md:col-span-3 md:row-span-2' : 'md:col-span-2 md:row-span-2'} transition-all duration-700 ease-in-out`}
          style={{ cursor: "crosshair" }}
        >
          <video 
            src={videoUrl} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-transparent transition-colors duration-500" />
        </motion.div>

        {/* Panel 2: Zoomed Texture (Right Top) */}
        <motion.div 
          layout
          variants={panelVariants}
          onMouseEnter={() => setHoveredPanel(2)}
          onMouseLeave={() => setHoveredPanel(null)}
          className={`relative overflow-hidden bg-gray-200 rounded-3xl ${hoveredPanel === 2 ? 'md:col-span-2' : 'md:col-span-1'} transition-all duration-700 ease-in-out`}
        >
          <motion.img 
            src={textureImage} 
            className="absolute inset-0 w-[200%] h-[200%] object-cover opacity-90"
            style={{ 
              top: "-50%", left: "-50%",
            }}
            animate={{
               y: ["0%", "-20%", "0%"],
               x: ["0%", "-10%", "0%"]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Panel 4: Editorial Photo (Right Middle) */}
        <motion.div 
          layout
          variants={panelVariants}
          onMouseEnter={() => setHoveredPanel(4)}
          onMouseLeave={() => setHoveredPanel(null)}
          className={`relative overflow-hidden bg-white rounded-3xl ${hoveredPanel === 4 ? 'md:col-span-2' : 'md:col-span-1'} transition-all duration-700 ease-in-out border border-gray-100`}
        >
           <Image 
             src={productPhoto} 
             alt="Editorial" 
             fill
             priority
             sizes="(max-width: 768px) 100vw, 33vw"
             className="object-cover group-hover:scale-110 transition-transform duration-700 origin-bottom" 
           />
        </motion.div>

        {/* Panel 3: Marquee Text (Bottom spanning) */}
        <motion.div 
          layout
          variants={panelVariants}
          onMouseEnter={() => setHoveredPanel(3)}
          onMouseLeave={() => setHoveredPanel(null)}
          className={`relative overflow-hidden bg-charcoal flex items-center rounded-3xl ${hoveredPanel === 3 ? 'md:col-span-3' : 'md:col-span-2'} transition-all duration-700 ease-in-out p-6`}
          style={{ backgroundColor: textColor, color: bgColor }}
        >
          <motion.div 
            className="whitespace-nowrap flex"
            animate={{ x: [0, -1000] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-4xl md:text-6xl font-sans font-black italic tracking-tighter mr-8">
                {marqueeText}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Panel 5: Core CTA (Bottom Right) */}
        <motion.div 
          layout
          variants={panelVariants}
          onMouseEnter={() => setHoveredPanel(5)}
          onMouseLeave={() => setHoveredPanel(null)}
          className={`relative overflow-hidden bg-wine rounded-3xl flex items-center justify-center ${hoveredPanel === 5 ? 'md:col-span-2 md:col-start-3 md:row-start-3' : 'md:col-span-2'} transition-all duration-700 ease-in-out group`}
          style={{ backgroundColor: 'var(--primary)' }}
        >
          <MagneticLink>
            <Link 
              href={content.primaryCta?.link || content.ctaLink || "/collections"}
              className="relative z-10 w-full h-full flex items-center justify-center p-8"
            >
               {/* Glitch text effect on hover */}
               <motion.span 
                 className="text-2xl md:text-4xl font-serif font-bold text-ivory mix-blend-difference"
                 whileHover={{ x: [-2, 2, -2, 0], opacity: [1, 0.8, 1] }}
                 transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
               >
                  {content.primaryCta?.text || content.ctaText || "Shop Now"}
               </motion.span>
               
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none transition-opacity duration-300" />
            </Link>
          </MagneticLink>
        </motion.div>

      </motion.div>
    </section>
  );
}
