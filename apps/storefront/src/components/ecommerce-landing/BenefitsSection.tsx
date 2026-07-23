'use client';
import { motion } from 'framer-motion';
import { Clock, Globe, Shield, CreditCard, LayoutDashboard, TrendingDown } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      title: 'Sell 24×7',
      description: 'Your business never closes. Customers can visit, browse, and buy anytime, even while you sleep.',
      icon: <Clock className="w-8 h-8 text-blue-500" />,
    },
    {
      title: 'Reach Customers Everywhere',
      description: 'Break geographical barriers. Sell locally, across India, or internationally.',
      icon: <Globe className="w-8 h-8 text-indigo-500" />,
    },
    {
      title: 'Build Customer Trust',
      description: 'A professional website makes your brand look reliable and establishes authority in your market.',
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
    },
    {
      title: 'Accept Online Payments',
      description: 'Seamlessly accept UPI, Credit Cards, Debit Cards, Net Banking, Wallets, and Cash on Delivery.',
      icon: <CreditCard className="w-8 h-8 text-purple-500" />,
    },
    {
      title: 'Manage Everything in One Place',
      description: 'Track products, orders, customers, payments, inventory, and reports from a single dashboard.',
      icon: <LayoutDashboard className="w-8 h-8 text-amber-500" />,
    },
    {
      title: 'Lower Operating Cost',
      description: 'No marketplace commission. No expensive monthly selling charges. Own your customers and data.',
      icon: <TrendingDown className="w-8 h-8 text-rose-500" />,
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white"
          >
            Why Every Business Needs an E-Commerce Website
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 space-y-2"
          >
            <p>Imagine your shop is open 24 hours a day.</p>
            <p>Customers can visit anytime, browse products, add items to cart, pay online, and track orders.</p>
            <p className="font-semibold text-blue-600 dark:text-blue-400">That's the power of eCommerce.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="bg-white dark:bg-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                {benefit.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
