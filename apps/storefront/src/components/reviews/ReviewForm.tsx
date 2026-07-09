"use client";

import { useState, useEffect } from "react";
import { Star, Send, CheckCircle2, AlertCircle, X, Image as ImageIcon, Loader2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/AuthProvider";
import { API_URL } from "@/lib/api";

export default function ReviewForm({ productId }: { productId: string }) {
  const { getToken, user, isAuthenticated, loading: authLoading } = useAuth();
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && user) {
        checkEligibility();
      } else {
        setCheckingEligibility(false);
        setIsEligible(false);
      }
    }
  }, [authLoading, isAuthenticated, user, productId]);

  const checkEligibility = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/reviews/eligibility/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIsEligible(data);
    } catch (error) {
       setIsEligible(false);
    } finally {
      setCheckingEligibility(false);
    }
  };

  const addImage = () => {
    if (!newImageUrl) return;
    setImages([...images, newImageUrl]);
    setNewImageUrl("");
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Please select a rating");

    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      const res = await fetch(`${API_URL}/api/v1/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          headline,
          content,
          images
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit review");
      }

      setIsSubmitted(true);
    } catch (error: any) {
      alert(error.message || "Something went wrong while submitting your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (isAuthenticated && checkingEligibility)) {
    return <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-charcoal/5"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border border-charcoal/5 p-12 text-center rounded-2xl space-y-4">
        <h3 className="text-xl font-serif text-charcoal">Want to share your thoughts?</h3>
        <p className="text-sm text-charcoal/50 max-w-xs mx-auto">Please sign in to leave a review. Only verified buyers can share their experience.</p>
        <a href="/sign-in" className="inline-block text-primary text-xs font-bold uppercase tracking-widest border-b border-primary pb-1">Sign In to Review</a>
      </div>
    );
  }

  if (isEligible === false) {
    return (
      <div className="bg-orange-50/50 border border-orange-100 p-12 text-center rounded-2xl space-y-4">
        <div className="flex justify-center text-orange-400"><AlertCircle size={32} /></div>
        <h3 className="text-xl font-serif text-charcoal">Verified Buyers Only</h3>
        <p className="text-sm text-charcoal/50 max-w-xs mx-auto">Our records show you haven't purchased this item yet. Only customers with a confirmed purchase can leave a review to ensure authenticity.</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-100 p-12 text-center rounded-2xl space-y-4"
      >
        <div className="flex justify-center text-green-600"><CheckCircle2 size={48} /></div>
        <h3 className="text-2xl font-serif text-charcoal">Thank You!</h3>
        <p className="text-charcoal/60 max-w-sm mx-auto">Your verified review has been submitted for moderation. It will appear on the site shortly.</p>
        <button onClick={() => { setIsSubmitted(false); setRating(0); setHeadline(""); setContent(""); setImages([]); }} className="text-primary text-xs font-bold uppercase tracking-widest border-b border-primary pb-1">Submit another review</button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-2xl border border-charcoal/5 shadow-sm space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
           <ShieldCheck size={18} />
           <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Verified Buyer Exclusive</span>
        </div>
        <h3 className="text-2xl font-serif text-charcoal">Share Your Experience</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-charcoal/40">Select Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-90"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  size={24} 
                  className={(hoverRating || rating) >= star ? "text-primary fill-primary" : "text-charcoal/10"} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-charcoal/40">Headline</label>
            <input 
              type="text" required
              placeholder="Ex: Stunning craftsmanship and perfect fit"
              className="w-full bg-ivory/30 border border-charcoal/5 px-4 py-3 text-sm focus:border-primary outline-none rounded-lg"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-charcoal/40">Review Details</label>
            <textarea 
              rows={4}
              placeholder="What did you love about this piece? How was the fit?"
              className="w-full bg-ivory/30 border border-charcoal/5 px-4 py-3 text-sm focus:border-primary outline-none resize-none rounded-lg"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-charcoal/40">Add Style Photos (Optional)</label>
          <div className="flex gap-3">
             <input 
               type="file"
               accept="image/*"
               multiple
               onChange={async (e) => {
                 if (!e.target.files || e.target.files.length === 0) return;
                 const fileArray = Array.from(e.target.files);
                 for (const file of fileArray) {
                    const formData = new FormData();
                    formData.append("file", file);
                    try {
                      const token = await getToken();
                      const res = await fetch(`${API_URL}/api/v1/cms/media/upload`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`
                        },
                        body: formData
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setImages(prev => [...prev, data.url]);
                      } else {
                        alert("Failed to upload image. Please try again.");
                      }
                    } catch (err) {
                      alert("An error occurred while uploading.");
                    }
                 }
                 e.target.value = ''; // Reset file input
               }}
               className="flex-1 bg-ivory/30 border border-charcoal/5 px-4 py-3 text-xs focus:border-primary outline-none rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-charcoal file:text-white hover:file:bg-primary file:cursor-pointer"
             />
          </div>
          
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2">
               {images.map((url, idx) => (
                 <div key={idx} className="relative w-16 h-20 group">
                    <img src={url} alt="Review Preview" className="w-full h-full object-cover rounded-lg border border-charcoal/10" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button 
          disabled={isSubmitting}
          className="w-full bg-charcoal text-white py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary transition-all flex items-center justify-center gap-2 group rounded-xl"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin text-white" /> : (
            <>
              Submit Verified Review
              <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
