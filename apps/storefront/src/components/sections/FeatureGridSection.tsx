"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

function DynamicIcon({ name, size = 28 }: { name: string; size?: number }) {
  const IconComp = (LucideIcons as any)[name];
  if (!IconComp) return <LucideIcons.Gem size={size} />;
  return <IconComp size={size} />;
}

export function FeatureGridSection({ content }: { content: any }) {
  const style = content.style || {};
  const features = content.features || [];

  const sectionStyle = {
    backgroundColor: style.backgroundColor || "var(--bg)",
    paddingTop: `${style.paddingTop || 96}px`,
    paddingBottom: `${style.paddingBottom || 96}px`,
  };

  const textAlignmentClass = {
    left: "text-left items-start mx-0",
    center: "text-center items-center mx-auto",
    right: "text-right items-end mx-0 ml-auto",
  }[style.textAlign as string] || "text-center items-center mx-auto";

  return (
    <section style={sectionStyle} className="w-full px-6 md:px-12 transition-all duration-500">
      <div className="max-w-7xl mx-auto">
        {content.headline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`mb-16 flex flex-col ${textAlignmentClass}`}
          >
            <h2 
              className="text-4xl font-serif leading-tight transition-colors duration-500 text-theme-text"
            >
              {content.headline}
            </h2>
            <div 
              className="w-12 h-px mt-4 transition-colors duration-500 bg-primary" 
            />
          </motion.div>
        )}

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12`}>
          {features.map((feature: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col space-y-4 ${textAlignmentClass === "text-center items-center mx-auto" ? "items-center text-center" : textAlignmentClass === "text-right items-end mx-0 ml-auto" ? "items-end text-right" : "items-start text-left"}`}
            >
              <div 
                className="w-16 h-16 flex items-center justify-center border border-theme-border rounded-2xl transition-all duration-500 bg-primary/10 text-primary"
              >
                <DynamicIcon name={feature.icon} size={24} />
              </div>
              <div>
                <h3 
                  className="text-sm font-bold uppercase tracking-widest mb-2 transition-colors duration-500 text-theme-text"
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-xs leading-relaxed max-w-[180px] mx-auto transition-colors duration-500 text-theme-text-muted"
                >
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
