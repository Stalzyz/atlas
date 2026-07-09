"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 group"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
      ) : (
        <Sun className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
