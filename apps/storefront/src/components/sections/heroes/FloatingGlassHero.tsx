"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { getAssetUrl } from "@/lib/utils/assets";

interface FloatingGlassHeroProps {
  content: {
    title: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    backgroundImage: string;
    productImage?: string;
    secondaryImage?: string;
  };
}

export function FloatingGlassHero({ content }: FloatingGlassHeroProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [0, 15]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-theme-bg flex items-center justify-center">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={getAssetUrl(content.backgroundImage)}
          alt="Background"
          fill
          className="object-cover opacity-30 grayscale"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-theme-bg/50 to-theme-bg" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold block mb-6 animate-pulse">
            Premium Collection 2024
          </span>
          <h1 className="text-6xl sm:text-8xl font-serif text-theme-text mb-8 leading-[1.1]">
            {content.title}
          </h1>
          <p className="text-xl text-theme-text/60 mb-12 font-light max-w-lg leading-relaxed">
            {content.subtitle}
          </p>
          <div className="flex flex-wrap gap-6">
            <a href={content.ctaLink || "/collections/all"} className="luxury-button">
              {content.ctaText || "Shop Now"}
            </a>
            <a href="/about" className="secondary-button">
              Our Story
            </a>
          </div>
        </motion.div>

        {/* Layered Visuals Side */}
        <div className="relative h-[600px] hidden lg:block">
          {/* Main Product Card (Glass) */}
          <motion.div
            style={{ y: y2 }}
            className="absolute top-10 right-0 w-[400px] h-[500px] glass-card p-4 rounded-sm z-30"
          >
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={getAssetUrl(content.productImage || content.backgroundImage)}
                alt="Product"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-primary text-theme-bg p-6 shadow-2xl">
              <span className="text-[10px] uppercase tracking-widest font-bold">New Arrival</span>
              <h3 className="font-serif text-xl">Handpicked Silk</h3>
            </div>
          </motion.div>

          {/* Floating Fabric / Secondary Card */}
          <motion.div
            style={{ y: y1, rotate }}
            className="absolute top-40 -left-10 w-[300px] h-[400px] glass-card p-2 rounded-sm z-20 opacity-80"
          >
             <Image
                src={getAssetUrl(content.secondaryImage || content.backgroundImage)}
                alt="Detail"
                fill
                className="object-cover"
              />
          </motion.div>

          {/* Decorative Floating Circles */}
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              x: [0, 20, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/5 border border-primary/10 blur-xl" 
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-theme-text/40">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-primary to-transparent" />
      </motion.div>
    </section>
  );
}
