"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, RotateCw, Sparkles } from "lucide-react";
import { getAssetUrl } from "@/lib/utils/assets";

export function HolographicStack({ content, style: externalStyle, settings }: { content: Record<string, any>, style?: any, settings?: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const style = { ...(content.style || {}), ...(externalStyle || {}) };
  const bgColor = style.backgroundColor || "var(--bg)";
  const textColor = style.textColor || "var(--text-primary)";
  const height = style.height ? `${style.height}vh` : "95vh";
  const verticalAlign = style.verticalAlign || "items-center";

  const headline = content.headline || "COLLECTION";
  const subheadline = content.subheadline || content.description || "Holographic Spring / 2026";
  const rawImages = content.images && content.images.length > 0 ? content.images : [
    content.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    content.backgroundImage || "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=800&auto=format&fit=crop",
    content.image || "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop",
  ];
  // FIX: Resolve all image paths through the API URL bridge
  const images = rawImages.map((img: string | null) => getAssetUrl(img));

  // Mouse tracking for 3D parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 25 });

  // 3D Engine Settings from CMS
  const parallaxIntensity = settings?.parallaxIntensity || 20;
  const shimmerIntensity = (settings?.shimmerIntensity || 60) / 100;
  const layerGap = settings?.layerGap || 60;

  // Increased rotation for more "hard" 3D feel - now adjustable
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [`${parallaxIntensity}deg`, `-${parallaxIntensity}deg`]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [`-${parallaxIntensity}deg`, `${parallaxIntensity}deg`]);
  
  // Dynamic Holographic Gradient based on mouse - enhanced visibility
  const gradientX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20%", "120%"]);
  const gradientY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20%", "120%"]);
  
  // Use useMotionTemplate for high-performance reactive strings
  const shimmer = useMotionTemplate`radial-gradient(circle at ${gradientX} ${gradientY}, rgba(255,255,255,${shimmerIntensity}) 0%, rgba(200,100,255,${shimmerIntensity * 0.5}) 30%, rgba(100,200,255,${shimmerIntensity * 0.25}) 60%, transparent 90%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Typing effect variants
  const typingContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const typingLetter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12 } }
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ backgroundColor: bgColor, color: textColor, minHeight: height }}
      className={`relative w-full overflow-hidden flex ${verticalAlign} justify-center pt-20 perspective-[2500px]`}
    >
      {/* Overlay Support */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundColor: style.overlayColor || 'transparent',
          opacity: style.overlayOpacity || 0
        }} 
      />

      {/* Background Graphic - Massive Headline */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
         <motion.div 
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true }}
           variants={typingContainer}
           className="text-[20vw] font-serif tracking-[0.1em] whitespace-nowrap select-none"
         >
           {headline.split('').map((char: string, i: number) => (
             <motion.span key={i} variants={typingLetter} className="inline-block">{char}</motion.span>
           ))}
         </motion.div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 h-full flex flex-col md:flex-row items-center justify-between gap-12">
         
         {/* Left Side: Content */}
         <div className="flex-1 space-y-8 pl-4">
            <motion.h2 
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, delay: 0.5 }}
               className="text-5xl md:text-7xl font-sans font-light tracking-tight leading-tight"
            >
               {subheadline}
            </motion.h2>
            
            <motion.p 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               transition={{ duration: 1, delay: 0.8 }}
               className="text-lg opacity-80 max-w-md font-serif leading-relaxed"
            >
               {content.text || "Experience the convergence of digital art and physical textiles in our most avant-garde presentation yet."}
            </motion.p>
            
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 1 }}
            >
               <Link 
                 href={content.ctaLink || "/collections/all"}
                 className="relative inline-flex items-center gap-4 group"
               >
                 <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em] px-10 py-5 bg-transparent border border-transparent">
                   {content.ctaText || "Explore"}
                 </span>
                 {/* Ghost button iridescent border effect */}
                 <motion.div 
                   className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-cyan-400 p-[1px] opacity-60 group-hover:opacity-100 transition-opacity"
                 >
                   <div className="w-full h-full bg-[var(--bg)] rounded-full group-hover:bg-transparent transition-colors duration-500" />
                 </motion.div>
                 
                 <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center group-hover:scale-110 group-hover:border-pink-500 transition-all duration-300">
                   <ArrowRight size={16} className="group-hover:text-pink-500 transition-colors" />
                 </div>
               </Link>
            </motion.div>
         </div>

         {/* Right Side: Holographic Stack */}
         <div className="flex-1 w-full h-[70vh] flex items-center justify-center relative perspective-[1500px]">
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="relative w-64 h-96 md:w-80 md:h-[32rem]"
            >
               {/* Deepest Layer - Back Panel */}
               <motion.div 
                 initial={{ opacity: 0, x: 200, rotate: 10 }}
                 animate={{ opacity: 0.4, x: 0, rotate: 8 }}
                 transition={{ duration: 1.5, delay: 0.6, type: "spring" }}
                 style={{ translateZ: -layerGap * 2 }}
                 className="absolute inset-0 rounded-2xl overflow-hidden glass mix-blend-multiply"
               >
                 <img src={images[2]} alt="Deep Layer" className="w-full h-full object-cover filter blur-[3px]" />
               </motion.div>

               {/* Mid Layer - Parallax Panel */}
               <motion.div 
                 initial={{ opacity: 0, x: 150, rotate: -5 }}
                 animate={{ opacity: 0.8, x: 0, rotate: -6 }}
                 transition={{ duration: 1.5, delay: 0.4, type: "spring" }}
                 style={{ translateZ: -layerGap }}
                 className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl glass-dark mix-blend-multiply"
               >
                 <img src={images[1]} alt="Mid Layer" className="w-full h-full object-cover filter blur-[1px]" />
               </motion.div>

               {/* Front Flip Panel */}
               <motion.div 
                 initial={{ opacity: 0, y: 50 }}
                 animate={{ opacity: 1, y: 0, rotateY: isFlipped ? 180 : 0 }}
                 transition={{ duration: 1.2, delay: 0.2, type: "spring", stiffness: 100 }}
                 style={{ translateZ: 0, transformStyle: "preserve-3d" }}
                 className="absolute inset-0 cursor-pointer"
                 onClick={() => setIsFlipped(!isFlipped)}
               >
                  {/* Front Face */}
                  <motion.div 
                    style={{ backfaceVisibility: "hidden" }}
                    className="absolute inset-0 rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-white"
                  >
                     <img src={images[0]} alt="Front View" className="w-full h-full object-cover" />
                     
                     {/* Holographic Shimmer Overlay - REACTIVE TO MOUSE */}
                     <motion.div 
                       style={{ background: shimmer, mixBlendMode: "overlay" }}
                       className="absolute inset-0 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                     />
                     
                     {/* Gloss Shine */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 pointer-events-none" />

                     <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-3 rounded-full text-black shadow-lg">
                        <motion.div
                          animate={{ rotate: isFlipped ? 180 : 0 }}
                          transition={{ duration: 0.6 }}
                        >
                          <RotateCw size={20} />
                        </motion.div>
                     </div>
                  </motion.div>

                  {/* Back Face (Details) - CMS DRIVEN */}
                  <motion.div 
                    style={{ backfaceVisibility: "hidden", rotateY: 180 }}
                    className="absolute inset-0 rounded-xl overflow-hidden bg-white/95 backdrop-blur-2xl border border-white/40 p-10 flex flex-col justify-center items-center text-center shadow-2xl"
                  >
                     <div className="w-12 h-1 bg-primary/20 rounded-full mb-8" />
                     <h3 className="text-2xl font-serif text-charcoal mb-4 uppercase tracking-tight">
                        {content.backTitle || "Behind the Design"}
                     </h3>
                     <p className="text-sm font-sans text-gray-600 mb-8 leading-relaxed">
                        {content.backText || "Constructed with sustainable silk threads and minimal water-dye processes, this piece represents the pinnacle of our ethical future."}
                     </p>
                     
                     {content.backCtaText && (
                       <Link 
                         href={content.backCtaLink || "#"}
                         className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary border-b-2 border-primary/10 pb-1 hover:border-primary transition-all"
                       >
                          {content.backCtaText}
                       </Link>
                     )}
                     
                     <div className="absolute top-6 left-6 opacity-10">
                        <Sparkles size={40} />
                     </div>
                  </motion.div>
               </motion.div>
            </motion.div>
         </div>

      </div>
    </section>
  );
}
