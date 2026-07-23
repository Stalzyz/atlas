"use client";

import React from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-theme-bg flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Visual Side (Luxury) */}
      <div className="hidden md:flex w-1/2 bg-primary items-center justify-center p-20 relative overflow-hidden">
        {/* Subtle Luxury Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]"></div>
        
        <div className="z-10 text-center space-y-8 max-w-md animate-in fade-in slide-in-from-bottom-10 duration-1000">
           <Link href="/" className="block mb-12">
             <img src="/logo-light.svg" alt="ATLAS" className="h-16 mx-auto object-contain" />
           </Link>
           <div className="h-px w-24 bg-white/30 mx-auto"></div>
           <p className="text-white/90 font-serif italic text-2xl leading-relaxed">
             "Timeless Elegance, Modern Luxury"
           </p>
           <div className="flex justify-center gap-12 text-[10px] uppercase font-bold tracking-[0.4em] text-white/50 pt-12">
             <span>Est. 2022 &bull; Designed in India</span>
           </div>
        </div>
      </div>

      {/* Auth Form Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-theme-bg relative">
        {/* Floating elements */}
        <div className="absolute top-8 left-8 z-50">
          <Link href="/" className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-theme-text-muted hover:text-primary transition-colors group">
            <MoveLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </div>

        <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
           
           <div className="bg-theme-glass backdrop-blur-xl rounded-[40px] border border-theme-glass-border shadow-2xl p-2 min-h-[500px] flex flex-col items-center justify-center relative">
              {children}
           </div>

           <div className="mt-12 text-center text-[10px] font-bold text-theme-text-muted/30 uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Atlas Private Limited &bull; Est. 2022
           </div>
        </div>
      </div>
    </div>
  );
}
