"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, Sparkles, Wand2, CheckCircle2, 
  X, Loader2, AlertCircle, ShoppingBag, 
  Tag, Palette, Gem, IndianRupee 
} from "lucide-react";
import { useAdminAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface AIAnalysisResult {
  title: string;
  description: string;
  type: string;
  fabric: string;
  primaryColor: string;
  tags: string[];
  suggestedPrice: number;
  reasoning: string;
}

export function SmartImporter() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAdminAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005'}/ai/analyze-product`, {
        method: "POST",
        headers,
        credentials: 'include',
        body: JSON.stringify({ image }),
      });

      if (!resp.ok) throw new Error("AI Analysis failed. Make sure your OpenAI key is configured.");
      
      const data = await resp.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    // Store in session storage to be picked up by the 'New Product' form
    sessionStorage.setItem("ai_importer_data", JSON.stringify({ ...result, image }));
    router.push("/products/new?source=ai");
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-charcoal mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-wine animate-pulse" /> Smart Product Importer
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto uppercase tracking-widest text-[10px] font-bold">
          Powered by Vision AI — Turn photos into high-converting products instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* ─── UPLOAD ZONE ─── */}
        <div className="space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`aspect-[3/4] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group ${
              image ? "border-wine bg-white" : "border-gray-200 bg-gray-50 hover:border-wine hover:bg-wine/5"
            }`}
          >
            {image ? (
              <>
                <img src={image} className="w-full h-full object-cover" alt="Preview" />
                <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-charcoal px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Change Photo</span>
                </div>
              </>
            ) : (
              <div className="text-center p-8">
                <div className="bg-white w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-wine mx-auto mb-6">
                  <UploadCloud size={32} />
                </div>
                <p className="text-sm font-bold text-charcoal mb-2">Drop your product photo here</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Supports PNG, JPG (Max 5MB)</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
          </div>

          <button
            onClick={analyzeImage}
            disabled={!image || isAnalyzing}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold uppercase tracking-[0.2em] text-xs shadow-xl ${
              !image || isAnalyzing 
                ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                : "bg-charcoal text-white hover:bg-wine active:scale-95 shadow-wine/20"
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                AI is thinking...
              </>
            ) : (
              <>
                <Wand2 size={18} />
                Magic Analyze
              </>
            )}
          </button>
        </div>

        {/* ─── AI RESULT ZONE ─── */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && !error && (
               <motion.div 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }}
                 className="h-full border border-gray-100 bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-4"
               >
                 <div className="p-4 bg-gray-50 rounded-full text-gray-300"><Sparkles size={40} /></div>
                 <p className="text-gray-400 text-xs font-medium max-w-[200px]">Waiting for image analysis to generate luxury details...</p>
               </motion.div>
            )}

            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-full border border-wine/20 bg-wine/[0.02] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-6 overflow-hidden relative"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-gradient-to-br from-wine/5 via-transparent to-transparent"
                />
                <div className="relative">
                  <div className="flex gap-2 justify-center mb-8">
                    {[0, 1, 2].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                        className="w-2 h-2 bg-wine rounded-full"
                      />
                    ))}
                  </div>
                  <h4 className="text-xl font-serif font-bold text-wine mb-2">Analyzing Drape & Fabric</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">AI Vision Intelligence is mapping<br/>texture and color density...</p>
                </div>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="h-full border border-red-100 bg-red-50/50 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="p-4 bg-red-100 text-red-500 rounded-full"><AlertCircle size={32} /></div>
                <div>
                  <h4 className="font-bold text-red-700 uppercase tracking-widest text-[11px] mb-2">Connection Failure</h4>
                  <p className="text-red-600/70 text-sm">{error}</p>
                </div>
                <button 
                  onClick={analyzeImage}
                  className="text-xs font-bold text-red-700 underline"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 space-y-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-charcoal leading-tight">{result.title}</h3>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-widest rounded">{result.type}</span>
                      <span className="px-2 py-0.5 bg-ivory text-wine text-[9px] font-bold uppercase tracking-widest rounded border border-wine/10">{result.fabric}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Suggested</p>
                    <p className="text-2xl font-bold text-wine flex items-center justify-end gap-1"><IndianRupee size={18} />{result.suggestedPrice}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                   <p className="text-xs text-gray-600 leading-relaxed italic">"{result.description}"</p>
                   <div className="flex flex-wrap gap-1.5">
                      {result.tags.map(t => (
                        <span key={t} className="text-[10px] text-gray-400 font-medium">#{t}</span>
                      ))}
                   </div>
                </div>

                <div className="p-4 border border-wine/10 bg-wine/[0.01] rounded-2xl space-y-2">
                   <div className="flex items-center gap-2 text-wine">
                      <Gem size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">AI Reasoning</span>
                   </div>
                   <p className="text-[11px] text-gray-500 leading-relaxed">{result.reasoning}</p>
                </div>

                <button 
                  onClick={handleApply}
                  className="w-full py-4 bg-wine text-white rounded-2xl flex items-center justify-center gap-3 transition-all font-bold uppercase tracking-widest text-xs shadow-lg shadow-wine/30 hover:bg-charcoal active:scale-95"
                >
                  <CheckCircle2 size={18} />
                  Complete Product Creation
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
