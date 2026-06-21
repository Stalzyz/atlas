"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ShoppingBag, Loader2, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface BundleProduct {
  id: string;
  title: string;
  handle: string;
  variants: { id: string, price: number }[];
  images: { url: string }[];
}

interface BundleBuilderProps {
  mainProduct: BundleProduct;
  bundleProducts: BundleProduct[];
}

export default function BundleBuilder({ mainProduct, bundleProducts }: BundleBuilderProps) {
  const { addItem, toggleDrawer } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!bundleProducts || bundleProducts.length === 0) return null;

  const allProducts = [mainProduct, ...bundleProducts];
  const totalPrice = allProducts.reduce((sum, p) => sum + Number(p.variants[0]?.price || 0), 0);

  const handleAddAll = async () => {
    setIsAdding(true);
    
    // Process each item with a slight delay for luxe feel
    for (const prod of allProducts) {
      addItem({
        id: prod.variants[0]?.id || prod.id,
        variantId: prod.variants[0]?.id || prod.id,
        title: prod.title,
        price: Number(prod.variants[0]?.price || 0),
        quantity: 1,
        image: prod.images[0]?.url || "",
        handle: prod.handle,
      });
      await new Promise(r => setTimeout(r, 200));
    }

    setIsAdding(false);
    setAdded(true);
    toggleDrawer(true);
    
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-charcoal/5 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-serif text-charcoal">Complete the Ensemble</h3>
          <p className="text-xs uppercase font-bold tracking-widest text-charcoal/40">Artisan Curated Bundle</p>
        </div>
        
        <div className="flex items-center gap-6 bg-ivory px-8 py-5 rounded-2xl border border-charcoal/5">
           <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40 mb-1">Bundle Total</p>
              <p className="text-2xl font-bold text-charcoal">₹{totalPrice.toLocaleString()}</p>
           </div>
           <button 
            onClick={handleAddAll}
            disabled={isAdding || added}
            className="bg-wine text-white px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-charcoal transition-all shadow-lg active:scale-95 disabled:bg-green-600"
           >
             {isAdding ? (
               <Loader2 className="animate-spin" size={18} />
             ) : added ? (
               <div className="flex items-center gap-2 text-white">
                 <Check size={18} /> <span>Added to Bag</span>
               </div>
             ) : (
               <span>Buy the Ensemble</span>
             )}
           </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {allProducts.map((prod, idx) => (
          <div key={prod.id} className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-40 rounded-2xl overflow-hidden bg-beige border border-charcoal/5 transition-transform group-hover:scale-105">
                <img src={prod.images[0]?.url} className="w-full h-full object-cover" alt={prod.title} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md border border-charcoal/5">
                {idx + 1}
              </div>
            </div>
            
            {idx < allProducts.length - 1 && (
              <div className="text-charcoal/20">
                <Plus size={24} strokeWidth={1} />
              </div>
            )}
          </div>
        ))}
        
        <div className="flex-1 md:ml-12 space-y-4">
           {allProducts.map((prod) => (
             <div key={prod.id} className="flex justify-between items-center py-2 border-b border-charcoal/5 last:border-0">
                <p className="text-xs font-serif text-charcoal/80">{prod.title}</p>
                <p className="text-xs font-bold text-charcoal">₹{Number(prod.variants[0]?.price || 0).toLocaleString()}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
