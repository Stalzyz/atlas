"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface SocialProofProps {
  content: {
    title: string;
    testimonials: Array<{
      name: string;
      role?: string;
      content: string;
      rating?: number;
    }>;
  };
}

export function SocialProofSection({ content }: SocialProofProps) {
  const testimonials = content.testimonials || [];

  return (
    <section className="py-24 px-6 sm:px-12 bg-cream dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-serif text-theme-text mb-6">
            {content.title}
          </h2>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-sm relative"
            >
              <div className="absolute -top-6 left-10 text-8xl font-serif text-primary/10 pointer-events-none">
                “
              </div>
              <p className="text-theme-text/80 font-light italic mb-8 relative z-10 leading-relaxed">
                {item.content}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-serif text-primary text-xl">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-theme-text uppercase tracking-widest">
                    {item.name}
                  </h4>
                  {item.role && (
                    <span className="text-[10px] text-theme-text/50 uppercase tracking-widest">
                      {item.role}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
