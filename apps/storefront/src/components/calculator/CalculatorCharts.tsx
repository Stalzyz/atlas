import React from 'react';
import { useShopifyCalculator } from '@/hooks/useShopifyCalculator';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Props {
  calculator: ReturnType<typeof useShopifyCalculator>;
}

export function CalculatorCharts({ calculator }: Props) {
  const { derived } = calculator;

  const comparisonData = [
    {
      name: 'Year 1',
      Shopify: derived.shopifyFirstYear,
    },
    {
      name: 'Year 3',
      Shopify: derived.shopify3Year,
    },
    {
      name: 'Year 5',
      Shopify: derived.shopify5Year,
    },
  ];

  const breakdownData = [
    { name: 'Platform Plan', value: derived.activePlanCost * 12 },
    { name: 'Gateway Fees', value: derived.monthlyGatewayCost * 12 },
    { name: 'Apps & Addons', value: derived.monthlyAppsCost * 12 },
    { name: 'Maintenance', value: calculator.state.maintenance * 12 },
  ].filter(d => d.value > 0);

  const COLORS = ['#16A34A', '#F59E0B', '#3B82F6', '#6366F1', '#EC4899'];

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="space-y-8">
      {/* 5 Year Comparison Bar Chart */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Total Cost of Ownership (5 Years)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
              <YAxis 
                tickFormatter={formatCurrency}
                axisLine={false}
                tickLine={false}
                tick={{fill: '#6B7280'}}
              />
              <RechartsTooltip 
                formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                cursor={{fill: '#F3F4F6'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Shopify" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
