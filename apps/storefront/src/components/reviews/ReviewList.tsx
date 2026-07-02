"use client";

import { useState, useEffect } from "react";
import { API_URL } from "@/lib/api";
import { Star, MessageSquare, ShieldCheck, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Image {
  id: string;
  url: string;
}

interface Review {
  id: string;
  rating: number;
  headline: string;
  content: string;
  createdAt: string;
  approved: boolean;
  user: {
    name: string;
  };
  images: Image[];
}

export default function ReviewList({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`${API_URL}/api/v1/reviews/product/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReviews();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-charcoal/5 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 bg-charcoal/5 rounded-3xl space-y-4 border border-charcoal/5 border-dashed">
        <MessageSquare size={32} className="mx-auto text-charcoal/20" />
        <p className="text-charcoal/40 font-medium font-sans">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-12">
      {/* Summary Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-charcoal/5 pb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
             <span className="text-6xl font-serif text-charcoal">{averageRating.toFixed(1)}</span>
             <div>
                <div className="flex text-wine mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={20} fill={i <= Math.round(averageRating) ? "currentColor" : "none"} strokeWidth={2} />
                  ))}
                </div>
                <p className="text-[10px] text-charcoal/40 uppercase tracking-[0.2em] font-bold">Based on {reviews.length} reviews</p>
             </div>
          </div>
        </div>
      </div>

      {/* Review Feed */}
      <div className="space-y-10 divide-y divide-charcoal/5">
        {reviews.map((review) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={review.id} 
            className="pt-10 space-y-6"
          >
            <div className="flex justify-between items-center">
               <div className="flex gap-0.5 text-wine">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} fill={i <= review.rating ? "currentColor" : "none"} strokeWidth={2} />
                  ))}
               </div>
               <span className="text-[10px] text-charcoal/30 uppercase font-bold tracking-widest font-sans">
                 {new Date(review.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
               </span>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-charcoal">{review.headline}</h4>
              <p className="text-charcoal/70 leading-relaxed font-sans text-sm md:text-base">{review.content}</p>
            </div>

            {/* Review Gallery */}
            {review.images && review.images.length > 0 && (
              <div className="flex flex-wrap gap-4 pt-2">
                 {review.images.map((img) => (
                   <div key={img.id} className="relative w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden border border-charcoal/5 group cursor-zoom-in">
                      <img 
                        src={img.url} 
                        alt="Customer Look" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                 ))}
              </div>
            )}
            
            <div className="flex items-center gap-3 pt-4">
               <div className="w-8 h-8 bg-beige rounded-xl flex items-center justify-center text-xs font-bold text-wine uppercase shadow-sm">
                 {review.user.name.charAt(0)}
               </div>
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-charcoal">{review.user.name}</span>
                  <span className="text-[9px] text-green-600 font-bold uppercase tracking-[0.1em] flex items-center gap-1.5 mt-0.5">
                    <div className="w-3.5 h-3.5 bg-green-600 rounded-full flex items-center justify-center text-white"><Check size={10} strokeWidth={4} /></div>
                    Verified Purchase
                  </span>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
