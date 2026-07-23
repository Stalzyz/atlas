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

export const metadata: Metadata = {
  title: 'Build an Online Store That Sells 24x7 | Grekam Visuals',
  description: 'We create online shopping experiences that help businesses sell more. Choose between Shopify, WooCommerce, and Atlas CMS.',
};

export default function EcommerceLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      <HeroSection />
      <BenefitsSection />
      
      {/* Interactive Tools Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
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
      
      {/* Final CTA */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to Start Selling Online?</h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Whether you're launching your first online store or upgrading an existing one, Grekam Visuals will help you choose the right platform and build a website that grows with your business.
          </p>
          <a href="#contact" className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-10 rounded-full text-xl transition-all hover:scale-105 shadow-xl hover:shadow-2xl">
            Book a Free Consultation Today
          </a>
        </div>
      </section>
    </div>
  );
}
