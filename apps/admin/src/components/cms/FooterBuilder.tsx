"use client";

import React, { useState } from "react";
import { Plus, Trash2, GripVertical, Settings2, Share2, ImageIcon } from "lucide-react";

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterColumn {
  id: string;
  title: string;
  items: FooterLink[];
}

interface FooterConfig {
  logo: { show: boolean; type: "IMAGE" | "TEXT" };
  tagline: string;
  columns: FooterColumn[];
  socials: { show: boolean };
  bottomBar: {
    copyright: string;
    showPaymentIcons: boolean;
  };
}

interface FooterBuilderProps {
  config: FooterConfig;
  onChange: (newConfig: FooterConfig) => void;
}

export function FooterBuilder({ config, onChange }: FooterBuilderProps) {
  // Ensure config has required fields to avoid crashes
  const safeConfig = {
    logo: config?.logo || { show: true, type: "IMAGE" },
    tagline: config?.tagline || "",
    columns: config?.columns || [],
    socials: config?.socials || { show: true },
    bottomBar: config?.bottomBar || { copyright: "", showPaymentIcons: true },
  };

  const updateConfig = (patch: Partial<FooterConfig>) => {
    onChange({ ...safeConfig, ...patch });
  };

  const addColumn = () => {
    const newColumn: FooterColumn = {
      id: Math.random().toString(36).substr(2, 9),
      title: "New Column",
      items: []
    };
    updateConfig({ columns: [...safeConfig.columns, newColumn] });
  };

  const removeColumn = (id: string) => {
    updateConfig({ columns: safeConfig.columns.filter(c => c.id !== id) });
  };

  const updateColumn = (id: string, patch: Partial<FooterColumn>) => {
    updateConfig({
      columns: safeConfig.columns.map(c => c.id === id ? { ...c, ...patch } : c)
    });
  };

  const addLink = (columnId: string) => {
    const column = safeConfig.columns.find(c => c.id === columnId);
    if (!column) return;

    const newLink: FooterLink = {
      id: Math.random().toString(36).substr(2, 9),
      label: "New Link",
      url: "/"
    };

    updateColumn(columnId, { items: [...column.items, newLink] });
  };

  const removeLink = (columnId: string, linkId: string) => {
    const column = safeConfig.columns.find(c => c.id === columnId);
    if (!column) return;

    updateColumn(columnId, { items: column.items.filter(l => l.id !== linkId) });
  };

  const updateLink = (columnId: string, linkId: string, patch: Partial<FooterLink>) => {
    const column = safeConfig.columns.find(c => c.id === columnId);
    if (!column) return;

    updateColumn(columnId, {
      items: column.items.map(l => l.id === linkId ? { ...l, ...patch } : l)
    });
  };

  return (
    <div className="space-y-10">
      {/* Branding Section */}
      <div className="space-y-4">
        <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2">
          <ImageIcon size={14} className="text-wine" /> Branding & Bio
        </h4>
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
           <span className="text-[10px] uppercase font-bold text-gray-400">Show Brand Logo</span>
           <button 
            onClick={() => updateConfig({ logo: { ...safeConfig.logo, show: !safeConfig.logo.show } })}
            className={`w-10 h-5 rounded-full transition-all relative ${safeConfig.logo.show ? "bg-wine" : "bg-gray-200"}`}
           >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${safeConfig.logo.show ? "left-6" : "left-1"}`} />
           </button>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Footer Tagline</label>
          <textarea 
            rows={3}
            value={safeConfig.tagline} 
            onChange={(e) => updateConfig({ tagline: e.target.value })}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:bg-white focus:border-wine outline-none transition-all shadow-inner"
            placeholder="Write a short brand bio..."
          />
        </div>
      </div>

      {/* Menu Columns Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2">
            <Settings2 size={16} className="text-wine" />
            <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em]">Navigation Columns</h4>
          </div>
          <button 
            onClick={addColumn}
            className="flex items-center gap-2 px-4 py-2 bg-wine text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal transition-all shadow-md shadow-wine/10"
          >
            <Plus size={14} /> Add New Column
          </button>
        </div>

        <div className="space-y-4">
          {safeConfig.columns.map((column) => (
            <div key={column.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                <GripVertical size={16} className="text-gray-300 cursor-grab" />
                <input 
                  value={column.title}
                  onChange={(e) => updateColumn(column.id, { title: e.target.value })}
                  className="flex-1 bg-transparent border-none text-xs font-bold uppercase tracking-widest outline-none focus:text-wine"
                />
                <button 
                  onClick={() => removeColumn(column.id)}
                  className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="p-4 space-y-3">
                {column.items.map((link) => (
                  <div key={link.id} className="flex gap-2">
                    <input 
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => updateLink(column.id, link.id, { label: e.target.value })}
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:bg-white focus:border-wine"
                    />
                    <input 
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateLink(column.id, link.id, { url: e.target.value })}
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] font-mono outline-none focus:bg-white focus:border-wine"
                    />
                    <button 
                      onClick={() => removeLink(column.id, link.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => addLink(column.id)}
                  className="w-full py-2 border border-dashed border-gray-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-wine hover:text-wine transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={12} /> Add Link
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Socials & Bottom Bar Section */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <h4 className="text-[11px] font-bold text-charcoal uppercase tracking-[0.2em] flex items-center gap-2">
          <Share2 size={14} className="text-wine" /> Socials & Legal
        </h4>
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
           <span className="text-[10px] uppercase font-bold text-gray-400">Show Social Icons</span>
           <button 
            onClick={() => updateConfig({ socials: { ...safeConfig.socials, show: !safeConfig.socials.show } })}
            className={`w-10 h-5 rounded-full transition-all relative ${safeConfig.socials.show ? "bg-wine" : "bg-gray-200"}`}
           >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${safeConfig.socials.show ? "left-6" : "left-1"}`} />
           </button>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl">
           <span className="text-[10px] uppercase font-bold text-gray-400">Show Payment Badges</span>
           <button 
            onClick={() => updateConfig({ bottomBar: { ...safeConfig.bottomBar, showPaymentIcons: !safeConfig.bottomBar.showPaymentIcons } })}
            className={`w-10 h-5 rounded-full transition-all relative ${safeConfig.bottomBar.showPaymentIcons ? "bg-wine" : "bg-gray-200"}`}
           >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${safeConfig.bottomBar.showPaymentIcons ? "left-6" : "left-1"}`} />
           </button>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Copyright Text</label>
          <input 
            type="text"
            value={safeConfig.bottomBar.copyright} 
            onChange={(e) => updateConfig({ bottomBar: { ...safeConfig.bottomBar, copyright: e.target.value } })}
            className="w-full bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm focus:bg-white focus:border-wine outline-none transition-all shadow-inner"
            placeholder="© 2024 Atlas. All rights reserved."
          />
        </div>
      </div>
    </div>
  );
}
