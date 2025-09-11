"use client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [balance, setBalance] = useState(0);
  const [sellQuantities, setSellQuantities] = useState({});
  const [search, setSearch] = useState("");

  // Fetch inventory
  const fetchInventory = async () => {
    // const res = await fetch("/api/inventory");
    // const data = await res.json();
    // if (res.ok) {
    //   setItems(data.items);
    //   setBalance(data.balance);
    //   localStorage.setItem("balance", data.balance.toString()); // sync with GameLayout
    // }
    const res = await axios.post("http://localhost:8000/api/game/inventory", {
      userId: localStorage.getItem("userId")
    })
    if(res.status === 200){
      setItems(res.data.items);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Sell handler
  // const handleSell = async (itemId) => {
  //   const quantity = sellQuantities[itemId] || 1;

  //   const res = await fetch("/api/inventory/sell", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ itemId, quantity }),
  //   });

  //   const data = await res.json();
  //   if (res.ok) {
  //     alert(`✅ Sold ${quantity}x for $${data.totalValue}`);
  //     setBalance(data.newBalance);
  //     localStorage.setItem("balance", data.newBalance.toString());
  //     fetchInventory();
  //   } else {
  //     alert(data.error);
  //   }
  // };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🎒 Inventory</h1>

      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 border rounded px-3 py-2"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600">
              {item.quantity}x — Base: ${item.baseValue}
            </p>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min="1"
                max={item.quantity}
                value={sellQuantities[item.id] || 1}
                onChange={(e) =>
                  setSellQuantities((prev) => ({
                    ...prev,
                    [item.id]: Number(e.target.value),
                  }))
                }
                className="w-16 border rounded px-2 py-1 text-sm"
              />
              <button
                // onClick={() => handleSell(item.id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
              >
                Sell
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
