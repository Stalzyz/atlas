"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { getAssetUrl } from "@/lib/utils/assets";

export function BannerSection({ content }: { content: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax calculations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scaleBg = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  
  // Stagger Text Animations
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };
  
  const itemVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] lg:h-[110vh] overflow-hidden flex items-center justify-center">
      {/* Background Parallax Layer */}
      <motion.div 
        style={{ y: yBg, scale: scaleBg }}
        className="absolute inset-0 w-full h-full"
      >
        {content.image ? (
          <img 
            src={getAssetUrl(content.image)} 
            alt={content.headline || "Banner"} 
            className="w-full h-full object-cover object-center" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
        )}
      </motion.div>

      {/* Dramatic Vignette / Overlay Layer */}
      {content.overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
      )}
      {!content.overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-theme-bg/90" />
      )}

      {/* Main Content Box (Glassmorphic) */}
      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 lg:px-10 max-w-4xl pt-20"
      >
        {/* Floating Pre-heading badge */}
        <motion.div 
          variants={itemVars}
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] backdrop-saturate-150 text-[10px] uppercase font-bold tracking-[0.3em] text-white/90"
        >
          {content.pretext || "Luxury Collection"}
        </motion.div>

        {content.headline && (
          <motion.h1 
            variants={itemVars}
            className={`text-5xl md:text-7xl lg:text-8xl font-serif leading-[1.1] ${content.overlay ? "text-white" : "text-theme-text"} drop-shadow-2xl`}
          >
            {content.headline}
          </motion.h1>
        )}
        
        {content.subtext && (
          <motion.p 
            variants={itemVars}
            className={`mt-8 text-base md:text-lg font-sans tracking-wide max-w-2xl font-light leading-relaxed ${content.overlay ? "text-white/80" : "text-theme-text-muted"} drop-shadow-md`}
          >
            {content.subtext}
          </motion.p>
        )}
        
        {content.cta && (
          <motion.div variants={itemVars} className="mt-12">
            <Link
              href={content.cta.link || "#"}
              className={`relative overflow-hidden inline-flex items-center justify-center gap-3 px-12 py-5 text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-500 group rounded-xl ${
                content.overlay
                  ? "bg-white/10 border border-white/30 text-white hover:bg-white hover:text-charcoal backdrop-blur-lg shadow-2xl"
                  : "bg-theme-text text-theme-bg hover:bg-primary hover:text-white shadow-xl"
              }`}
            >
              <span className="relative z-10">{content.cta.text}</span>
              <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </motion.div>

      {/* Floating Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Discover</span>
        <ChevronDown size={14} />
      </motion.div>

      {/* Floating Fabrics / Aesthetic Assets */}
      {content.fabrics && content.fabrics.map((fabric: any, i: number) => (
        <motion.img 
          key={`fabric-${i}`}
          src={fabric.url || "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=200&auto=format&fit=crop"} // Default texture if none provided
          className="absolute z-0 mix-blend-multiply opacity-30 rounded-full blur-xl sepia"
          style={{
            top: `${fabric.y}%`,
            left: `${fabric.x}%`,
            scale: fabric.scale || 1,
            opacity: fabric.opacity || 0.1,
          }}
          animate={{
            y: [0, (fabric.speed || 1) * -30, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 15 / (fabric.speed || 1), repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* Floating UI Elements */}
      {content.uiElements && content.uiElements.map((el: any, i: number) => (
        <motion.div
           key={`ui-${i}`}
           className="absolute z-20 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl"
           style={{
            top: `${el.y}%`,
            left: `${el.x}%`,
            scale: el.size || 1,
            opacity: el.opacity || 0.8,
           }}
           animate={{ y: [0, -20, 0] }}
           transition={{ duration: 5 * (el.speed || 1), repeat: Infinity, ease: "easeInOut" }}
        >
           {/* Fallback rendering of requested icon sets */}
           <div className="w-8 h-8 rounded-full border border-white/30 bg-white/20" />
        </motion.div>
      ))}
    </section>
  );
}
