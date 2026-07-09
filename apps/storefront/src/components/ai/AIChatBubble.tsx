"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "@/lib/api";
import { MessageSquare, X, Send, Sparkles, Loader2, User, Camera, ShoppingBag, ExternalLink } from "lucide-react";

export function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', content: string }[]>([
    { role: 'ai', content: "I am your personal Atlas Muse. How can I help you discover your perfect style today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customQuery?: string) => {
    const query = customQuery || input;
    if (!query.trim() || loading) return;

    if (!customQuery) setInput("");
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.answer || "I apologize, but I am unable to assist at this moment." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "My apologies, I seem to have lost my connection to the atelier." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleVisualSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzingImage(true);
    setMessages(prev => [...prev, { role: 'user', content: "📷 [Uploaded Image for Visual Search]" }]);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string);
        
        const res = await fetch(`${API_URL}/api/v1/ai/visual-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          const productList = data.results.map((p: any) => 
            `MATCH: ${p.title}|${p.handle}|${p.images?.[0]?.url || ''}|${p.variants?.[0]?.price || ''}`
          ).join('\n');
          
          setMessages(prev => [...prev, { 
            role: 'ai', 
            content: `I've analyzed the look! Based on the style and fabric, I found these matching pieces in our atelier:\n\n${productList}` 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            role: 'ai', 
            content: "That's a beautiful piece. While I couldn't find an exact match in our current collection, I'd suggest looking at our luxury silk range for something similar." 
          }]);
        }
        setAnalyzingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "I encountered an error while analyzing your image. Please try again or describe the garment to me." }]);
      setAnalyzingImage(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[140px] right-6 md:bottom-12 md:right-12 z-[9999] w-14 h-14 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        <Sparkles size={28} className="text-primary drop-shadow-lg group-hover:text-primary/80 transition-colors" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-[140px] right-4 left-4 md:left-auto md:right-12 md:bottom-28 z-[9999] w-auto md:w-[380px] h-[70vh] md:h-[520px] bg-theme-surface rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-primary/5 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-5 flex justify-between items-center bg-gradient-to-r from-primary to-primary/80">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ivory/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-ivory" />
                </div>
                <div>
                  <h3 className="text-ivory font-serif text-sm leading-none">Atlas Muse</h3>
                  <p className="text-ivory/60 text-[10px] uppercase tracking-widest mt-1">Virtual Stylist</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-ivory/60 hover:text-ivory transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] bg-fixed"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                      msg.role === 'user' ? 'bg-gray-100 text-charcoal' : 'bg-primary/10 text-primary border border-primary/5'
                    }`}>
                      {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                    </div>
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-tr-none shadow-md' 
                        : 'bg-theme-bg/50 text-theme-text border border-primary/10 rounded-tl-none italic'
                    }`}>
                      {msg.content.includes("MATCH: ") ? (
                        <div className="space-y-3 not-italic">
                          <p>{msg.content.split("\n\n")[0]}</p>
                          <div className="grid grid-cols-1 gap-2">
                            {msg.content.split("\n\n")[1].split("\n").map((match, idx) => {
                              const [title, id, img, price] = match.replace("MATCH: ", "").split("|");
                              return (
                                <a 
                                  key={idx}
                                  href={`/products/${id}`} 
                                  className="flex items-center gap-3 bg-white p-2 rounded-xl border border-primary/10 hover:border-primary/30 transition-all shadow-sm group"
                                >
                                  <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                                    {img && <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-theme-text truncate">{title}</p>
                                    <p className="text-primary text-[10px] font-bold">₹{price}</p>
                                  </div>
                                  <ExternalLink size={12} className="text-gray-300 group-hover:text-primary" />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(loading || analyzingImage) && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-primary" />
                    <span className="text-[10px] text-gray-400 font-medium">
                      {analyzingImage ? "Analyzing your look..." : "Stylist is thinking..."}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-theme-bg/50 border-t border-primary/10">
              {analyzingImage && (
                <div className="mb-3 px-3 py-2 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary animate-pulse">
                    <ImageIcon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Vision AI</p>
                    <p className="text-xs text-theme-text-muted truncate">Analyzing garment and matching...</p>
                  </div>
                </div>
              )}
              
              <div className="relative flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  ref={fileInputRef}
                  onChange={handleVisualSearch}
                  disabled={loading || analyzingImage}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute left-3 p-2 text-theme-text-muted hover:text-primary hover:bg-primary/5 rounded-full cursor-pointer transition-colors"
                >
                  <Camera size={18} />
                </button>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describe what you're looking for..."
                  className="w-full bg-white border border-primary/10 rounded-full pl-12 pr-12 py-3 text-sm focus:outline-none focus:border-primary/30 shadow-sm"
                  disabled={loading || analyzingImage}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading || analyzingImage}
                  className="absolute right-2 p-2 bg-primary text-white rounded-full hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
              <p className="text-[9px] text-center text-gray-300 mt-2 font-medium tracking-wide">
                Indulge in a personalized styling session powered by Atlas AI.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

