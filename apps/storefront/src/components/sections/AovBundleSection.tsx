"use client";

import { motion } from "framer-motion";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getAssetUrl } from "@/lib/utils/assets";

export function AovBundleSection({ content }: { content: Record<string, any> }) {
  const style = content.style || {};
  const defaultBundles = [
    {
      id: "b1",
      title: "Buy 2 Kurtis @ ₹999",
      description: "Mix & match from our bestselling everyday cottons.",
      images: [
        "https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop"
      ],
      price: "₹999",
      originalPrice: "₹1,598",
      link: "/collections/bundle-kurtis"
    },
    {
      id: "b2",
      title: "Everyday Combo Sets",
      description: "Kurti + Palazzo pairing for effortless styling.",
      images: [
        "https://images.unsplash.com/photo-1608226068884-bbdddef12f17?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=600&auto=format&fit=crop"
      ],
      price: "₹1,299",
      originalPrice: "₹2,100",
      link: "/collections/bundle-sets"
    }
  ];

  const bundles = content.bundles || defaultBundles;

  const sectionStyle = {
    backgroundColor: style.backgroundColor || "transparent", 
    paddingTop: `${style.paddingTop || 96}px`, 
    paddingBottom: `${style.paddingBottom || 96}px`,
  };

  const textColor = style.textColor || "var(--text-primary)";
  const accentColor = style.textColor ? `${style.textColor}` : "var(--primary)";

  const textAlignmentClass = {
    left: "text-left items-start mx-0",
    center: "text-center items-center mx-auto",
    right: "text-right items-end mx-0 ml-auto",
  }[style.textAlign as string] || "text-center items-center mx-auto";

  return (
    <section 
      style={sectionStyle} 
      className="w-full px-6 md:px-12 transition-all duration-500 bg-theme-bg"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className={`flex flex-col space-y-4 ${textAlignmentClass}`}>
          <h2 
            className="text-3xl md:text-4xl font-serif transition-colors duration-500"
            style={{ color: textColor }}
          >
            {content.headline || "Curated For You"}
          </h2>
          <p 
            className="font-sans transition-colors duration-500"
            style={{ color: `${textColor}99` }}
          >
            {content.subheadline || "Exceptional value on our most-loved pairings."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {bundles.map((bundle: any) => (
            <div 
              key={bundle.id} 
              className="bg-theme-surface p-6 md:p-8 rounded-2xl shadow-sm border border-theme-border flex flex-col items-center text-center space-y-6 hover:shadow-md transition-all duration-500"
            >
              
              <div className="flex items-center justify-center gap-4 w-full">
                <div className="relative w-1/3 aspect-[3/4] rounded-lg overflow-hidden bg-primary/10">
                  <img src={getAssetUrl(bundle.images[0])} alt="Bundle Item 1" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10 -mx-6 transition-colors duration-500 bg-theme-bg text-primary"
                >
                  <Plus size={16} />
                </div>
                <div className="relative w-1/3 aspect-[3/4] rounded-lg overflow-hidden bg-primary/10">
                  <img src={getAssetUrl(bundle.images[1])} alt="Bundle Item 2" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 
                  className="text-2xl font-serif transition-colors duration-500"
                  style={{ color: accentColor }}
                >
                  {bundle.title}
                </h3>
                <p 
                  className="text-sm font-sans transition-colors duration-500"
                  style={{ color: `${textColor}99` }}
                >
                  {bundle.description}
                </p>
              </div>

              <div className="flex items-end gap-3 pb-2">
                <span 
                  className="text-2xl font-sans font-medium transition-colors duration-500"
                  style={{ color: textColor }}
                >
                  {bundle.price}
                </span>
                <span 
                  className="text-sm font-sans line-through mb-1 transition-colors duration-500"
                  style={{ color: `${textColor}66` }}
                >
                  {bundle.originalPrice}
                </span>
              </div>

              <Link 
                href={bundle.link || "#"}
                className="w-full py-4 border border-primary text-primary font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-theme-bg"
                style={{ 
                  borderRadius: style.buttonRadius || "0px"
                }}
              >
                Shop Bundle
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
