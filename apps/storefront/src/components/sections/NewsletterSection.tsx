"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

export function NewsletterSection({ content, style: sectionStyle }: { content: any, style?: any }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const bgColor = sectionStyle?.backgroundColor || "var(--primary)";
  const textColor = sectionStyle?.textColor || "var(--theme-bg)";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section
      className="relative w-full overflow-hidden py-20 md:py-32 px-6"
      style={{ backgroundColor: bgColor }}
    >
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.5),transparent)]" />
      {/* Decorative large serif character */}
      <span
        className="absolute -right-8 top-1/2 -translate-y-1/2 text-[20rem] font-serif leading-none select-none pointer-events-none opacity-[0.04]"
        style={{ color: textColor }}
      >
        R
      </span>

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-10">

        {/* Label */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8" style={{ backgroundColor: `${textColor}4D` }} />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold" style={{ color: `${textColor}B3` }}>
            Join the Inner Circle
          </span>
          <div className="h-px w-8" style={{ backgroundColor: `${textColor}4D` }} />
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif leading-none" style={{ color: textColor }}>
            {content.headline || "First Access. Always."}
          </h2>
          <p className="text-base md:text-lg font-sans font-light max-w-md mx-auto leading-relaxed" style={{ color: `${textColor}B3` }}>
            {content.body || "Be the first to know new collections, private sales, and styling stories crafted just for you."}
          </p>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-0 max-w-lg mx-auto border"
          style={{ borderColor: `${textColor}30` }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status !== "idle"}
            placeholder="Your email address"
            className="flex-1 bg-transparent px-6 py-4 text-sm outline-none placeholder:opacity-40 disabled:opacity-40"
            style={{ color: textColor, borderRight: `1px solid ${textColor}30` }}
          />
          <button
            type="submit"
            disabled={status !== "idle"}
            className="px-8 py-4 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all duration-300 shrink-0 disabled:opacity-60 hover:opacity-80"
            style={{ backgroundColor: textColor, color: bgColor }}
          >
            {status === "idle" && <><span>Join</span> <ArrowRight size={12} /></>}
            {status === "loading" && <Loader2 size={14} className="animate-spin" />}
            {status === "success" && <><CheckCircle2 size={14} /> <span>Joined!</span></>}
          </button>
        </motion.form>

        {/* Benefits */}
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {["New arrivals first", "Exclusive offers", "Style guides"].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `${textColor}60` }} />
              <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: `${textColor}60` }}>
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
