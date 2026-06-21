"use client";

import React from "react";
import { getAssetUrl } from "@/lib/utils/assets";

export function ImageRowSection({ content, style }: { content: any; style: any }) {
  const imageShape = content.imageShape || "round";
  
  let shapeClasses = "";
  if (imageShape === "round") shapeClasses = "rounded-full aspect-square object-cover";
  else if (imageShape === "rounded-square") shapeClasses = "rounded-2xl aspect-square object-cover";
  else if (imageShape === "square") shapeClasses = "aspect-square object-cover";
  else shapeClasses = "object-contain";

  return (
    <section className="py-16 px-6 overflow-hidden max-w-7xl mx-auto w-full" style={style}>
      {content.headline && (
        <h2 
          className="text-2xl md:text-3xl mb-12 flex flex-col font-serif" 
          style={{ color: style?.textColor || "inherit", textAlign: style?.textAlign || "center" }}
        >
          {content.headline}
        </h2>
      )}
      <div className="flex justify-center items-center gap-8 md:gap-16 flex-wrap">
        {(content.images || []).map((img: any, i: number) => {
          const contentNode = img.url ? (
            <img src={getAssetUrl(img.url)} alt="" className={`w-full h-full ${shapeClasses} shadow-sm transition-transform hover:scale-105 duration-300`} />
          ) : (
            <div className={`w-full h-full bg-gray-100 ${shapeClasses} flex items-center justify-center text-gray-300 text-xs`}>
              Image
            </div>
          );

          return (
            <div key={i} className={`relative flex-shrink-0 ${imageShape === 'logo' ? 'w-24 md:w-32 h-16' : 'w-20 md:w-32 h-20 md:h-32'}`}>
              {img.link ? (
                <a href={img.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {contentNode}
                </a>
              ) : (
                contentNode
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
