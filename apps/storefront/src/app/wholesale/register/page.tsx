"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { API_URL } from "@/lib/api";
import { 
  Building2, 
  User as UserIcon, 
  MapPin, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ShieldCheck,
  Globe,
  Truck,
  FileText
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export default function WholesaleRegisterPage() {
  const { getToken, isAuthenticated, user, loading: authLoading } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    gstNumber: "",
    address: "",
    city: "",
    state: "",
    notes: ""
  });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!GST_REGEX.test(formData.gstNumber)) {
      setError("Please provide a valid Indian GSTIN format.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/wholesale/retailers`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          userId: user?.id
        })
      });

      if (!res.ok) throw new Error("Failed to submit application.");
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-theme-bg flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-theme-surface rounded-[48px] p-12 text-center space-y-8 shadow-2xl border border-theme-border"
        >
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-wine">
             <ShieldCheck size={48} />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-serif text-theme-text tracking-tight">Dossier Received</h1>
            <p className="text-theme-text-muted leading-relaxed font-sans">
              Thank you for applying to the Atlas Wholesale Program. Our curation team will review your business credentials and GST status within 48 hours.
            </p>
          </div>
          <div className="pt-4">
             <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-wine hover:opacity-70 transition-opacity">
               Return to Boutique <ArrowRight size={14} />
             </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-bg pt-32 pb-32">
       <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Side: Brand Value */}
          <div className="lg:col-span-5 space-y-12">
             <div className="space-y-6">
                <span className="text-[10px] font-bold text-wine tracking-widest uppercase flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-wine rounded-full" /> Elite Partner Program
                </span>
                <h1 className="text-5xl md:text-6xl font-serif text-theme-text leading-[1.1] tracking-tight">
                  Grow Your Boutique <br />
                  <span className="italic text-wine">With Atlas.</span>
                </h1>
                <p className="text-theme-text-muted leading-relaxed max-w-md font-sans">
                  Join our select network of luxury resellers across India. Access exclusive wholesale pricing, advanced inventory reservations, and priority shipping for your clientele.
                </p>
             </div>

             <div className="space-y-8">
                {[
                   { icon: <Truck size={20} />, title: "Pan-India Logistics", desc: "Express fulfillment to your boutique or directly to your customer." },
                   { icon: <Globe size={20} />, title: "Global Design Standard", desc: "Every piece crafted to the highest quality control specifications." },
                   { icon: <FileText size={20} />, title: "GST Compliant", desc: "Full tax transparency with automated proforma and invoicing." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-start group">
                     <div className="w-12 h-12 bg-theme-surface rounded-2xl flex items-center justify-center text-theme-text-muted group-hover:bg-primary/10 group-hover:text-wine transition-all shadow-sm">
                        {item.icon}
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-bold text-theme-text">{item.title}</h4>
                        <p className="text-xs text-theme-text-muted leading-relaxed font-sans">{item.desc}</p>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="lg:col-span-7">
             <div className="bg-theme-surface rounded-[40px] p-10 md:p-16 shadow-2xl border border-theme-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-wine/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                
                <form onSubmit={handleSubmit} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1">Business Name</label>
                         <div className="relative">
                            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-theme-text/20" size={18} />
                            <input 
                              required
                              placeholder="e.g. Silk Traditions Boutique"
                              className="w-full bg-theme-bg/50 border border-theme-border rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:border-wine/20 transition-all outline-none text-theme-text"
                              value={formData.businessName}
                              onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1">GST Number</label>
                         <div className="relative">
                            <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-theme-text/20" size={18} />
                            <input 
                              required
                              placeholder="15-digit GSTIN"
                              className="w-full bg-theme-bg/50 border border-theme-border rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:border-wine/20 transition-all outline-none uppercase tracking-widest text-theme-text"
                              value={formData.gstNumber}
                              onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1">Contact Name</label>
                         <div className="relative">
                            <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-theme-text/20" size={18} />
                            <input 
                              required
                              placeholder="Owner or Manager name"
                              className="w-full bg-theme-bg/50 border border-theme-border rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:border-wine/20 transition-all outline-none text-theme-text"
                              value={formData.contactName}
                              onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1">Primary Phone</label>
                         <input 
                           required
                           type="tel"
                           placeholder="Mobile or Landline"
                           className="w-full bg-theme-bg/50 border border-theme-border rounded-2xl px-6 py-4 text-sm font-medium focus:border-wine/20 transition-all outline-none text-theme-text"
                           value={formData.phone}
                           onChange={e => setFormData({ ...formData, phone: e.target.value })}
                         />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1">Business Address</label>
                         <div className="relative">
                            <MapPin className="absolute left-6 top-6 text-theme-text/20" size={18} />
                            <textarea 
                              required
                              rows={3}
                              placeholder="Full registered business address"
                              className="w-full bg-theme-bg/50 border border-theme-border rounded-2xl pl-14 pr-6 py-4 text-sm font-medium focus:border-wine/20 transition-all outline-none resize-none text-theme-text"
                              value={formData.address}
                              onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1">City</label>
                         <input 
                           required
                           className="w-full bg-theme-bg/50 border border-theme-border rounded-2xl px-6 py-4 text-sm font-medium focus:border-wine/20 transition-all outline-none text-theme-text"
                           value={formData.city}
                           onChange={e => setFormData({ ...formData, city: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted ml-1">State</label>
                         <input 
                           required
                           className="w-full bg-theme-bg/50 border border-theme-border rounded-2xl px-6 py-4 text-sm font-medium focus:border-wine/20 transition-all outline-none text-theme-text"
                           value={formData.state}
                           onChange={e => setFormData({ ...formData, state: e.target.value })}
                         />
                      </div>
                   </div>

                   {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 p-4 rounded-xl">{error}</p>}

                   <div className="pt-6">
                      <button 
                        disabled={isLoading || authLoading || !isAuthenticated}
                        className="w-full bg-theme-text text-theme-bg py-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-wine hover:text-white transition-all flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
                      >
                         {isLoading ? <Loader2 className="animate-spin" /> : "Submit Partner Application"}
                         {!isLoading && <ArrowRight size={14} />}
                      </button>
                      {!isAuthenticated && !authLoading && <p className="text-center text-[9px] text-theme-text-muted mt-4 uppercase font-bold tracking-widest">Please sign in to your owner account first</p>}
                   </div>
                </form>
             </div>
          </div>

       </div>
    </div>
  );
}
