import React, { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';
import { InvoiceDocument } from '../invoices/InvoiceDocument';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');

    if (printWindow && printContent) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice - ${order.formattedOrderNumber || (order.orderNumber ? `RGS-${String(order.orderNumber).padStart(5, '0')}` : order.id)}</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                #invoice-content { border: none; box-shadow: none; width: 100%; max-width: none; }
              }
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-2 hover:bg-white rounded-lg transition-colors shadow-sm">
              <X size={20} className="text-gray-400" />
            </button>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">Order Invoice</h2>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-charcoal rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 transition-all"
            >
              <Printer size={16} />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <InvoiceDocument 
            invoiceNumber={order.formattedOrderNumber || `INV-${new Date(order.createdAt).getFullYear()}-${order.orderNumber ? String(order.orderNumber).padStart(5, '0') : order.id.slice(-4).toUpperCase()}`}
            date={new Date(order.createdAt).toLocaleDateString('en-GB')}
            customer={{
              name: order.customerName,
              email: order.customerEmail,
              phone: order.customerPhone,
              address: order.shippingAddress || {}
            }}
            items={order.items?.map((item: any) => ({
              name: item.variant?.product?.title || 'Product',
              variant: `${item.variant?.option1Name}: ${item.variant?.option1Value}`,
              qty: item.quantity,
              price: Number(item.price) / 1.05, // Backward calculation for base price
              tax: (Number(item.price) / 1.05) * 0.05,
              total: Number(item.price) * item.quantity,
              hsn: item.hsnCode || '6204'
            })) || []}
            subtotal={Number(order.subtotal || order.totalAmount) / 1.05}
            taxTotal={Number(order.taxes || (Number(order.totalAmount) - Number(order.totalAmount)/1.05))}
            shipping={Number(order.shipping || 0)}
            total={Number(order.totalAmount)}
            paymentMethod={order.paymentMethod || 'RAZORPAY'}
            status={order.financialStatus || 'PAID'}
          />
        </div>
      </div>
    </div>
  );
};
