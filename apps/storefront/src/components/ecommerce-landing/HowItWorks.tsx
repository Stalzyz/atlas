'use client';
import { motion } from 'framer-motion';
import { User, Search, ShoppingBag, CreditCard, Bell, Package, Truck, Smile } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    { text: 'Customer visits your website', icon: <User className="w-6 h-6" /> },
    { text: 'Browses products', icon: <Search className="w-6 h-6" /> },
    { text: 'Adds products to cart', icon: <ShoppingBag className="w-6 h-6" /> },
    { text: 'Makes payment', icon: <CreditCard className="w-6 h-6" /> },
    { text: 'You receive order instantly', icon: <Bell className="w-6 h-6" /> },
    { text: 'Pack the product', icon: <Package className="w-6 h-6" /> },
    { text: 'Ship it', icon: <Truck className="w-6 h-6" /> },
    { text: 'Customer receives it', icon: <Smile className="w-6 h-6" /> },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white"
          >
            How Does an E-Commerce Website Work?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400"
          >
            It's much simpler than you think.
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-indigo-300 to-emerald-200 dark:from-blue-900 dark:via-indigo-900 dark:to-emerald-900 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-2 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white dark:border-slate-950 bg-white dark:bg-slate-800 transition-transform duration-300 group-hover:scale-110
                  ${index < 4 ? 'text-blue-500' : index < 6 ? 'text-indigo-500' : 'text-emerald-500'}
                `}>
                  {step.icon}
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700 w-full h-full text-sm font-medium text-slate-700 dark:text-slate-300">
                  <span className="block text-xs text-slate-400 dark:text-slate-500 mb-1">Step {index + 1}</span>
                  {step.text}
                </div>

                {/* Mobile downward arrow */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-1 h-8 bg-slate-200 dark:bg-slate-700 my-2 rounded-full" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-20 flex justify-center gap-8 text-2xl font-bold text-slate-300 dark:text-slate-700"
        >
          <span className="text-blue-500">Simple.</span>
          <span className="text-indigo-500">Fast.</span>
          <span className="text-emerald-500">Professional.</span>
        </motion.div>
      </div>
    </section>
  );
}
