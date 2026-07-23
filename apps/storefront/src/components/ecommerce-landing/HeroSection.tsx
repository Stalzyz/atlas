'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
  Layers
} from 'lucide-react';

export default function HeroSection() {
  const highlights = [
    'Mobile-First Responsive Design',
    '1-Click Mobile UPI Checkout',
    'SEO & Speed Index Guaranteed',
    'Zero Tech Knowledge Required',
  ];

  // 10 HD E-Commerce Showcase Cards
  const showcaseCards = [
    {
      id: 1,
      title: 'Silk & Ethnic Wear Store',
      category: 'Fashion & Luxury',
      platform: 'Shopify Plus',
      metric: '₹14.2L / mo',
      image: 'https://images.unsplash.com/photo-1610030469983-98e55041d03c?auto=format&fit=crop&w=1000&q=80',
      badge: 'Fashion',
    },
    {
      id: 2,
      title: 'Smart Tech & Gadgets',
      category: 'Electronics',
      platform: 'Atlas CMS',
      metric: '0.5s Load Time',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80',
      badge: 'Electronics',
    },
    {
      id: 3,
      title: 'Diamond & Gold Jewellery',
      category: 'Jewelry Boutique',
      platform: 'WooCommerce',
      metric: '3.4x Conv. Rate',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80',
      badge: 'Jewelry',
    },
    {
      id: 4,
      title: 'Organic Skincare & Glow',
      category: 'Beauty & Wellness',
      platform: 'Shopify',
      metric: '99.9% Uptime',
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80',
      badge: 'Beauty',
    },
    {
      id: 5,
      title: 'Handcrafted Home Decor',
      category: 'Home & Living',
      platform: 'Atlas CMS',
      metric: 'WhatsApp Orders',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
      badge: 'Decor',
    },
    {
      id: 6,
      title: 'Urban Sneaker Kicks',
      category: 'Footwear & Apparel',
      platform: 'Shopify',
      metric: '₹8.9L / mo',
      image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80',
      badge: 'Sneakers',
    },
    {
      id: 7,
      title: 'Artisanal Gourmet Coffee',
      category: 'Food & Beverage',
      platform: 'WooCommerce',
      metric: '1-Click Checkout',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80',
      badge: 'Gourmet',
    },
    {
      id: 8,
      title: 'Sports & Active Nutrition',
      category: 'Fitness',
      platform: 'Atlas CMS',
      metric: 'Auto-Inventory Sync',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
      badge: 'Fitness',
    },
    {
      id: 9,
      title: 'Luxury Timepiece Watches',
      category: 'Accessories',
      platform: 'Shopify Plus',
      metric: '₹22.5L / mo',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      badge: 'Luxury',
    },
    {
      id: 10,
      title: 'Handloom Saree Weaves',
      category: 'Heritage Craft',
      platform: 'Atlas CMS',
      metric: 'Direct UPI Pay',
      image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1000&q=80',
      badge: 'Heritage',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Mouse Motion Values for Option 3 Magnetic Parallax Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);
  const cardRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const cardRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

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

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseCards.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [showcaseCards.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % showcaseCards.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + showcaseCards.length) % showcaseCards.length);
  };

  const activeCard = showcaseCards[activeIndex];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white min-h-[95vh] flex flex-col justify-between pt-6 pb-20">
      {/* Dynamic Background Mesh Gradients */}
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

      {/* Hero Body Container: On Mobile order-1 (Carousel top), order-2 (Copy below) */}
      <div className="container mx-auto px-4 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* CAROUSEL COLUMN: ORDER-1 ON MOBILE, ORDER-2 ON DESKTOP */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 lg:col-span-6 relative flex flex-col items-center justify-center"
          >
            {/* Option 3: Magnetic Parallax Interactive Card Frame */}
            <div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-lg aspect-[4/3] rounded-3xl p-1 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-2xl shadow-blue-950/50 cursor-grab active:cursor-grabbing perspective-1000"
            >
              <motion.div 
                style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
                className="w-full h-full bg-slate-900 rounded-[22px] overflow-hidden border border-slate-800 flex flex-col relative"
              >
                
                {/* Parallax HD Background Image */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
                  <motion.img 
                    key={activeCard.id}
                    src={activeCard.image} 
                    alt={activeCard.title}
                    style={{ x: parallaxX, y: parallaxY, scale: 1.15 }}
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 1, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full object-cover transition-transform duration-300 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="bg-slate-950/85 backdrop-blur-md border border-slate-700/80 text-blue-300 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg">
                      ✨ {activeCard.badge}
                    </span>
                    <span className="bg-emerald-500 text-slate-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                      {activeCard.metric}
                    </span>
                  </div>

                  {/* Parallax Cursor Hint */}
                  <div className="absolute bottom-3 left-4 text-[10px] text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-slate-700/60 hidden sm:flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Hover cursor for 3D Magnetic Parallax</span>
                  </div>
                </div>

                {/* Card Info Details */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900 border-t border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-1">{activeCard.category}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{activeCard.title}</h3>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-400 font-medium">Built on <strong className="text-blue-400 font-bold">{activeCard.platform}</strong></span>
                    <span className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold">
                      Explore Store Showcase <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

              </motion.div>

              {/* Floating Badge overlay */}
              <div className="absolute -top-4 -right-4 bg-slate-900/90 border border-blue-500/40 px-3.5 py-2 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-2 z-30">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Live Showcase {activeIndex + 1}/10</span>
              </div>
            </div>

            {/* Carousel Navigation Controls */}
            <div className="flex items-center gap-4 mt-6 z-30">
              <button 
                onClick={handlePrev} 
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-500 flex items-center justify-center transition-all shadow-lg active:scale-95"
                aria-label="Previous Showcase"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots Indicators */}
              <div className="flex items-center gap-1.5">
                {showcaseCards.map((_, i) => (
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
