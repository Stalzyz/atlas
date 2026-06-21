"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { API_URL } from "@/lib/api";
import { X, Mail, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PopupConfig {
  enabled: boolean;
  type: "newsletter" | "promotion" | "announcement";
  trigger: "immediate" | "scroll" | "exit";
  delay?: number;
  scrollThreshold?: number;
  image?: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
  discountCode?: string;
}

export function PromotionPopup({ config }: { config?: PopupConfig }) {
  const [show, setShow] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // If no config or disabled, don't do anything
  if (!config || !config.enabled) return null;

  useEffect(() => {
    // Check if already shown in this session
    if (sessionStorage.getItem("promoPopupShown")) {
      setHasTriggered(true);
      return;
    }

    const triggerPopup = () => {
      setShow(true);
      setHasTriggered(true);
      sessionStorage.setItem("promoPopupShown", "true");
    };

    // Immediate / Delay Trigger
    if (config.trigger === "immediate") {
      const timer = setTimeout(triggerPopup, (config.delay || 0) * 1000);
      return () => clearTimeout(timer);
    }

    // Scroll Trigger
    if (config.trigger === "scroll") {
      const handleScroll = () => {
        if (hasTriggered) return;
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrollPercent >= (config.scrollThreshold || 30)) {
          triggerPopup();
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    // Exit Intent Trigger
    if (config.trigger === "exit") {
      const mouseOutFn = (e: MouseEvent) => {
        if (e.clientY <= 0 && !hasTriggered) {
          triggerPopup();
        }
      };
      document.addEventListener("mouseout", mouseOutFn);
      return () => document.removeEventListener("mouseout", mouseOutFn);
    }
  }, [hasTriggered, config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/api/v1/marketing/discounts/track-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "promo_popup", type: config.type }),
      });
    } catch (err) {
      console.error("Failed to sync popup lead:", err);
    }
    setSubscribed(true);
    if (config.type === "announcement" || !config.discountCode) {
        setTimeout(() => setShow(false), 3000);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-theme-bg shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row border border-theme-border"
          >
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-theme-bg/50 text-theme-text hover:bg-theme-bg transition-all backdrop-blur-md"
            >
              <X size={20} />
            </button>

            {/* Image side */}
            {config.image && (
              <div 
                className="hidden md:block w-2/5 bg-cover bg-center" 
                style={{ backgroundImage: `url('${config.image}')` }} 
              />
            )}

            {/* Content side */}
            <div className={`w-full ${config.image ? 'md:w-3/5' : ''} p-8 md:p-12 text-center flex flex-col justify-center items-center space-y-6`}>
              {!subscribed ? (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                    {config.type === "newsletter" ? <Mail size={32} /> : config.type === "promotion" ? <Gift size={32} /> : <Sparkles size={32} />}
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-3xl md:text-4xl font-serif text-theme-text leading-tight">{config.headline}</h3>
                    <p className="text-base text-theme-text-muted leading-relaxed font-light">
                      {config.subheadline}
                    </p>
                  </div>

                  {config.type !== "announcement" ? (
                    <form onSubmit={handleSubmit} className="w-full space-y-4 pt-4">
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted/30 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          className="w-full bg-theme-surface border border-theme-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary transition-all text-theme-text"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
                      >
                        {config.ctaText || "Claim Exclusive Access"}
                      </button>
                    </form>
                  ) : (
                    <div className="pt-4 w-full">
                       {config.ctaLink ? (
                         <Link 
                           href={config.ctaLink}
                           onClick={() => setShow(false)}
                           className="inline-flex items-center gap-3 bg-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] px-10 py-5 rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 active:scale-95"
                         >
                            {config.ctaText || "Explore Now"} <ArrowRight size={14} />
                         </Link>
                       ) : (
                         <button 
                           onClick={() => setShow(false)}
                           className="bg-primary text-white font-bold uppercase tracking-[0.2em] text-[10px] px-10 py-5 rounded-2xl hover:bg-primary-dark transition-all"
                         >
                            Got It
                         </button>
                       )}
                    </div>
                  )}

                  <button onClick={() => setShow(false)} className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted/40 hover:text-theme-text transition-colors pt-4">
                    Close this window
                  </button>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-8 space-y-6 flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center text-3xl">✓</div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-serif text-theme-text">Welcome to the Family</h3>
                    <p className="text-sm text-theme-text-muted">Your luxury experience begins now.</p>
                  </div>
                  
                  {config.discountCode && (
                    <div className="p-6 bg-theme-surface border-2 border-dashed border-primary/20 rounded-2xl w-full text-center">
                       <p className="text-[10px] font-bold text-theme-text-muted uppercase tracking-widest mb-2">Your Invitation Code</p>
                       <p className="text-3xl font-serif text-primary tracking-widest">{config.discountCode}</p>
                    </div>
                  )}

                  <button 
                    onClick={() => setShow(false)}
                    className="bg-theme-text text-theme-bg font-bold uppercase tracking-[0.2em] text-[10px] px-10 py-4 rounded-xl hover:opacity-90 transition-all"
                  >
                    Start Shopping
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Sparkles({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
