"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingCart, Users, MessageSquare, BarChart3, MessageCircle,
  Truck, ClipboardList, Sparkles, LayoutDashboard, Package, Image as ImageIcon, Settings, Zap,
  LogOut, Wallet, FileText, Landmark, RefreshCw, LayoutGrid, Mail, HardDrive
} from "lucide-react";
import { useAdminAuth } from "@/components/providers/AuthProvider";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
  permission?: string;
}

function SidebarLink({ href, icon, label, roles, permission }: SidebarLinkProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAdminAuth();
  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

  if (permission) {
    if (isLoading) return null;
    if (!user) return null;
    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    const hasPermission = user.permissions?.includes(permission);
    if (!isAdmin && !hasPermission && !['OPERATIONS', 'MARKETING', 'FINANCE'].includes(user.role)) {
      return null;
    }
  }

  if (roles && !permission) {
    if (isLoading) return null;
    if (!user || !roles.includes(user.role)) return null;
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
        isActive
          ? "bg-[#ffffff]/15 text-[#ffffff] shadow-lg shadow-black/20 translate-x-1 backdrop-blur-sm"
          : "text-[#ffffff] opacity-75 hover:opacity-100 hover:bg-[#ffffff]/10"
      }`}
    >
      <div className={`${isActive ? "text-[#DEACF5]" : "text-[#ffffff] opacity-60 group-hover:text-[#DEACF5]"} transition-colors flex-shrink-0`}>
        {icon}
      </div>
      <span className="truncate">{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#9754CB] flex-shrink-0" />}
    </Link>
  );
}

export function Sidebar({ isOpen = false, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const { user, logout } = useAdminAuth();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-64 flex flex-col z-30 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `} style={{ background: "linear-gradient(180deg, #28104E 0%, #1a0a33 100%)" }}>
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(151,84,203,0.25) 0%, transparent 70%)" }} />

      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[#ffffff]/10 flex-shrink-0 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #6237A0, #9754CB)" }}>
            <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none">
              <path d="M10 2 L17 16 H13.5 L10 7 L6.5 16 H3 Z" fill="white"/>
              <path d="M5.5 13 H14.5" stroke="#DEACF5" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <span className="text-[#ffffff] font-bold tracking-widest text-sm" style={{ fontFamily: "'Jost', sans-serif" }}>ATLAS</span>
            <div className="text-[9px] text-[#ffffff] opacity-60 uppercase tracking-widest font-medium leading-none">Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 relative z-10 custom-scrollbar">
        <SidebarLink href="/" icon={<LayoutDashboard size={16} />} label="Overview" permission="module:dashboard" />
        <SidebarLink href="/products" icon={<Package size={16} />} label="Products" permission="module:products" />
        <SidebarLink href="/products/size-guides" icon={<Settings size={16} />} label="Size Guides" permission="module:products" />
        <SidebarLink href="/products/collections" icon={<LayoutGrid size={16} />} label="Collections" permission="module:products" />
        <SidebarLink href="/products/shopify" icon={<Sparkles size={16} />} label="Import Products" permission="module:products" />
        <SidebarLink href="/media" icon={<ImageIcon size={16} />} label="Images & Videos" permission="module:media" />
        <SidebarLink href="/orders" icon={<ShoppingCart size={16} />} label="Orders" permission="module:orders" />
        <SidebarLink href="/customers" icon={<Users size={16} />} label="Customers" permission="module:customers" />
        <SidebarLink href="/reviews" icon={<MessageSquare size={16} />} label="Reviews" permission="module:reviews" />

        <div className="pt-5 pb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff] opacity-50">Marketing</div>
        <SidebarLink href="/marketing/coupons" icon={<Sparkles size={16} />} label="Coupons & Offers" permission="module:marketing" />
        <SidebarLink href="/marketing/wallet" icon={<ClipboardList size={16} />} label="Store Credits" permission="module:marketing" />
        <SidebarLink href="/marketing/referrals" icon={<Users size={16} />} label="Referrals" permission="module:marketing" />
        <SidebarLink href="/marketing" icon={<MessageCircle size={16} />} label="Campaigns" permission="module:marketing" />

        <div className="pt-4 pb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff] opacity-50">Design</div>
        <SidebarLink href="/cms" icon={<Settings size={16} />} label="Website Design" permission="module:cms" />
        <SidebarLink href="/cms/pages" icon={<FileText size={16} />} label="Pages" permission="module:cms" />

        <div className="pt-4 pb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff] opacity-50">Supply Partners</div>
        <SidebarLink href="/procurement/suppliers" icon={<Users size={16} />} label="Partners List" permission="module:procurement" />
        <SidebarLink href="/procurement/orders" icon={<ClipboardList size={16} />} label="Stock Orders" permission="module:procurement" />

        <div className="pt-4 pb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff] opacity-50">Partner Channels</div>
        <SidebarLink href="/wholesale/retailers" icon={<Users size={16} />} label="Store Partners" permission="module:wholesale" />
        <SidebarLink href="/wholesale/price-lists" icon={<BarChart3 size={16} />} label="Price Settings" permission="module:wholesale" />
        <SidebarLink href="/wholesale/orders" icon={<ShoppingCart size={16} />} label="Partner Orders" permission="module:wholesale" />

        <div className="pt-4 pb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff] opacity-50">Shipping</div>
        <SidebarLink href="/logistics/fulfillment" icon={<ClipboardList size={16} />} label="Shipping Desk" permission="module:logistics" />
        <SidebarLink href="/logistics/shipments" icon={<Truck size={16} />} label="Track Shipments" permission="module:logistics" />
        <SidebarLink href="/logistics/returns" icon={<RefreshCw size={16} />} label="Returns" permission="module:logistics" />
        <SidebarLink href="/logistics/shipping" icon={<Settings size={16} />} label="Shipping Settings" permission="module:logistics" />

        {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'OPERATIONS' || user?.role === 'ACCOUNTANT' || user?.role === 'FINANCE' || user?.permissions?.includes('module:finance')) && (
          <>
            <div className="pt-4 pb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff] opacity-50">Finance</div>
            <SidebarLink href="/analytics" icon={<BarChart3 size={16} />} label="Sales Reports" permission="module:finance" />
            <SidebarLink href="/analytics/ledger" icon={<Landmark size={16} />} label="Transactions" permission="module:finance" />
            <SidebarLink href="/invoices/history" icon={<FileText size={16} />} label="Invoices" permission="module:finance" />
            <SidebarLink href="/analytics/tax-reports" icon={<ClipboardList size={16} />} label="Tax Reports" permission="module:finance" />
            <SidebarLink href="/reconciliation" icon={<RefreshCw size={16} />} label="Reconciliation" permission="module:finance" />
          </>
        )}

        <div className="pt-4 pb-2 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ffffff] opacity-50">Configuration</div>
        <SidebarLink href="/roles" icon={<Users size={16} />} label="Team Access" permission="module:roles" roles={['SUPER_ADMIN']} />
        <SidebarLink href="/settings" icon={<Settings size={16} />} label="Store Settings" permission="module:settings" />
        <SidebarLink href="/settings/email-templates" icon={<Mail size={16} />} label="Email Templates" permission="module:settings" />
        <SidebarLink href="/settings/backups" icon={<HardDrive size={16} />} label="Backups" roles={['SUPER_ADMIN', 'ADMIN']} />
      </nav>

      {/* User profile footer */}
      <div className="p-3 border-t border-[#ffffff]/10 space-y-1 relative z-10 flex-shrink-0">
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group hover:bg-[#ffffff]/10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-lg" style={{ background: "linear-gradient(135deg, #6237A0, #9754CB)", color: "white" }}>
            {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-[#ffffff] truncate">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-[#ffffff] opacity-60 truncate">{user?.email || 'admin@grekam.in'}</p>
          </div>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-[#ffffff] opacity-60 hover:opacity-100 hover:bg-red-500/15 hover:text-red-300 transition-all active:scale-[0.98]"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
    </>
  );
}
