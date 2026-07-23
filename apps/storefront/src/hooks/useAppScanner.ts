import { useState, useMemo } from 'react';

export interface ScannerApp {
  id: string;
  name: string;
  category: string;
  avgMonthlyCost: number;
  icon: string;
  isNativeToAtlas: boolean;
  atlasFeatureName: string;
}

export const APP_CATALOG: ScannerApp[] = [
  // Marketing & Email
  { id: 'klaviyo', name: 'Klaviyo', category: 'Email & SMS', avgMonthlyCost: 4500, icon: '📧', isNativeToAtlas: false, atlasFeatureName: '' },
  { id: 'mailchimp', name: 'Mailchimp', category: 'Email & SMS', avgMonthlyCost: 2500, icon: '📨', isNativeToAtlas: false, atlasFeatureName: '' },
  { id: 'omnisend', name: 'Omnisend', category: 'Email & SMS', avgMonthlyCost: 3000, icon: '📩', isNativeToAtlas: false, atlasFeatureName: '' },
  
  // Reviews & UGC
  { id: 'judgeme', name: 'Judge.me', category: 'Reviews', avgMonthlyCost: 1200, icon: '⭐', isNativeToAtlas: true, atlasFeatureName: 'Native Product Reviews' },
  { id: 'loox', name: 'Loox', category: 'Reviews', avgMonthlyCost: 2900, icon: '📸', isNativeToAtlas: true, atlasFeatureName: 'Native Product Reviews' },
  { id: 'yotpo', name: 'Yotpo Reviews', category: 'Reviews', avgMonthlyCost: 5000, icon: '🌟', isNativeToAtlas: true, atlasFeatureName: 'Native Product Reviews' },

  // Loyalty & Rewards
  { id: 'smile', name: 'Smile.io', category: 'Loyalty', avgMonthlyCost: 3900, icon: '🎁', isNativeToAtlas: true, atlasFeatureName: 'Atlas Credit Wallet' },
  { id: 'loyaltylion', name: 'LoyaltyLion', category: 'Loyalty', avgMonthlyCost: 8000, icon: '🦁', isNativeToAtlas: true, atlasFeatureName: 'Atlas Credit Wallet' },

  // Page Builders
  { id: 'pagefly', name: 'PageFly', category: 'Page Builder', avgMonthlyCost: 2000, icon: '📄', isNativeToAtlas: true, atlasFeatureName: 'Drag-and-Drop CMS' },
  { id: 'shogun', name: 'Shogun', category: 'Page Builder', avgMonthlyCost: 3500, icon: '🎨', isNativeToAtlas: true, atlasFeatureName: 'Drag-and-Drop CMS' },

  // Subscriptions
  { id: 'recharge', name: 'Recharge', category: 'Subscriptions', avgMonthlyCost: 7900, icon: '🔄', isNativeToAtlas: true, atlasFeatureName: 'Recurring Billing Engine' },
  { id: 'skio', name: 'Skio', category: 'Subscriptions', avgMonthlyCost: 15000, icon: '📦', isNativeToAtlas: true, atlasFeatureName: 'Recurring Billing Engine' },

  // Search & Filters
  { id: 'searchanise', name: 'Searchanise', category: 'Search', avgMonthlyCost: 1500, icon: '🔍', isNativeToAtlas: true, atlasFeatureName: 'Algolia-powered Global Search' },
  { id: 'boostcommerce', name: 'Boost Commerce', category: 'Search', avgMonthlyCost: 4000, icon: '⚡', isNativeToAtlas: true, atlasFeatureName: 'Algolia-powered Global Search' },

  // Shipping & Fulfillment
  { id: 'shiprocket', name: 'Shiprocket', category: 'Logistics', avgMonthlyCost: 1000, icon: '🚀', isNativeToAtlas: false, atlasFeatureName: '' },
  
  // B2B & Wholesale
  { id: 'sparklayer', name: 'SparkLayer', category: 'B2B', avgMonthlyCost: 12000, icon: '🏢', isNativeToAtlas: true, atlasFeatureName: 'Atlas Wholesale Portal' },
  { id: 'b2b-handsfree', name: 'B2B Handsfree', category: 'B2B', avgMonthlyCost: 8000, icon: '🤝', isNativeToAtlas: true, atlasFeatureName: 'Atlas Wholesale Portal' },
];

export function useAppScanner() {
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [step, setStep] = useState<'selection' | 'lead-capture' | 'results'>('selection');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const toggleApp = (id: string) => {
    setSelectedAppIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const selectedApps = useMemo(() => {
    return APP_CATALOG.filter(app => selectedAppIds.includes(app.id));
  }, [selectedAppIds]);

  const totalMonthlySpend = useMemo(() => {
    return selectedApps.reduce((sum, app) => sum + app.avgMonthlyCost, 0);
  }, [selectedApps]);

  const appsReplacedByAtlas = useMemo(() => {
    return selectedApps.filter(app => app.isNativeToAtlas);
  }, [selectedApps]);

  const wastedSpendReplaced = useMemo(() => {
    return appsReplacedByAtlas.reduce((sum, app) => sum + app.avgMonthlyCost, 0);
  }, [appsReplacedByAtlas]);

  const remainingSpend = totalMonthlySpend - wastedSpendReplaced;

  const handleAnalyze = () => {
    if (selectedAppIds.length === 0) return;
    setStep('lead-capture');
  };

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Here we would typically send to an API endpoint
    console.log('Lead Captured:', { name, email, selectedAppIds, totalMonthlySpend });
    setStep('results');
  };

  const reset = () => {
    setSelectedAppIds([]);
    setStep('selection');
    setEmail('');
    setName('');
  };

  return {
    state: {
      step,
      selectedAppIds,
      selectedApps,
      totalMonthlySpend,
      appsReplacedByAtlas,
      wastedSpendReplaced,
      remainingSpend,
      email,
      name
    },
    actions: {
      toggleApp,
      handleAnalyze,
      handleSubmitLead,
      setEmail,
      setName,
      reset
    }
  };
}
