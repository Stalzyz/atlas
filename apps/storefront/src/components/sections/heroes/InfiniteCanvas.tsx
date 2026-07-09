"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import MagneticLink from "@/components/ui/MagneticLink";

import { getAssetUrl } from "@/lib/utils/assets";

export function InfiniteCanvas({ content, style: externalStyle, settings }: { content: Record<string, any>, style?: any, settings?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Combine style
  const style = { ...(content.style || {}), ...(externalStyle || {}) };
  const bgColorStart = style.backgroundColor || "#FDFBF7";
  const bgColorEnd = style.bgColorEnd || "#1A362D";
  const height = style.height ? `${style.height}vh` : "150vh";
  const verticalAlign = style.verticalAlign || "items-center";

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.8],
    [bgColorStart, bgColorEnd]
  );
  
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.4],
    [style.textColor || "#111111", "#FDFBF7"]
  );

  // Parallax Values
  const yTextFast = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  const yModelSlow = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const xTextureDrift = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const yButtonFloat = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);
  const rotateWireframe = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const yWireframe = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  // Content fallbacks
  const headline = content.headline || "THE ART OF DRESSING.";
  const cutoutImage = getAssetUrl(content.image || content.backgroundImage || content.cutoutImage);
  const ctaText = content.primaryCta?.text || content.ctaText || "Discover";
  const ctaLink = content.primaryCta?.link || content.ctaLink || "/collections";

  return (
    <motion.section 
      ref={containerRef}
      style={{ backgroundColor, color: textColor, minHeight: height }}
      className="relative w-full overflow-hidden" 
    >
      {/* Overlay Support */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundColor: style.overlayColor || 'transparent',
          opacity: style.overlayOpacity || 0
        }} 
      />
      {/* 1. Drifting Background Texture (e.g. woven fabric lines or massive typography) */}
      <motion.div 
        style={{ x: xTextureDrift }}
        className="absolute inset-0 pointer-events-none opacity-5 w-[200vw]"
      >
         <svg width="100%" height="100%">
           <pattern id="diagonalHatch" width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
             <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="2" />
           </pattern>
           <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
         </svg>
      </motion.div>

      <div className="absolute inset-0 h-screen sticky top-0 flex flex-col md:flex-row items-center justify-center p-6 md:p-12">
        
        {/* 2. Floating Wireframe (Abstract Shape) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0, rotate: -90 }}
          animate={{ opacity: 0.15, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, delay: 0.2, type: "spring" }}
          style={{ y: yWireframe, rotate: rotateWireframe }}
          className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border border-current mix-blend-difference pointer-events-none"
        >
          {/* Inner rings */}
          <div className="absolute inset-4 rounded-full border border-current opacity-50" />
          <div className="absolute inset-12 rounded-full border border-current opacity-25" />
        </motion.div>

        {/* 3. Fast Parallax Headline */}
        <motion.div 
          style={{ y: yTextFast }}
          className="absolute left-6 md:left-24 top-24 md:top-32 z-10 max-w-sm md:max-w-xl"
        >
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="text-6xl md:text-9xl font-serif font-black uppercase leading-[0.8] tracking-tighter mix-blend-difference text-white"
          >
            {headline}
          </motion.h1>
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 1.2 }}
             className="mt-6 text-sm font-sans uppercase tracking-[0.2em] font-bold mix-blend-difference text-white/70"
          >
             {content.subheadline || "A new perspective on luxury"}
          </motion.p>
        </motion.div>

        {/* 4. Slow Parallax Cutout Image */}
        <motion.div 
          style={{ y: yModelSlow }}
          className="absolute right-0 md:right-32 bottom-0 w-[80vw] md:w-[40vw] h-[70vh] md:h-[85vh] origin-bottom group cursor-grab"
        >
          <motion.img 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            src={cutoutImage} 
            alt="Model Cutout"
            className="w-full h-full object-cover object-bottom Mix-blend-luminosity filter transition-transform duration-1000 group-hover:scale-105 group-hover:rotate-1"
            style={{ 
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
            }}
          />
        </motion.div>

        {/* 5. Floating CTA Button */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5, type: "spring" }}
          style={{ y: yButtonFloat }}
          className="absolute right-12 md:right-[45vw] top-1/2 md:top-2/3 z-20"
        >
          <MagneticLink>
            <Link 
              href={ctaLink}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-current flex items-center justify-center text-xs font-bold uppercase tracking-[0.2em] relative overflow-hidden group bg-transparent backdrop-blur-sm"
            >
               <span className="relative z-10 transition-colors duration-500 group-hover:text-white">{ctaText}</span>
               {/* Fluid fill on hover */}
               <motion.div 
                 className="absolute bottom-0 w-full h-[0%] bg-current group-hover:h-[100%] transition-all duration-500 ease-out"
               />
               <motion.div 
                 className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-500 mix-blend-overlay"
               />
            </Link>
          </MagneticLink>
        </motion.div>

      </div>
    </motion.section>
  );
}
