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
  CheckSquare,
  Lock,
  Smartphone,
  Monitor
} from 'lucide-react';

export default function HeroSection() {
  const highlights = [
    'Mobile & Desktop Responsive',
    '1-Click Mobile UPI Checkout',
    'SEO & Sub-Second Page Speed',
    'Zero Technical Hassle',
  ];

  // 10 Curated HD Showcase Stores matching reference layout
  const showcaseStores = [
    {
      id: 1,
      title: 'Ethnic Fashion Store',
      subtitle: 'Luxury Apparel & Silk Sarees',
      category: 'Fashion & Apparel',
      platform: 'Shopify Plus',
      metric: '₹14.2L / Month',
      checkmarks: ['Mobile Optimized', 'Instant UPI Pay', 'Automated Shipping', 'Fast 0.5s Speed'],
      gridImages: [
        'https://images.unsplash.com/photo-1610030469983-98e55041d03c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
      ],
      mobileImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
      badge: 'Fashion',
      price: '₹3,499.00',
    },
    {
      id: 2,
      title: 'Smart Audio & Tech',
      subtitle: 'Wireless Headphones & Gear',
      category: 'Electronics',
      platform: 'Atlas CMS',
      metric: '0.5s Load Time',
      checkmarks: ['Built-in CRM', 'Zero Monthly Fees', 'High Speed', 'Custom Admin'],
      gridImages: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      ],
      mobileImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      badge: 'Electronics',
      price: '₹8,999.00',
    },
    {
      id: 3,
      title: 'Diamond & Gold Gems',
      subtitle: 'Fine Heritage Jewellery',
      category: 'Jewelry Boutique',
      platform: 'WooCommerce',
      metric: '3.4x Conv. Rate',
      checkmarks: ['Complete Control', 'SEO Optimized', 'WordPress Base', 'Custom Themes'],
      gridImages: [
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
      ],
      mobileImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
      badge: 'Jewelry',
      price: '₹24,500.00',
    },
    {
      id: 4,
      title: 'Organic Glow Botanicals',
      subtitle: 'Natural Skincare & Serums',
      category: 'Beauty & Skincare',
      platform: 'Shopify',
      metric: '99.9% Uptime',
      checkmarks: ['Easy Setup', 'Reliable Host', 'App Ecosystem', '1-Click Pay'],
      gridImages: [
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1608248597261-8131e4e32235?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
      ],
      mobileImage: 'https://images.unsplash.com/photo-1608248597261-8131e4e32235?auto=format&fit=crop&w=600&q=80',
      badge: 'Beauty',
      price: '₹1,299.00',
    },
    {
      id: 5,
      title: 'Minimalist Living Space',
      subtitle: 'Modern Ceramic & Furniture',
      category: 'Home & Living',
      platform: 'Atlas CMS',
      metric: 'WhatsApp Orders',
      checkmarks: ['Direct WhatsApp', 'Multi-user Access', 'Role Management', 'No Plugins'],
      gridImages: [
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&w=600&q=80',
      ],
      mobileImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      badge: 'Decor',
      price: '₹4,200.00',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Mouse Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 180 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig);

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

  // Auto-cycle carousel
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
    <section className="relative overflow-hidden bg-white text-slate-900 min-h-[95vh] flex flex-col justify-between pt-6 pb-20">
      {/* Background Soft Mesh Gradients on White */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[20%] w-[600px] h-[600px] rounded-full bg-blue-100/60 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[650px] h-[650px] rounded-full bg-purple-100/50 blur-[150px]" />
        <div className="absolute top-[40%] left-[-5%] w-[450px] h-[450px] rounded-full bg-emerald-100/40 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      {/* Top Navbar */}
      <header className="container mx-auto px-4 relative z-20 mb-8 lg:mb-12">
        <nav className="flex items-center justify-between py-4 px-6 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Grekam<span className="text-blue-600">Visuals</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#platforms" className="hover:text-blue-600 transition-colors">Platforms</a>
            <a href="#roi-calculator" className="hover:text-blue-600 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-blue-600 transition-colors">FAQs</a>
          </div>

          <a 
            href="https://wa.me/919843199556?text=Hi%20Grekam%20Visuals%2C%20I%20want%20to%20get%20a%20free%20consultation%20for%20building%20my%20online%20store." 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20 hover:scale-105"
          >
            Chat on WhatsApp
          </a>
        </nav>
      </header>

      {/* Hero Content: On Mobile order-1 (Carousel top), order-2 (Copy below) */}
      <div className="container mx-auto px-4 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* MOCKUP CAROUSEL COLUMN: MATCHING REFERENCE IMAGE COMPOSITION */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 lg:col-span-6 relative flex flex-col items-center justify-center"
          >
            {/* Scene Container with Magnetic Parallax */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-xl sm:max-w-2xl min-h-[420px] sm:min-h-[480px] flex items-center justify-center perspective-1000"
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentStore.id}
                  style={{ rotateX, rotateY }}
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full flex items-center justify-center"
                >
                  
                  {/* DEVICE 1: LAPTOP SCREEN MOCKUP (Background / Main 16:10 Ratio) */}
                  <div className="w-full max-w-md sm:max-w-xl relative flex flex-col items-center drop-shadow-2xl">
                    
                    {/* Laptop Screen Bezel */}
                    <div className="w-full rounded-t-2xl bg-slate-900 border-2 border-slate-800 p-2 sm:p-3 shadow-2xl relative overflow-hidden">
                      
                      {/* Laptop Camera Dot */}
                      <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-700 mx-auto mb-2 relative z-10" />

                      {/* Laptop Display Content Layout */}
                      <div className="relative h-60 sm:h-72 w-full rounded-lg overflow-hidden bg-white text-slate-900 grid grid-cols-12 border border-slate-200 shadow-inner">
                        
                        {/* Laptop Left Side: Info & Features List */}
                        <div className="col-span-6 p-4 sm:p-5 flex flex-col justify-between bg-slate-50 border-r border-slate-200">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                                {currentStore.badge}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                {currentStore.platform}
                              </span>
                            </div>
                            <h3 className="text-base sm:text-xl font-extrabold text-slate-900 leading-tight mb-1">
                              {currentStore.title}
                            </h3>
                            <p className="text-[10px] sm:text-xs text-slate-500 mb-3 font-medium">
                              {currentStore.subtitle}
                            </p>

                            {/* Checklist matching reference screen design */}
                            <div className="space-y-1.5 text-[10px] sm:text-xs text-slate-700">
                              {currentStore.checkmarks.map((chk, i) => (
                                <div key={i} className="flex items-center gap-1.5 font-medium">
                                  <CheckSquare className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                  <span>{chk}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Est. Sales:</span>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {currentStore.metric}
                            </span>
                          </div>
                        </div>

                        {/* Laptop Right Side: 2x2 HD Product Photo Collage */}
                        <div className="col-span-6 grid grid-cols-2 gap-1 p-1 bg-slate-200">
                          {currentStore.gridImages.map((imgUrl, i) => (
                            <div key={i} className="relative h-full min-h-[110px] overflow-hidden rounded bg-slate-300">
                              <motion.img 
                                src={imgUrl} 
                                alt={`${currentStore.title} preview ${i+1}`}
                                style={{ x: parallaxX, y: parallaxY }}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            </div>
                          ))}
                        </div>

                      </div>

                    </div>

                    {/* Laptop Aluminum Keyboard Base (Silver Deck matching reference) */}
                    <div className="w-[106%] h-5 sm:h-6 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-b-2xl border-t border-slate-100 shadow-2xl relative flex flex-col items-center justify-start pt-1">
                      {/* Dark Keybed Slot */}
                      <div className="w-[88%] h-2.5 sm:h-3 bg-slate-800 rounded-sm" />
                      {/* Trackpad Line */}
                      <div className="w-20 h-1.5 bg-slate-400/80 rounded-b-md mt-0.5" />
                    </div>
                  </div>

                  {/* DEVICE 2: SMARTPHONE MOCKUP (Foreground Bottom-Left Overlay) */}
                  <motion.div 
                    initial={{ x: -20, y: 30, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="absolute left-[-10px] sm:left-[-20px] bottom-[-10px] sm:bottom-[-15px] w-36 sm:w-48 rounded-[32px] sm:rounded-[40px] bg-slate-950 border-4 border-slate-800 shadow-2xl p-2 sm:p-2.5 z-30 backdrop-blur-xl ring-1 ring-slate-700/80"
                  >
                    {/* iPhone Top Speaker Notch */}
                    <div className="w-12 sm:w-14 h-3 bg-black rounded-full mx-auto mb-2 flex items-center justify-center gap-1 shadow-inner">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                    </div>

                    {/* Smartphone Screen Content */}
                    <div className="bg-slate-900 rounded-[22px] overflow-hidden border border-slate-800 space-y-2">
                      
                      {/* Smartphone Screen Visual */}
                      <div className="relative h-32 sm:h-40 w-full bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-950 p-3 flex flex-col justify-between text-white overflow-hidden">
                        <img 
                          src={currentStore.mobileImage} 
                          alt={`${currentStore.title} Smartphone View`}
                          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                        />
                        <div className="relative z-10">
                          <span className="text-[9px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                            SMARTPHONE
                          </span>
                          <h4 className="text-xs sm:text-sm font-extrabold mt-2 leading-tight uppercase tracking-wider text-white">
                            1-Click UPI <br /> Checkout
                          </h4>
                        </div>
                        <div className="relative z-10 text-[9px] text-blue-200 font-semibold">
                          Fast • Mobile • Secure
                        </div>
                      </div>

                      {/* Mobile Pay Button */}
                      <div className="p-2 bg-slate-900 text-[10px] space-y-1">
                        <div className="flex justify-between text-slate-300 font-medium">
                          <span>Pay Total:</span>
                          <span className="font-bold text-emerald-400">{currentStore.price}</span>
                        </div>
                        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-1.5 rounded-lg text-center text-[10px] flex items-center justify-center gap-1 shadow-md">
                          <CreditCard className="w-3 h-3" />
                          <span>Pay via GPay</span>
                        </div>
                      </div>

                    </div>

                    {/* Smartphone Home Indicator Bar */}
                    <div className="w-12 h-1 bg-slate-400/50 rounded-full mx-auto mt-2" />
                  </motion.div>

                  {/* Floating Badge */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 z-40 text-slate-900"
                  >
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold">0.6s Page Speed</span>
                  </motion.div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Navigation Controls */}
            <div className="flex items-center gap-4 mt-6 z-30">
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:bg-slate-50 hover:border-blue-300 flex items-center justify-center transition-all shadow-md active:scale-95"
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
                    className={`h-2.5 rounded-full transition-all ${i === activeIndex ? 'w-7 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={handleNext} 
                className="w-10 h-10 rounded-full bg-white border border-slate-300 text-slate-700 hover:text-blue-600 hover:bg-slate-50 hover:border-blue-300 flex items-center justify-center transition-all shadow-md active:scale-95"
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
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
              <span>Awwwards-Grade E-Commerce Partner</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900">
              Build an Online Store <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                That Sells 24×7
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 leading-relaxed font-normal">
              We engineer high-converting digital storefronts on <strong className="text-slate-900 font-semibold">Shopify</strong>, <strong className="text-slate-900 font-semibold">WooCommerce</strong>, or <strong className="text-slate-900 font-semibold">Atlas CMS</strong> tailored to your revenue targets.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-3 mb-10 text-sm text-slate-700">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <a 
                href="https://wa.me/919843199556?text=Hi%20Grekam%20Visuals%2C%20I%20want%20to%20launch%20my%20online%20store." 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl text-base text-center transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 overflow-hidden"
              >
                <span>Launch Your Store on WhatsApp</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a 
                href="#roi-calculator" 
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-8 py-4 rounded-xl text-base text-center border border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <span>Calculate Your ROI</span>
              </a>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-8 text-slate-600 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-900">5.0 Rating</span>
              </div>
              <div className="h-4 w-px bg-slate-300 hidden sm:block" />
              <div><span className="font-extrabold text-slate-900">50+</span> Stores Built</div>
              <div className="h-4 w-px bg-slate-300 hidden sm:block" />
              <div><span className="font-extrabold text-slate-900">2.4x</span> Avg Growth</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
