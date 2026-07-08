"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon, CheckCircle2, Folder, Search, Library, Grid, List as ListIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

// Dummy media library for CMS demonstration
const DUMMY_MEDIA = [
  { id: 1, url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop", name: "silk-sari-01.jpg", folder: "Products" },
  { id: 2, url: "https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=800&auto=format&fit=crop", name: "hero-campaign.jpg", folder: "Campaigns" },
  { id: 3, url: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop", name: "model-cutout.png", folder: "Lookbook" },
  { id: 4, url: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?q=80&w=800&auto=format&fit=crop", name: "texture-sand.jpg", folder: "Assets" },
  { id: 5, url: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop", name: "pashmina-shawl.jpg", folder: "Products" }
];

export function MediaUploader({ value, onChange, label = "Section Image" }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showManager, setShowManager] = useState(false);
  const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recentUploads, setRecentUploads] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("atlas_media_recent");
    if (saved) setRecentUploads(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (showManager && activeTab === "library") {
      fetchMedia();
    }
  }, [showManager, activeTab]);

  const fetchMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6005"}/cms/media`, {
        credentials: 'include',
      });
      if (resp.ok) {
        const data = await resp.json();
        setMediaList(data);
      }
    } catch (err) {
      console.error("Failed to fetch media", err);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const saveRecent = (url: string) => {
    const next = [url, ...recentUploads.filter(u => u !== url)].slice(0, 10);
    setRecentUploads(next);
    localStorage.setItem("atlas_media_recent", JSON.stringify(next));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6005"}/cms/media/upload`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });

      if (!resp.ok) throw new Error("Upload failed");

      const data = await resp.json();
      saveRecent(data.url);
      onChange(data.url);
      setShowManager(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const allMedia = [...mediaList, ...DUMMY_MEDIA];
  const filteredMedia = allMedia.filter(m => 
    (activeFolder === "All" || m.folder === activeFolder) &&
    ((m.name || m.filename || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-3">
      <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">{label}</label>
      
      <div 
        className={`relative group aspect-video rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center bg-gray-50/50 ${
          value ? "border-wine/20 bg-white" : "border-gray-100 hover:border-wine/40 hover:bg-wine/[0.02]"
        }`}
      >
        {value ? (
          <>
            <img src={value} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button 
                onClick={() => setShowManager(true)}
                className="p-2 bg-white text-charcoal rounded-full hover:bg-wine hover:text-white transition-all shadow-lg"
                title="Change Image"
              >
                <Library size={18} />
              </button>
              <button 
                onClick={() => onChange("")}
                className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg"
                title="Remove Image"
              >
                <X size={18} />
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={() => setShowManager(true)}
            className="flex flex-col items-center justify-center gap-3 p-6 w-full h-full text-gray-300 hover:text-wine transition-colors"
          >
            <ImageIcon size={28} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Select Media</span>
          </button>
        )}
      </div>

      {value && !isUploading && (
        <div className="flex items-center gap-2 text-green-600 text-[9px] font-bold uppercase tracking-widest">
          <CheckCircle2 size={12} /> Live Preview Ready
        </div>
      )}

      {/* Advanced Media Manager Modal */}
      <AnimatePresence>
        {showManager && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/70 backdrop-blur-sm z-[90] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden shadow-2xl border border-white/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                 <div>
                    <h2 className="text-xl font-serif text-charcoal flex items-center gap-3">
                       <Library className="text-wine" /> Media Manager
                    </h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-2">Manage & Reuse Assets</p>
                 </div>
                 <button onClick={() => setShowManager(false)} className="p-3 hover:bg-gray-200 rounded-full transition-colors">
                    <X size={20} />
                 </button>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                 <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                    <button onClick={() => setActiveTab("library")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md ${activeTab === "library" ? "bg-white text-wine shadow-sm" : "text-gray-400 hover:text-charcoal"}`}>Library</button>
                    <button onClick={() => setActiveTab("upload")} className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-md ${activeTab === "upload" ? "bg-white text-wine shadow-sm" : "text-gray-400 hover:text-charcoal"}`}>Upload New</button>
                 </div>

                 {activeTab === "library" && (
                   <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search assets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:border-wine transition-all" />
                   </div>
                 )}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex overflow-hidden bg-gray-50/30">
                 {activeTab === "library" ? (
                   <>
                     {/* Folders Sidebar */}
                     <div className="w-64 border-r border-gray-100 bg-white p-4 space-y-1 overflow-y-auto hidden md:block">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-gray-400 px-3 block mb-4">Directories</span>
                        {["All", "Campaigns", "Products", "Lookbook", "Assets"].map(f => (
                           <button 
                            key={f} onClick={() => setActiveFolder(f)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeFolder === f ? "bg-wine/5 text-wine" : "text-gray-600 hover:bg-gray-50"}`}
                           >
                              <Folder size={16} className={activeFolder === f ? "text-wine" : "text-gray-400"} /> {f}
                           </button>
                        ))}
                     </div>
                     {/* Gallery Canvas */}
                     <div className="flex-1 p-6 overflow-y-auto">
                        {recentUploads.length > 0 && activeFolder === "All" && !search && (
                          <div className="mb-8">
                             <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4 px-2 border-l-2 border-wine">Recent Uploads</h4>
                             <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {recentUploads.map((url, i) => (
                                   <div key={i} onClick={() => { onChange(url); setShowManager(false); }} className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer group border-2 border-transparent hover:border-wine relative shadow-sm">
                                      <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                      <div className="absolute inset-0 bg-wine/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </div>
                                ))}
                             </div>
                          </div>
                        )}

                        <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4 px-2 border-l-2 border-wine">{activeFolder} Assets</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                           {filteredMedia.map(m => (
                             <div key={m.id} onClick={() => { onChange(m.url); setShowManager(false); }} className="group cursor-pointer">
                                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-transparent group-hover:border-wine relative shadow-sm">
                                   <img src={m.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                   <div className="absolute inset-0 bg-wine/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-[10px] truncate text-gray-500 mt-2 px-1 group-hover:text-charcoal font-medium">{m.name}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                   </>
                 ) : (
                   /* Upload View */
                   <div className="flex-1 flex flex-col items-center justify-center p-12">
                      <div className="w-full max-w-lg aspect-auto bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:bg-wine/[0.02] hover:border-wine/40 transition-colors flex flex-col items-center">
                         {isUploading ? (
                           <>
                             <Loader2 className="animate-spin text-wine mb-4" size={48} />
                             <h3 className="text-xl font-serif text-charcoal">Uploading to Cloud...</h3>
                             <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-2">{error || "Optimizing and saving asset"}</p>
                           </>
                         ) : (
                           <>
                             <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-wine/50 mb-6 drop-shadow-sm">
                                <UploadCloud size={40} />
                             </div>
                             <h3 className="text-xl font-serif text-charcoal mb-2">Drag and drop file</h3>
                             <p className="text-sm text-gray-500 mb-8">High-res JPG or PNG recommended</p>
                             <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-wine text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:shadow-lg transition-transform active:scale-95">Select File from Computer</button>
                           </>
                         )}
                         <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
                      </div>
                   </div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
