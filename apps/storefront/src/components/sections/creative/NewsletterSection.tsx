"use client";

import React from "react";
import { motion } from "framer-motion";

interface NewsletterSectionProps {
  content: {
    title: string;
    description: string;
    buttonText?: string;
    placeholder?: string;
  };
}

export function NewsletterSection({ content }: NewsletterSectionProps) {
  return (
    <section className="py-32 px-6 sm:px-12 bg-primary text-theme-bg overflow-hidden relative">
      {/* Background Decorative Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-serif opacity-5 select-none pointer-events-none whitespace-nowrap">
        ATLAS EXCLUSIVE
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl sm:text-7xl font-serif mb-8 leading-tight">
            {content.title}
          </h2>
          <p className="text-xl opacity-80 mb-12 font-light tracking-wide max-w-2xl mx-auto">
            {content.description}
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder={content.placeholder || "Enter your email address"}
              className="flex-1 bg-transparent border-b-2 border-theme-bg/30 px-6 py-4 focus:border-theme-bg outline-none transition-colors text-lg placeholder:text-theme-bg/50"
            />
            <button type="submit" className="px-12 py-4 bg-theme-bg text-primary uppercase tracking-[0.3em] font-bold hover:bg-cream transition-colors duration-300">
              {content.buttonText || "Subscribe"}
            </button>
          </form>
          
          <p className="mt-8 text-[10px] uppercase tracking-[0.2em] opacity-40">
            By subscribing, you agree to our privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
