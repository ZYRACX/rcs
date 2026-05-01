"use client";
import { backend_url } from "@/lib/backend_url";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminInventory() {

  const { userId } = useParams();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch player's inventory
  useEffect(() => {
    axios
      .get(`${backend_url}/admin/player/${userId}/inventory`, {
        withCredentials: true,
      })
      .then((response) => {
        setItems(response.data.inventory);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId]);

const filteredItems = items.filter((item) =>
  item.name.toLowerCase().includes(search.toLowerCase())
);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-6">

      {/* Page Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          🎒 Player Inventory
        </h1>

        <p className="text-sm text-neutral-500 mt-1">
          Inspecting inventory for: {userId}
        </p>
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
              key={item.itemId}
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
                Base value: ${item.itemBaseValue}
              </p>

              {/* Admin Buttons */}
              <div className="flex gap-2">

                <button className="flex-1 px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700">
                  Info
                </button>

                <button className="flex-1 px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-500">
                  Give
                </button>

                <button className="flex-1 px-3 py-2 rounded bg-red-600 hover:bg-red-500">
                  Remove
                </button>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}