"use client";

import { useState } from "react";
import { Plus, Edit3, Trash2, Users, Percent, ShoppingBag, CheckCircle, X } from "lucide-react";

interface PriceList {
  id: string;
  name: string;
  discountPercent: number;
  moqPerSku: number;
  moqPerOrder: number;
  _count: { retailers: number };
}

const MOCK_PRICE_LISTS: PriceList[] = [
  { id: "pl1", name: "Platinum Elite", discountPercent: 40, moqPerSku: 5,  moqPerOrder: 50000,  _count: { retailers: 3 } },
  { id: "pl2", name: "Gold Standard",  discountPercent: 30, moqPerSku: 3,  moqPerOrder: 25000,  _count: { retailers: 8 } },
  { id: "pl3", name: "Silver Base",    discountPercent: 20, moqPerSku: 1,  moqPerOrder: 10000,  _count: { retailers: 14 } },
  { id: "pl4", name: "Event Special",  discountPercent: 35, moqPerSku: 10, moqPerOrder: 100000, _count: { retailers: 1 } },
];

function PriceListModal({ list, onClose }: { list?: PriceList; onClose: () => void }) {
  const [form, setForm] = useState({
    name:            list?.name            || "",
    discountPercent: list?.discountPercent || 20,
    moqPerSku:       list?.moqPerSku       || 1,
    moqPerOrder:     list?.moqPerOrder     || 10000,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-charcoal">{list ? "Edit Price List" : "New Price List"}</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-charcoal"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">List Name</label>
            <input
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-wine"
              placeholder="e.g. Gold Standard"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Discount % off MRP</label>
            <div className="relative">
              <input
                type="number" min={0} max={80}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-wine pr-10"
                value={form.discountPercent}
                onChange={e => setForm({ ...form, discountPercent: Number(e.target.value) })}
              />
              <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Min Qty / Item</label>
              <input
                type="number" min={1}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-wine"
                value={form.moqPerSku}
                onChange={e => setForm({ ...form, moqPerSku: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Min Order Value (₹)</label>
              <input
                type="number" min={0}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-wine"
                value={form.moqPerOrder}
                onChange={e => setForm({ ...form, moqPerOrder: Number(e.target.value) })}
              />
            </div>
          </div>
          {/* Preview */}
          <div className="bg-wine/5 border border-wine/10 rounded-xl p-4 space-y-1">
            <p className="text-[10px] uppercase font-bold tracking-widest text-wine">Preview</p>
            <p className="text-sm text-charcoal font-medium">
              A product with MRP <strong>₹3,000</strong> will be priced at{" "}
              <strong className="text-wine">₹{(3000 * (1 - form.discountPercent / 100)).toFixed(0)}</strong> for this list.
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 rounded-xl">Cancel</button>
          <button onClick={onClose} className="px-5 py-2.5 bg-wine text-white text-xs font-bold uppercase tracking-widest hover:bg-charcoal rounded-xl transition-colors">
            {list ? "Save Changes" : "Create List"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PriceListsPage() {
  const [lists, setLists] = useState(MOCK_PRICE_LISTS);
  const [editTarget, setEditTarget] = useState<PriceList | undefined>();
  const [showModal, setShowModal] = useState(false);

  const openNew  = () => { setEditTarget(undefined); setShowModal(true); };
  const openEdit = (pl: PriceList) => { setEditTarget(pl); setShowModal(true); };

  return (
    <div className="space-y-8">
      {showModal && <PriceListModal list={editTarget} onClose={() => setShowModal(false)} />}

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-charcoal">Price Lists</h2>
          <p className="text-gray-500 text-sm mt-1">Define tiered partner pricing, minimum quantities, and order values.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-wine text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-charcoal transition-colors">
          <Plus size={16} /> New Price List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {lists.map(pl => (
          <div key={pl.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:border-wine/20 transition-all space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-charcoal">{pl.name}</h3>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                  <Users size={12} /> {pl._count.retailers} retailer{pl._count.retailers !== 1 ? "s" : ""} assigned
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(pl)} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:border-wine hover:text-wine transition-colors">
                  <Edit3 size={14} />
                </button>
                <button className="p-2 border border-gray-100 rounded-xl text-gray-300 hover:border-red-200 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Big Discount Number */}
            <div className="flex items-end gap-2">
              <span className="text-6xl font-bold text-wine">{pl.discountPercent}</span>
              <span className="text-2xl font-bold text-wine/40 pb-2">%</span>
              <span className="text-sm text-gray-400 pb-3 ml-1">off MRP</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <ShoppingBag size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">Min / Item</p>
                  <p className="text-sm font-bold text-charcoal">{pl.moqPerSku} pcs</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Percent size={14} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-300 tracking-widest">Min Order</p>
                  <p className="text-sm font-bold text-charcoal">₹{pl.moqPerOrder.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
