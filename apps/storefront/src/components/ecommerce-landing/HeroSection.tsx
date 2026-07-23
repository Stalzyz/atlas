'use client';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Sparkles,
  Lock,
  Globe,
  Layers
} from 'lucide-react';

export default function HeroSection() {
  const highlights = [
    'Mobile-First Design',
    'Instant Payment Gateways',
    'SEO & Speed Guaranteed',
    'Zero Tech Knowledge Needed',
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[92vh] flex flex-col justify-between pt-6 pb-16">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-600/25 blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[160px]" />
        <div className="absolute top-[40%] left-[-10%] w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>

      {/* Top Navbar */}
      <header className="container mx-auto px-4 relative z-20 mb-12">
        <nav className="flex items-center justify-between py-4 px-6 rounded-2xl glass-effect border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              Grekam<span className="text-blue-400">Visuals</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#platforms" className="hover:text-blue-400 transition-colors">Platforms</a>
            <a href="#roi-calculator" className="hover:text-blue-400 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-blue-400 transition-colors">FAQs</a>
          </div>

          <a 
            href="#consultation" 
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/30 hover:scale-105"
          >
            Get Free Consultation
          </a>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 max-w-2xl"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-inner">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <span>E-Commerce Growth Partner for Brands</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Build an Online Store <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                That Sells 24×7
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed font-light">
              Don't just launch a website—build your <strong className="text-white font-semibold">Digital Storefront</strong>. 
              We craft high-converting shopping experiences on <span className="text-blue-300 font-medium">Shopify</span>, <span className="text-purple-300 font-medium">WooCommerce</span>, or <span className="text-emerald-300 font-medium">Atlas CMS</span> tailored to your sales goals.
            </p>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-2 gap-3 mb-10 text-sm text-slate-300">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <a 
                href="#consultation" 
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl text-base text-center transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a 
                href="#platforms" 
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl text-base text-center border border-slate-700/80 backdrop-blur-md transition-all hover:border-slate-500 flex items-center justify-center gap-2"
              >
                <span>Compare Platforms & Pricing</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-8 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-slate-200">5.0 Rating</span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div>
                <span className="font-bold text-white">50+</span> Stores Built
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div>
                <span className="font-bold text-white">2.4x</span> Avg Revenue Boost
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Visual Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Store UI Showcase Card */}
            <div className="relative w-full max-w-lg mx-auto rounded-3xl p-1 bg-gradient-to-b from-slate-700 to-slate-900/80 shadow-2xl shadow-blue-950/50">
              <div className="bg-slate-900 rounded-[22px] overflow-hidden border border-slate-800">
                
                {/* Simulated Browser Bar */}
                <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-md text-[11px] text-slate-400 font-mono">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>yourbrand.com</span>
                  </div>
                  <div className="w-4" />
                </div>

                {/* Simulated Dashboard Content */}
                <div className="p-6 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
                  
                  {/* Top Stats Banner */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-xs text-slate-400 mb-1">Today's Sales</div>
                      <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                        <span>$4,890.00</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">+32%</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                      <div className="text-xs text-slate-400 mb-1">Conversion Rate</div>
                      <div className="text-xl font-bold text-blue-400 flex items-center gap-2">
                        <span>3.84%</span>
                        <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">High</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Card Mockup */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <ShoppingCart className="w-8 h-8 text-blue-300" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-28 bg-slate-700 rounded mb-2" />
                      <div className="h-3 w-16 bg-slate-800 rounded mb-2" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">$149.00</span>
                        <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">In Stock</span>
                      </div>
                    </div>
                  </div>

                  {/* Growth Chart Simulation */}
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="flex items-center justify-between mb-3 text-xs text-slate-300 font-medium">
                      <span>Monthly Revenue Trend</span>
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="h-20 flex items-end gap-2 pt-4">
                      {[40, 55, 45, 65, 80, 70, 95].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t transition-all duration-1000"
                            style={{ height: `${val}%` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* Floating Badge 1: Speed */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -left-5 bg-slate-900/90 border border-blue-500/40 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-30"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Speed Index</div>
                  <div className="text-xs font-bold text-white">0.6s Page Load</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Security */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-5 -right-5 bg-slate-900/90 border border-purple-500/40 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-30"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Security</div>
                  <div className="text-xs font-bold text-white">256-bit SSL & PCI-DSS</div>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
