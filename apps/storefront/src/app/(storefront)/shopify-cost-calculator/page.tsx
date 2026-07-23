import React from 'react';
import { Metadata } from 'next';
import { ShopifyCostCalculator } from '@/components/calculator/ShopifyCostCalculator';

export const metadata: Metadata = {
  title: 'Shopify Cost Calculator | True Cost of eCommerce',
  description: 'Calculate your actual yearly Shopify expenses including subscriptions, transaction fees, paid apps, and hidden costs, and compare it with owning your own enterprise eCommerce platform.',
  openGraph: {
    title: 'Shopify Cost Calculator',
    description: 'Calculate your true eCommerce platform costs over 5 years.',
    type: 'website',
  }
};

export default function ShopifyCostCalculatorPage() {
  return <ShopifyCostCalculator />;
}
