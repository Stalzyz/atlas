'use client';
import { motion } from 'framer-motion';
import { ShoppingCart, Smartphone, ShieldCheck, Zap, BarChart, Settings } from 'lucide-react';

export default function HeroSection() {
  const benefits = [
    { text: 'Professional Design', icon: <ShoppingCart className="w-5 h-5" /> },
    { text: 'Mobile Friendly', icon: <Smartphone className="w-5 h-5" /> },
    { text: 'Secure Payments', icon: <ShieldCheck className="w-5 h-5" /> },
    { text: 'Easy Product Management', icon: <Settings className="w-5 h-5" /> },
    { text: 'SEO Optimized', icon: <Zap className="w-5 h-5" /> },
    { text: 'Future Ready', icon: <BarChart className="w-5 h-5" /> },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[90vh] flex items-center pt-20">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Build an Online Store That Sells 24×7
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 font-light">
              <span className="font-semibold text-white">More Than Just a Website. It's Your Digital Shop.</span><br className="hidden md:block" />
              Whether you're selling clothes, electronics, groceries, jewellery, handmade products, or anything else, an eCommerce website helps you reach more customers, increase sales, and grow your business without opening more stores.
            </p>
            <p className="text-lg text-slate-400 mb-10">
              At <strong className="text-white">Grekam Visuals</strong>, we don't just build websites—we create online shopping experiences that help businesses sell more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#consultation" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg text-center transition-all hover:scale-105 shadow-lg shadow-blue-600/30">
                Get Free Consultation
              </a>
              <a href="#platforms" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg text-center backdrop-blur-sm transition-all border border-white/10">
                Compare Platforms
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Abstract visual representation of a store */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
                {/* Browser bar */}
                <div className="h-12 bg-slate-950 flex items-center px-4 gap-2 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <div className="ml-4 h-6 w-48 bg-slate-800 rounded-md" />
                </div>
                
                {/* Store UI mockup */}
                <div className="flex-1 p-6 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-24 bg-slate-700 rounded" />
                    <div className="flex gap-3">
                      <div className="h-4 w-12 bg-slate-800 rounded" />
                      <div className="h-4 w-12 bg-slate-800 rounded" />
                    </div>
                  </div>
                  <div className="h-40 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-xl flex items-center justify-center border border-blue-800/30">
                    <span className="text-2xl font-bold text-blue-300/50">Your Brand</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-slate-800 rounded-lg" />
                    <div className="h-24 bg-slate-800 rounded-lg" />
                    <div className="h-24 bg-slate-800 rounded-lg" />
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                  className={`absolute bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl flex items-center gap-3
                    ${index === 0 ? '-top-6 -left-6' : ''}
                    ${index === 1 ? 'top-1/4 -right-8' : ''}
                    ${index === 2 ? 'bottom-1/4 -left-8' : ''}
                    ${index === 3 ? '-bottom-6 -right-4' : ''}
                    ${index === 4 ? 'top-[-20px] right-20' : ''}
                    ${index === 5 ? 'bottom-[-20px] left-20' : ''}
                  `}
                  style={{
                    zIndex: 20 + index
                  }}
                >
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                    {benefit.icon}
                  </div>
                  <span className="font-semibold text-sm whitespace-nowrap">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
