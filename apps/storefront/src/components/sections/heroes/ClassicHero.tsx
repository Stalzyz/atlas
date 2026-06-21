"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck } from "lucide-react";
import MagneticLink from "@/components/ui/MagneticLink";

import { getAssetUrl } from "@/lib/utils/assets";

export function ClassicHero({ content, style: externalStyle, settings }: { content: Record<string, any>, style?: any, settings?: any }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // Combine content.style (legacy) with externalStyle (new)
  const style = { ...(content.style || {}), ...(externalStyle || {}) };
  const words = (content.headline || "Feel Comfortable. Look Effortless.").split(" ");

  const sectionStyle = {
    backgroundColor: style.backgroundColor || "var(--bg)",
    paddingTop: `${style.paddingTop || 0}px`,
    paddingBottom: `${style.paddingBottom || 0}px`,
    color: style.textColor || "var(--text-primary)",
    height: style.height ? `${style.height}vh` : "100vh",
  };

  const textAlignmentClass = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }[style.textAlign as string] || "text-center items-center";

  const verticalAlignClass = style.verticalAlign || "items-center";

  return (
    <section 
      ref={ref}
      style={sectionStyle}
      className={`relative w-full flex ${verticalAlignClass} justify-center overflow-hidden transition-all duration-500`}
    >
      <motion.div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${getAssetUrl(content.backgroundImage || content.image)}')`,
          y: backgroundY,
          scale: 1.1
        }}
      />
      
      {/* Dynamic Overlay */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          background: style.overlayColor || "rgba(0,0,0,0.4)",
          opacity: style.overlayOpacity !== undefined ? style.overlayOpacity : 0.4,
          backgroundBlendMode: "multiply"
        }} 
      />

      <motion.div 
        style={{ opacity }}
        className={`relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-12 flex flex-col ${textAlignmentClass}`}
      >
        {(content.urgencyTag || !content.id) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 border border-white/20 backdrop-blur-md px-6 py-2 rounded-full text-[10px] uppercase font-bold tracking-[0.3em]"
            style={{ borderColor: style.textColor ? `${style.textColor}20` : undefined, color: style.textColor }}
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            {content.urgencyTag || "New Collections Available"}
          </motion.div>
        )}

        <div className="space-y-6">
          <h1 
            className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tight"
            style={{ color: style.textColor }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.2 + (i * 0.1), 
                  duration: 1, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="text-lg md:text-xl font-sans text-white/80 max-w-2xl mx-auto font-light"
            style={{ color: style.textColor ? `${style.textColor}CC` : undefined }}
          >
            {content.subheadline || content.description || "Bespoke ethnic wear for the modern woman."}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          {(content.primaryCta?.text || content.ctaText) && (
            <MagneticLink>
              <Link 
                href={content.primaryCta?.link || content.ctaLink || "/collections"} 
                className="group relative bg-primary text-theme-bg px-12 py-5 text-xs font-bold uppercase tracking-[0.2em] overflow-hidden"
                style={{ borderRadius: style.buttonRadius }}
              >
                <span className="relative z-10">{content.primaryCta?.text || content.ctaText || "Shop Now"}</span>
                <motion.div 
                  className="absolute inset-0 bg-theme-bg text-theme-text translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                />
              </Link>
            </MagneticLink>
          )}
          
          {content.secondaryCta?.text && (
            <MagneticLink>
              <Link 
                href={content.secondaryCta?.link || "/collections/all"} 
                className="text-white/60 hover:text-white px-6 py-5 text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center gap-2"
                style={{ color: style.textColor ? `${style.textColor}99` : undefined }}
              >
                {content.secondaryCta.text} <ArrowRight size={14} />
              </Link>
            </MagneticLink>
          )}
        </motion.div>

        {/* Trust Line */}
        {(content.trustLine || !content.id) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="pt-6 flex flex-col items-center gap-2"
          >
            <div className="flex items-center gap-1 text-primary">
              {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
            </div>
            <p 
              className="text-xs text-white/70 font-sans tracking-wide flex items-center gap-1.5"
              style={{ color: style.textColor ? `${style.textColor}B3` : undefined }}
            >
              <ShieldCheck size={14} />
              {content.trustLine || "Trusted by 5,000+ women across India"}
            </p>
          </motion.div>
        )}

      </motion.div>
    </section>
  );
}
