'use client';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Smartphone, 
  Monitor, 
  Tablet, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Star,
  Sparkles,
  CreditCard,
  Layers,
  RefreshCw,
  Globe,
  Lock
} from 'lucide-react';

export default function HeroSection() {
  const highlights = [
    'Unified Inventory & Orders',
    '1-Click Mobile UPI Checkout',
    'Desktop Optimized Catalog',
    'Sub-Second Page Loads',
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[92vh] flex flex-col justify-between pt-6 pb-16">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[15%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[650px] h-[650px] rounded-full bg-purple-600/20 blur-[160px]" />
        <div className="absolute top-[45%] left-[-5%] w-[450px] h-[450px] rounded-full bg-emerald-500/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* Top Navbar */}
      <header className="container mx-auto px-4 relative z-20 mb-12">
        <nav className="flex items-center justify-between py-4 px-6 rounded-2xl glass-effect border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/30 hover:scale-105"
          >
            Get Free Consultation
          </a>
        </nav>
      </header>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy & Value Proposition */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 max-w-2xl"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Omnichannel E-Commerce Ecosystem</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Sell Anywhere, <br />
              On Any Device — <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                24×7 Non-Stop
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed font-light">
              From desktop browsers to mobile apps and tablet checkout — <strong className="text-white font-semibold">Grekam Visuals</strong> builds unified, high-converting digital storefronts on <span className="text-blue-300 font-medium">Shopify</span>, <span className="text-purple-300 font-medium">WooCommerce</span>, or <span className="text-emerald-300 font-medium">Atlas CMS</span>.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 mb-10 text-sm text-slate-300">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-12">
              <a 
                href="#consultation" 
                className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl text-base text-center transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span>Launch Your Store Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a 
                href="#roi-calculator" 
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl text-base text-center border border-slate-700/80 backdrop-blur-md transition-all hover:border-slate-500 flex items-center justify-center gap-2"
              >
                <span>Calculate Your ROI</span>
              </a>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-8 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-semibold text-slate-200">5.0 Star Rating</span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div>
                <span className="font-bold text-white">50+</span> Live Stores
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div>
                <span className="font-bold text-white">2.4x</span> Avg Revenue Growth
              </div>
            </div>
          </motion.div>

          {/* Right Column: Multi-Device Ecosystem Showcase (Desktop + Mobile + Tablet Stack) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative flex items-center justify-center min-h-[480px]"
          >
            {/* Device 1: Desktop Browser Mockup (Back Layer) */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl shadow-blue-950/80 overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-500"
            >
              {/* Browser Bar */}
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-md text-[11px] text-slate-400 font-mono">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>https://yourbrand.com</span>
                </div>
                <Monitor className="w-4 h-4 text-slate-500" />
              </div>

              {/* Desktop Store Mockup Header & Hero Banner */}
              <div className="p-4 bg-slate-900 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">Y</div>
                    <span className="font-bold text-sm text-white">YOUR BRAND</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>Shop</span>
                    <span>Collections</span>
                    <div className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded font-semibold flex items-center gap-1">
                      <ShoppingCart className="w-3 h-3" />
                      <span>3</span>
                    </div>
                  </div>
                </div>

                {/* Hero Banner inside mockup */}
                <div className="h-28 rounded-xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 p-4 flex flex-col justify-center border border-blue-500/20">
                  <span className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider">New Collection 2026</span>
                  <h4 className="text-base font-extrabold text-white">Summer Luxury Edit</h4>
                  <div className="mt-2 text-[10px] bg-white text-slate-900 font-bold px-3 py-1 rounded-full w-fit">Explore Now</div>
                </div>

                {/* Product Grid Mockup */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: 'Silk Kurti Set', price: '₹3,499' },
                    { title: 'Designer Jacket', price: '₹4,999' },
                    { title: 'Handloom Saree', price: '₹6,200' },
                  ].map((prod, idx) => (
                    <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col gap-1.5">
                      <div className="h-14 rounded bg-slate-700/50 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="text-[10px] font-semibold text-slate-200 truncate">{prod.title}</div>
                      <div className="text-[10px] font-bold text-emerald-400">{prod.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Device 2: Mobile Smartphone Mockup (Front Left Floating Layer) */}
            <motion.div 
              initial={{ x: -20, y: 30, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="absolute left-[-20px] sm:left-[-30px] bottom-[-20px] w-52 sm:w-60 rounded-3xl bg-slate-950 border-2 border-slate-700 shadow-2xl p-3 z-20 backdrop-blur-xl"
            >
              {/* Phone Notch */}
              <div className="w-16 h-3 bg-slate-800 rounded-full mx-auto mb-3" />
              
              {/* Phone Screen Mockup: 1-Click Checkout */}
              <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Instant Checkout</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Step 2/2</span>
                </div>

                <div className="space-y-1.5 text-[10px]">
                  <div className="flex justify-between text-slate-300">
                    <span>Item: Silk Kurti</span>
                    <span className="font-semibold text-white">₹3,499</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Express Delivery</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-between text-[10px]">
                  <span className="text-blue-200 font-medium">Payment via UPI</span>
                  <span className="bg-blue-500 text-white font-bold px-1.5 py-0.5 rounded">GPay</span>
                </div>

                <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pay ₹3,499.00 Now</span>
                </button>
              </div>
            </motion.div>

            {/* Device 3: Tablet POS & Realtime Analytics (Front Right Floating Layer) */}
            <motion.div 
              initial={{ x: 20, y: 30, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute right-[-10px] sm:right-[-20px] top-[-20px] w-56 sm:w-64 rounded-2xl bg-slate-900/95 border border-purple-500/40 p-3 shadow-2xl z-30 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Live POS & Sales Feed</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-2">
                <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/80">
                  <div className="text-[10px] text-slate-400">Total Sales Today</div>
                  <div className="text-base font-extrabold text-emerald-400">₹48,250.00</div>
                  <div className="text-[9px] text-slate-400">18 orders completed automatically</div>
                </div>

                <div className="bg-purple-950/40 border border-purple-500/30 p-2 rounded-lg text-[10px] text-purple-200 flex items-center justify-between">
                  <span>Inventory Auto-Synced</span>
                  <RefreshCw className="w-3 h-3 text-purple-400 animate-spin-slow" />
                </div>
              </div>
            </motion.div>

            {/* Floating Badge: Sub-second Speed */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 right-12 bg-slate-900/90 border border-blue-500/40 px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2.5 z-40"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase font-semibold">Page Speed</div>
                <div className="text-xs font-bold text-white">0.6s Load Time</div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
