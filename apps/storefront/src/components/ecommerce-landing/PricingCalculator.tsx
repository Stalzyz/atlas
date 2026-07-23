'use client';
import { useState } from 'react';
import { IndianRupee, Info } from 'lucide-react';

export default function PricingCalculator() {
  const [platform, setPlatform] = useState<'shopify' | 'woocommerce' | 'atlas'>('shopify');
  const [products, setProducts] = useState(50);
  const [needMaintenance, setNeedMaintenance] = useState(false);
  const [needAdvancedSeo, setNeedAdvancedSeo] = useState(false);

  const calculateTotal = () => {
    let base = 0;
    if (platform === 'shopify') base = 35000;
    if (platform === 'woocommerce') base = 45000;
    if (platform === 'atlas') base = 75000;

    // Add cost for extra products (assuming 50 are included in base)
    if (products > 50) {
      base += (products - 50) * 100; // ₹100 per extra product upload
    }

    if (needMaintenance) base += 15000; // Annual Maintenance Contract
    if (needAdvancedSeo) base += 20000; // Advanced SEO Package

    return base;
  };

  const getMonthlyCost = () => {
    if (platform === 'shopify') return '₹2,000 - ₹3,000 (To Shopify)';
    if (platform === 'woocommerce') return '₹500 - ₹1,500 (Hosting)';
    if (platform === 'atlas') return 'Depends on traffic (Hosting)';
    return '';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row">
      
      {/* Controls */}
      <div className="p-8 md:w-2/3 md:border-r border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-bold mb-6">Build Your Package</h3>
        
        <div className="space-y-8">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              1. Select Platform
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'shopify', label: 'Shopify', color: 'border-[#95bf47] hover:bg-[#95bf47]/10' },
                { id: 'woocommerce', label: 'WooCommerce', color: 'border-[#7F54B3] hover:bg-[#7F54B3]/10' },
                { id: 'atlas', label: 'Atlas CMS', color: 'border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id as any)}
                  className={`p-3 rounded-xl border-2 font-medium transition-all ${platform === p.id ? p.color + ' shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Count Slider */}
          <div>
            <div className="flex justify-between mb-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                2. Number of Products
              </label>
              <span className="font-bold text-blue-600">{products}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={products} 
              onChange={(e) => setProducts(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-blue-600"
            />
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Info className="w-3 h-3" /> Base package includes 50 product uploads.
            </p>
          </div>

          {/* Add-ons */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              3. Additional Services (Optional)
            </label>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input 
                  type="checkbox" 
                  checked={needMaintenance}
                  onChange={(e) => setNeedMaintenance(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium">Annual Maintenance Contract</div>
                  <div className="text-xs text-slate-500">Updates, backups, security, and technical support.</div>
                </div>
                <div className="font-semibold text-sm">+₹15,000</div>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <input 
                  type="checkbox" 
                  checked={needAdvancedSeo}
                  onChange={(e) => setNeedAdvancedSeo(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium">Advanced SEO Package</div>
                  <div className="text-xs text-slate-500">Keyword research, schema markup, and speed optimization.</div>
                </div>
                <div className="font-semibold text-sm">+₹20,000</div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-8 md:w-1/3 bg-slate-50 dark:bg-slate-800 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">Estimated Investment</h3>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Development Cost</span>
              <span className="font-medium">₹{calculateTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-start text-sm">
              <span className="text-slate-600 dark:text-slate-400">Platform Fees<br/>(Recurring)</span>
              <span className="font-medium text-right text-rose-600 dark:text-rose-400">{getMonthlyCost()}</span>
            </div>
          </div>
          
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-6">
            <div className="text-sm text-blue-800 dark:text-blue-300 mb-1">Total Setup Cost</div>
            <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-200 flex items-center">
              <IndianRupee className="w-6 h-6 mr-1" />
              {calculateTotal().toLocaleString('en-IN')}
            </div>
          </div>
          
          <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-8">
            *This is a rough estimate. Final pricing may vary based on specific custom requirements, third-party integrations, and design complexity.
          </p>
        </div>
        
        <a 
          href="https://wa.me/919843199556?text=Hi%20Grekam%20Visuals%2C%20I%20calculated%20my%20project%20estimate%20on%20your%20website%20and%20would%20like%20an%20exact%20quote." 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-4 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white transition-colors"
        >
          Get Exact Quote on WhatsApp
        </a>
      </div>

    </div>
  );
}
