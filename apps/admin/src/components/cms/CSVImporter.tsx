"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileUp, Download, CheckCircle2, 
  X, Loader2, AlertCircle, Table,
  ChevronRight, Database, ShieldCheck,
  FileSpreadsheet
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/components/providers/AuthProvider";

export function CSVImporter() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { token } = useAdminAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
        setError("Please upload a valid CSV file.");
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    setProgress(10);
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress for better UX
      const progressInt = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 5 : prev));
      }, 300);

      // Build headers — include token if available, but always send cookies
      // The AuthGuard accepts BOTH Bearer token AND admin_token cookie
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005/api/v1'}/products/bulk-upload`, {
        method: "POST",
        headers,
        credentials: 'include', // Always send admin_token cookie as fallback
        body: formData,
      });

      clearInterval(progressInt);
      setProgress(100);

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({ message: 'Upload failed' }));
        if (resp.status === 401) {
          throw new Error('Session expired. Please refresh the page and try again.');
        }
        throw new Error(errData.message || "Failed to upload CSV. Please check the file format.");
      }
      
      const data = await resp.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "Handle", "Title", "Name", "Description", "Category", "Product_Type", "Brand",
      "Gender", "Age_Group", "Fabric", "Fit_Type", "Sleeve_Type", "Neck_Type", 
      "Status", "Size_Guide", "SKU", "Barcode", "Price", "MRP", "Selling_Price", 
      "Cost_Price", "Stock_Qty", "Size", "Color", 
      "Main_Image", "Image_2"
    ];
    
    // Kurti 1: Anarkali with 3 variants
    const row1 = [
      "floral-anarkali-kurti", "Floral Print Anarkali Kurti", "Floral Print Anarkali Kurti", "Beautiful flowing Anarkali kurti perfect for festive occasions.", "Ethnic Wear", "Kurti", "Atlas",
      "Women", "Adult", "Cotton Blend", "Anarkali", "3/4 Sleeve", "Round Neck",
      "ACTIVE", "", "KRT-FLR-S", "89012345001", "1299", "2499", "1299",
      "600", "15", "S", "Pink",
      "https://images.unsplash.com/photo-1604928135896-1d120d206fdb?q=80&w=600", ""
    ];
    const row2 = [
      "floral-anarkali-kurti", "Floral Print Anarkali Kurti", "Floral Print Anarkali Kurti", "", "", "", "",
      "", "", "", "", "", "",
      "ACTIVE", "", "KRT-FLR-M", "89012345002", "1299", "2499", "1299",
      "600", "20", "M", "Pink",
      "", ""
    ];
    const row3 = [
      "floral-anarkali-kurti", "Floral Print Anarkali Kurti", "Floral Print Anarkali Kurti", "", "", "", "",
      "", "", "", "", "", "",
      "ACTIVE", "", "KRT-FLR-L", "89012345003", "1299", "2499", "1299",
      "600", "10", "L", "Pink",
      "", ""
    ];

    // Kurti 2: A-Line Kurti with 2 variants
    const row4 = [
      "geometric-aline-kurti", "Geometric Print A-Line Kurti", "Geometric Print A-Line Kurti", "Modern A-line cut for everyday office wear.", "Everyday Wear", "Kurti", "Atlas",
      "Women", "Adult", "Rayon", "A-Line", "Short Sleeve", "V-Neck",
      "ACTIVE", "", "KRT-GEO-M", "89012345010", "899", "1599", "899",
      "400", "30", "M", "Navy Blue",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600", ""
    ];
    const row5 = [
      "geometric-aline-kurti", "Geometric Print A-Line Kurti", "Geometric Print A-Line Kurti", "", "", "", "",
      "", "", "", "", "", "",
      "ACTIVE", "", "KRT-GEO-L", "89012345011", "899", "1599", "899",
      "400", "25", "L", "Navy Blue",
      "", ""
    ];

    // Kurti 3: Straight Cut Solid Kurti (Single Variant)
    const row6 = [
      "solid-straight-kurti-yellow", "Solid Straight Cut Kurti", "Solid Straight Cut Kurti", "Bright yellow straight kurti with side slits.", "Casual Wear", "Kurti", "Atlas",
      "Women", "Adult", "Pure Cotton", "Straight", "Sleeveless", "Boat Neck",
      "ACTIVE", "", "KRT-STR-YEL-FS", "89012345020", "699", "999", "699",
      "350", "40", "Free Size", "Mustard Yellow",
      "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?q=80&w=600", ""
    ];

    // Kurti 4: Embellished Flared Kurti (2 Variants)
    const row7 = [
      "embellished-flared-kurti", "Embellished Flared Party Kurti", "Embellished Flared Party Kurti", "Heavy mirror work flared kurti.", "Party Wear", "Kurti", "Atlas",
      "Women", "Adult", "Georgette", "Flared", "Full Sleeve", "Keyhole Neck",
      "ACTIVE", "", "KRT-EMB-XL", "89012345030", "1999", "3999", "1999",
      "950", "5", "XL", "Teal Green",
      "https://images.unsplash.com/photo-1598022712346-67389a016f46?q=80&w=600", ""
    ];
    const row8 = [
      "embellished-flared-kurti", "Embellished Flared Party Kurti", "Embellished Flared Party Kurti", "", "", "", "",
      "", "", "", "", "", "",
      "ACTIVE", "", "KRT-EMB-XXL", "89012345031", "1999", "3999", "1999",
      "950", "8", "XXL", "Teal Green",
      "", ""
    ];

    const csvContent = [
      headers.map(h => `"${h}"`).join(","),
      row1.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","),
      row2.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","),
      row3.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","),
      row4.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","),
      row5.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","),
      row6.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","),
      row7.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(","),
      row8.map(v => `"${(v || "").toString().replace(/"/g, '""')}"`).join(",")
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "atlas_enterprise_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* ─── HEADER ─── */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-wine/5 rounded-2xl flex items-center justify-center text-wine">
            <FileSpreadsheet size={28} />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-charcoal">Enterprise CSV Import</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Bulk Process Thousands of SKUs Instantly</p>
          </div>
        </div>
        <button 
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 text-charcoal rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-gray-100"
        >
          <Download size={14} />
          Download Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── UPLOAD COLUMN ─── */}
        <div className="lg:col-span-2 space-y-6">
          <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`aspect-[21/9] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative group overflow-hidden ${
              file ? "border-wine bg-wine/[0.02]" : "border-gray-200 bg-white hover:border-wine hover:bg-wine/5"
            } ${isUploading ? "cursor-wait opacity-80" : ""}`}
          >
            {file ? (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-wine text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-wine/20">
                  <Table size={32} />
                </div>
                <p className="text-sm font-bold text-charcoal">{file.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{(file.size / 1024).toFixed(1)} KB • Ready to Import</p>
                {!isUploading && (
                  <button className="mt-4 text-wine text-[10px] font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">Change File</button>
                )}
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-wine group-hover:text-white transition-colors">
                  <FileUp size={32} />
                </div>
                <p className="text-sm font-bold text-charcoal mb-1">Upload Product CSV</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Drag and drop or click to browse</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept=".csv" />
          </div>

          <button
            onClick={uploadFile}
            disabled={!file || isUploading}
            className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl ${
              !file || isUploading 
                ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                : "bg-charcoal text-white hover:bg-wine active:scale-95 shadow-wine/20"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Processing Batch... {progress}%
              </>
            ) : (
              <>
                <Database size={16} />
                Initiate Bulk Import
              </>
            )}
          </button>
        </div>

        {/* ─── INFO/GUIDE COLUMN ─── */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-gray-100 space-y-6 shadow-sm">
            <div className="flex items-center gap-3 text-wine">
               <ShieldCheck size={20} />
               <h3 className="text-xs font-bold uppercase tracking-widest">CSV Mapping Guide</h3>
            </div>
            
            <div className="space-y-6">
              
               {/* Scrollable Guide Container */}
               <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">

                 {/* 1. Variants & SKUs Block */}
                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="text-[10px] font-bold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-2"><Database size={12} className="text-wine"/> Variants & SKUs</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed mb-3">To add multiple sizes/colors for the same Kurti, create <strong>multiple rows</strong> using the EXACT SAME <code className="bg-white px-1 py-0.5 rounded text-wine font-mono">Handle</code>.</p>
                    <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-2">
                       <li><strong>Row 1:</strong> Fill all details (Title, Description, Handle, Size: S). Set <code className="bg-white px-1 font-mono">SKU</code> to `KRT-01-S`.</li>
                       <li><strong>Row 2+:</strong> Only fill Handle, Title, Size: M, Price, and set <code className="bg-white px-1 font-mono">SKU</code> to `KRT-01-M`. The system groups them automatically!</li>
                       <li><strong>Blank SKUs:</strong> If you leave the SKU blank, the system will auto-generate one for you.</li>
                    </ul>
                 </div>

                 {/* 2. Collections & Categories Block */}
                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="text-[10px] font-bold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-2"><Table size={12} className="text-wine"/> Collections Auto-Sync</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Use the <code className="bg-white px-1 font-mono">Category</code> or <code className="bg-white px-1 font-mono">Collection</code> column (e.g., <code className="bg-white px-1 font-mono">Summer Wear</code>). 
                      If the collection already exists in your store, the product is added to it. <strong>If it does not exist, the system automatically creates a brand new Collection for you!</strong> You can also pass multiple collections separated by commas: <code className="bg-white px-1 font-mono">Summer, Best Sellers</code>.
                    </p>
                 </div>

                 {/* 3. Taxes & Pricing Block */}
                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="text-[10px] font-bold text-charcoal uppercase tracking-wider mb-3 flex items-center gap-2"><FileSpreadsheet size={12} className="text-wine"/> Taxes & Pricing</h4>
                    <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-2">
                       <li><strong>Selling_Price & MRP:</strong> Set the final price and crossed-out price.</li>
                       <li><strong>Tax_Rate:</strong> Add a column named exactly <code className="bg-white px-1 font-mono">Tax_Rate</code>. Put a number like `12` or `18`. Defaults to 12.</li>
                       <li><strong>Tax_Inclusive:</strong> Add a column named <code className="bg-white px-1 font-mono">Tax_Inclusive</code>. Set to <code className="bg-white px-1 font-mono text-green-600">TRUE</code> if GST is already inside the Selling Price, or <code className="bg-white px-1 font-mono text-red-600">FALSE</code> if it should be added at checkout.</li>
                    </ul>
                 </div>

                 {/* 4. Size Guides Block */}
                 <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h4 className="text-[10px] font-bold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-2"><CheckCircle2 size={12} className="text-wine"/> Size Guides</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      To attach a size guide, create a column named <code className="bg-white px-1 font-mono">Size_Guide</code>. Type the <strong>exact name</strong> of the Size Guide you built in the Admin panel (e.g., <code className="bg-white px-1 font-mono">Standard Kurti Fit</code>). The system will search and link it instantly.
                    </p>
                 </div>

                 {/* 5. Shopify Compatibility */}
                 <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                    <h4 className="text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-2">Shopify Export Compatibility</h4>
                    <p className="text-[11px] text-blue-800 leading-relaxed">You can directly upload a raw Shopify Export CSV here. The system maps Shopify's <code className="bg-white px-1.5 py-0.5 rounded">Variant SKU</code>, <code className="bg-white px-1.5 py-0.5 rounded">Variant Price</code>, <code className="bg-white px-1.5 py-0.5 rounded">Product Category</code>, and <code className="bg-white px-1.5 py-0.5 rounded">Published</code> columns natively.</p>
                 </div>

               </div>

            </div>
          </div>
        </div>
      </div>

      {/* ─── RESULT MODAL ─── */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2.5rem] border-2 border-wine/10 p-10 shadow-2xl space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-wine" />
            
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-charcoal">Import Successful</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Transaction Log #{(Math.random() * 10000).toFixed(0)}</p>
                </div>
              </div>
              <button onClick={() => setResult(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Created", val: result.summary?.success || 0, color: "text-green-600" },
                { label: "Updated", val: result.summary?.updated || 0, color: "text-wine" },
                { label: "Failed", val: result.summary?.failed || 0, color: "text-gray-400" }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.val}</p>
                </div>
              ))}
            </div>

            {result.summary?.errors?.length > 0 && (
              <div className="bg-red-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Error Log</span>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                  {result.summary.errors.map((err: any, i: number) => (
                    <p key={i} className="text-[11px] text-red-600/70 border-b border-red-100 pb-2 font-mono">
                      <span className="font-bold">[{err.key}]:</span> {err.error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={() => router.push("/products")}
              className="w-full py-4 bg-charcoal text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-wine transition-all"
            >
              View Updated Catalog
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
