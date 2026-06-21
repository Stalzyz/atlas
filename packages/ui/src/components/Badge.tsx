"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "outline" | "solid" | "wine";
  children: React.ReactNode;
}

export const Badge = ({ className, variant = "outline", children, ...props }: BadgeProps) => {
  const variants = {
    outline: "border border-charcoal/10 text-charcoal/60",
    solid: "bg-charcoal text-ivory",
    wine: "bg-wine text-ivory",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
