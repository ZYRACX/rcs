import {
  DollarSign,
  Hammer,
  Info,
} from "lucide-react";

export default function InventoryItemCard({
  item,
  openSellModal,
}) {
  return (
    <div className="bg-[#0f172a]/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-all">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold">
            {item.name}
          </h2>

          <p className="text-xs text-slate-500 uppercase mt-1">
            ID: {item.itemId}
          </p>
        </div>

        <div className="text-emerald-400 font-bold">
          x{item.quantity}
        </div>
      </div>

      <div className="mb-5 text-sm text-slate-400">
        <DollarSign
          size={14}
          className="inline mr-1"
        />

        ${item.itemBaseValue}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button className="bg-slate-900 border border-slate-800 rounded-lg py-2 text-xs uppercase font-bold">
          <Info size={14} className="mx-auto mb-1" />
          Info
        </button>

        <button className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg py-2 text-xs uppercase font-bold text-emerald-400">
          <Hammer size={14} className="mx-auto mb-1" />
          Craft
        </button>

        <button
          onClick={() =>
            openSellModal(item)
          }
          className="bg-red-500/10 border border-red-500/30 rounded-lg py-2 text-xs uppercase font-bold text-red-400"
        >
          <DollarSign
            size={14}
            className="mx-auto mb-1"
          />
          Sell
        </button>
      </div>
    </div>
  );
}