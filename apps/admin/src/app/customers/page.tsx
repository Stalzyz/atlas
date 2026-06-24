"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Filter, 
  ExternalLink,
  Loader2,
  Tag,
  Clock,
  Send
} from "lucide-react";
import Link from "next/link";
import { useAdminAuth } from "@/components/providers/AuthProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? "http://localhost:6005" : "https://api.raaghas.in");

export default function CustomersPage() {
  const { token } = useAdminAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = (searchParams.get("tab") || "ALL") as 'ALL' | 'PROSPECTS';
  const setActiveTab = (tab: 'ALL' | 'PROSPECTS') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [customers, setCustomers] = useState<any[]>([]);
  const [prospects, setProspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    if (token) fetchData();
  }, [activeTab, token]);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const endpoint = activeTab === 'ALL' ? '/customers' : '/customers/prospects';
      
      const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      if (activeTab === 'ALL') setCustomers(safeData);
      else setProspects(safeData);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = (activeTab === 'ALL' ? customers : prospects).filter(c => 
    c.email.toLowerCase().includes(search.toLowerCase()) || 
    (c.name && c.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Customer Intelligence</h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Manage your community and recover potential revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                const params = new URLSearchParams(searchParams.toString());
                if (e.target.value) params.set("q", e.target.value);
                else params.delete("q");
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
              }}
              className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:border-wine outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-50 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100/50 w-fit rounded-2xl border border-gray-100">
        <button 
          onClick={() => setActiveTab('ALL')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'ALL' ? "bg-white text-wine shadow-sm" : "text-gray-400 hover:text-charcoal"
          }`}
        >
          <Users size={14} />
          All Customers
        </button>
        <button 
          onClick={() => setActiveTab('PROSPECTS')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
            activeTab === 'PROSPECTS' ? "bg-wine text-white shadow-lg" : "text-gray-400 hover:text-charcoal"
          }`}
        >
          <Sparkles size={14} />
          Prospects (Leads)
          <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px]">
            {prospects.length || 0}
          </span>
        </button>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-24 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-wine" size={32} />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Analyzing your customer base...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="p-24 text-center space-y-4">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Users size={32} />
             </div>
             <p className="text-gray-500 font-medium">No users found matching your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-8 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Identity</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Status/Role</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                    {activeTab === 'ALL' ? 'Acquisition' : 'Last Interest'}
                  </th>
                  <th className="px-8 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Interests</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest">Wallet</th>
                  <th className="px-8 py-5 text-[10px] uppercase font-bold text-gray-400 tracking-widest text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-gray-50/50 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-wine/5 flex items-center justify-center text-wine text-xs font-bold border border-wine/5">
                          {customer.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-charcoal">{customer.name || 'Anonymous User'}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail size={12} /> {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                         customer._count?.orders > 0 ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                       }`}>
                         {customer._count?.orders > 0 ? `${customer._count.orders} Orders` : 'Prospect'}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                         <Clock size={14} className="text-gray-300" />
                         {activeTab === 'ALL' 
                           ? new Date(customer.createdAt).toLocaleDateString()
                           : customer.lastActiveAt ? new Date(customer.lastActiveAt).toLocaleDateString() : 'Never'}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-wrap gap-1">
                         {customer.interests?.slice(0, 3).map((interest: string, idx: number) => (
                           <span key={idx} className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[9px] rounded-md font-bold border border-gray-100">
                             {interest}
                           </span>
                         ))}
                         {(!customer.interests || customer.interests.length === 0) && (
                           <span className="text-[10px] text-gray-300 italic font-sans">No data yet</span>
                         )}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                          <span className="font-bold text-charcoal">
                             ₹{customer.wallet?.balance || 0}
                          </span>
                          {Number(customer.wallet?.balance || 0) > 0 && (
                             <Sparkles size={12} className="text-yellow-500" />
                          )}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          {activeTab === 'PROSPECTS' && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-wine text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal transition-all shadow-md">
                              <Send size={12} />
                              Nudge
                            </button>
                          )}
                          <Link href={`/customers/${customer.id}`} className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-wine transition-all">
                             <ExternalLink size={16} />
                          </Link>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 flex items-center justify-between">
            <div>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Total Audience</p>
               <h3 className="text-3xl font-serif text-charcoal">{customers.length + prospects.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
               <Users size={24} />
            </div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 flex items-center justify-between">
            <div>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Unconverted Leads</p>
               <h3 className="text-3xl font-serif text-orange-600">{prospects.length}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
               <Sparkles size={24} />
            </div>
         </div>
         <div className="bg-white p-8 rounded-[32px] border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-wine/20 transition-all">
            <div>
               <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Abandoned Carts</p>
               <h3 className="text-3xl font-serif text-wine">14</h3>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-wine group-hover:scale-110 transition-transform">
               <Tag size={24} />
            </div>
         </div>
      </div>
    </div>
  );
}
