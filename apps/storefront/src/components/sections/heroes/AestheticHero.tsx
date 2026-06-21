"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import * as EthnicIcons from "@/components/ui/EthnicIcons";
import Link from "next/link";
import Image from "next/image";
import { getAssetUrl } from "@/lib/utils/assets";

interface FloatingElement {
  image?: string;
  iconName?: string;
  text?: string;
  subtext?: string;
  x: number;
  y: number;
  scale?: number;
  size?: number;
  opacity?: number;
  speed?: number;
  rotation?: number;
  type?: "icon" | "shape";
  shape?: "circle" | "rounded" | "none";
}

interface AestheticHeroProps {
  content: {
    headline?: string;
    subheadline?: string;
    description?: string;
    primaryCta?: { text: string; link: string };
    image?: string;
    pattern?: "vines" | "sand" | "none";
    floatingIcons?: boolean; // legacy toggle
    overlayGradient?: boolean;
    fabrics?: FloatingElement[];
    uiElements?: FloatingElement[];
  };
  style?: {
    textAlign?: "left" | "center" | "right";
    backgroundColor?: string;
    textColor?: string;
    padding?: number;
    gradient?: string;
  };
  settings?: {
    animation?: string;
    speed?: number;
    parallax?: boolean;
    delay?: number;
  };
}

export function AestheticHero({ content, style, settings }: AestheticHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Global Parallax
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleTransform = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (settings?.parallax === false || isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [settings?.parallax, isMobile]);

  const getPatternClass = () => {
    if (content.pattern === "vines") return "pattern-kalamkari-vines";
    if (content.pattern === "sand") return "pattern-luxury-sand";
    return "";
  };

  const textAlign = style?.textAlign || "left";
  const bgColor = style?.backgroundColor || "var(--bg)";
  const textColor = style?.textColor || "var(--text-primary)";
  const height = style?.height ? `${style?.height}vh` : "95vh";
  const verticalAlign = style?.verticalAlign || "items-center";

  const renderIcon = (name: string, className?: string) => {
    const Icon = (EthnicIcons as any)[name] || EthnicIcons.KalamkariFlower;
    return <Icon className={className || "w-full h-full"} />;
  };

  // Mobile optimization: Limit items
  const uiElements = isMobile ? (content.uiElements || []).slice(0, 2) : (content.uiElements || []);
  const fabrics = isMobile ? (content.fabrics || []).slice(0, 1) : (content.fabrics || []);

  return (
    <section 
      ref={containerRef}
      className={`relative flex ${verticalAlign} overflow-hidden py-24 luxury-grain ${getPatternClass()}`}
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        minHeight: height,
        backgroundImage: style?.gradient ? style.gradient : undefined 
      }}
    >
      {/* Background Glows / Overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: style?.overlayColor || 'transparent',
            opacity: style?.overlayOpacity || 0
          }} 
        />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 blur-[120px] rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Deep Background: Floating Fabrics */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <AnimatePresence>
          {fabrics.map((fabric, i) => (
            <motion.div
              key={`fabric-${i}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: fabric.opacity || (fabric.image ? 0.8 : 0.08),
                scale: fabric.scale || 1,
                left: `${fabric.x}%`,
                top: `${fabric.y}%`,
                rotate: [0, (fabric.rotation || 20) * (i % 2 === 0 ? 1 : -1), 0],
                x: mousePos.x * (fabric.speed || 0.2),
                y: mousePos.y * (fabric.speed || 0.2),
              }}
              transition={{ 
                duration: 25 / (fabric.speed || 1), 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className={`absolute ${fabric.image ? 'w-96 h-96' : 'w-80 h-80 blur-[80px]'} rounded-full`}
              style={{ 
                backgroundColor: fabric.image ? 'transparent' : (style?.primaryColor || 'var(--primary)'),
                transform: 'translate(-50%, -50%)'
              }}
            >
              {fabric.image && (
                <img 
                  src={getAssetUrl(fabric.image)} 
                  alt="" 
                  className="w-full h-full object-contain opacity-80 mix-blend-soft-light" 
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Midground: Floating UI Icons & Badges */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {uiElements.map((el, i) => (
            <motion.div
              key={`ui-${i}`}
              animate={{ 
                left: `${el.x}%`, 
                top: `${el.y}%`,
                rotate: [0, (el.rotation || 15), 0],
                x: mousePos.x * (el.speed || 0.4),
                y: mousePos.y * (el.speed || 0.4) + Math.sin(Date.now() / 2000 + i) * 10,
                scale: isMobile ? (el.size || 0.8) * 0.7 : el.size || 1,
                opacity: el.opacity || 0.6
              }}
              transition={{ 
                duration: 12 + i, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className={`absolute ${el.shape === 'circle' ? 'glass-card rounded-full p-6' : el.shape === 'rounded' ? 'glass-card rounded-[2rem] p-6' : ''}`}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                {el.image ? (
                  <img src={getAssetUrl(el.image)} alt="" className="w-16 h-16 object-contain" />
                ) : el.iconName ? (
                  <div className="w-16 h-16 p-2">
                    {renderIcon(el.iconName)}
                  </div>
                ) : null}

                {(el.text || el.subtext) && (
                  <div className="text-center">
                    {el.text && <p className="text-[10px] font-bold text-primary tracking-widest leading-none uppercase">{el.text}</p>}
                    {el.subtext && <p className="text-[10px] font-bold text-primary tracking-widest mt-1 uppercase">{el.subtext}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Main Content Stage */}
      <div className="container mx-auto px-6 relative z-20">
        <div className={`flex flex-col lg:flex-row items-center gap-16 ${textAlign === 'center' ? 'lg:flex-col' : textAlign === 'right' ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Content Block with Glass Wrap */}
          <div className={`flex-1 max-w-2xl w-full ${textAlign === 'center' ? 'text-center' : textAlign === 'right' ? 'text-right' : 'text-left'}`}>
            <motion.div
              initial={{ opacity: 0, x: textAlign === 'left' ? -50 : textAlign === 'right' ? 50 : 0, y: textAlign === 'center' ? 50 : 0 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: settings?.speed || 1, delay: settings?.delay || 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`${style?.textAlign === 'center' ? 'mx-auto' : ''}`}
            >
              <div className="inline-block glass-card px-4 py-1.5 rounded-full mb-8 border-theme-border bg-primary/5">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">
                   {content.description || "The Raaghas Signature"}
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[10vw] font-serif mb-8 leading-[0.9] tracking-tighter text-theme-text">
                {content.headline?.split('\\n').map((line, i) => (
                  <span key={i} className="block relative">
                    {line}
                    {i === 0 && <motion.span 
                      className="absolute -top-4 -left-4 w-12 h-12 text-primary/10 lg:block hidden"
                      animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    ><EthnicIcons.KalamkariFlower /></motion.span>}
                  </span>
                ))}
              </h1>
              
              <p className="text-lg md:text-xl font-sans mb-12 text-theme-text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
                {content.subheadline}
              </p>

              {(content.primaryCta || content.ctaText) && (
                <div className={`flex flex-wrap items-center gap-6 ${style?.textAlign === 'center' ? 'justify-center' : style?.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                   <Link 
                    href={content.primaryCta?.link || content.ctaLink || "/collections/all"}
                    className="luxury-button"
                  >
                    {content.primaryCta?.text || content.ctaText}
                  </Link>
                  {content.secondaryCta?.text && (
                    <Link 
                      href={content.secondaryCta?.link || "/collections/all"}
                      className="secondary-button"
                    >
                      {content.secondaryCta.text}
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Model Imagery with Glass Accents */}
          <div className="flex-1 w-full relative">
            <motion.div
              style={{ y: springY, scale: scaleTransform, opacity: opacityTransform }}
              className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(var(--theme-accent-rgb),0.2)] ring-1 ring-theme-glass-border"
            >
              {content.image ? (
                <Image 
                  src={getAssetUrl(content.image)} 
                  alt={content.headline || "Raaghas Fashion"} 
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                />
              ) : (
                <div className="w-full h-full bg-theme-surface flex items-center justify-center p-12">
                   <EthnicIcons.SilkSpool className="w-32 h-32 text-theme-accent/20" />
                </div>
              )}
              
              {/* Image Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-theme-accent/30 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 luxury-grain opacity-10 pointer-events-none" />
            </motion.div>

            {/* Precision Floating Accents are now handled by uiElements list */}
          </div>

        </div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 px-6 sm:px-0"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Explore Collections</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
