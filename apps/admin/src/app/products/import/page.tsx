"use client";

import { useState } from "react";
import { SmartImporter } from "@/components/cms/SmartImporter";
import { CSVImporter } from "@/components/cms/CSVImporter";
import { ArrowLeft, Sparkles, FileSpreadsheet, Settings2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ImportCenterPage() {
  const [activeTab, setActiveTab] = useState<"ai" | "csv">("csv");

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* ─── BREADCRUMBS ─── */}
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-wine transition-colors mb-10 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          Return to Catalog
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-5xl font-serif font-bold text-charcoal mb-3">Import Center</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.3em]">Scalable Product Ingestion & Intelligence</p>
          </div>

          {/* ─── TAB SWITCHER ─── */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit border border-gray-200/50 shadow-inner">
            <button
              onClick={() => setActiveTab("csv")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === "csv" 
                  ? "bg-white text-wine shadow-sm" 
                  : "text-gray-400 hover:text-charcoal"
              }`}
            >
              <FileSpreadsheet size={14} />
              Enterprise CSV
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === "ai" 
                  ? "bg-white text-wine shadow-sm" 
                  : "text-gray-400 hover:text-charcoal"
              }`}
            >
              <Sparkles size={14} />
              AI Smart Import
            </button>
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {activeTab === "csv" ? (
              <motion.div
                key="csv"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <CSVImporter />
              </motion.div>
            ) : (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SmartImporter />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── FOOTER INFO ─── */}
        <div className="mt-20 pt-8 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Settings2 size={12} />
              Encryption Active
            </div>
            <span>•</span>
            <div>Auto-Sync Enabled</div>
          </div>
          <div>Raaghas Enterprise v2.0</div>
        </div>
      </div>
    </div>
  );
}
