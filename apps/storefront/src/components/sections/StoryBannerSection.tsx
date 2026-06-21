"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function StoryBannerSection({ content, style: sectionStyle }: { content: Record<string, any>, style?: any }) {
  const bgImage = content.backgroundImage || "https://images.unsplash.com/photo-1601058269785-021c176e737c?q=80&w=2670&auto=format&fit=crop";
  const bgColor = sectionStyle?.backgroundColor || "#F4F1ED";
  const textColor = sectionStyle?.textColor || "#2D2926";

  return (
    <section
      className="relative w-full overflow-hidden min-h-[60vh] flex items-center"
      style={{ backgroundColor: bgColor }}
    >
      {/* Parallax Background */}
      <motion.div
        initial={{ scale: 1.05 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />

      {/* Layered Gradient Overlay — creates editorial depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 py-24 md:py-36 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl space-y-8"
        >
          {/* Eyebrow Label */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-white/60" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60">
              {content.label || "Our Philosophy"}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[0.9] tracking-tight text-white">
            {content.headline || "Not Just Clothing."}
            <span className="block text-primary mt-2">
              {content.headlineAccent || "A Daily Comfort Ritual."}
            </span>
          </h2>

          {/* Body */}
          <p className="text-lg md:text-xl font-sans font-light text-white/70 max-w-lg leading-relaxed">
            {content.subtext || "Crafted for women who embrace simplicity with confidence. Every thread woven with the intent to empower your everyday."}
          </p>

          {/* CTA */}
          {content.ctaText && (
            <Link
              href={content.ctaLink || "/collections/all"}
              className="inline-flex items-center gap-3 group"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white border-b border-white/30 pb-1 group-hover:border-white transition-colors duration-300">
                {content.ctaText}
              </span>
              <ArrowRight size={14} className="text-white/60 group-hover:translate-x-2 group-hover:text-white transition-all duration-300" />
            </Link>
          )}
        </motion.div>
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}
