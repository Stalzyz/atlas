"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, ShoppingBag, Ruler, Layers, Import, Image as ImageIcon, 
  ShoppingCart, Users, Star, Ticket, CreditCard, Share2, Megaphone, 
  Palette, FileText, Truck, PackagePlus, Store, Tag, PackageSearch, 
  MapPin, RefreshCcw, Settings, BarChart3, Receipt, FileSpreadsheet, 
  Calculator, ShieldCheck, Mail, Database, Globe, Factory, Target, Box, ChartBar, MessageCircle
} from "lucide-react";

const MODULES = [
  {
    category: "Catalog & Products",
    description: "Total control over what you sell, how it looks, and how it's organized.",
    icon: <ShoppingBag className="w-8 h-8" />,
    items: [
      { name: "Overview", icon: <LayoutDashboard size={18} />, text: "A bird's-eye view of your entire inventory health." },
      { name: "Products", icon: <ShoppingBag size={18} />, text: "Manage details, variants, prices, and stock levels." },
      { name: "Size Guides", icon: <Ruler size={18} />, text: "Create dynamic size charts to reduce customer returns." },
      { name: "Collections", icon: <Layers size={18} />, text: "Group items into smart categories for easy browsing." },
      { name: "Import Products", icon: <Import size={18} />, text: "1-click migration from Shopify or CSV uploads." },
      { name: "Images & Videos", icon: <ImageIcon size={18} />, text: "Central media library for all product assets." }
    ]
  },
  {
    category: "Sales & Customers",
    description: "Manage the people who buy from you and the orders they place.",
    icon: <Users className="w-8 h-8" />,
    items: [
      { name: "Orders", icon: <ShoppingCart size={18} />, text: "Process, edit, and track every single customer order." },
      { name: "Customers", icon: <Users size={18} />, text: "Detailed profiles, purchase history, and lifetime value." },
      { name: "Reviews", icon: <Star size={18} />, text: "Moderate and publish customer feedback and ratings." }
    ]
  },
  {
    category: "Marketing & Loyalty",
    description: "Tools designed to bring shoppers back and increase average order value.",
    icon: <Megaphone className="w-8 h-8" />,
    items: [
      { name: "Coupons & Offers", icon: <Ticket size={18} />, text: "Create smart discounts, BOGO deals, and flash sales." },
      { name: "Store Credits", icon: <CreditCard size={18} />, text: "Digital wallets to reward customers and handle refunds." },
      { name: "Referrals", icon: <Share2 size={18} />, text: "Turn your best customers into powerful brand advocates." },
      { name: "Campaigns", icon: <Megaphone size={18} />, text: "Send targeted emails and smart nudges directly to buyers." }
    ]
  },
  {
    category: "Design & Website",
    description: "Shape your brand's digital storefront without writing code.",
    icon: <Palette className="w-8 h-8" />,
    items: [
      { name: "Website Design", icon: <Palette size={18} />, text: "Customize colors, typography, and page layouts easily." },
      { name: "Pages", icon: <FileText size={18} />, text: "Build beautiful custom landing pages for holidays or events." }
    ]
  },
  {
    category: "Supply Chain",
    description: "Connect your storefront directly to your manufacturers.",
    icon: <Factory className="w-8 h-8" />,
    items: [
      { name: "Partners List", icon: <Users size={18} />, text: "A directory of all your factories and suppliers." },
      { name: "Stock Orders", icon: <PackagePlus size={18} />, text: "Automate purchase orders when inventory runs low." }
    ]
  },
  {
    category: "Wholesale (B2B)",
    description: "Scale your revenue by selling in bulk to other retailers.",
    icon: <Globe className="w-8 h-8" />,
    items: [
      { name: "Store Partners", icon: <Store size={18} />, text: "Approve and manage your B2B wholesale buyers." },
      { name: "Price Settings", icon: <Tag size={18} />, text: "Create custom price lists for different partner tiers." },
      { name: "Partner Orders", icon: <PackageSearch size={18} />, text: "Handle massive bulk shipments smoothly and easily." }
    ]
  },
  {
    category: "Shipping & Logistics",
    description: "Get products out the door fast and handle returns painlessly.",
    icon: <Truck className="w-8 h-8" />,
    items: [
      { name: "Shipping Desk", icon: <Truck size={18} />, text: "Print labels and manage the daily packing queue." },
      { name: "Track Shipments", icon: <MapPin size={18} />, text: "Live updates on where packages are globally." },
      { name: "Returns", icon: <RefreshCcw size={18} />, text: "Automated portal for hassle-free customer returns." },
      { name: "Shipping Settings", icon: <Settings size={18} />, text: "Set carrier rates, zones, and free shipping rules." }
    ]
  },
  {
    category: "Finance & Reports",
    description: "Crystal clear visibility into your money, taxes, and margins.",
    icon: <ChartBar className="w-8 h-8" />,
    items: [
      { name: "Sales Reports", icon: <BarChart3 size={18} />, text: "Deep analytics on what's selling and who is buying." },
      { name: "Transactions", icon: <Receipt size={18} />, text: "A unified ledger of every single payment capture." },
      { name: "Invoices", icon: <FileText size={18} />, text: "Generate professional B2B invoices automatically." },
      { name: "Tax Reports", icon: <FileSpreadsheet size={18} />, text: "Export sales tax data instantly for your accountant." },
      { name: "Reconciliation", icon: <Calculator size={18} />, text: "Match your bank payouts to your storefront sales." }
    ]
  },
  {
    category: "Configuration",
    description: "The secure foundation that runs your entire commerce empire.",
    icon: <Settings className="w-8 h-8" />,
    items: [
      { name: "Team Access", icon: <ShieldCheck size={18} />, text: "Granular permissions for marketing vs finance staff." },
      { name: "Store Settings", icon: <Settings size={18} />, text: "Manage domains, currencies, and global defaults." },
      { name: "Email Templates", icon: <Mail size={18} />, text: "Customize order confirmations and shipping alerts." },
      { name: "Backups", icon: <Database size={18} />, text: "Automated daily snapshots to keep your data safe." }
    ]
  }
];

export default function EnterpriseLandingPage() {
  return (
    <main className="min-h-screen text-white relative font-[family-name:var(--body-font)] pb-24" style={{ background: "linear-gradient(135deg, var(--wine), var(--wine-dark))" }}>
      
      {/* ─── Background Noise ─────────────────────────────────────────── */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="absolute top-0 left-0 right-0 p-8 flex justify-center lg:justify-start z-50">
        <Link href="/" className="text-2xl font-serif tracking-[0.2em] text-white">
          ATLAS
        </Link>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-40 pb-24 lg:pt-48 lg:pb-32 z-10">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full pointer-events-none opacity-40 mix-blend-screen" style={{ background: "radial-gradient(ellipse at 50% -20%, var(--cta) 0%, transparent 70%)" }} />
        
        <div className="container mx-auto px-6 relative text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/30 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-8">
            The All-in-One Store Management System
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl text-white font-serif max-w-5xl mx-auto leading-tight mb-8">
            Own Your Store. Own Your Growth.<br />Stop Paying Monthly Subscriptions.
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 font-sans leading-relaxed">
            Meet Atlas Enterprise — the easy-to-use system built for growing brands. Connect your online store, wholesale partners, suppliers, and money matters all in one beautiful dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://atlasadmin.grekam.in/login" 
              className="luxury-button w-full sm:w-auto shadow-xl shadow-[var(--cta)]/20 text-center"
            >
              View Demo
            </a>
            <a 
              href="https://wa.me/919789359407?text=Send%20Ecommerce%20Quote" 
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-3.5 text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold rounded-full border border-white/20 hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Get Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ─── The Vision ─────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-8">Designed to Sell More Efficiently.</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-6">
            Your business needs a fully responsive website that looks stunning on every device. But more importantly, you need a powerful backend admin panel to run everything smoothly.
          </p>
          <p className="text-lg text-white/70 leading-relaxed">
            <strong className="text-white font-semibold">Atlas changes all that.</strong> We built a system from scratch to handle everything—all managed from one fast, beautiful dashboard. No more messy apps. Just total control made easy.
          </p>
        </div>
      </section>

      {/* ─── The Command Center / Modules ───────────────────────────────── */}
      <section id="architecture" className="py-24 relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Everything You Need</h2>
            <p className="text-white/70">All built right in.</p>
          </div>

          <div className="space-y-16">
            {MODULES.map((module, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row gap-8 mb-10 items-start">
                  <div className="w-16 h-16 rounded-2xl bg-[var(--cta)]/20 text-[var(--cta)] flex items-center justify-center shrink-0 border border-[var(--cta)]/30">
                    {module.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">{module.category}</h3>
                    <p className="text-white/70 text-lg">{module.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {module.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 group">
                      <div className="text-[var(--cta)] mt-1 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1">{item.name}</h4>
                        <p className="text-xs text-white/60 leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it Scales ────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-20 text-center">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Built to Grow With You</h2>
            <p className="text-white/70">Never Holds You Back.</p>
          </div>

          <div className="space-y-20">
            {/* Block 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">From Single Store to Everywhere</h3>
                <p className="text-white/70 leading-relaxed">
                  Start selling directly to customers today, and turn on your wholesale portal tomorrow—all sharing the exact same stock. Atlas automatically sends orders to the right place.
                </p>
              </div>
              <div className="flex-1 w-full h-64 bg-white/10 rounded-3xl p-1 shadow-2xl backdrop-blur-sm border border-white/10">
                <div className="w-full h-full bg-[#1A0A32]/60 rounded-[22px] flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Inventory Pool</div>
                    <div className="flex flex-col gap-2 mt-4 text-[var(--cta)] font-bold">
                      <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">Online Store</div>
                      <div className="text-[var(--cta)]">↓</div>
                      <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">Wholesale Portal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Easy Website Builder</h3>
                <p className="text-white/70 leading-relaxed">
                  Need to update your website for a holiday sale? Our built-in page builder lets your team create beautiful, fast pages without writing any code.
                </p>
              </div>
              <div className="flex-1 w-full h-64 bg-white/5 rounded-3xl relative overflow-hidden backdrop-blur-sm border border-white/10">
                <div className="absolute inset-x-4 top-4 bottom-0 bg-[#1A0A32]/60 rounded-t-xl shadow-lg border-x border-t border-white/10 p-4 flex flex-col gap-3">
                  <div className="w-3/4 h-8 bg-white/10 rounded-lg"></div>
                  <div className="w-1/2 h-4 bg-white/10 rounded"></div>
                  <div className="w-full h-32 bg-[var(--cta)]/20 border border-dashed border-[var(--cta)]/50 rounded-lg mt-4 flex items-center justify-center text-[var(--cta)] font-bold tracking-widest text-xs uppercase">Your Custom Page</div>
                </div>
              </div>
            </div>

            {/* Block 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Easy Team Access</h3>
                <p className="text-white/70 leading-relaxed">
                  As your team grows, you can easily control who sees what. Let the marketing team see campaigns, while the finance team sees the money. Complete security, made simple.
                </p>
              </div>
              <div className="flex-1 w-full h-64 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-8 backdrop-blur-sm">
                <div className="space-y-3 w-full max-w-xs">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#1A0A32]/60 shadow-sm border border-white/10">
                    <span className="text-sm font-bold text-white">Finance Team</span>
                    <span className="text-[10px] uppercase font-bold text-white bg-[var(--cta)]/40 px-2 py-1 rounded-full border border-[var(--cta)]/50">Finance tools</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#1A0A32]/60 shadow-sm border border-white/10">
                    <span className="text-sm font-bold text-white">Marketing Dept</span>
                    <span className="text-[10px] uppercase font-bold text-white bg-blue-500/40 px-2 py-1 rounded-full border border-blue-500/50">Marketing tools</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-[#1A0A32]/60 shadow-sm border border-white/10 opacity-50">
                    <span className="text-sm font-bold text-white">Data Entry</span>
                    <span className="text-[10px] uppercase font-bold text-white bg-purple-500/40 px-2 py-1 rounded-full border border-purple-500/50">Product tools</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Security & Testimonials ─────────────────────────────────── */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-[10px] text-[var(--cta)] uppercase tracking-[0.3em] font-bold mb-4">Safe & Reliable</div>
              <h2 className="text-3xl md:text-5xl font-serif mb-6 text-white">Always Online.</h2>
              <p className="text-white/70 mb-8 leading-relaxed text-lg">When you have lots of sales, you can't afford your website to go down. Atlas is built to stay up and keep your data safe.</p>
              
              <ul className="space-y-4 text-white/80">
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--cta)]" />
                  <strong>Automated Backups:</strong> Real-time data saving
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--cta)]" />
                  <strong>Team Access:</strong> Control who sees what
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--cta)]" />
                  <strong>Super Fast:</strong> Loads quickly everywhere
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
                <p className="text-lg italic text-white/90 mb-6 font-serif leading-relaxed">"We used to need 14 different apps to manage our store. Moving to Atlas connected everything together. We cut costs by 60% and doubled our packing speed."</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">OD</div>
                  <div>
                    <div className="font-bold text-sm text-white">Operations Manager</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">Global Fashion House</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl ml-0 md:ml-8 hover:bg-white/10 transition-colors">
                <p className="text-lg italic text-white/90 mb-6 font-serif leading-relaxed">"The Wholesale feature changed everything for us. Our partners can now log in, see their special pricing, and place big orders without having to call us."</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">VS</div>
                  <div>
                    <div className="font-bold text-sm text-white">Store Owner</div>
                    <div className="text-[10px] text-white/50 uppercase tracking-widest">Luxury Retailer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Do I have to pay a monthly subscription?</h4>
              <p className="text-white/70">No! Own your store and stop paying endless monthly fees. Once you are set up, the engine is yours to scale without penalty.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Can I easily move my products from Shopify?</h4>
              <p className="text-white/70">Yes. Our easy product import tool lets you bring over your entire catalog from Shopify with just one click.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">Is the website mobile-friendly and SEO optimized?</h4>
              <p className="text-white/70">Absolutely. Your business needs a fully responsive website, and Atlas delivers a beautiful, fast experience on every device, with built-in SEO tools to help you rank higher.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all">
              <h4 className="text-lg font-bold text-white mb-2">How does the credit points system work?</h4>
              <p className="text-white/70">You can reward your customers with credit points for their purchases, which are stored in their digital wallets to encourage repeat shopping.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────────── */}
      <section className="py-32 text-center relative z-10 border-t border-white/10">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            Stop letting tricky software hold you back. Upgrade to a system that makes running your store a breeze.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://atlasadmin.grekam.in/login" 
              className="luxury-button shadow-xl shadow-[var(--cta)]/20 text-center w-full sm:w-auto"
            >
              View Demo
            </a>
            <a 
              href="https://wa.me/919789359407?text=Send%20Ecommerce%20Quote" 
              target="_blank" 
              rel="noreferrer"
              className="px-10 py-3.5 text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold rounded-full border border-white/20 hover:bg-white/10 transition-colors w-full sm:w-auto text-center"
            >
              Get Pricing
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="py-8 border-t border-white/10 text-center relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-xs tracking-widest uppercase">
          <div>A product by Grekam</div>
          <div className="flex items-center gap-2">
            <MessageCircle size={14} />
            <a href="https://wa.me/919789359407" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              WhatsApp: +91 9789359407
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
