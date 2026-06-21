"use client";

import * as LucideIcons from "lucide-react";

export function TrustBarSection({ content, style: sectionStyle }: { content: Record<string, any>, style?: any }) {
  const defaultItems = [
    { icon: "ShieldCheck", text: "Premium Quality Cotton" },
    { icon: "Sparkles",    text: "Trending Collections" },
    { icon: "Tag",         text: "Affordable Luxury" },
    { icon: "Lock",        text: "100% Secure Payments" },
    { icon: "HeartHandshake", text: "Handcrafted with Care" },
  ];

  const items = content.items?.length > 0 ? content.items : defaultItems;
  const bgColor = sectionStyle?.backgroundColor || "var(--bg)";
  const accentColor = sectionStyle?.textColor || "var(--primary)";
  const textColor = "var(--text-primary)";

  const renderIcon = (name: string) => {
    const IconComp = (LucideIcons as any)[name] || LucideIcons.ShieldCheck;
    return <IconComp size={14} className="text-primary" strokeWidth={1.5} />;
  };

  return (
    <div
      className="w-full border-y border-theme-border transition-all duration-500 bg-theme-bg"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-0 px-4">
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="flex items-center gap-2.5 py-4 px-6 border-r border-theme-border last:border-r-0 md:flex-1 justify-center"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
              {renderIcon(item.icon)}
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em] whitespace-nowrap text-theme-text-muted"
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
