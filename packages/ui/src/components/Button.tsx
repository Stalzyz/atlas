"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-charcoal text-ivory hover:bg-wine",
      secondary: "bg-wine text-ivory hover:bg-charcoal",
      outline: "bg-transparent border border-charcoal text-charcoal hover:border-wine hover:text-wine",
      ghost: "bg-transparent text-charcoal hover:bg-beige/50",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px]",
      md: "px-8 py-3 text-xs",
      lg: "px-12 py-4 text-sm",
      xl: "px-16 py-5 text-base",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
