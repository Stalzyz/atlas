"use client";

import { useState, useEffect } from "react";
import { Gift, Share2, Copy, CheckCircle, Users, IndianRupee, MessageCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export default function ReferAndEarn() {
  const { user, token } = useAuth();
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005'}/api/v1/growth/referral/code`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        setReferralCode(data.code);
        setLoading(false);
      });
    }
  }, [token]);

  const shareUrl = `https://raaghas.in/?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = `Hey! Check out Raaghas for some amazing ethnic wear. Use my link to get a special discount on your first order: ${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
        <Gift size={64} className="text-wine opacity-20" />
        <h2 className="text-3xl font-serif text-charcoal">Join the Raaghas Family</h2>
        <p className="text-gray-500 max-w-sm">Sign in to unlock your unique referral link and start earning store credits.</p>
        <button className="bg-wine text-white px-8 py-3 rounded-md text-sm font-bold uppercase tracking-widest hover:bg-charcoal transition-all">Sign In to Continue</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 md:py-20 space-y-12">
      
      <div className="text-center space-y-4">
        <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-wine">Growth Engine</h2>
        <h1 className="text-4xl md:text-5xl font-serif text-charcoal tracking-tight">Refer & Earn Luxury Credits</h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          Invite your friends to experience Raaghas. They get a discount on their first purchase, and you earn <span className="text-wine font-bold">₹100 credits</span> for every successful referral.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Share Card */}
        <div className="bg-[var(--surface)] border border-wine/10 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal">Your Referral Link</h3>
            <div className="flex gap-2">
              <div className="flex-1 bg-[var(--surface)] border border-wine/10 rounded-xl px-4 py-3 text-xs font-medium text-gray-400 truncate">
                {loading ? "Generating..." : shareUrl}
              </div>
              <button 
                onClick={copyToClipboard}
                className="bg-wine text-white p-3 rounded-xl hover:bg-charcoal transition-all active:scale-95"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Quick Share</p>
            <div className="flex gap-4">
              <button 
                onClick={shareWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
              >
                <MessageCircle size={18} /> WhatsApp
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-charcoal text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black transition-all">
                <Share2 size={18} /> More Options
              </button>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-6 flex flex-col justify-center">
           <div className="flex gap-6">
              <div className="w-12 h-12 bg-wine text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">1</div>
              <div className="space-y-1">
                 <h4 className="font-bold text-charcoal">Share your link</h4>
                 <p className="text-sm text-gray-500">Send your unique code to friends and family.</p>
              </div>
           </div>
           <div className="flex gap-6">
              <div className="w-12 h-12 bg-wine text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">2</div>
              <div className="space-y-1">
                 <h4 className="font-bold text-charcoal">They shop at Raaghas</h4>
                 <p className="text-sm text-gray-500">Your friends get an automatic discount at checkout.</p>
              </div>
           </div>
           <div className="flex gap-6">
              <div className="w-12 h-12 bg-wine text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg">3</div>
              <div className="space-y-1">
                 <h4 className="font-bold text-charcoal">You get rewarded</h4>
                 <p className="text-sm text-gray-500">Receive ₹100 store credit in your wallet for every first order.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Rewards Overview */}
      <div className="bg-charcoal text-white rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
         <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-serif">Your Earnings</h3>
            <p className="text-xs opacity-40 uppercase font-bold tracking-widest">Credited to your Raaghas Wallet</p>
         </div>
         <div className="flex gap-12">
            <div className="text-center space-y-1">
               <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Successful</p>
               <p className="text-4xl font-bold font-serif">0</p>
            </div>
            <div className="text-center space-y-1">
               <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">Total Earned</p>
               <p className="text-4xl font-bold font-serif flex items-center justify-center">₹0</p>
            </div>
         </div>
         <button className="bg-wine px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ivory hover:text-wine transition-all">
            Redeem at Checkout
         </button>
      </div>

    </div>
  );
}
