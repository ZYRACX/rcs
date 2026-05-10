"use client";
import React, { useEffect, useState } from "react";
import { backend_url } from "@/lib/backend_url";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package, 
  Info, 
  Hammer, 
  DollarSign, 
  TrendingUp,
  Box
} from "lucide-react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${backend_url}/game/inventory`, { withCredentials: true })
      .then((response) => {
        setItems(response.data.inventory);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <Package className="text-indigo-500" size={32} />
              INVENTORY
            </h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your collected resources and gear.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Inventory Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <QuickStat label="Total Items" value={items.length} icon={<Box size={16}/>} />
            <QuickStat label="Net Worth" value={`$${items.reduce((acc, i) => acc + (i.itemBaseValue * i.quantity), 0)}`} icon={<TrendingUp size={16}/>} />
        </div>

        {/* Main Grid */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-zinc-800/50 animate-pulse rounded-xl" />)}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <Package className="mx-auto text-zinc-800 mb-4" size={48} />
              <p className="text-zinc-500 font-medium">No artifacts detected in your cargo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item) => (
                <ItemCard key={item.itemId} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub-Components ---------- */

function ItemCard({ item }) {
  // Logic for rarity colors (example)
  const isRare = item.itemBaseValue > 500;

  return (
    <div className={`group relative bg-zinc-900 border ${isRare ? 'border-indigo-500/30' : 'border-zinc-800'} rounded-xl p-5 transition-all hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]`}>
      
      {/* Glow Effect for Rare Items */}
      {isRare && <div className="absolute inset-0 bg-indigo-500/5 rounded-xl pointer-events-none" />}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
            {item.name}
          </h2>
          <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-[10px] uppercase tracking-widest mt-1">
            ID: {item.itemId}
          </Badge>
        </div>
        <div className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono font-bold text-indigo-400">
          x{item.quantity}
        </div>
      </div>

      <div className="flex items-center gap-2 text-zinc-500 text-sm mb-6">
        <DollarSign size={14} className="text-emerald-500" />
        <span>Value: <span className="text-zinc-200 font-semibold">${item.itemBaseValue}</span></span>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-3 gap-2">
        <ActionButton icon={<Info size={14}/>} label="Info" />
        <ActionButton icon={<Hammer size={14}/>} label="Craft" highlight />
        <ActionButton icon={<DollarSign size={14}/>} label="Sell" danger />
      </div>
    </div>
  );
}

function ActionButton({ icon, label, highlight, danger }) {
  let styles = "bg-zinc-800 hover:bg-zinc-700 text-zinc-300";
  if (highlight) styles = "bg-indigo-600 hover:bg-indigo-500 text-white";
  if (danger) styles = "bg-red-950/30 border border-red-900/50 text-red-500 hover:bg-red-900/40";

  return (
    <button className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${styles}`}>
      {icon}
      {label}
    </button>
  );
}

function QuickStat({ label, value, icon }) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
            <div className="text-indigo-500">{icon}</div>
            <div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    )
}