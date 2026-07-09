"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getAssetUrl } from "@/lib/utils/assets";

interface EditorialSectionProps {
  content: {
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    ctaText?: string;
    ctaLink?: string;
    layout?: "left" | "right";
  };
}

export function EditorialSection({ content }: EditorialSectionProps) {
  const isRight = content.layout === "right";

  return (
    <section className="py-32 px-6 sm:px-12 bg-theme-bg overflow-hidden">
      <div className={`max-w-7xl mx-auto flex flex-col ${isRight ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-16 lg:gap-24`}>
        {/* Image Side */}
        <div className="w-full lg:w-1/2 relative h-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="h-full w-full relative z-10"
          >
            <Image
              src={getAssetUrl(content.image)}
              alt={content.title}
              fill
              className="object-cover rounded-sm shadow-2xl"
            />
          </motion.div>
          {/* Decorative Elements */}
          <div className={`absolute -top-10 ${isRight ? "-right-10" : "-left-10"} w-48 h-48 border border-primary/10 -z-0`} />
          <div className={`absolute -bottom-10 ${isRight ? "-left-10" : "-right-10"} w-48 h-48 bg-primary/5 -z-0`} />
        </div>

        {/* Text Side */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: isRight ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {content.subtitle && (
              <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold block mb-6">
                {content.subtitle}
              </span>
            )}
            <h2 className="text-5xl sm:text-7xl font-serif text-theme-text mb-8 leading-[1.1]">
              {content.title}
            </h2>
            <p className="text-lg text-theme-text/70 mb-12 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
              {content.description}
            </p>
            
            {content.ctaText && (
              <a 
                href={content.ctaLink || "#"} 
                className="luxury-button inline-block"
              >
                {content.ctaText}
              </a>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
