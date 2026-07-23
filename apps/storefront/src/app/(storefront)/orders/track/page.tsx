"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";
import { Search, Package, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MagneticLink from "@/components/ui/MagneticLink";

export default function GuestTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/v1/orders/track?orderId=${orderId}&email=${email}`);
      if (!res.ok) throw new Error("Order not found or details mismatch");
      const order = await res.json();
      
      // Persistence for returning guests
      localStorage.setItem("last_tracked_order", JSON.stringify({ id: order.id, email }));
      
      router.push(`/orders/${order.id}?email=${email}`);
    } catch (err: any) {
      setError(err.message || "Failed to find order");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center py-20 px-6 overflow-hidden relative">
      {/* Background Aesthetic Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-charcoal/[0.02] font-serif text-[400px] pointer-events-none select-none -rotate-12 transition-all duration-1000">
        JOURNEY
      </div>

      <div className="max-w-2xl w-full space-y-12 relative z-10">
        
        <div className="text-center space-y-4">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/10 mb-8"
           >
              <Package size={32} strokeWidth={1} />
           </motion.div>
           <h1 className="text-5xl md:text-6xl font-serif text-charcoal tracking-tight">The Luxury Journey</h1>
           <p className="text-charcoal/40 text-sm uppercase tracking-[0.3em] font-bold">Private Concierge Tracking</p>
        </div>

        <form onSubmit={handleTrack} className="bg-white/80 backdrop-blur-xl p-8 md:p-14 rounded-[40px] border border-charcoal/5 shadow-2xl space-y-10 group">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-[0.25em] text-charcoal/30 flex items-center gap-2">
                Order Identification <Sparkles size={10} className="text-primary/40" />
              </label>
              <input 
                type="text" 
                placeholder="RAG-XXXXX"
                required
                className="w-full bg-transparent border-b border-charcoal/10 px-0 py-4 text-sm font-medium focus:border-primary outline-none transition-colors placeholder:text-charcoal/10"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-[0.25em] text-charcoal/30">Email Credentials</label>
              <input 
                type="email" 
                placeholder="artisan@atlas.com"
                required
                className="w-full bg-transparent border-b border-charcoal/10 px-0 py-4 text-sm font-medium focus:border-primary outline-none transition-colors placeholder:text-charcoal/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest p-4 rounded-2xl flex items-center gap-3 border border-primary/10 shadow-sm"
            >
               <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          <div className="pt-4">
            <MagneticLink>
              <button 
                disabled={isLoading}
                className="w-full bg-charcoal text-white py-6 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-primary transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-2xl group"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    Initialize Tracking 
                    <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </button>
            </MagneticLink>
          </div>
        </form>

        <div className="pt-8 text-center space-y-6">
          <p className="text-[10px] text-charcoal/30 uppercase font-bold tracking-[0.25em]">
             Need Assistance? <a href="/support" className="text-primary border-b border-primary/20 pb-0.5 ml-2 hover:text-charcoal transition-colors">Digital Concierge</a>
          </p>
        </div>
      </div>
    </div>
  );
}
