'use client';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';

export default function PlatformComparison() {
  const platforms = [
    {
      id: 'shopify',
      name: 'Shopify Website',
      badge: 'Startups & Quick Launch',
      color: 'bg-[#95bf47]',
      textColor: 'text-[#95bf47]',
      bestFor: ['New Businesses', 'Fashion Stores', 'Small Businesses', 'Beauty Products', 'Lifestyle Brands'],
      advantages: [
        'Very easy to use', 'Fast setup', 'Highly secure', 'Excellent performance', 
        'Thousands of apps', 'Reliable hosting', 'No technical knowledge required'
      ],
      limitations: [
        'Monthly subscription', 'Paid apps increase cost', 'Limited customization', 
        'Platform controlled by Shopify', 'Less flexibility for advanced features'
      ],
      pricing: {
        dev: '₹35,000 onwards',
        recurring: '₹2,000–₹3,000/month (Shopify)',
        domain: '₹1,000/year'
      },
      verdict: 'You want a hassle-free online store that is easy to manage.'
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce Website',
      subtitle: 'Built on WordPress',
      badge: 'Complete Ownership',
      color: 'bg-[#7F54B3]',
      textColor: 'text-[#7F54B3]',
      bestFor: ['Growing Businesses wanting complete ownership', 'Bloggers', 'Custom Stores'],
      advantages: [
        'Lower recurring cost', 'Unlimited customization', 'Thousands of plugins', 
        'Complete ownership', 'SEO friendly', 'Flexible design'
      ],
      limitations: [
        'Needs reliable hosting', 'Regular maintenance required', 'Plugin updates', 
        'Can become slow if poorly managed', 'Requires technical support'
      ],
      pricing: {
        dev: '₹45,000 onwards',
        recurring: '₹5,000–₹15,000/year (Hosting)',
        domain: '₹1,000/year'
      },
      verdict: 'You need flexibility and complete control over your website.'
    },
    {
      id: 'atlas',
      name: 'Atlas CMS',
      subtitle: "Grekam Visuals' Own Platform",
      badge: 'Enterprise & Scaling',
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      bestFor: ['Growing Businesses', 'Manufacturers', 'Wholesalers', 'Retail Chains', 'Franchises', 'Large Product Catalogs', 'Multi-Vendor Businesses'],
      advantages: [
        'Complete ownership', 'Highly customizable', 'Fast performance', 'Modern Admin Panel',
        'Built-in CRM', 'WhatsApp Integration', 'Inventory & Order Management', 'Marketing Automation',
        'Role Management', 'Analytics Dashboard', 'API Ready', 'Multi-user access', 'No plugin dependency'
      ],
      limitations: [
        'Higher initial investment', 'Requires implementation planning'
      ],
      pricing: {
        dev: '₹75,000 onwards',
        recurring: 'Depends on traffic (Hosting only)',
        domain: 'No monthly platform subscription'
      },
      verdict: 'Your business plans to scale over the next few years and needs advanced features.'
    }
  ];

  return (
    <section id="platforms" className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Which E-Commerce Platform Is Right For You?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            Not every business needs the same solution. We help you choose the right one.
          </motion.p>
        </div>

        {/* Detailed Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl border-2 overflow-hidden flex flex-col bg-white dark:bg-slate-900 
                ${platform.id === 'atlas' ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-slate-200 dark:border-slate-800'}
              `}
            >
              <div className={`${platform.color} text-white p-6 relative`}>
                {platform.id === 'atlas' && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg">
                    RECOMMENDED
                  </div>
                )}
                <span className="inline-block bg-black/20 rounded-full px-3 py-1 text-xs font-semibold mb-3">
                  {platform.badge}
                </span>
                <h3 className="text-2xl font-bold">{platform.name}</h3>
                {platform.subtitle && <p className="text-white/80 text-sm mt-1">{platform.subtitle}</p>}
              </div>

              <div className="p-6 flex-1 flex flex-col gap-6">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wider">Best For</h4>
                  <div className="flex flex-wrap gap-2">
                    {platform.bestFor.map((item, i) => (
                      <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 mb-3 text-sm uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-4 h-4" /> Advantages
                  </h4>
                  <ul className="space-y-2">
                    {platform.advantages.map((adv, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span> {adv}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-rose-600 dark:text-rose-400 mb-3 text-sm uppercase tracking-wider flex items-center gap-1">
                    <X className="w-4 h-4" /> Limitations
                  </h4>
                  <ul className="space-y-2">
                    {platform.limitations.map((limit, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">•</span> {limit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-t border-slate-100 dark:border-slate-800">
                <div className="mb-4">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Pricing</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-500">Development:</div>
                    <div className="font-semibold">{platform.pricing.dev}</div>
                    <div className="text-slate-500">Recurring:</div>
                    <div className="font-semibold">{platform.pricing.recurring}</div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-xl bg-opacity-10 dark:bg-opacity-20 ${platform.id === 'shopify' ? 'bg-[#95bf47]' : platform.id === 'woocommerce' ? 'bg-[#7F54B3]' : 'bg-blue-600'}`}>
                  <p className="text-sm font-medium">
                    <strong className={platform.textColor}>Best Choice If:</strong> {platform.verdict}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Comparison Table */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
        >
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-bold text-center">Quick Comparison</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300">
                <th className="p-4 font-semibold">Feature</th>
                <th className="p-4 font-semibold text-[#95bf47]">Shopify</th>
                <th className="p-4 font-semibold text-[#7F54B3]">WooCommerce</th>
                <th className="p-4 font-bold text-blue-600 dark:text-blue-400">Atlas CMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-medium">Easy to Use</td>
                <td className="p-4 flex gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/></td>
                <td className="p-4 flex gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/></td>
                <td className="p-4 flex gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/><Star className="w-4 h-4 fill-amber-400 text-amber-400"/></td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-medium">Monthly Subscription</td>
                <td className="p-4">Yes</td>
                <td className="p-4">No</td>
                <td className="p-4 font-bold text-emerald-500">No</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-medium">Ownership</td>
                <td className="p-4">Limited</td>
                <td className="p-4">Full</td>
                <td className="p-4 font-bold text-emerald-500">Full</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-medium">Custom Features</td>
                <td className="p-4">Medium</td>
                <td className="p-4">High</td>
                <td className="p-4 font-bold text-blue-500">Unlimited</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-medium">SEO</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4 font-bold text-emerald-500">Excellent</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-medium">Speed</td>
                <td className="p-4 text-emerald-500">Excellent</td>
                <td className="p-4 text-amber-500">Good</td>
                <td className="p-4 font-bold text-emerald-500">Excellent</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="p-4 font-medium">Scalability</td>
                <td className="p-4">High</td>
                <td className="p-4">High</td>
                <td className="p-4 font-bold text-blue-500">Enterprise</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 bg-slate-50 dark:bg-slate-800/50">
                <td className="p-4 font-medium">Best For</td>
                <td className="p-4">Startups</td>
                <td className="p-4">Growing Businesses</td>
                <td className="p-4 font-bold text-blue-600 dark:text-blue-400">Serious Brands</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
