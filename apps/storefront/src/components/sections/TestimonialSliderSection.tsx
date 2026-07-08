"use client";

import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAssetUrl } from "@/lib/utils/assets";

export function TestimonialSliderSection({ content, style: sectionStyle }: { content: Record<string, any>, style?: any }) {
  const defaultTestimonials = [
    { 
      quote: "The softest cotton I've ever worn. The packaging itself felt like a true luxury experience.", 
      name: "Priya Venkataraman", 
      city: "Chennai",
      rating: 5 
    },
    { 
      quote: "Finally, a brand that understands modern minimalism married to ethnic luxury. Every detail exceeded my expectations.", 
      name: "Sneha Raghunathan", 
      city: "Bangalore",
      rating: 5 
    },
    { 
      quote: "I get compliments every single time I wear Atlas. It has become my everyday uniform for confidence.", 
      name: "Anjali Mehta", 
      city: "Mumbai",
      rating: 5 
    },
  ];

  const testimonials = content.testimonials || defaultTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const goTo = (i: number) => {
    setDirection(i > currentIndex ? 1 : -1);
    setCurrentIndex(i);
  };

  const bgColor = sectionStyle?.backgroundColor || "var(--theme-surface)";
  const textColor = sectionStyle?.textColor || "var(--theme-text)";
  const accentColor = "var(--primary)";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      {/* Background Quote Watermark */}
      <Quote 
        size={320} 
        className="absolute -top-16 -right-16 opacity-[0.03] pointer-events-none" 
        style={{ color: textColor }} 
      />

      <div className={`max-w-5xl mx-auto px-6 ${content.variant === 'compact' ? 'py-12 md:py-16' : 'py-20 md:py-32'} relative z-10`}>

        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-primary" />
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-theme-text-muted">
              Real Women. Real Stories.
            </span>
            <div className="h-px w-8 bg-primary" />
          </div>
          <h2 className={`${content.variant === 'compact' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-6xl'} font-serif`} style={{ color: textColor }}>
            {content.headline || "Voices of Our Community"}
          </h2>
        </div>

        {/* Testimonial Display */}
        <div className="relative h-[260px] md:h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center space-y-8"
            >
              {/* Avatar Image */}
              {testimonials[currentIndex].image && (
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary mb-2 shadow-lg scale-110">
                  <img 
                    src={getAssetUrl(testimonials[currentIndex].image)} 
                    alt={testimonials[currentIndex].name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Star Rating */}
              <div className="flex gap-1.5" style={{ color: accentColor }}>
                {Array.from({ length: testimonials[currentIndex].rating || 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              {/* Quote/Feedback */}
              <p 
                className={`${content.variant === 'compact' ? 'text-lg md:text-xl' : 'text-xl md:text-3xl'} font-serif italic font-light leading-relaxed max-w-3xl text-center px-4`}
                style={{ color: textColor }}
              >
                "{testimonials[currentIndex].feedback || testimonials[currentIndex].quote}"
              </p>

              {/* Attribution */}
              <div className="flex flex-col items-center gap-1">
                <p 
                  className="text-xs uppercase tracking-[0.4em] font-bold"
                  style={{ color: `${textColor}80` }}
                >
                  — {testimonials[currentIndex].name}
                </p>
                {testimonials[currentIndex].city && (
                  <p 
                    className="text-[10px] uppercase tracking-widest"
                    style={{ color: `${textColor}40` }}
                  >
                    {testimonials[currentIndex].city}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {testimonials.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-[3px] transition-all duration-500 rounded-full"
              style={{
                backgroundColor: i === currentIndex ? textColor : `${textColor}20`,
                width: i === currentIndex ? "32px" : "12px",
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${textColor}15, transparent)` }} />
    </section>
  );
}
