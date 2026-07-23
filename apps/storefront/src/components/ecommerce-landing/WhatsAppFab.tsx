'use client';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhatsAppFab() {
  const whatsappUrl = "https://wa.me/919843199556?text=Hi%20Grekam%20Visuals%2C%20I%20want%20to%20build%20an%20online%20store%20for%20my%20business.";

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
    >
      {/* Tooltip Popup on Hover */}
      <span className="hidden sm:inline-block bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-slate-800">
        Chat with Us on WhatsApp
      </span>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center ring-4 ring-emerald-500/20"
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30" />
        
        {/* Icon */}
        <MessageCircle className="w-7 h-7 relative z-10 fill-white stroke-emerald-500" />
      </a>
    </motion.div>
  );
}
