import { useState, useMemo } from 'react';

export type AppAddon = {
  id: string;
  name: string;
  defaultCost: number;
  cost: number;
  enabled: boolean;
};

export const DEFAULT_APPS: AppAddon[] = [
  { id: 'reviews', name: 'Judge.me / Loox', defaultCost: 1500, cost: 1500, enabled: true },
  { id: 'email', name: 'Klaviyo / Email Marketing', defaultCost: 1500, cost: 1500, enabled: true },
  { id: 'shipping', name: 'Shiprocket / Shipping', defaultCost: 1500, cost: 1500, enabled: true },
  { id: 'subscriptions', name: 'Recharge / Subscriptions', defaultCost: 2000, cost: 2000, enabled: false },
  { id: 'pagebuilder', name: 'PageFly / Page Builder', defaultCost: 2000, cost: 2000, enabled: false },
  { id: 'seo', name: 'SEO App', defaultCost: 1000, cost: 1000, enabled: false },
  { id: 'bundles', name: 'Bundle App', defaultCost: 1200, cost: 1200, enabled: false },
  { id: 'wishlist', name: 'Wishlist', defaultCost: 500, cost: 500, enabled: false },
  { id: 'loyalty', name: 'Loyalty Program', defaultCost: 2500, cost: 2500, enabled: false },
  { id: 'whatsapp', name: 'WhatsApp Automation', defaultCost: 1000, cost: 1000, enabled: true },
  { id: 'erp', name: 'ERP Connector', defaultCost: 5000, cost: 5000, enabled: false },
  { id: 'gst', name: 'GST Invoice', defaultCost: 500, cost: 500, enabled: false },
];

export const PLAN_PRICING = {
  'Basic': 1499,
  'Grow': 5599,
  'Advanced': 22499,
  'Plus': 200000, // Approximate starting price
  'Custom': 0,
};

export const GATEWAY_FEES = {
  'Shopify Payments': 2.0,
  'Razorpay': 2.0,
  'Cashfree': 2.0,
  'PhonePe': 1.5,
  'PayU': 2.0,
  'Stripe': 2.9,
  'Custom': 2.0,
};

export const THEME_PRICING = {
  'Free': 0,
  'Premium (Standard)': 20000,
  'Premium (Advanced)': 30000,
  'Premium (Enterprise)': 40000,
  'Custom': 0,
};

export const DEVELOPER_PRICING = {
  'None': 0,
  'Freelancer': 75000,
  'Agency': 300000,
  'Custom': 0,
};

export function useShopifyCalculator() {
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  // Base Settings
  const [monthlySales, setMonthlySales] = useState<number>(500000); // Default 5L
  const [aov, setAov] = useState<number>(1499);
  
  // Shopify Core
  const [plan, setPlan] = useState<keyof typeof PLAN_PRICING>('Basic');
  const [customPlanCost, setCustomPlanCost] = useState<number>(0);
  
  const [gateway, setGateway] = useState<keyof typeof GATEWAY_FEES>('Razorpay');
  const [customGatewayFee, setCustomGatewayFee] = useState<number>(2.0);

  // Additional SaaS / Apps
  const [apps, setApps] = useState<AppAddon[]>(DEFAULT_APPS);
  const [customApps, setCustomApps] = useState<{name: string, cost: number}[]>([]);

  // Fixed/One-time Costs
  const [themeTier, setThemeTier] = useState<keyof typeof THEME_PRICING>('Premium (Standard)');
  const [customThemeCost, setCustomThemeCost] = useState<number>(0);
  
  const [devTier, setDevTier] = useState<keyof typeof DEVELOPER_PRICING>('Freelancer');
  const [customDevCost, setCustomDevCost] = useState<number>(0);

  // Ongoing Operational Costs
  const [maintenance, setMaintenance] = useState<number>(2000);

  // Own Platform Comparison
  const [ownPlatformSetup, setOwnPlatformSetup] = useState<number>(150000);
  const [ownPlatformAnnualMaintenance, setOwnPlatformAnnualMaintenance] = useState<number>(24000);
  const [ownPlatformGatewayFee, setOwnPlatformGatewayFee] = useState<number>(1.5); // Cheaper direct negotiated rate

  // Auto-Inferred Simple Values
  const inferredPlanCost = useMemo(() => {
    if (monthlySales < 500000) return PLAN_PRICING['Basic'];
    if (monthlySales < 2500000) return PLAN_PRICING['Grow'];
    return PLAN_PRICING['Advanced'];
  }, [monthlySales]);

  const inferredAppsCost = useMemo(() => {
    if (monthlySales < 500000) return 3000; // Minimal apps
    if (monthlySales < 2500000) return 6000; // Growing stack
    if (monthlySales < 5000000) return 12000; // Solid stack
    return 25000; // Enterprise stack
  }, [monthlySales]);

  const activePlanCost = isAdvancedMode ? (plan === 'Custom' ? customPlanCost : PLAN_PRICING[plan]) : inferredPlanCost;
  const activeGatewayFee = isAdvancedMode ? (gateway === 'Custom' ? customGatewayFee : GATEWAY_FEES[gateway]) : 2.0; // Default 2%
  const activeThemeCost = isAdvancedMode ? (themeTier === 'Custom' ? customThemeCost : THEME_PRICING[themeTier]) : 0;
  const activeDevCost = isAdvancedMode ? (devTier === 'Custom' ? customDevCost : DEVELOPER_PRICING[devTier]) : 0;

  // Calculated Values
  const ordersPerMonth = useMemo(() => {
    if (aov <= 0) return 0;
    return Math.ceil(monthlySales / aov);
  }, [monthlySales, aov]);

  const monthlyGatewayCost = (monthlySales * activeGatewayFee) / 100;

  const monthlyAppsCost = useMemo(() => {
    if (!isAdvancedMode) return inferredAppsCost;
    const builtinCost = apps.filter(a => a.enabled).reduce((sum, app) => sum + app.cost, 0);
    const customCost = customApps.reduce((sum, app) => sum + app.cost, 0);
    return builtinCost + customCost;
  }, [isAdvancedMode, inferredAppsCost, apps, customApps]);

  const totalMonthlyOperational = activePlanCost + monthlyAppsCost + (isAdvancedMode ? maintenance : 0);
  
  // First Year Shopify
  const shopifyFirstYear = (totalMonthlyOperational * 12) + (monthlyGatewayCost * 12) + activeThemeCost + activeDevCost;
  
  // Year 2+ Shopify (Excludes Theme and Dev setup)
  const shopifyAnnualRecurring = (totalMonthlyOperational * 12) + (monthlyGatewayCost * 12);
  
  const shopify3Year = shopifyFirstYear + (shopifyAnnualRecurring * 2);
  const shopify5Year = shopifyFirstYear + (shopifyAnnualRecurring * 4);

  // Own Platform Calcs
  const ownMonthlyGatewayCost = (monthlySales * ownPlatformGatewayFee) / 100;
  const ownPlatformFirstYear = ownPlatformSetup + ownPlatformAnnualMaintenance + (ownMonthlyGatewayCost * 12);
  const ownPlatformAnnualRecurring = ownPlatformAnnualMaintenance + (ownMonthlyGatewayCost * 12);
  
  const ownPlatform3Year = ownPlatformFirstYear + (ownPlatformAnnualRecurring * 2);
  const ownPlatform5Year = ownPlatformFirstYear + (ownPlatformAnnualRecurring * 4);

  // Savings
  const savings1Year = shopifyFirstYear - ownPlatformFirstYear;
  const savings3Year = shopify3Year - ownPlatform3Year;
  const savings5Year = shopify5Year - ownPlatform5Year;

  // Break-even Calculation (Months)
  // When does (Own Setup - Shopify Setup) = (Shopify Monthly - Own Monthly) * Months
  const shopifySetup = activeThemeCost + activeDevCost;
  const setupDifference = ownPlatformSetup - shopifySetup;
  
  const shopifyMonthly = totalMonthlyOperational + monthlyGatewayCost;
  const ownMonthly = (ownPlatformAnnualMaintenance / 12) + ownMonthlyGatewayCost;
  const monthlySavings = shopifyMonthly - ownMonthly;

  const breakEvenMonths = monthlySavings > 0 
    ? (setupDifference > 0 ? Math.ceil(setupDifference / monthlySavings) : 0)
    : -1; // Never breaks even if monthly is higher

  const toggleApp = (id: string) => {
    setApps(apps.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const updateAppCost = (id: string, cost: number) => {
    setApps(apps.map(a => a.id === id ? { ...a, cost } : a));
  };

  const addCustomApp = (name: string, cost: number) => {
    setCustomApps([...customApps, { name, cost }]);
  };

  const removeCustomApp = (index: number) => {
    const newApps = [...customApps];
    newApps.splice(index, 1);
    setCustomApps(newApps);
  };

  return {
    state: {
      isAdvancedMode,
      monthlySales,
      aov,
      plan,
      customPlanCost,
      gateway,
      customGatewayFee,
      apps,
      customApps,
      themeTier,
      customThemeCost,
      devTier,
      customDevCost,
      maintenance,
      ownPlatformSetup,
      ownPlatformAnnualMaintenance,
      ownPlatformGatewayFee,
    },
    actions: {
      setIsAdvancedMode,
      setMonthlySales,
      setAov,
      setPlan,
      setCustomPlanCost,
      setGateway,
      setCustomGatewayFee,
      toggleApp,
      updateAppCost,
      addCustomApp,
      removeCustomApp,
      setThemeTier,
      setCustomThemeCost,
      setDevTier,
      setCustomDevCost,
      setMaintenance,
      setOwnPlatformSetup,
      setOwnPlatformAnnualMaintenance,
      setOwnPlatformGatewayFee,
    },
    derived: {
      ordersPerMonth,
      activePlanCost,
      monthlyGatewayCost,
      monthlyAppsCost,
      totalMonthlyOperational,
      shopifyMonthly,
      shopifyFirstYear,
      shopify3Year,
      shopify5Year,
      ownMonthlyGatewayCost,
      ownPlatformFirstYear,
      ownPlatform3Year,
      ownPlatform5Year,
      savings1Year,
      savings3Year,
      savings5Year,
      breakEvenMonths,
      monthlySavings,
      shopifySetup
    }
  };
}
