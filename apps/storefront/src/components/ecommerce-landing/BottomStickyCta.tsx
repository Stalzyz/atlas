'use client';

import { motion } from 'framer-motion';

export default function BottomStickyCta() {
  const whatsappUrl = "https://wa.me/919843199556?text=" + encodeURIComponent("Hi Grekam Visuals, I want to start building my online store.");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none flex justify-center">
      <div className="w-full max-w-md pointer-events-auto bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl sm:rounded-full border border-slate-200 shadow-2xl mb-2 sm:mb-6">
        <a 
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl sm:rounded-full bg-slate-900 py-3.5 sm:py-4 font-bold text-white transition-transform active:scale-95"
        >
          {/* Fill Animation Background */}
          <span className="absolute inset-0 h-full w-0 bg-emerald-600 transition-all duration-300 ease-out group-hover:w-full group-active:w-full" />
          
          {/* Text & Icon Layer */}
          <span className="relative z-10 flex items-center gap-2">
            Start Now
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
}
