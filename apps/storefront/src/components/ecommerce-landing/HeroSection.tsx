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
        '/screenshots/03fb9977-3da8-4811-852c-131e13e47ef8.webp',
        '/screenshots/0505d978-39f8-44a9-865a-2499b4e4e0c1.webp',
        '/screenshots/1aecd32c-1f98-4ee8-8dfd-c8da0cc71317.webp',
        '/screenshots/26767f37-7510-4a5b-ad92-8d3776eb9d4c.webp',
      ],
      mobileImage: '/screenshots/60e98a01-d377-4d2f-80fd-1664d8d2ad17.webp',
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
        '/screenshots/70ea7945-987a-424e-93b8-5444a0d28b40.avif',
        '/screenshots/76ef52ae-7c7b-47d8-8c7f-b8397eb79b1b.webp',
        '/screenshots/7a5a8c2c-4c0d-4f21-961b-e87f7e80500a.webp',
        '/screenshots/8143f0bb-50c9-40cd-a19c-5ca6319c824d.webp',
      ],
      mobileImage: '/screenshots/84cc4123-ea05-46bc-bc44-60f9b2a5ae86.webp',
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
        '/screenshots/8627ac50-7338-4543-b770-888b462f50f1.webp',
        '/screenshots/97afc099-b841-43e5-b0d1-04b284539df2.webp',
        '/screenshots/992fd488-463f-476d-a08e-1ec93952a583.webp',
        '/screenshots/d2d9f0e8-3340-430d-aef1-35a884129065.webp',
      ],
      mobileImage: '/screenshots/d5710731-7a49-4137-818e-120893181037.webp',
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
        '/screenshots/0505d978-39f8-44a9-865a-2499b4e4e0c1.webp',
        '/screenshots/26767f37-7510-4a5b-ad92-8d3776eb9d4c.webp',
        '/screenshots/70ea7945-987a-424e-93b8-5444a0d28b40.avif',
        '/screenshots/7a5a8c2c-4c0d-4f21-961b-e87f7e80500a.webp',
      ],
      mobileImage: '/screenshots/8143f0bb-50c9-40cd-a19c-5ca6319c824d.webp',
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
        '/screenshots/1aecd32c-1f98-4ee8-8dfd-c8da0cc71317.webp',
        '/screenshots/60e98a01-d377-4d2f-80fd-1664d8d2ad17.webp',
        '/screenshots/76ef52ae-7c7b-47d8-8c7f-b8397eb79b1b.webp',
        '/screenshots/84cc4123-ea05-46bc-bc44-60f9b2a5ae86.webp',
      ],
      mobileImage: '/screenshots/8627ac50-7338-4543-b770-888b462f50f1.webp',
      badge: 'Decor',
      price: '₹4,200.00',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  // Paused state for auto-cycle
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle carousel
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseStores.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [showcaseStores.length, isHovered]);

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
        <nav className="flex items-center justify-between py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between w-full md:w-auto">
            <img 
              src="/logo.svg" 
              alt="Grekam Visuals Logo" 
              className="h-8 sm:h-10 w-auto max-w-[180px] sm:max-w-none"
            />
          </div>

          {/* Menu links hidden on mobile screen, visible on desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#platforms" className="hover:text-emerald-600 transition-colors">Platforms</a>
            <a href="#roi-calculator" className="hover:text-emerald-600 transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors">Pricing</a>
            <a href="#faqs" className="hover:text-emerald-600 transition-colors">FAQs</a>
          </div>
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
            {/* 3D Swipe Carousel Container */}
            <div 
              className="relative w-full h-[400px] sm:h-[500px] flex items-center justify-center perspective-1000 overflow-visible"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence initial={false}>
                {showcaseStores.map((store, i) => {
                  // Calculate relative offset based on active index
                  // Handle wrap-around for infinite carousel effect
                  let offset = i - activeIndex;
                  const total = showcaseStores.length;
                  if (offset < -Math.floor(total / 2)) offset += total;
                  if (offset > Math.floor(total / 2)) offset -= total;

                  // Only render if it's within -2 to 2 offset (visible range)
                  if (Math.abs(offset) > 2) return null;

                  // 3D Coverflow properties
                  const isCenter = offset === 0;
                  const x = offset * 50; // 50px shift per index
                  const scale = isCenter ? 1 : Math.max(0.7, 1 - Math.abs(offset) * 0.15);
                  const rotateY = offset * -25; // Rotate slightly towards center
                  const zIndex = 10 - Math.abs(offset);
                  const opacity = isCenter ? 1 : Math.max(0, 0.8 - Math.abs(offset) * 0.3);

                  return (
                    <motion.div
                      key={store.id}
                      className="absolute top-0 bottom-0 flex items-center justify-center cursor-grab active:cursor-grabbing w-[260px] sm:w-[320px]"
                      initial={false}
                      animate={{
                        x: `${x}%`,
                        scale,
                        rotateY,
                        zIndex,
                        opacity,
                      }}
                      style={{ willChange: "transform" }}
                      transition={{ type: "tween", duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (info.offset.x > 50) {
                          handlePrev();
                        } else if (info.offset.x < -50) {
                          handleNext();
                        }
                      }}
                      onClick={() => !isCenter && setActiveIndex(i)}
                    >
                      {/* Image Card */}
                      <div className="w-full h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 bg-white relative pointer-events-none">
                        <img 
                          src={store.mobileImage} 
                          alt={`Store ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Carousel Navigation Controls */}
            <div className="flex items-center gap-4 mt-8 z-30">
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
                className="group relative bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl text-base text-center transition-all duration-300 hover:scale-105 shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-3 overflow-hidden"
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
