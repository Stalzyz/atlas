"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart, Users, MessageSquare, BarChart3, MessageCircle,
  Truck, ClipboardList, Sparkles, LayoutDashboard, Package, Image, Settings, Zap,
  LogOut, Wallet, FileText, Landmark, RefreshCw, LayoutGrid, Mail, HardDrive
} from "lucide-react";
import { useAdminAuth } from "@/components/providers/AuthProvider";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[]; // Optional: restrict to specific roles (legacy)
  permission?: string; // Optional: restrict to specific permission
}

function SidebarLink({ href, icon, label, roles, permission }: SidebarLinkProps) {
  const pathname = usePathname();
  const { user, isLoading } = useAdminAuth();
  const isActive = pathname === href || (href !== "/" && pathname?.startsWith(href));

  // If roles are specified, check if user has one of them
  // Hide if loading or if user doesn't have the role
  // 1. Check Granular Permissions (Priority)
  if (permission) {
    if (isLoading) return null;
    if (!user) return null;
    
    // Admins have bypass
    const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'ADMIN';
    const hasPermission = user.permissions?.includes(permission);
    
    if (!isAdmin && !hasPermission && !['OPERATIONS', 'MARKETING', 'FINANCE'].includes(user.role)) {
      return null;
    }
  }

  // 2. Check Legacy Roles (Fallback)
  if (roles && !permission) {
    if (isLoading) return null;
    if (!user || !roles.includes(user.role)) return null;
  }

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
        isActive 
          ? "bg-wine text-ivory shadow-lg shadow-wine/20 translate-x-1" 
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <div className={`${isActive ? "text-ivory" : "text-gray-400 group-hover:text-wine"} transition-colors`}>
        {icon}
      </div>
      <span>{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const { user, logout } = useAdminAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-xl font-bold tracking-tight text-wine">RAAGHAS</span>
        <span className="ml-2 px-1.5 py-0.5 bg-beige text-[10px] uppercase font-bold text-wine rounded leading-none">Admin</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <SidebarLink href="/" icon={<LayoutDashboard size={18} />} label="Overview" permission="module:dashboard" />
        <SidebarLink href="/products" icon={<Package size={18} />} label="Products" permission="module:products" />
        <SidebarLink href="/products/size-guides" icon={<Settings size={18} />} label="Size Guides" permission="module:products" />
        <SidebarLink href="/products/collections" icon={<LayoutGrid size={18} />} label="Collections" permission="module:products" />
        <SidebarLink href="/products/shopify" icon={<Sparkles size={18} />} label="Import Products" permission="module:products" />
        <SidebarLink href="/media" icon={<Image size={18} />} label="Images & Videos" permission="module:media" />
        <SidebarLink href="/orders" icon={<ShoppingCart size={18} />} label="Orders" permission="module:orders" />
        <SidebarLink href="/customers" icon={<Users size={18} />} label="Customers" permission="module:customers" />
        <SidebarLink href="/reviews" icon={<MessageSquare size={18} />} label="Reviews" permission="module:reviews" />
        
        <div className="pt-6 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/60">Marketing</div>
        <SidebarLink href="/marketing/coupons" icon={<Sparkles size={18} />} label="Coupons & Offers" permission="module:marketing" />
        <SidebarLink href="/marketing/wallet" icon={<ClipboardList size={18} />} label="Store Credits" permission="module:marketing" />
        <SidebarLink href="/marketing/referrals" icon={<Users size={18} />} label="Referrals" permission="module:marketing" />
        <SidebarLink href="/marketing" icon={<MessageCircle size={18} />} label="Campaigns" permission="module:marketing" />

        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/60">Design</div>
        <SidebarLink href="/cms" icon={<Settings size={18} />} label="Website Design" permission="module:cms" />
        <SidebarLink href="/cms/pages" icon={<FileText size={18} />} label="Pages" permission="module:cms" />

        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/60">Supply Partners</div>
        <SidebarLink href="/procurement/suppliers" icon={<Users size={18} />} label="Partners List" permission="module:procurement" />
        <SidebarLink href="/procurement/orders" icon={<ClipboardList size={18} />} label="Stock Orders" permission="module:procurement" />

        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/60">Partner Channels</div>
        <SidebarLink href="/wholesale/retailers" icon={<Users size={18} />} label="Store Partners" permission="module:wholesale" />
        <SidebarLink href="/wholesale/price-lists" icon={<BarChart3 size={18} />} label="Price Settings" permission="module:wholesale" />
        <SidebarLink href="/wholesale/orders" icon={<ShoppingCart size={18} />} label="Partner Orders" permission="module:wholesale" />
        
        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/60">Shipping</div>
        <SidebarLink href="/logistics/fulfillment" icon={<ClipboardList size={18} />} label="Shipping Desk" permission="module:logistics" />
        <SidebarLink href="/logistics/shipments" icon={<Truck size={18} />} label="Track Shipments" permission="module:logistics" />
        <SidebarLink href="/logistics/returns" icon={<RefreshCw size={18} />} label="Returns" permission="module:logistics" />
        <SidebarLink href="/logistics/shipping" icon={<Settings size={18} />} label="Shipping Settings" permission="module:logistics" />

        {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'OPERATIONS' || user?.role === 'ACCOUNTANT' || user?.role === 'FINANCE' || user?.permissions?.includes('module:finance')) && (
          <>
            <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/60">Finance</div>
            <SidebarLink href="/analytics" icon={<BarChart3 size={18} />} label="Sales Reports" permission="module:finance" />
            <SidebarLink href="/analytics/ledger" icon={<Landmark size={18} />} label="Transactions" permission="module:finance" />
            <SidebarLink href="/invoices/history" icon={<FileText size={18} />} label="Invoices" permission="module:finance" />
            <SidebarLink href="/analytics/tax-reports" icon={<ClipboardList size={18} />} label="Tax Reports" permission="module:finance" />
            <SidebarLink href="/reconciliation" icon={<RefreshCw size={18} />} label="Reconciliation" permission="module:finance" />
          </>
        )}
        
        <div className="pt-4 pb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400/60">Configuration</div>
        <SidebarLink href="/roles" icon={<Users size={18} />} label="Team Access" permission="module:roles" roles={['SUPER_ADMIN']} />
        <SidebarLink href="/settings" icon={<Settings size={18} />} label="Store Settings" permission="module:settings" />
        <SidebarLink href="/settings/email-templates" icon={<Mail size={18} />} label="Email Templates" permission="module:settings" />
        <SidebarLink href="/settings/backups" icon={<HardDrive size={18} />} label="Backups" roles={['SUPER_ADMIN', 'ADMIN']} />
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
         <Link href="/profile" className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-all group">
           <div className="w-10 h-10 rounded-full bg-wine text-ivory flex items-center justify-center text-sm font-bold font-serif shadow-md group-hover:scale-110 transition-transform">
             {user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
           </div>
           <div className="flex-1 overflow-hidden">
             <p className="text-sm font-bold text-charcoal truncate">{user?.name || 'Admin User'}</p>
             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{user?.email || 'Super Admin'}</p>
           </div>
         </Link>
         
         <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.2em] text-red-600 hover:bg-red-50 hover:text-red-700 transition-all active:scale-[0.98]"
         >
           <LogOut size={16} />
           <span>Sign Out</span>
         </button>
      </div>
    </aside>
  );
}
