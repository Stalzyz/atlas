"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle, FileText, Building2 } from "lucide-react";
import Link from "next/link";

export default function WholesaleCheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // In actual implementation, we pass auth headers natively
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005'}/api/v1/wholesale/orders/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Order not found");
        return res.json();
      })
      .then(data => setOrder(data))
      .catch(() => setError(true));
  }, [id]);

  if (error) return <div className="p-20 text-center text-red-500">Error loading wholesale order</div>;
  if (!order) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-charcoal" /></div>;

  const handleConfirmOrder = async () => {
    setProcessing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005'}/api/v1/wholesale/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PENDING_BANK_TRANSFER' })
      });
      if (!res.ok) throw new Error("Failed to confirm order");
      
      router.push(`/wholesale/invoice/${id}`);
    } catch (e) {
      alert("Something went wrong");
      setProcessing(false);
    }
  };

  const gstAmount = Number(order.totalAmount) * 0.18;
  const netPayable = Number(order.totalAmount) + gstAmount;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-charcoal">
      
      {/* ─── LEFT: Confirmation Steps ───────────────────────────────────────── */}
      <div className="w-full md:w-[60%] p-6 md:p-12 lg:p-20 bg-white shadow-sm z-10 space-y-12">
        <div>
          <Link href="/" className="text-3xl font-serif tracking-widest text-charcoal block mb-4">RAAGHAS</Link>
          <span className="text-xs tracking-widest text-gray-400 font-bold uppercase">B2B Wholesale Portal</span>
        </div>

        <div className="space-y-6 max-w-lg">
          <div className="bg-wine/5 border border-wine/10 p-6 rounded-xl flex gap-4">
             <div className="bg-wine w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0">
               <Building2 size={20} />
             </div>
             <div>
               <h3 className="font-bold font-serif text-lg">B2B Trade Checkout</h3>
               <p className="text-sm text-gray-600 leading-relaxed mt-1">
                 As an approved Retailer ({order.retailer.tier.toUpperCase()} Tier), your payment gateway is gracefully bypassed. Click confirm to generate your official GST Proforma Invoice containing our bank wire details.
               </p>
             </div>
          </div>

          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-serif">Billing Details</h2>
            <div className="p-6 border border-gray-200 rounded-lg text-sm text-gray-600 space-y-2">
              <p><strong className="text-charcoal mr-2">Business Name:</strong> {order.retailer.businessName}</p>
              <p><strong className="text-charcoal mr-2">Contact Person:</strong> {order.retailer.contactName}</p>
              <p><strong className="text-charcoal mr-2">GSTIN:</strong> <span className="font-mono">{order.retailer.gstNumber || 'Unregistered'}</span></p>
              <p><strong className="text-charcoal mr-2">Email Invoice To:</strong> {order.retailer.email}</p>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={handleConfirmOrder}
              disabled={processing}
              className="w-full bg-charcoal text-white px-8 py-5 rounded-md text-sm font-bold uppercase tracking-widest hover:bg-wine transition-all disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {processing ? (
                <><Loader2 size={18} className="animate-spin" /> Finalizing Invoice...</>
              ) : (
                <><FileText size={18} /> Confirm Order & Generate GST Invoice <ArrowRight size={16} /></>
              )}
            </button>
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-4">
              Your inventory will be reserved upon confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Wholesale Summary ──────────────────────────────────────── */}
      <div className="w-full md:w-[40%] p-6 md:p-12 lg:p-20 bg-gray-50 flex flex-col pt-12 md:pt-32">
        <div className="max-w-md w-full space-y-8">
          
          <h2 className="text-lg font-serif">Order Summary</h2>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded border border-gray-200 shadow-sm">
                <div className="space-y-1">
                  <p className="text-xs font-bold">{item.variant.product.title}</p>
                  <p className="text-[10px] text-gray-400 font-mono">SKU: {item.variant.sku} | Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-medium">₹{Number(item.totalPrice).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded border border-gray-200 shadow-sm space-y-3 text-sm">
             <div className="flex justify-between text-gray-600">
               <span>Taxable Value</span>
               <span className="font-mono">₹{Number(order.totalAmount).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-gray-600">
               <span>Estimated GST (18%)</span>
               <span className="font-mono">₹{gstAmount.toLocaleString()}</span>
             </div>
             <div className="flex justify-between border-t border-gray-100 pt-3 mt-1 font-bold text-lg">
               <span>Grand Total</span>
               <span className="font-mono text-wine">₹{netPayable.toLocaleString()}</span>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
