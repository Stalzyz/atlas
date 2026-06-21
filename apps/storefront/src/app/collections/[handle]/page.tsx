"use client";

import React, { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";
import { getAssetUrl } from "@/lib/utils/assets";
import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { ChevronDown, Filter, X, Loader2, SlidersHorizontal, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";

export default function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = React.use(params);
  const decodedHandle = decodeURIComponent(handle);
  const [products, setProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<"categories" | "size" | "availability" | "price">("categories");
  
  // States for Filtering & Sorting
  const [sort, setSort] = useState<string>("newest");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000); 
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  // Debounce price to avoid API spam
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const displayTitle = decodedHandle === 'all' ? 'All Collections' : decodedHandle.split("-").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  useEffect(() => {
    fetchCollections();
  }, []);

  useEffect(() => {
    setPage(1); // Reset to page 1 on filter change
  }, [decodedHandle, sort, selectedTags, selectedSizes, inStockOnly, showCombo, minPrice, debouncedMaxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [decodedHandle, sort, selectedTags, selectedSizes, inStockOnly, showCombo, minPrice, debouncedMaxPrice, page]);

  const fetchCollections = async () => {
    try {
      const [colRes, themeRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/products/collections`),
        fetch(`${API_URL}/api/v1/cms/theme`)
      ]);
      const data = await colRes.json();
      const rawTheme = await themeRes.json();
      const themeData = rawTheme.config || rawTheme;
      
      let validCollections = data.filter((c: any) => !c.isVirtual);
      if (themeData.headerCollections && Array.isArray(themeData.headerCollections) && themeData.headerCollections.length > 0) {
        validCollections = themeData.headerCollections
          .map((handle: string) => validCollections.find((c: any) => c.handle === handle))
          .filter(Boolean);
      }
      setCollections(validCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        collection: decodedHandle,
        sort: sort,
        page: page.toString(),
        limit: limit.toString(),
        returnMeta: 'true',
      });
      if (minPrice > 0) query.append("minPrice", minPrice.toString());
      if (debouncedMaxPrice < 10000) query.append("maxPrice", debouncedMaxPrice.toString());
      selectedTags.forEach(t => query.append("tags", t));
      selectedSizes.forEach(s => query.append("sizes", s));
      if (inStockOnly) query.append("inStock", "true");
      if (showCombo) query.append("combo", "true");

      const res = await fetch(`${API_URL}/api/v1/products?${query.toString()}`);
      const result = await res.json();
      
      if (result.data && result.meta) {
        setProducts(result.data);
        setTotalPages(result.meta.totalPages);
      } else {
        setProducts(result);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? [] : [size]);
  };

  const toggleFilter = (setFn: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setFn(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="bg-theme-bg min-h-screen">
      {/* Header */}
      <div className="pt-[140px] md:pt-[120px] pb-16 px-6 md:px-12 text-center max-w-4xl mx-auto border-b border-theme-border/10">
        <h1 className="text-4xl md:text-7xl font-serif text-theme-text mb-6 tracking-tight">{displayTitle}</h1>
        <p className="text-theme-text-muted font-sans tracking-wide leading-relaxed text-sm md:text-lg max-w-2xl mx-auto">
          Refined aesthetics and traditional craftsmanship. Discover our Must-Have Picks from our luxury {displayTitle.toLowerCase()} designed for modern elegance and timeless grace.
        </p>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar: Categories & Filters (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-12 sticky top-32 h-fit">
           {/* Categories Section */}
           <div className="space-y-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Categories</h3>
              <div className="space-y-3">
                 <Link 
                   href={`/collections/all`}
                   className={`block text-[11px] font-bold uppercase tracking-widest transition-colors ${handle === 'all' ? 'text-wine' : 'text-theme-text-muted hover:text-theme-text'}`}
                 >
                   All Collections
                 </Link>
                 {collections.map(col => (
                   <Link 
                     key={col.id} 
                     href={`/collections/${col.handle}`}
                     className={`block text-[11px] font-bold uppercase tracking-widest transition-colors ${handle === col.handle ? 'text-wine' : 'text-theme-text-muted hover:text-theme-text'}`}
                   >
                     {col.title} <span className="opacity-40 ml-1">({col._count?.products || 0})</span>
                   </Link>
                 ))}
              </div>
           </div>
           {/* Price Filter */}
           <div className="space-y-6 pt-12 border-t border-theme-border/10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Price Range</h3>
              <div className="space-y-4">
                 <input 
                   type="range" min="0" max="10000" step="100"
                   value={maxPrice}
                   onChange={(e) => setMaxPrice(Number(e.target.value))}
                   className="w-full accent-wine h-1 bg-theme-border rounded-lg appearance-none cursor-pointer"
                 />
                 <div className="flex items-center gap-4">
                    <div className="flex-1">
                       <label className="text-[9px] uppercase tracking-widest text-theme-text-muted mb-1 block">Min (₹)</label>
                       <input 
                         type="number" min="0" max={maxPrice}
                         value={minPrice}
                         onChange={(e) => setMinPrice(Number(e.target.value))}
                         className="w-full bg-transparent border border-theme-border/20 rounded text-[11px] p-2 outline-none focus:border-wine"
                       />
                    </div>
                    <div className="flex-1">
                       <label className="text-[9px] uppercase tracking-widest text-theme-text-muted mb-1 block">Max (₹)</label>
                       <input 
                         type="number" min={minPrice} max="10000"
                         value={maxPrice}
                         onChange={(e) => setMaxPrice(Number(e.target.value))}
                         className="w-full bg-transparent border border-theme-border/20 rounded text-[11px] p-2 outline-none focus:border-wine"
                       />
                    </div>
                 </div>
              </div>
           </div>



           {/* Size */}
           <div className="space-y-6 pt-12 border-t border-theme-border/10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Size</h3>
              <div className="flex flex-wrap gap-2">
                 {["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"].map(size => (
                   <button 
                     key={size}
                     onClick={() => toggleSize(size)}
                     className={`px-3 py-1.5 border rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${selectedSizes.includes(size) ? 'bg-theme-text text-theme-bg border-theme-text' : 'border-theme-border text-theme-text-muted hover:border-wine hover:text-wine'}`}
                   >
                      {size}
                   </button>
                 ))}
              </div>
           </div>

           {/* More Filters */}
           <div className="space-y-4 pt-12 border-t border-theme-border/10">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">Availability & Type</h3>
              <div className="flex flex-col gap-4 mt-2">
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-wine border-wine text-white' : 'border-theme-border bg-transparent'}`}>
                     {inStockOnly && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                   </div>
                   <span className="text-[10px] font-bold text-theme-text-muted group-hover:text-theme-text uppercase tracking-widest">In Stock Only</span>
                   <input type="checkbox" className="hidden" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                 </label>
                 
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${showCombo ? 'bg-wine border-wine text-white' : 'border-theme-border bg-transparent'}`}>
                     {showCombo && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                   </div>
                   <span className="text-[10px] font-bold text-theme-text-muted group-hover:text-theme-text uppercase tracking-widest">Combo Packs</span>
                   <input type="checkbox" className="hidden" checked={showCombo} onChange={(e) => setShowCombo(e.target.checked)} />
                 </label>
              </div>
           </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {/* Mobile Refine Button & Active Filters */}
          <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-theme-border/10">
             <button 
               onClick={() => setShowFilters(true)}
               className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-primary"
             >
               <SlidersHorizontal size={14} />
               Refine Collections
             </button>
             <div className="text-[10px] font-bold uppercase tracking-widest text-theme-text-muted">
                Page {page}
             </div>
          </div>

          {/* Sort & Stats (Desktop Only) */}
          <div className="hidden lg:flex justify-between items-center mb-12">
             <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-theme-text-muted">
                Showing collections for you
             </div>
             <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold">
                <span className="opacity-40">Arrange by:</span>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-theme-text outline-none cursor-pointer border-b border-theme-border/10 pb-1"
                >
                   <option value="newest">Newest First</option>
                   <option value="price_asc">Price: Low to High</option>
                   <option value="price_desc">Price: High to Low</option>
                </select>
             </div>
          </div>

          {/* Product Grid */}
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center gap-4">
                 <Loader2 className="animate-spin text-wine" size={32} />
                 <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-theme-text-muted/20">Hydrating the lookbook...</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={{
                      id: product.id,
                      handle: product.handle,
                      title: product.title,
                      price: product.variants[0]?.price || '0',
                      compareAtPrice: product.variants[0]?.compareAtPrice,
                      mrp: product.mrp,
                      imageUrl: getAssetUrl(product.images?.[0]?.url) || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b',
                      category: product.category || product.type,
                      variants: product.variants
                    }} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-20 flex justify-center items-center gap-2 md:gap-4 border-t border-theme-border/10 pt-12">
                     <button 
                       disabled={page === 1}
                       onClick={() => setPage(p => Math.max(1, p - 1))}
                       className="p-2 md:px-6 md:py-3 border border-theme-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-wine hover:text-white transition-all disabled:opacity-20"
                     >
                       <span className="hidden md:inline">Previous</span>
                       <span className="md:hidden">&lt;</span>
                     </button>
                     
                     <div className="flex items-center gap-2">
                       {Array.from({ length: totalPages }).map((_, i) => {
                         const p = i + 1;
                         // Show max 5 pages around current page, plus first and last
                         if (
                           p === 1 || 
                           p === totalPages || 
                           (p >= page - 1 && p <= page + 1) ||
                           (page === 1 && p <= 4) ||
                           (page === totalPages && p >= totalPages - 3)
                         ) {
                           return (
                             <button
                               key={i}
                               onClick={() => setPage(p)}
                               className={`w-8 h-8 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all ${
                                 page === p 
                                   ? 'bg-wine text-white shadow-md' 
                                   : 'hover:bg-theme-border/50 text-theme-text-muted'
                               }`}
                             >
                               {p}
                             </button>
                           );
                         }
                         if (p === 2 && page > 3) return <span key={i} className="text-theme-text-muted text-[10px]">...</span>;
                         if (p === totalPages - 1 && page < totalPages - 2) return <span key={i} className="text-theme-text-muted text-[10px]">...</span>;
                         return null;
                       })}
                     </div>

                     <button 
                       disabled={page === totalPages}
                       onClick={() => setPage(p => p + 1)}
                       className="p-2 md:px-6 md:py-3 border border-theme-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-wine hover:text-white transition-all disabled:opacity-20"
                     >
                       <span className="hidden md:inline">Next</span>
                       <span className="md:hidden">&gt;</span>
                     </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-32 text-center space-y-4">
                 <div className="w-16 h-16 bg-theme-text/5 rounded-full flex items-center justify-center mx-auto text-theme-text-muted/20">
                    <ShoppingBag size={24} />
                 </div>
                 <p className="text-[11px] uppercase font-bold text-theme-text-muted/30 tracking-widest">No collections found matching your criteria</p>
                 <button onClick={() => { setSelectedTags([]); setSelectedSizes([]); setMaxPrice(10000); setPage(1); }} className="text-primary text-[10px] uppercase font-bold border-b border-primary pb-0.5">Reset Filters</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar Drawer (Redesigned Bottom Sheet) */}
      <AnimatePresence>
        {showFilters && (
          <div className="fixed inset-0 z-[100] flex items-end">
            <motion.div 
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              key="sheet"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full h-[85vh] bg-theme-surface rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 pb-4 border-b border-theme-border/10 bg-theme-surface z-20">
                 <h2 className="text-xl font-bold font-serif text-theme-text">Filters</h2>
                 <button onClick={() => setShowFilters(false)} className="p-2 bg-theme-bg rounded-full text-theme-text-muted hover:text-wine hover:bg-wine/10 transition-colors"><X size={18} /></button>
              </div>

              {/* Split Body */}
              <div className="flex flex-1 overflow-hidden bg-theme-surface">
                 {/* Left Tabs */}
                 <div className="w-[35%] bg-theme-bg border-r border-theme-border/10 overflow-y-auto">
                    {[
                      { id: "categories", label: "Categories" },
                      { id: "size", label: "Size" },
                      { id: "availability", label: "Availability" },
                      { id: "price", label: "Price" }
                    ].map(tab => (
                       <button
                         key={tab.id}
                         onClick={() => setActiveFilterTab(tab.id as any)}
                         className={`w-full text-left px-4 py-5 text-xs font-bold transition-colors border-l-4 ${activeFilterTab === tab.id ? 'bg-wine/5 border-wine text-wine' : 'border-transparent text-theme-text-muted hover:bg-theme-bg/80 hover:text-theme-text'}`}
                       >
                         {tab.label}
                         {/* Show indicator if filters are active */}
                         {tab.id === 'size' && selectedSizes.length > 0 && <span className="inline-block w-2 h-2 rounded-full bg-wine ml-2" />}
                         {tab.id === 'availability' && (inStockOnly || showCombo) && <span className="inline-block w-2 h-2 rounded-full bg-wine ml-2" />}
                         {tab.id === 'price' && (maxPrice < 10000 || minPrice > 0) && <span className="inline-block w-2 h-2 rounded-full bg-wine ml-2" />}
                       </button>
                    ))}
                 </div>

                 {/* Right Content */}
                 <div className="w-[65%] p-6 overflow-y-auto custom-scrollbar">
                    {activeFilterTab === "categories" && (
                       <div className="flex flex-col gap-4">
                          <Link 
                            href={`/collections/all`}
                            onClick={() => setShowFilters(false)}
                            className={`flex items-center justify-between text-xs font-bold transition-colors py-2 ${handle === 'all' ? 'text-wine' : 'text-theme-text'}`}
                          >
                            All Collections
                            {handle === 'all' && <div className="w-2 h-2 bg-wine rounded-full" />}
                          </Link>
                          {collections.map(col => (
                            <Link 
                              key={col.id} 
                              href={`/collections/${col.handle}`}
                              onClick={() => setShowFilters(false)}
                              className={`flex items-center justify-between text-xs font-bold transition-colors py-2 ${handle === col.handle ? 'text-wine' : 'text-theme-text'}`}
                            >
                              {col.title}
                              {handle === col.handle && <div className="w-2 h-2 bg-wine rounded-full" />}
                            </Link>
                          ))}
                       </div>
                    )}

                    {activeFilterTab === "size" && (
                       <div className="flex flex-col gap-4">
                          {["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"].map(size => (
                            <label key={size} className="flex items-center justify-between cursor-pointer group py-2">
                              <span className={`text-xs font-bold ${selectedSizes.includes(size) ? 'text-wine' : 'text-theme-text'}`}>{size}</span>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedSizes.includes(size) ? 'bg-wine border-wine text-white' : 'border-theme-border bg-transparent'}`}>
                                {selectedSizes.includes(size) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                              </div>
                              <input type="checkbox" className="hidden" checked={selectedSizes.includes(size)} onChange={() => toggleSize(size)} />
                            </label>
                          ))}
                       </div>
                    )}

                    {activeFilterTab === "availability" && (
                       <div className="flex flex-col gap-4">
                          <label className="flex items-center justify-between cursor-pointer group py-2">
                            <span className={`text-xs font-bold ${inStockOnly ? 'text-wine' : 'text-theme-text'}`}>In Stock Only</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${inStockOnly ? 'bg-wine border-wine text-white' : 'border-theme-border bg-transparent'}`}>
                              {inStockOnly && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            <input type="checkbox" className="hidden" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                          </label>
                          
                          <label className="flex items-center justify-between cursor-pointer group py-2">
                            <span className={`text-xs font-bold ${showCombo ? 'text-wine' : 'text-theme-text'}`}>Combo Packs</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${showCombo ? 'bg-wine border-wine text-white' : 'border-theme-border bg-transparent'}`}>
                              {showCombo && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                            </div>
                            <input type="checkbox" className="hidden" checked={showCombo} onChange={(e) => setShowCombo(e.target.checked)} />
                          </label>
                       </div>
                    )}

                    {activeFilterTab === "price" && (
                       <div className="space-y-6 pt-4">
                          <div className="text-center pb-4">
                             <span className="text-2xl font-bold font-serif text-wine">₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}</span>
                          </div>
                          <input 
                            type="range" min="0" max="10000" step="100"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                            className="w-full accent-wine h-2 bg-theme-border rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex items-center gap-4 mt-6">
                            <div className="flex-1">
                              <label className="text-[10px] uppercase tracking-widest text-theme-text-muted mb-2 block">Min Price (₹)</label>
                              <input 
                                type="number" min="0" max={maxPrice}
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-full bg-theme-bg border border-theme-border/20 rounded-lg text-sm p-3 outline-none focus:border-wine"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-[10px] uppercase tracking-widest text-theme-text-muted mb-2 block">Max Price (₹)</label>
                              <input 
                                type="number" min={minPrice} max="10000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full bg-theme-bg border border-theme-border/20 rounded-lg text-sm p-3 outline-none focus:border-wine"
                              />
                            </div>
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              {/* Bottom Sticky Action Bar */}
              <div className="p-4 pb-28 md:pb-4 border-t border-theme-border/10 bg-theme-surface z-20 flex gap-4">
                 <button 
                   onClick={() => { setSelectedSizes([]); setInStockOnly(false); setShowCombo(false); setMinPrice(0); setMaxPrice(10000); }}
                   className="flex-1 bg-white border border-theme-border text-wine py-4 text-xs font-bold hover:bg-theme-bg transition-all rounded-xl shadow-sm"
                 >
                    Clear all
                 </button>
                 <button 
                   onClick={() => setShowFilters(false)}
                   className="flex-[1.5] bg-wine text-white py-4 text-xs font-bold hover:bg-wine/90 transition-all rounded-xl shadow-lg"
                 >
                    {isLoading ? "Loading..." : `Show Products`}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
