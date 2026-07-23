'use client';

import React from 'react';
import { useAppScanner, APP_CATALOG } from '@/hooks/useAppScanner';
import { Check, Mail, User, ShieldCheck, ArrowRight, RefreshCw, XCircle } from 'lucide-react';
import Link from 'next/link';

export function AppBloatScanner() {
  const { state, actions } = useAppScanner();

  // Group apps by category
  const categories = Array.from(new Set(APP_CATALOG.map(app => app.category)));

  return (
    <div className="w-full max-w-5xl mx-auto font-sans">
      
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
          The App Bloat Scanner
        </h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Select the Shopify apps you currently pay for. We'll show you exactly how much money you are bleeding to third-party subscriptions.
        </p>
      </div>

      {/* ─── STEP 1: SELECTION ────────────────────────────────────────────── */}
      {state.step === 'selection' && (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 relative overflow-hidden">
          
          <div className="space-y-12 relative z-10">
            {categories.map(category => {
              const apps = APP_CATALOG.filter(a => a.category === category);
              return (
                <div key={category}>
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-4">{category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {apps.map(app => {
                      const isSelected = state.selectedAppIds.includes(app.id);
                      return (
                        <button
                          key={app.id}
                          onClick={() => actions.toggleApp(app.id)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                            isSelected 
                              ? 'border-green-500 bg-green-50 shadow-[0_0_20px_rgba(34,197,94,0.15)]' 
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                          }`}>
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold truncate ${isSelected ? 'text-green-800' : 'text-gray-900'}`}>{app.name}</p>
                            <p className="text-xs text-gray-500">~₹{app.avgMonthlyCost.toLocaleString()}/mo</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Action Bar */}
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Selected Apps</p>
              <p className="text-3xl font-black text-gray-900">
                {state.selectedAppIds.length} <span className="text-lg font-medium text-gray-500">Apps</span>
              </p>
            </div>
            <button 
              onClick={actions.handleAnalyze}
              disabled={state.selectedAppIds.length === 0}
              className="bg-green-600 hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20 w-full sm:w-auto justify-center"
            >
              Analyze My Tech Stack <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ─── STEP 2: LEAD CAPTURE MODAL ─────────────────────────────────────── */}
      {state.step === 'lead-capture' && (
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-green-100 max-w-lg mx-auto text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600" />
          
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCw size={40} className="text-green-600 animate-spin-slow" />
          </div>
          
          <h3 className="text-3xl font-black text-gray-900 mb-2">Audit Ready!</h3>
          <p className="text-gray-500 mb-8">
            We've calculated exactly how much you can save by eliminating redundant app subscriptions. Where should we send your report?
          </p>

          <form onSubmit={actions.handleSubmitLead} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Your Name</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><User size={20} /></span>
                <input 
                  type="text" 
                  required
                  value={state.name}
                  onChange={(e) => actions.setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Work Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={20} /></span>
                <input 
                  type="email" 
                  required
                  value={state.email}
                  onChange={(e) => actions.setEmail(e.target.value)}
                  placeholder="john@yourbrand.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-green-600/20"
            >
              Reveal My Savings <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} /> Your data is secure and never shared.
          </div>
        </div>
      )}

      {/* ─── STEP 3: RESULTS ──────────────────────────────────────────────── */}
      {state.step === 'results' && (
        <div className="space-y-8">
          
          {/* Top Hero Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
              <p className="text-red-800 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                <XCircle size={18} /> Current Wasted Spend
              </p>
              <p className="text-5xl font-black text-red-600 mb-4">
                ₹{state.totalMonthlySpend.toLocaleString('en-IN')}<span className="text-xl text-red-400">/mo</span>
              </p>
              <p className="text-red-700/80">
                You are currently paying this to <strong>{state.selectedApps.length}</strong> different third-party vendors every month. That's <strong>₹{(state.totalMonthlySpend * 12).toLocaleString('en-IN')}</strong> per year drained from your profits.
              </p>
            </div>

            <div className="bg-green-600 p-8 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck size={120} />
              </div>
              <div className="relative z-10">
                <p className="text-green-200 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Check size={18} /> Atlas Savings
                </p>
                <p className="text-5xl font-black text-white mb-4">
                  ₹{state.wastedSpendReplaced.toLocaleString('en-IN')}<span className="text-xl text-green-200">/mo</span>
                </p>
                <p className="text-green-100">
                  Atlas completely eliminates this cost because <strong>{state.appsReplacedByAtlas.length}</strong> of your selected apps are already built natively into the Atlas core system.
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Your Tech Stack Audit</h3>
            
            <div className="space-y-4">
              {state.selectedApps.map(app => (
                <div key={app.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-4 mb-2 sm:mb-0">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{app.name}</p>
                      <p className="text-sm text-gray-500">{app.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <p className="text-sm text-gray-500 line-through">₹{app.avgMonthlyCost.toLocaleString()}/mo</p>
                    </div>
                    
                    {app.isNativeToAtlas ? (
                      <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold w-48 justify-center">
                        <Check size={16} /> Free in Atlas
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold w-48 justify-center">
                        Keep Using
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center text-center p-8 bg-gray-900 rounded-2xl text-white">
              <h4 className="text-3xl font-black mb-4">Stop Renting Your Business</h4>
              <p className="text-gray-400 max-w-2xl mb-8">
                With Atlas, you pay a one-time fee to own the platform. Stop bleeding cash to dozens of subscription apps. Get the ultimate performance, custom checkout, and B2B tools built right in.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="https://atlasadmin.grekam.in/login" 
                  className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:scale-105"
                >
                  Book a Demo
                </Link>
                <button 
                  onClick={actions.reset}
                  className="px-8 py-4 rounded-xl font-bold transition-all border border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
