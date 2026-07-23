'use client';
import { motion } from 'framer-motion';
import { Award, Users, ShoppingBag, BarChart2 } from 'lucide-react';

export default function TrustIndicators() {
  const stats = [
    { label: 'eCommerce Stores Built', value: '150+', icon: <ShoppingBag className="w-6 h-6 text-blue-500" /> },
    { label: 'Happy Clients', value: '98%', icon: <Users className="w-6 h-6 text-indigo-500" /> },
    { label: 'Years Experience', value: '8+', icon: <Award className="w-6 h-6 text-emerald-500" /> },
    { label: 'Client Revenue Growth', value: '3x', icon: <BarChart2 className="w-6 h-6 text-amber-500" /> },
  ];

  const stories = [
    {
      brand: "Fashion Nova India",
      metric: "+145%",
      metricLabel: "Online Sales in 3 Months",
      testimonial: "Grekam Visuals completely transformed our online presence. Our conversion rates doubled after moving to their custom solution."
    },
    {
      brand: "Organic Foods Co.",
      metric: "0 to 10k",
      metricLabel: "Monthly Orders",
      testimonial: "We started with zero online presence. The team guided us to Shopify, and now we process thousands of orders seamlessly."
    },
    {
      brand: "Tech Gadgets Wholesale",
      metric: "50%",
      metricLabel: "Reduction in Admin Work",
      testimonial: "Atlas CMS was a game changer for our B2B operations. We finally have inventory and orders synced perfectly."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 max-w-5xl mx-auto border-b border-slate-200 dark:border-slate-800 pb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-full shadow-sm">
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Client Success Stories
          </motion.h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Real results from businesses just like yours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-black text-blue-600 dark:text-blue-500 mb-1">
                {story.metric}
              </div>
              <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-6">
                {story.metricLabel}
              </div>
              <p className="text-slate-700 dark:text-slate-300 italic mb-6">
                "{story.testimonial}"
              </p>
              <div className="font-bold text-slate-900 dark:text-white">
                — {story.brand}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
