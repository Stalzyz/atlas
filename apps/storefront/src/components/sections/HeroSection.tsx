"use client";

import { ClassicHero } from "./heroes/ClassicHero";
import { QuantumMosaic } from "./heroes/QuantumMosaic";
import { HolographicStack } from "./heroes/HolographicStack";
import { InfiniteCanvas } from "./heroes/InfiniteCanvas";
import { AestheticHero } from "./heroes/AestheticHero";
import { FloatingGlassHero } from "./heroes/FloatingGlassHero";

export function HeroSection({ content, style, settings }: { content: Record<string, any>, style?: any, settings?: any }) {
  const variant = content.variant || "aesthetic";

  switch (variant) {
    case "aesthetic":
      return <AestheticHero content={content} style={style} settings={settings} />;
    case "quantum_mosaic":
      return <QuantumMosaic content={content} style={style} settings={settings} />;
    case "holographic_layer":
      return <HolographicStack content={content} style={style} settings={settings} />;
    case "infinite_canvas":
      return <InfiniteCanvas content={content} style={style} settings={settings} />;
    case "floating_glass":
      return <FloatingGlassHero content={content as any} />;
    case "classic":
    default:
      return <ClassicHero content={content} style={style} settings={settings} />;
  }
}
