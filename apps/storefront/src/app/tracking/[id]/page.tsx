"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/lib/api";
import { 
  Truck, Package, CheckCircle2, Clock, MapPin, 
  ChevronRight, ArrowLeft, Loader2, Navigation,
  AlertCircle, ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PublicTrackingPage() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTracking();
  }, [id]);

  const fetchTracking = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/logistics/tracking/${id}`);
      if (!res.ok) throw new Error("Shipment not found");
      const data = await res.json();
      setShipment(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="animate-spin text-wine" size={40} />
      <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-gray-400">Locating your Raaghas shipment...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center px-6">
      <div className="p-6 bg-red-50 text-red-500 rounded-full">
        <AlertCircle size={40} />
      </div>
      <div>
        <h1 className="text-2xl font-serif text-charcoal">Shipment Not Found</h1>
        <p className="text-sm text-gray-400 mt-2">We couldn't find a shipment with that tracking ID. Please check the ID and try again.</p>
      </div>
      <Link href="/" className="bg-wine text-ivory px-8 py-4 rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-xl">
        Back to Shopping
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory/30 pb-24">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-24 space-y-8">
        <Link href="/account/orders" className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-charcoal/40 hover:text-wine transition-colors">
          <ArrowLeft size={14} /> Back to My Orders
        </Link>

        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-charcoal/5 space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-12 border-b border-charcoal/5">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif text-charcoal">Track Shipment</h1>
              <p className="text-xs text-charcoal/40 font-bold uppercase tracking-widest">Tracking ID: {shipment.trackingId}</p>
            </div>
            <div className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-wine text-white`}>
              {shipment.status}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-12 relative">
             {/* Vertical Line */}
             <div className="absolute left-[15px] top-4 bottom-4 w-px bg-charcoal/10" />

             {(shipment.history || [
               { status: 'CONFIRMED', message: 'The artisan order has been verified and is ready for creation.', timestamp: shipment.order.createdAt, location: 'Raaghas Studio' },
               { status: 'PACKED', message: 'Your items have been carefully packaged in our signature luxury box.', timestamp: shipment.shippedAt || new Date(), location: 'Distribution Hub' },
               { status: 'SHIPPED', message: 'Package has been handed over to our premium logistics partner.', timestamp: shipment.shippedAt, location: 'Transit Point' },
             ]).map((event: any, i: number) => (
               <div key={i} className="relative pl-16 group">
                  {/* Dot */}
                  <div className={`absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 z-10 ${i === 0 ? 'bg-wine text-white scale-110' : 'bg-gray-50 text-gray-300'}`}>
                     {event.status === 'CONFIRMED' && <ShieldCheck size={18} />}
                     {event.status === 'PACKED' && <Package size={18} />}
                     {event.status === 'SHIPPED' && <Truck size={18} />}
                     {event.status === 'DELIVERED' && <CheckCircle2 size={18} />}
                     {!['CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'].includes(event.status) && <Clock size={18} />}
                  </div>
                  <div className="space-y-1">
                     <div className="flex justify-between items-center">
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${i === 0 ? 'text-wine' : 'text-charcoal/30'}`}>
                           {event.status}
                        </p>
                        <p className="text-[9px] text-charcoal/20 font-bold uppercase tracking-widest">{event.location || 'Hub'}</p>
                     </div>
                     <p className={`text-sm leading-relaxed ${i === 0 ? 'text-charcoal font-medium' : 'text-charcoal/60'}`}>{event.message}</p>
                     <p className="text-[10px] text-charcoal/30 font-bold mt-1">
                        {new Date(event.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                     </p>
                  </div>
               </div>
             ))}
          </div>

          {/* Delivery Info */}
          <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-charcoal/5">
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-charcoal/40">
                   <Truck size={14} /> Shipping Via
                </div>
                <div>
                   <p className="text-sm font-bold text-charcoal">{shipment.courier || 'Standard Logistics'}</p>
                   <p className="text-xs text-charcoal/60 mt-1">Estimated Arrival: {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString('en-GB') : 'TBD'}</p>
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-charcoal/40">
                   <MapPin size={14} /> Destination
                </div>
                <div>
                   <p className="text-sm font-bold text-charcoal">{shipment.order.customerName}</p>
                   <p className="text-xs text-charcoal/60 mt-1">Signature Required upon delivery</p>
                </div>
             </div>
          </div>
        </div>

        {/* Support Callout */}
        <div className="bg-charcoal text-ivory rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="space-y-2 text-center md:text-left">
              <h3 className="text-lg font-serif">Need assistance with your delivery?</h3>
              <p className="text-xs text-ivory/60 uppercase font-bold tracking-widest">Our Raaghas Concierge is here to help.</p>
           </div>
           <button className="bg-wine text-white px-8 py-4 rounded-xl text-[10px] uppercase font-bold tracking-widest shadow-xl whitespace-nowrap">
              Contact Support
           </button>
        </div>
      </div>
    </div>
  );
}
