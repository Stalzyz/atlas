"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-charcoal/40 ml-1">
            {label}
          </label>
        ) as any}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full border border-charcoal/10 bg-ivory/30 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-charcoal/30 focus-visible:outline-none focus-visible:border-wine disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300",
            error && "border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[10px] text-red-500 font-medium ml-1 uppercase tracking-wider">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
