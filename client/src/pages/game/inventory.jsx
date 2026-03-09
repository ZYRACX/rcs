"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [sellQuantities, setSellQuantities] = useState({});
  const [search, setSearch] = useState("");

  // Fetch inventory
  const fetchInventory = async () => {
    const res = await axios.get("http://localhost:8000/game/inventory", {withCredentials: true});
    console.log(res.data)
    if (res.status === 200) {
      // setItems(res.data.items);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:8000/game/inventory", {withCredentials: true}).then((response) => {
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">
      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🎒 Inventory
        </h1>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 rounded-md bg-neutral-900 border border-neutral-700 px-4 py-3 outline-none focus:border-neutral-500"
      />

      {/* Inventory Panel */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl min-h-[400px] p-6">
        {filteredItems.length === 0 && (
          <p className="text-neutral-500 text-center mt-20">
            No items found
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4"
            >
              {/* Item Header */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">{item.name}</h2>
                <span className="text-sm text-neutral-400">
                  x{item.quantity}
                </span>
              </div>

              {/* Meta */}
              <p className="text-sm text-neutral-500 mb-4">
                Base value: ${item.baseValue}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700">
                  Info
                </button>

                <button className="flex-1 px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500">
                  Craft
                </button>

                <button className="flex-1 px-3 py-2 rounded bg-red-600 hover:bg-red-500">
                  Sell
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
