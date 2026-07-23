'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  ShoppingCart, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Zap,
  TrendingUp,
  CreditCard,
  Wifi,
  Battery
} from 'lucide-react';

export default function HeroSection() {
  const highlights = [
    'Mobile & Desktop Responsive',
    '1-Click Mobile UPI Checkout',
    'SEO & Sub-Second Page Speed',
    'Zero Technical Hassle',
  ];

  // 10 Curated HD Showcase Stores with both Desktop & Mobile previews
  const showcaseStores = [
    {
      id: 1,
      title: 'Silk & Ethnic Wear Boutique',
      category: 'Fashion & Luxury',
      platform: 'Shopify Plus',
      metric: '₹14.2L / mo',
      desktopImage: 'https://images.unsplash.com/photo-1610030469983-98e55041d03c?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      badge: 'Fashion',
      price: '₹3,499.00',
    },
    {
      id: 2,
      title: 'Smart Tech & Wireless Audio',
      category: 'Electronics',
      platform: 'Atlas CMS',
      metric: '0.5s Load Time',
      desktopImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      badge: 'Electronics',
      price: '₹8,999.00',
    },
    {
      id: 3,
      title: 'Diamond & Gold Fine Jewellery',
      category: 'Jewelry Boutique',
      platform: 'WooCommerce',
      metric: '3.4x Conv. Rate',
      desktopImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      badge: 'Jewelry',
      price: '₹24,500.00',
    },
    {
      id: 4,
      title: 'Organic Skincare & Glow Botanicals',
      category: 'Beauty & Wellness',
      platform: 'Shopify',
      metric: '99.9% Uptime',
      desktopImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1608248597261-8131e4e32235?auto=format&fit=crop&w=600&q=80',
      badge: 'Beauty',
      price: '₹1,299.00',
    },
    {
      id: 5,
      title: 'Handcrafted Minimalist Home Decor',
      category: 'Home & Living',
      platform: 'Atlas CMS',
      metric: 'WhatsApp Orders',
      desktopImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      badge: 'Decor',
      price: '₹4,200.00',
    },
    {
      id: 6,
      title: 'Urban Hypebeast Sneaker Kicks',
      category: 'Footwear & Apparel',
      platform: 'Shopify',
      metric: '₹8.9L / mo',
      desktopImage: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
      badge: 'Sneakers',
      price: '₹11,499.00',
    },
    {
      id: 7,
      title: 'Artisanal Single-Origin Coffee',
      category: 'Food & Beverage',
      platform: 'WooCommerce',
      metric: '1-Click Checkout',
      desktopImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      badge: 'Gourmet',
      price: '₹890.00',
    },
    {
      id: 8,
      title: 'Active Sports Performance Supplements',
      category: 'Fitness & Health',
      platform: 'Atlas CMS',
      metric: 'Auto-Inventory Sync',
      desktopImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
      badge: 'Fitness',
      price: '₹2,699.00',
    },
    {
      id: 9,
      title: 'Swiss Precision Luxury Watches',
      category: 'Accessories',
      platform: 'Shopify Plus',
      metric: '₹22.5L / mo',
      desktopImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
      badge: 'Luxury',
      price: '₹48,990.00',
    },
    {
      id: 10,
      title: 'Handloom Kanjivaram Saree Weaves',
      category: 'Heritage Craft',
      platform: 'Atlas CMS',
      metric: 'Direct UPI Pay',
      desktopImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1610030469983-98e55041d03c?auto=format&fit=crop&w=600&q=80',
      badge: 'Heritage',
      price: '₹12,800.00',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Mouse Motion Values for smooth 3D depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Auto-cycle carousel every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseStores.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [showcaseStores.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % showcaseStores.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + showcaseStores.length) % showcaseStores.length);
  };

  const currentStore = showcaseStores[activeIndex];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[95vh] flex flex-col justify-between pt-6 pb-20">
      {/* Background Mesh Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-600/25 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[10%] w-[650px] h-[650px] rounded-full bg-purple-600/20 blur-[160px]" />
        <div className="absolute top-[40%] left-[-5%] w-[450px] h-[450px] rounded-full bg-emerald-500/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* Top Navbar */}
      <header className="container mx-auto px-4 relative z-20 mb-8 lg:mb-12">
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

      {/* Hero Content: On Mobile, Carousel (order-1) comes FIRST, Text (order-2) comes BELOW */}
      <div className="container mx-auto px-4 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* MACBOOK & IPHONE MOCKUP SHOWCASE: ORDER-1 ON MOBILE, ORDER-2 ON DESKTOP */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 lg:col-span-6 relative flex flex-col items-center justify-center"
          >
            {/* Interactive Device Frames with Magnetic Parallax */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-xl min-h-[400px] sm:min-h-[460px] flex items-center justify-center perspective-1000"
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStore.id}
                  style={{ rotateX, rotateY }}
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full flex items-center justify-center"
                >
                  
                  {/* DEVICE 1: REALISTIC MACBOOK PRO MOCKUP (Desktop Store Preview) */}
                  <div className="w-full max-w-md sm:max-w-lg relative flex flex-col items-center drop-shadow-2xl">
                    
                    {/* MacBook Display Lid & Screen Frame */}
                    <div className="w-full rounded-t-2xl bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-2.5 sm:p-3 border border-slate-600/80 shadow-2xl relative">
                      
                      {/* Web Camera Dot */}
                      <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-700 mx-auto mb-2 relative z-10" />

                      {/* Display Screen Screen Surface */}
                      <div className="relative h-56 sm:h-64 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                        <motion.img 
                          src={currentStore.desktopImage} 
                          alt={`${currentStore.title} MacBook View`}
                          style={{ x: parallaxX, y: parallaxY }}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        
                        {/* Top Store Info Tag */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                          <span className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-blue-300 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            💻 MacBook Pro Storefront
                          </span>
                          <span className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-3 py-1 rounded-full shadow-lg">
                            {currentStore.metric}
                          </span>
                        </div>

                        {/* Title Bar overlay */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                          <span className="font-bold text-white text-sm drop-shadow-md truncate max-w-[200px]">
                            {currentStore.title}
                          </span>
                          <span className="bg-blue-600/90 text-white font-semibold text-[10px] px-2.5 py-1 rounded-md backdrop-blur-md">
                            {currentStore.platform}
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* MacBook Aluminum Base / Trackpad Deck */}
                    <div className="w-[108%] h-4 sm:h-5 bg-gradient-to-b from-slate-600 via-slate-700 to-slate-800 rounded-b-2xl border-t border-slate-500/80 shadow-2xl relative flex justify-center">
                      <div className="w-16 sm:w-20 h-1.5 bg-slate-800 rounded-b-md" />
                    </div>
                  </div>

                  {/* DEVICE 2: REALISTIC IPHONE 15 PRO MOCKUP (Floating Mobile Preview) */}
                  <motion.div 
                    initial={{ x: 30, y: 30, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute right-[-10px] sm:right-[-25px] bottom-[-15px] sm:bottom-[-20px] w-44 sm:w-52 rounded-[36px] bg-slate-950 border-4 border-slate-700 shadow-2xl p-2.5 z-30 backdrop-blur-xl ring-1 ring-slate-600/50"
                  >
                    {/* iPhone Dynamic Island */}
                    <div className="w-14 h-3.5 bg-black rounded-full mx-auto mb-2 flex items-center justify-end px-1.5 gap-1 shadow-inner">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                    </div>

                    {/* iPhone Screen Surface */}
                    <div className="bg-slate-900 rounded-[24px] overflow-hidden border border-slate-800 space-y-2">
                      <div className="relative h-28 sm:h-32 w-full bg-slate-950 overflow-hidden">
                        <img 
                          src={currentStore.mobileImage} 
                          alt={`${currentStore.title} iPhone View`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                        <div className="absolute top-2 left-2 bg-emerald-500/90 text-slate-950 font-bold text-[9px] px-2 py-0.5 rounded-full shadow">
                          📱 iPhone View
                        </div>
                      </div>

                      {/* 1-Click Mobile Checkout Section */}
                      <div className="p-2 space-y-1.5 bg-slate-900 text-[10px]">
                        <div className="flex justify-between items-center text-slate-300 font-medium">
                          <span>1-Click UPI Checkout</span>
                          <span className="font-bold text-white">{currentStore.price}</span>
                        </div>
                        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-1.5 rounded-lg text-center text-[10px] flex items-center justify-center gap-1 shadow-md">
                          <CreditCard className="w-3 h-3" />
                          <span>Pay with GPay / PhonePe</span>
                        </div>
                      </div>
                    </div>

                    {/* iPhone Home Bar */}
                    <div className="w-14 h-1 bg-slate-400/50 rounded-full mx-auto mt-2" />
                  </motion.div>

                  {/* Floating Micro-Badge */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -left-4 bg-slate-900/90 border border-blue-500/40 px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2 z-40"
                  >
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">0.6s Page Speed</span>
                  </motion.div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-4 mt-6 z-30">
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 flex items-center justify-center transition-all shadow-lg active:scale-95"
                aria-label="Previous Showcase"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {showcaseStores.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${i === activeIndex ? 'w-7 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext} 
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 flex items-center justify-center transition-all shadow-lg active:scale-95"
                aria-label="Next Showcase"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </motion.div>

          {/* COPY COLUMN: ORDER-2 ON MOBILE, ORDER-1 ON DESKTOP */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 lg:col-span-6 max-w-2xl"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium mb-6 backdrop-blur-md shadow-inner">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <span>Awwwards-Grade E-Commerce Partner</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Build an Online Store <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                That Sells 24×7
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-300 mb-8 leading-relaxed font-light">
              We engineer high-converting digital storefronts on <strong className="text-blue-300 font-semibold">Shopify</strong>, <strong className="text-purple-300 font-semibold">WooCommerce</strong>, or <strong className="text-emerald-300 font-semibold">Atlas CMS</strong> tailored to your revenue targets.
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a 
                href="#consultation" 
                className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-xl text-base text-center transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span>Launch Your Store</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a 
                href="#roi-calculator" 
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold px-8 py-4 rounded-xl text-base text-center border border-slate-700/80 backdrop-blur-md transition-all hover:border-slate-500 flex items-center justify-center gap-2"
              >
                <span>Calculate Your ROI</span>
              </a>
            </div>

            {/* Social Proof Bar */}
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
              <div><span className="font-bold text-white">50+</span> Stores Built</div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div><span className="font-bold text-white">2.4x</span> Avg Growth</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
