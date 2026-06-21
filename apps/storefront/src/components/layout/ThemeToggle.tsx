"use client";

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/providers/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full p-1 bg-[var(--surface)] border border-[var(--border)] shadow-sm flex items-center justify-between overflow-hidden transition-colors"
      aria-label="Toggle Theme"
    >
      <div className="absolute inset-0 opacity-10 bg-[var(--primary)]" />
      
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="z-10 w-5 h-5 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-lg"
        style={{ x: theme === 'light' ? 0 : 28 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {theme === 'light' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={10} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={10} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex-1 flex justify-around items-center px-1">
         <Sun size={12} className={`transition-opacity ${theme === 'light' ? 'opacity-0' : 'opacity-20'}`} />
         <Moon size={12} className={`transition-opacity ${theme === 'dark' ? 'opacity-0' : 'opacity-20'}`} />
      </div>
    </motion.button>
  );
}
