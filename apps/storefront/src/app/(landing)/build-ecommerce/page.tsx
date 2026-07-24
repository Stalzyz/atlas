import { Metadata } from 'next';
import HeroSection from '@/components/ecommerce-landing/HeroSection';
import BenefitsSection from '@/components/ecommerce-landing/BenefitsSection';
import HowItWorks from '@/components/ecommerce-landing/HowItWorks';
import PlatformComparison from '@/components/ecommerce-landing/PlatformComparison';
import DevelopmentProcess from '@/components/ecommerce-landing/DevelopmentProcess';
import PricingSection from '@/components/ecommerce-landing/PricingSection';
import FaqSection from '@/components/ecommerce-landing/FaqSection';
import TrustIndicators from '@/components/ecommerce-landing/TrustIndicators';
import InteractivePlatformFinder from '@/components/ecommerce-landing/InteractivePlatformFinder';
import PricingCalculator from '@/components/ecommerce-landing/PricingCalculator';
import RoiCalculator from '@/components/ecommerce-landing/RoiCalculator';
import LandingFooter from '@/components/ecommerce-landing/LandingFooter';
import BottomStickyCta from '@/components/ecommerce-landing/BottomStickyCta';

export const metadata: Metadata = {
  title: 'Build an Online Store That Sells 24x7 | Grekam Visuals',
  description: 'We create online shopping experiences that help businesses sell more. Choose between Shopify, WooCommerce, and Atlas CMS.',
  icons: {
    icon: '/logo-short.svg',
    shortcut: '/logo-short.svg',
    apple: '/logo-short.svg',
  },
};

export default function EcommerceLandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroSection />
      <BenefitsSection />
      
      {/* Interactive Tools Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">See What eCommerce Can Do For You</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Use our interactive tools to calculate your potential ROI and find the right platform for your business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <RoiCalculator />
            <InteractivePlatformFinder />
          </div>
        </div>
      </section>

      <HowItWorks />
      <PlatformComparison />
      
      <section className="py-20 bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Estimate Your Project Cost</h2>
          <div className="max-w-4xl mx-auto">
            <PricingCalculator />
          </div>
        </div>
      </section>

      <PricingSection />
      <DevelopmentProcess />
      <TrustIndicators />
      <FaqSection />
      
      {/* Final CTA in Logo Emerald Green */}
      <section className="py-24 bg-emerald-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight">Ready to Start Selling Online?</h2>
          <p className="text-xl md:text-2xl mb-12 opacity-95 font-light">
            Whether you're launching your first online store or upgrading an existing one, Grekam Visuals will help you choose the right platform and build a website that grows with your business.
          </p>
          <a 
            href="https://wa.me/919843199556?text=Hi%20Grekam%20Visuals%2C%20I%20want%20to%20build%20an%20online%20store%20for%20my%20business." 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white text-emerald-800 hover:bg-slate-100 font-extrabold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 shadow-2xl"
          >
            Chat on WhatsApp for Free Consultation
          </a>
        </div>
      </section>

      {/* Footer with Logo */}
      <LandingFooter />

      {/* Fixed Bottom Static CTA */}
      <BottomStickyCta />
    </div>
  );
}
