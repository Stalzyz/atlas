"use client";

import { motion } from "framer-motion";

interface LegalProseSectionProps {
  content: {
    title?: string;
    lastUpdated?: string;
    html?: string;
    sections?: { title: string; content: string }[];
  };
}

export function LegalProseSection({ content }: LegalProseSectionProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-16 text-center">
        {content.title && (
          <h1 className="text-4xl md:text-5xl font-serif text-theme-text mb-4">
            {content.title}
          </h1>
        )}
        {content.lastUpdated && (
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-theme-text-muted">
            Last Updated: {content.lastUpdated}
          </p>
        )}
      </div>

      <div className="prose prose-lg prose-theme max-w-none prose-headings:font-serif prose-headings:text-theme-text prose-p:text-theme-text-muted prose-li:text-theme-text-muted">
        {content.html ? (
          <div dangerouslySetInnerHTML={{ __html: content.html }} />
        ) : (
          <div className="space-y-12">
            {content.sections?.map((section, idx) => (
              <motion.section 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-serif text-theme-text">{section.title}</h2>
                <div 
                  className="text-theme-text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
