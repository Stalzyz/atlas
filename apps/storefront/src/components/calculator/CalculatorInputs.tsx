import React, from 'react';
import { useShopifyCalculator, PLAN_PRICING, GATEWAY_FEES, THEME_PRICING, DEVELOPER_PRICING } from '@/hooks/useShopifyCalculator';
import { Plus, X, Check } from 'lucide-react';

interface Props {
  calculator: ReturnType<typeof useShopifyCalculator>;
}

export function CalculatorInputs({ calculator }: Props) {
  const { state, actions, derived } = calculator;

  return (
    <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
      
      {/* SECTION: Core Business Metrics */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">1</span>
          Core Business Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 md:col-span-2 lg:col-span-1">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">Monthly Sales Volume</label>
              <span className="text-sm font-bold text-green-600">
                ₹{state.monthlySales.toLocaleString('en-IN')}
              </span>
            </div>
            <input 
              type="range" 
              min="10000" 
              max="10000000" 
              step="10000"
              value={state.monthlySales}
              onChange={(e) => actions.setMonthlySales(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>₹10k</span>
              <span>₹1Cr+</span>
            </div>
          </div>

          {state.isAdvancedMode && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Average Order Value (AOV)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input 
                  type="number"
                  value={state.aov}
                  onChange={(e) => actions.setAov(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-500">
                Est. Orders: <strong className="text-gray-700">{derived.ordersPerMonth.toLocaleString()}</strong> per month
              </p>
            </div>
          )}
        </div>
        
        {!state.isAdvancedMode && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => actions.setIsAdvancedMode(true)}
              className="text-sm font-medium text-gray-500 hover:text-green-600 bg-gray-50 hover:bg-green-50 px-6 py-2.5 rounded-full transition-all border border-gray-200 hover:border-green-200 flex items-center gap-2"
            >
              <span className="text-lg">⚙️</span> Show Advanced Settings
            </button>
          </div>
        )}
      </div>

      {state.isAdvancedMode && (
        <>
          <hr className="border-gray-100" />

      {/* SECTION: Shopify Plan & Payment */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">2</span>
          Platform & Payments
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Shopify Plan</label>
            <select 
              value={state.plan}
              onChange={(e) => actions.setPlan(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none bg-white"
            >
              {Object.keys(PLAN_PRICING).map(p => (
                <option key={p} value={p}>{p} {p !== 'Custom' ? `(₹${PLAN_PRICING[p as keyof typeof PLAN_PRICING].toLocaleString()}/mo)` : ''}</option>
              ))}
            </select>
            {state.plan === 'Custom' && (
              <input 
                type="number"
                placeholder="Monthly Plan Cost (₹)"
                value={state.customPlanCost}
                onChange={(e) => actions.setCustomPlanCost(Number(e.target.value))}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              />
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Payment Gateway</label>
            <select 
              value={state.gateway}
              onChange={(e) => actions.setGateway(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none bg-white"
            >
              {Object.keys(GATEWAY_FEES).map(g => (
                <option key={g} value={g}>{g} {g !== 'Custom' ? `(${GATEWAY_FEES[g as keyof typeof GATEWAY_FEES]}%)` : ''}</option>
              ))}
            </select>
            {state.gateway === 'Custom' && (
              <div className="relative mt-2">
                <input 
                  type="number"
                  step="0.1"
                  placeholder="Gateway Fee %"
                  value={state.customGatewayFee}
                  onChange={(e) => actions.setCustomGatewayFee(Number(e.target.value))}
                  className="w-full pr-8 pl-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* SECTION: Apps & Addons */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">3</span>
            Shopify App Stack
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Total: <span className="text-gray-900 font-bold">₹{derived.monthlyAppsCost.toLocaleString()}/mo</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {state.apps.map(app => (
            <div 
              key={app.id}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                app.enabled 
                  ? 'border-green-500 bg-green-50/50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 bg-gray-50'
              }`}
              onClick={() => actions.toggleApp(app.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border ${app.enabled ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 bg-white'}`}>
                    {app.enabled && <Check size={14} strokeWidth={3} />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${app.enabled ? 'text-green-900' : 'text-gray-700'}`}>{app.name}</p>
                  </div>
                </div>
              </div>
              
              {app.enabled && (
                <div className="mt-3 pl-8 relative" onClick={e => e.stopPropagation()}>
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium z-10">₹</span>
                  <input 
                    type="number" 
                    value={app.cost}
                    onChange={(e) => actions.updateAppCost(app.id, Number(e.target.value))}
                    className="w-full bg-white border border-green-200 rounded-lg pl-6 pr-3 py-1.5 text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">/mo</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* SECTION: Setup & Development */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm">4</span>
          Setup & Development
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Theme Cost (One-time)</label>
            <select 
              value={state.themeTier}
              onChange={(e) => actions.setThemeTier(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none bg-white"
            >
              {Object.keys(THEME_PRICING).map(t => (
                <option key={t} value={t}>{t} {t !== 'Custom' && t !== 'Free' ? `(₹${THEME_PRICING[t as keyof typeof THEME_PRICING].toLocaleString()})` : ''}</option>
              ))}
            </select>
            {state.themeTier === 'Custom' && (
              <input 
                type="number"
                placeholder="Custom Theme Cost (₹)"
                value={state.customThemeCost}
                onChange={(e) => actions.setCustomThemeCost(Number(e.target.value))}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              />
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Developer Setup (One-time)</label>
            <select 
              value={state.devTier}
              onChange={(e) => actions.setDevTier(e.target.value as any)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all appearance-none bg-white"
            >
              {Object.keys(DEVELOPER_PRICING).map(d => (
                <option key={d} value={d}>{d} {d !== 'Custom' && d !== 'None' ? `(₹${DEVELOPER_PRICING[d as keyof typeof DEVELOPER_PRICING].toLocaleString()})` : ''}</option>
              ))}
            </select>
            {state.devTier === 'Custom' && (
              <input 
                type="number"
                placeholder="Custom Developer Cost (₹)"
                value={state.customDevCost}
                onChange={(e) => actions.setCustomDevCost(Number(e.target.value))}
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => actions.setIsAdvancedMode(false)}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 px-6 py-2 transition-all"
        >
          Hide Advanced Settings
        </button>
      </div>
      </>
      )}
    </div>
  );
}
