'use client';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function PricingSection() {
  const plans = [
    {
      name: 'Shopify Website',
      price: '35,000',
      description: 'Perfect for startups wanting a quick, hassle-free launch.',
      features: [
        'Premium Shopify Theme Setup',
        'Up to 50 Products Upload',
        'Payment Gateway Integration',
        'Mobile Responsive Design',
        'Basic SEO Setup',
        'Admin Training',
        '30 Days Support'
      ],
      color: 'bg-white text-slate-900 border-slate-200',
      button: 'bg-slate-900 text-white hover:bg-slate-800'
    },
    {
      name: 'WooCommerce Website',
      price: '45,000',
      description: 'Ideal for growing businesses needing flexibility and ownership.',
      features: [
        'Custom WordPress Theme',
        'Up to 100 Products Upload',
        'Payment Gateway & Shipping',
        'Advanced Customization',
        'Basic SEO Setup',
        'Admin Training',
        '30 Days Support'
      ],
      color: 'bg-white text-slate-900 border-slate-200',
      button: 'bg-slate-900 text-white hover:bg-slate-800'
    },
    {
      name: 'Atlas CMS',
      price: '75,000',
      description: 'Enterprise-grade platform for scaling serious brands.',
      features: [
        'Custom Storefront (Next.js)',
        'Unlimited Products Capability',
        'Built-in CRM & Analytics',
        'WhatsApp Automation Ready',
        'Advanced SEO Architecture',
        'Priority Development Support',
        '60 Days Extended Support'
      ],
      color: 'bg-blue-600 text-white border-blue-500 scale-105 shadow-2xl relative',
      button: 'bg-white text-blue-600 hover:bg-blue-50'
    }
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white"
          >
            Transparent Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            No hidden charges. Choose the platform that fits your budget and goals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-3xl border p-8 flex flex-col h-full ${plan.color} ${plan.name !== 'Atlas CMS' ? 'dark:bg-slate-800 dark:border-slate-700 dark:text-white' : ''}`}
            >
              {plan.name === 'Atlas CMS' && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  MOST POWERFUL
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm ${plan.name === 'Atlas CMS' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="text-sm font-medium opacity-80">Starting at</span>
                <div className="flex items-baseline mt-1">
                  <span className="text-3xl font-bold mr-1">₹</span>
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.name === 'Atlas CMS' ? 'text-blue-200' : 'text-blue-500'}`} />
                    <span className="text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <a 
                href="#consultation" 
                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.button}`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          *Third-party costs like domain names, hosting, Shopify subscriptions, premium themes, and paid apps are charged separately and paid directly to the providers.
        </div>
      </div>
    </section>
  );
}
