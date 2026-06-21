"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.01 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] // Custom luxury easing
        }}
        className="w-full flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
