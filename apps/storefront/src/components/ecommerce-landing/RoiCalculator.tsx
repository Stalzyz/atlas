'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, MousePointerClick, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoiCalculator() {
  const [traffic, setTraffic] = useState(1000);
  const [conversionRate, setConversionRate] = useState(2);
  const [avgOrderValue, setAvgOrderValue] = useState(1500);

  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  useEffect(() => {
    const orders = traffic * (conversionRate / 100);
    const revenue = orders * avgOrderValue;
    setMonthlyRevenue(Math.round(revenue));
    setYearlyRevenue(Math.round(revenue * 12));
  }, [traffic, conversionRate, avgOrderValue]);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl border border-blue-500/30 p-8 h-full flex flex-col text-white">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">ROI Estimator</h3>
        <p className="text-blue-100">See how much revenue an online store could generate based on estimated traffic.</p>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-blue-100 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4" /> Monthly Website Visitors
            </label>
            <span className="font-bold">{traffic.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="100000" 
            step="100"
            value={traffic} 
            onChange={(e) => setTraffic(Number(e.target.value))}
            className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-blue-100">Conversion Rate (%)</label>
            <span className="font-bold">{conversionRate}%</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="10" 
            step="0.5"
            value={conversionRate} 
            onChange={(e) => setConversionRate(Number(e.target.value))}
            className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-white"
          />
          <p className="text-xs text-blue-200/60 mt-1">Industry average is 2-3%</p>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-blue-100">Avg. Order Value (₹)</label>
            <span className="font-bold">₹{avgOrderValue.toLocaleString()}</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100"
            value={avgOrderValue} 
            onChange={(e) => setAvgOrderValue(Number(e.target.value))}
            className="w-full h-2 bg-blue-900/50 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="flex items-center gap-2 mb-4 text-blue-100 font-medium">
          <TrendingUp className="w-5 h-5 text-green-400" /> Estimated Potential Revenue
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-blue-200 mb-1">Monthly</div>
            <motion.div 
              key={monthlyRevenue}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold flex items-center"
            >
              <IndianRupee className="w-5 h-5 mr-1" />
              {monthlyRevenue.toLocaleString('en-IN')}
            </motion.div>
          </div>
          <div>
            <div className="text-sm text-blue-200 mb-1">Yearly</div>
            <motion.div 
              key={yearlyRevenue}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold flex items-center text-green-300"
            >
              <IndianRupee className="w-5 h-5 mr-1" />
              {yearlyRevenue.toLocaleString('en-IN')}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
