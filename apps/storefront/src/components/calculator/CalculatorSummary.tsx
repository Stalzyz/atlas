import React, { useEffect, useState } from 'react';
import { useShopifyCalculator } from '@/hooks/useShopifyCalculator';
import { Download, Share2, Copy, Check, ArrowRight } from 'lucide-react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface Props {
  calculator: ReturnType<typeof useShopifyCalculator>;
  onExport: () => void;
}

// Animated Counter Component
function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { mass: 1, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => 
    Math.round(current).toLocaleString('en-IN')
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

export function CalculatorSummary({ calculator, onExport }: Props) {
  const { derived, state } = calculator;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculations for receipts
  const shopifyYearlyPlan = derived.inferredPlanCost * 12;
  const shopifyYearlyApps = derived.inferredAppsCost * 12;
  const shopifyGatewayFees = (state.monthlySales * (derived.activeGatewayFee / 100)) * 12;

  const atlasMaintenanceYear2 = state.ownPlatformAnnualMaintenance;
  const year2Savings = derived.shopifyFirstYear - atlasMaintenanceYear2;

  return (
    <div className="sticky top-8 space-y-6">
      
      {/* ─── SHOPIFY RECEIPT (RED) ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-red-100 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-red-600" />
        <div className="p-6">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center justify-between">
            <span>Shopify Costs</span>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md uppercase tracking-wider">Recurring</span>
          </h3>
          
          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between text-gray-600 border-b border-gray-100 border-dashed pb-2">
              <span>Platform Subscription (Yearly)</span>
              <span>₹{shopifyYearlyPlan.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600 border-b border-gray-100 border-dashed pb-2">
              <span>Third-Party Apps (Yearly)</span>
              <span>₹{shopifyYearlyApps.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-gray-600 border-b border-gray-100 border-dashed pb-2">
              <span>Payment Gateway Fees (Yearly)</span>
              <span>₹{shopifyGatewayFees.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between text-gray-900 pt-4 pb-2">
              <span className="font-bold">Total Year 1 Cost</span>
              <span className="font-black text-red-600 text-lg">₹<AnimatedNumber value={derived.shopifyFirstYear} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── ATLAS RECEIPT (GREEN) ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-green-900 to-black text-white rounded-3xl border border-green-800 shadow-xl overflow-hidden relative">
        <div className="p-6">
          <h3 className="text-xl font-black text-white mb-6 flex items-center justify-between">
            <span>Atlas Costs</span>
            <span className="text-xs font-bold text-green-200 bg-green-900/50 px-2 py-1 rounded-md uppercase tracking-wider">Asset</span>
          </h3>
          
          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between items-start text-green-100 border-b border-white/10 border-dashed pb-2 gap-4">
              <div className="flex flex-col">
                <span className="leading-tight">Building and Setup Cost (Custom)</span>
                <span className="text-[10px] text-green-400 mt-1 uppercase tracking-wider">Includes Free Server & 1st Year Maintenance</span>
              </div>
              <span className="shrink-0 font-bold bg-white/10 px-2 py-1 rounded text-white">One-Time</span>
            </div>
            
            <div className="flex justify-between items-start text-green-100 border-b border-white/10 border-dashed pb-2 gap-4">
              <div className="flex flex-col">
                <span className="leading-tight">Server cost plus maintenance</span>
                <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Starts from Year 2</span>
              </div>
              <span className="shrink-0">₹{atlasMaintenanceYear2.toLocaleString('en-IN')}/yr</span>
            </div>
            
            <div className="flex justify-between text-white pt-4 pb-2">
              <span className="font-bold">Total Year 1 Cost</span>
              <span className="font-black text-green-400 text-lg">Custom</span>
            </div>
          </div>

          {/* THE BIG SAVINGS BANNER */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-green-300 text-sm font-bold uppercase tracking-wider mb-2">Year 2+ Guaranteed Cash Savings</p>
            <div className="text-4xl font-black text-white mb-4">
              ₹<AnimatedNumber value={Math.max(0, year2Savings)} /><span className="text-xl text-green-200"> / yr</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              After your one-time building cost, you instantly save this much cash every single year compared to Shopify's recurring drain.
            </p>
          </div>
          
          <div className="pt-8">
            <a 
              href="https://wa.me/919789359407?text=I'm%20interested%20in%20moving%20away%20from%20Shopify%20to%20Atlas."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 group shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              Stop Renting. Own It.
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Utilities */}
      <div className="flex gap-2">
        <button 
          onClick={onExport}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 py-3 rounded-xl transition-all shadow-sm"
        >
          <Download size={16} /> Export PDF
        </button>
        <button 
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 py-3 rounded-xl transition-all shadow-sm"
        >
          {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>

    </div>
  );
}
