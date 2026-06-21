"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Save, Eye, Download, LayoutDashboard, Type, Settings2, Plus, 
  Trash2, GripVertical, CheckCircle2, PenTool, Image as ImageIcon,
  Droplet, FileText
} from "lucide-react";

export default function InvoiceBuilder() {
  const [activeTab, setActiveTab] = useState<"layout" | "branding" | "data">("layout");
  
  // Layout State
  const [columns, setColumns] = useState([
    { id: "item", label: "Product Name", width: "40%" },
    { id: "qty", label: "Quantity", width: "15%" },
    { id: "price", label: "Price", width: "20%" },
    { id: "total", label: "Total", width: "25%" }
  ]);
  const [customFields, setCustomFields] = useState({
    notes: "Thank you for your business.",
    terms: "Payment due within 30 days."
  });

  // Branding State
  const [branding, setBranding] = useState({
    logo: "",
    companyName: "RAAGHAS WHOLESALE",
    address: "123 Silk Board Road\nBengaluru, India",
    phone: "+91 98765 43210",
    email: "wholesale@raaghas.in",
    gst: "GSTIN29ABCDE1234F",
    color: "#701A31",
    font: "sans",
    watermark: "",
    watermarkOpacity: 0.1
  });

  // Data State (Mock Rows for Preview)
  const [rows, setRows] = useState([
    { item: "Kalamkari Silk Saree", qty: 10, price: 4500, total: 45000 },
    { item: "Organza Border Tissue", qty: 5, price: 3200, total: 16000 }
  ]);

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Math
  const subtotal = rows.reduce((acc, r) => acc + r.total, 0);
  const tax = subtotal * 0.12; // 12% GST
  const grandTotal = subtotal + tax;

  // Signature Paint Logic
  const startDrawing = (e: any) => { setIsDrawing(true); draw(e); };
  const stopDrawing = () => {
     setIsDrawing(false); 
     const canvas = canvasRef.current;
     if(canvas) setSignatureDataUrl(canvas.toDataURL());
  };
  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX || (e.touches && e.touches[0].clientX) - rect.left;
    const y = e.clientY || (e.touches && e.touches[0].clientY) - rect.top;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureDataUrl(null);
    }
  };

  const saveTemplate = async () => {
    // API Call to /v1/invoices/templates
    alert("Template saved successfully.");
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* ─── Left Sidebar Controls ───────────────────────────────────────── */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm shrink-0">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-wine flex items-center gap-2">
              <FileText size={20} /> Receipt Builder
            </h1>
            <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Master Template Config</p>
          </div>
        </div>

        <div className="flex border-b border-gray-100">
           {["layout", "branding", "data"].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${
                 activeTab === tab ? "border-b-2 border-wine text-wine bg-wine/5" : "text-gray-400 hover:bg-gray-50"
               }`}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {activeTab === "layout" && (
            <div className="space-y-6">
               <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2">
                 <LayoutDashboard size={14} className="text-wine" /> Table Columns
               </h4>
               <div className="space-y-2">
                 {columns.map((col, idx) => (
                   <div key={idx} className="flex gap-2 items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                      <GripVertical size={14} className="text-gray-400 cursor-grab" />
                      <input 
                        type="text" 
                        value={col.label} 
                        onChange={(e) => {
                          const n = [...columns];
                          n[idx].label = e.target.value;
                          setColumns(n);
                        }}
                        className="flex-1 bg-white border border-gray-100 text-xs px-2 py-1.5 focus:border-wine outline-none rounded"
                      />
                      <button onClick={() => setColumns(columns.filter((_, i) => i !== idx))} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                   </div>
                 ))}
                 <button 
                  onClick={() => setColumns([...columns, { id: `c-${Date.now()}`, label: "New Column", width: "20%" }])}
                  className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:border-wine hover:text-wine transition-all"
                 >
                   + Add Column
                 </button>
               </div>

               <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2 pt-6 border-t border-gray-100">
                 <PenTool size={14} className="text-wine" /> Custom Fields & Terms
               </h4>
               <div className="space-y-3">
                 <div>
                   <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Notes / Footer Text</label>
                   <textarea rows={3} value={customFields.notes} onChange={e => setCustomFields({...customFields, notes: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:border-wine outline-none resize-none" />
                 </div>
                 <div>
                   <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Terms & Conditions</label>
                   <textarea rows={3} value={customFields.terms} onChange={e => setCustomFields({...customFields, terms: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm focus:border-wine outline-none resize-none" />
                 </div>
               </div>
            </div>
          )}

          {activeTab === "branding" && (
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2">
                <ImageIcon size={14} className="text-wine" /> Visual Identity
              </h4>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Company Name</label>
                <input type="text" value={branding.companyName} onChange={e => setBranding({...branding, companyName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm outline-none" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Company Address</label>
                <textarea rows={2} value={branding.address} onChange={e => setBranding({...branding, address: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Phone</label>
                  <input type="text" value={branding.phone} onChange={e => setBranding({...branding, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">GSTIN</label>
                  <input type="text" value={branding.gst} onChange={e => setBranding({...branding, gst: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1 block">Theme Color</label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-2 rounded-xl">
                   <input type="color" value={branding.color} onChange={e => setBranding({...branding, color: e.target.value})} className="w-8 h-8 rounded border-none cursor-pointer" />
                   <span className="text-xs font-mono font-bold text-gray-500">{branding.color}</span>
                </div>
              </div>
              
              <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2 pt-6 border-t border-gray-100">
                <PenTool size={14} className="text-wine" /> Digital Signature
              </h4>
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden aspect-video relative">
                 <canvas 
                    ref={canvasRef}
                    width={270} height={150}
                    onMouseDown={startDrawing} onMouseUp={stopDrawing} onMouseOut={stopDrawing} onMouseMove={draw}
                    onTouchStart={startDrawing} onTouchEnd={stopDrawing} onTouchMove={draw}
                    className="w-full h-full cursor-crosshair"
                 />
                 <button onClick={clearSignature} className="absolute bottom-2 right-2 px-2 py-1 bg-white text-[9px] uppercase font-bold rounded shadow border border-gray-100 text-gray-500 hover:text-red-500">Clear</button>
              </div>
              <p className="text-[9px] text-gray-400 uppercase">Draw signature above to append to invoice bottoms.</p>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2">
                <LayoutDashboard size={14} className="text-wine" /> Sample Preview Data
              </h4>
              <p className="text-xs text-gray-500">Edit these mock rows to preview how total boundaries scale.</p>
              {rows.map((r, i) => (
                <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                   <input type="text" value={r.item} onChange={e => { const nr = [...rows]; nr[i].item = e.target.value; setRows(nr); }} className="w-full text-xs p-2 bg-white rounded border border-gray-200" placeholder="Item Name"/>
                   <div className="flex gap-2">
                     <input type="number" value={r.qty} onChange={e => { const nr = [...rows]; nr[i].qty = Number(e.target.value); nr[i].total = nr[i].qty * nr[i].price; setRows(nr); }} className="flex-1 text-xs p-2 bg-white rounded border border-gray-200" placeholder="Qty"/>
                     <input type="number" value={r.price} onChange={e => { const nr = [...rows]; nr[i].price = Number(e.target.value); nr[i].total = nr[i].qty * nr[i].price; setRows(nr); }} className="flex-1 text-xs p-2 bg-white rounded border border-gray-200" placeholder="Price"/>
                   </div>
                </div>
              ))}
              <button 
                  onClick={() => setRows([...rows, { item: "New Product", qty: 1, price: 100, total: 100 }])}
                  className="w-full py-2 border-2 border-dashed border-gray-200 text-gray-400 text-xs font-bold uppercase tracking-widest rounded-lg hover:border-wine hover:text-wine transition-all"
                 >
                   + Add Mock Row
              </button>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
           <button onClick={saveTemplate} className="w-full py-3 bg-wine text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-wine/90 transition-all flex items-center justify-center gap-2">
             <Save size={14} /> Save Template
           </button>
           <button onClick={downloadPDF} className="w-full py-3 bg-white text-charcoal border border-gray-200 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
             <Download size={14} /> Download PDF
           </button>
        </div>
      </aside>

      {/* ─── Center Canvas (Printable Area) ─────────────────────────────── */}
      <main className="flex-1 bg-gray-200 p-8 overflow-y-auto flex justify-center print:bg-white print:p-0">
         <div 
           className={`w-full max-w-[800px] bg-white min-h-[1056px] shadow-2xl print:shadow-none print:w-full font-${branding.font} relative flex flex-col`}
         >
            {/* Print Only CSS */}
            <style jsx global>{`
              @media print {
                body * { visibility: hidden; }
                .print-container, .print-container * { visibility: visible; }
                .print-container { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
                @page { size: A4; margin: 0; }
              }
            `}</style>

            <div className="print-container flex-1 flex flex-col relative w-full h-full p-12">
               
               {/* Watermark Overlay */}
               <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] grayscale">
                 <h1 className="text-9xl font-black -rotate-45" style={{ color: branding.color }}>{branding.companyName}</h1>
               </div>

               {/* HEADER */}
               <div className="flex items-start justify-between border-b pb-8" style={{ borderColor: branding.color }}>
                  <div className="space-y-1">
                     <h2 className="text-3xl font-black uppercase tracking-tight" style={{ color: branding.color }}>{branding.companyName}</h2>
                     <p className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{branding.address}</p>
                     <p className="text-xs text-gray-500"><span className="font-bold">GSTIN:</span> {branding.gst}</p>
                     <p className="text-xs text-gray-500"><span className="font-bold">E:</span> {branding.email} | <span className="font-bold">P:</span> {branding.phone}</p>
                  </div>
                  <div className="text-right">
                     <h1 className="text-4xl font-light text-gray-300 uppercase tracking-widest mb-4">INVOICE</h1>
                     <div className="space-y-1">
                       <p className="text-xs text-gray-500"><span className="font-bold uppercase tracking-widest mr-2">Invoice No:</span> INV-2026-001</p>
                       <p className="text-xs text-gray-500"><span className="font-bold uppercase tracking-widest mr-2">Date:</span> {new Date().toLocaleDateString()}</p>
                       <p className="text-xs text-gray-500"><span className="font-bold uppercase tracking-widest mr-2">Due Date:</span> {new Date(Date.now() + 86400000 * 30).toLocaleDateString()}</p>
                     </div>
                  </div>
               </div>

               {/* BILL TO */}
               <div className="py-8 grid grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Billed To</h3>
                    <p className="text-sm font-bold text-gray-800">Acme Retail Corp</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">45 Commercial Street<br/>South Ex, New Delhi 110049</p>
                    <p className="text-xs text-gray-500 mt-1">GSTIN: 07ABCDE1234F1Z5</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 flex flex-col justify-center items-end text-right">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Amount Due</h3>
                    <p className="text-3xl font-bold" style={{ color: branding.color }}>₹{grandTotal.toLocaleString()}</p>
                  </div>
               </div>

               {/* TABLE */}
               <div className="flex-1">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="border-y" style={{ borderColor: branding.color, backgroundColor: `${branding.color}05` }}>
                        {columns.map((c, i) => (
                           <th key={c.id} className={`py-4 text-[10px] font-bold uppercase tracking-widest px-4 ${i === columns.length - 1 ? 'text-right' : ''}`} style={{ color: branding.color, width: c.width }}>
                             {c.label}
                           </th>
                        ))}
                     </tr>
                   </thead>
                   <tbody>
                      {rows.map((r, ri) => (
                        <tr key={ri} className="border-b border-gray-100">
                          {columns.map((c, ci) => (
                            <td key={`${ri}-${ci}`} className={`py-4 px-4 text-sm text-gray-600 ${ci === columns.length - 1 ? 'text-right font-medium' : ''}`}>
                               {c.id === 'total' || c.id === 'price' ? `₹${(r as any)[c.id].toLocaleString()}` : (r as any)[c.id]}
                            </td>
                          ))}
                        </tr>
                      ))}
                   </tbody>
                 </table>
               </div>

               {/* TOTALS & SIGNATURE */}
               <div className="flex justify-between items-end mt-12 pt-8 border-t border-gray-100">
                  <div className="w-1/2 space-y-6">
                     <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Notes</h4>
                       <p className="text-xs text-gray-600 whitespace-pre-line">{customFields.notes}</p>
                     </div>
                     <div>
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Terms & Conditions</h4>
                       <p className="text-[10px] text-gray-500 whitespace-pre-line">{customFields.terms}</p>
                     </div>
                  </div>

                  <div className="w-[300px]">
                     <div className="space-y-3 mb-10">
                        <div className="flex justify-between text-sm text-gray-600">
                           <span>Subtotal</span>
                           <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                           <span>Tax (IGST 12%)</span>
                           <span>₹{tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200" style={{ color: branding.color }}>
                           <span>Grand Total</span>
                           <span>₹{grandTotal.toLocaleString()}</span>
                        </div>
                     </div>
                     
                     <div className="text-center pt-8 border-t border-dashed border-gray-300 relative">
                        {signatureDataUrl && (
                          <img src={signatureDataUrl} className="absolute bottom-6 left-1/2 -translate-x-1/2 h-16 opacity-80" />
                        )}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 relative z-10">Authorized Signatory</p>
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </main>
    </div>
  );
}
