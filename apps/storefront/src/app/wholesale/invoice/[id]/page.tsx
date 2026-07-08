"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, Printer, ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";

export default function InvoicePage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // In actual implementation, we would use the session token
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005'}/api/v1/wholesale/orders/${id}/invoice`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch invoice");
        return res.json();
      })
      .then(data => setInvoice(data))
      .catch(err => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-charcoal">
        <div className="text-center space-y-4">
          <p className="font-bold text-red-600">Error loading invoice</p>
          <Link href="/wholesale/orders" className="text-sm underline hover:text-wine">Return to Orders</Link>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return <div className="min-h-screen flex items-center justify-center">Loading PDF Data...</div>;
  }

  const { seller, buyer, items, summary, bankDetails, invoiceNumber, date } = invoice;

  const handleDownload = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6005'}/api/v1/wholesale/orders/${id}/download`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Atlas_Proforma_${String(id).toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-charcoal py-12 px-4 print:py-0 print:px-0">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Controls - Hidden when printing */}
        <div className="flex justify-between items-center print:hidden">
          <Link href="/wholesale/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-wine transition-all">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
          <div className="flex gap-4">
            <button onClick={() => window.print()} className="bg-charcoal text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-wine transition-all shadow-md">
              <Printer size={16} /> Print
            </button>
            <button onClick={handleDownload} className="bg-wine text-white px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-charcoal transition-all shadow-md">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>

        {/* Invoice Document */}
        <div className="bg-white p-12 md:p-16 border border-gray-200 shadow-sm print:shadow-none print:border-none print:p-0">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b border-charcoal/10 pb-8 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-serif tracking-widest text-wine uppercase">{seller.name}</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Proforma Tax Invoice</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <p><span className="text-gray-400">Invoice:</span> <strong className="ml-2 font-mono">{invoiceNumber}</strong></p>
              <p><span className="text-gray-400">Date:</span> <strong className="ml-2">{new Date(date).toLocaleDateString('en-GB')}</strong></p>
            </div>
          </div>

          {/* Business Details */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billed By (Seller)</h3>
              <div className="text-sm space-y-1.5">
                <p className="font-bold text-base">{seller.name}</p>
                <p className="text-gray-600">{seller.state}</p>
                <p className="text-gray-600">GSTIN: <span className="font-mono">{seller.gst}</span></p>
                <p className="text-gray-600">Email: {seller.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billed To (Buyer)</h3>
              <div className="text-sm space-y-1.5">
                <p className="font-bold text-base flex items-center gap-2">
                  <Building2 size={16} className="text-wine" /> {buyer.name}
                </p>
                <p className="text-gray-600">{buyer.address}</p>
                <p className="text-gray-600">GSTIN: <span className="font-mono">{buyer.gst}</span></p>
                <p className="text-gray-600">Contact: {buyer.contact} ({buyer.phone})</p>
              </div>
            </div>
          </div>

          {/* Items Grid */}
          <div className="mb-12 border border-charcoal/10 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-charcoal/5 border-b border-charcoal/10">
                <tr>
                  <th className="py-3 px-4 text-left font-bold text-xs uppercase tracking-widest text-gray-500">Item Description</th>
                  <th className="py-3 px-4 text-left font-bold text-xs uppercase tracking-widest text-gray-500">HSN</th>
                  <th className="py-3 px-4 text-center font-bold text-xs uppercase tracking-widest text-gray-500">Qty</th>
                  <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-widest text-gray-500">Rate</th>
                  <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-widest text-gray-500">Tax%</th>
                  <th className="py-3 px-4 text-right font-bold text-xs uppercase tracking-widest text-gray-500">Taxable Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {items.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="py-4 px-4 font-medium">{item.description}</td>
                    <td className="py-4 px-4 text-gray-400 font-mono text-xs">{item.hsn}</td>
                    <td className="py-4 px-4 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-4 px-4 text-right font-mono">₹{item.unitPrice.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    <td className="py-4 px-4 text-right font-mono text-gray-500">{item.taxPercent}%</td>
                    <td className="py-4 px-4 text-right font-mono font-medium">₹{item.taxableValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Payment */}
          <div className="grid grid-cols-2 gap-12">
            {/* Bank Details */}
            <div className="space-y-4 pt-4 border-t border-charcoal/10">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment Wire Details</h3>
              <div className="bg-wine/5 p-4 rounded-lg border border-wine/10 space-y-2 text-sm font-mono">
                <p><span className="text-wine font-sans font-bold">Bank:</span> {bankDetails.bankName}</p>
                <p><span className="text-wine font-sans font-bold">A/C Name:</span> {bankDetails.accountName}</p>
                <p><span className="text-wine font-sans font-bold">A/C No:</span> {bankDetails.accountNumber}</p>
                <p><span className="text-wine font-sans font-bold">IFSC:</span> {bankDetails.ifscCode}</p>
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 text-gray-600">
                <span>Taxable Subtotal</span>
                <span className="font-mono">₹{summary.subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              
              {summary.taxes.map((tax: any, i: number) => (
                <div key={i} className="flex justify-between py-1 text-gray-600">
                  <span>{tax.name}</span>
                  <span className="font-mono">₹{tax.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              ))}

              <div className="flex justify-between py-4 mt-2 border-t border-charcoal/10 text-lg font-bold">
                <span>Grand Total</span>
                <span className="font-mono text-wine">₹{summary.grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
              <p className="text-[10px] text-gray-400 text-right uppercase tracking-widest">All prices in Indian Rupees (INR)</p>
            </div>
          </div>

          {/* Print Footer */}
          <div className="hidden print:block mt-20 pt-8 border-t border-charcoal/10 text-center text-[10px] text-gray-400 uppercase tracking-widest">
            <p>This is a computer generated proforma invoice and does not require a physical signature.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
