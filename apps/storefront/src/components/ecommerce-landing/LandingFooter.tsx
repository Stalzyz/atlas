'use client';
import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="Grekam Visuals Logo" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-slate-400 text-sm max-w-sm font-light leading-relaxed">
              Engineering high-converting, sub-second e-commerce storefronts on Shopify, WooCommerce, and Atlas CMS.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available for New Projects
              </span>
            </div>
          </div>

          {/* E-Commerce Solutions */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">E-Commerce Platforms</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#platforms" className="hover:text-emerald-400 transition-colors">Shopify Development</a></li>
              <li><a href="#platforms" className="hover:text-emerald-400 transition-colors">WooCommerce Setup</a></li>
              <li><a href="#platforms" className="hover:text-emerald-400 transition-colors">Atlas Custom Headless CMS</a></li>
              <li><a href="#roi-calculator" className="hover:text-emerald-400 transition-colors">ROI Calculator</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#pricing" className="hover:text-emerald-400 transition-colors">Transparent Pricing</a></li>
              <li><a href="#process" className="hover:text-emerald-400 transition-colors">Development Process</a></li>
              <li><a href="#faqs" className="hover:text-emerald-400 transition-colors">FAQs</a></li>
              <li><a href="https://wa.me/919843199556" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">Contact Support <ArrowUpRight className="w-3 h-3" /></a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Get in Touch</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href="tel:+919843199556" className="hover:text-white transition-colors">+91 98431 99556</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>hello@grekam.in</span>
              </p>
              <p className="flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>India</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Grekam Visuals. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/policies/privacy-policy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="/policies/terms-and-conditions" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
