import React from 'react';

interface InvoiceItem {
  name: string;
  variant: string;
  qty: number;
  price: number;
  tax: number;
  total: number;
  hsn: string;
}

interface InvoiceProps {
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: any;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
}

export const InvoiceDocument: React.FC<InvoiceProps> = ({
  invoiceNumber,
  date,
  customer,
  items,
  subtotal,
  taxTotal,
  shipping,
  total,
  paymentMethod,
  status
}) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto border border-gray-100 shadow-sm font-sans" id="invoice-content">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
        <div>
          <img src="/logo-dark.svg" alt="Atlas Luxury Logo" className="h-12 w-auto mb-2 object-contain" />
          <p className="text-gray-500 text-sm">Luxury ethnic wear crafted for moments that matter.</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-medium text-gray-900 uppercase tracking-widest mb-1">Tax Invoice</h2>
          <p className="text-gray-600 font-medium">#{invoiceNumber}</p>
          <p className="text-gray-400 text-sm">{date}</p>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <h3 className="text-xs font-bold text-[#6D0F1B] uppercase tracking-widest mb-3">Billed To</h3>
          <p className="font-medium text-gray-900">{customer.name}</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {customer.address?.street}<br />
            {customer.address?.city}, {customer.address?.state} {customer.address?.zip}<br />
            {customer.email}<br />
            {customer.phone}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-bold text-[#6D0F1B] uppercase tracking-widest mb-3">Shipping To</h3>
          <p className="font-medium text-gray-900">{customer.name}</p>
          <p className="text-gray-600 text-sm leading-relaxed">
            {customer.address?.street}<br />
            {customer.address?.city}, {customer.address?.state} {customer.address?.zip}
          </p>
        </div>
      </div>

      {/* Product Table */}
      <div className="mb-10">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-900">
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-900">Product</th>
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-900">HSN</th>
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-900 text-center">Qty</th>
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-900 text-right">Unit Price</th>
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-900 text-right">Tax (5%)</th>
              <th className="py-4 text-xs font-bold uppercase tracking-wider text-gray-900 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-5">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{item.variant}</p>
                </td>
                <td className="py-5 text-sm text-gray-500">{item.hsn}</td>
                <td className="py-5 text-center text-gray-900">{item.qty}</td>
                <td className="py-5 text-right text-gray-900">₹{item.price.toLocaleString()}</td>
                <td className="py-5 text-right text-gray-500">₹{item.tax.toLocaleString()}</td>
                <td className="py-5 text-right font-medium text-gray-900">₹{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal</span>
            <span className="text-gray-900 font-medium">₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tax Total</span>
            <span className="text-gray-900 font-medium">₹{taxTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Shipping</span>
            <span className="text-gray-900 font-medium">₹{shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-900">
            <span className="text-sm font-bold uppercase tracking-wider text-gray-900">Total Amount</span>
            <span className="text-lg font-bold text-[#6D0F1B]">₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="mt-16 pt-8 border-t border-gray-100 grid grid-cols-2 gap-8 text-xs">
        <div>
          <h4 className="font-bold text-gray-900 uppercase tracking-widest mb-2">Payment Details</h4>
          <p className="text-gray-500">Method: {paymentMethod}</p>
          <p className="text-gray-500 uppercase">Status: {status}</p>
        </div>
        <div className="text-right">
          <h4 className="font-bold text-gray-900 uppercase tracking-widest mb-2">Legal</h4>
          <p className="text-gray-500">GSTIN: 33ABCDE1234F1Z5</p>
          <p className="text-gray-400 mt-2 italic">This is a computer generated invoice and does not require a signature.</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-[#6D0F1B] font-medium tracking-wide">Thank you for choosing Atlas Luxury</p>
      </div>
    </div>
  );
};
