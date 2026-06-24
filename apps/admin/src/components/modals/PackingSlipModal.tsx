import React from 'react';
import { X, Printer } from 'lucide-react';

interface PackingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: any[];
}

const getParsedAddress = (addr: any) =>
  typeof addr === 'string' ? JSON.parse(addr || '{}') : (addr || {});

function SlipContent({ order }: { order: any }) {
  const shippingAddr = order.shippingAddr || getParsedAddress(order.shippingAddress);
  return (
    <div className="bg-white p-10 border border-gray-200">
      <div className="flex justify-between items-start mb-10 border-b pb-10 border-gray-200">
        <div>
          <img src="/logo-dark.svg" alt="Raaghas Logo" className="h-10 mb-4 object-contain" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">From</h3>
          <h1 className="font-bold text-gray-900 text-base">Raaghas Clothing</h1>
          <div className="text-sm text-gray-600">
            <p>123 Fashion Street, Silk District</p>
            <p>Chennai, Tamil Nadu 600001, India</p>
            <p className="mt-2">GSTIN: 33ABCDE1234F1Z5</p>
            <p>support@raaghas.in | www.raaghas.in</p>
          </div>
        </div>
        <div className="text-right">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Ship To</h3>
          <p className="text-base font-bold text-gray-900">{shippingAddr.name || order.customerName}</p>
          <div className="text-sm text-gray-600">
            <div>{shippingAddr.address1 || shippingAddr.line1 || shippingAddr.address || ''}</div>
            {shippingAddr.address2 && <div>{shippingAddr.address2}</div>}
            <div>{shippingAddr.city}, {shippingAddr.province || shippingAddr.state} {shippingAddr.zip || shippingAddr.postalCode}</div>
            <div>{shippingAddr.country || 'India'}</div>
          </div>
          {shippingAddr.phone && <p className="text-sm font-bold text-gray-900 mt-2">{shippingAddr.phone}</p>}
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500 font-bold uppercase">Order: #{order.formattedOrderNumber || order.orderNumber || order.id.slice(-10).toUpperCase()}</p>
        <p className="text-xs text-gray-400">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="text-xs font-bold text-gray-400 mt-4 tracking-widest uppercase">PLEASE RETURN TO SENDER IF UNDELIVERED</p>
      </div>
    </div>
  );
}

export const PackingSlipModal: React.FC<PackingSlipModalProps> = ({ isOpen, onClose, orders }) => {
  if (!isOpen || !orders?.length) return null;

  const isBulk = orders.length > 1;

  const handlePrint = () => {
    const printContent = document.getElementById('packingslip-content');
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) { document.body.removeChild(iframe); return; }

    doc.write(`
      <html>
        <head>
          <title>Packing Slip${isBulk ? 's' : ` - ${orders[0]?.id || ''}`}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .page-break { page-break-after: always; }
            }
            body { font-family: sans-serif; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    doc.close();

    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1000);
      }, 500);
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
              <X size={20} className="text-gray-400" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
              {isBulk ? `Packing Slips (${orders.length})` : 'Packing Slip'}
            </h2>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-lg text-xs font-bold shadow-sm hover:bg-wine transition-all"
          >
            <Printer size={16} /> {isBulk ? `Print ${orders.length} Slips` : 'Print Slip'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div id="packingslip-content" className="space-y-4">
            {orders.map((order, i) => (
              <div key={order.id} className={i < orders.length - 1 ? 'page-break' : ''}>
                <SlipContent order={order} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
