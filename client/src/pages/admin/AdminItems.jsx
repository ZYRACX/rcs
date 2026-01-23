import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminItems = () => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // add or edit
  const [currentItem, setCurrentItem] = useState({
    itemId: null,
    itemName: "",
    itemValue: "",
    isCraftable: false,
  });

  const fetchItems = async (query = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/admin/items?q=${query}`);
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(search);
  };

  const openAddModal = () => {
    setModalMode("add");
    setCurrentItem({ itemId: null, itemName: "", itemValue: "", isCraftable: false });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setCurrentItem({
      itemId: item.itemId,
      itemName: item.itemName,
      itemValue: item.itemValue,
      isCraftable: item.isCraftable === 1 || item.isCraftable === true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/items/${itemId}`);
      alert("Item deleted!");
      fetchItems(search);
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const { itemId, itemName, itemValue, isCraftable } = currentItem;

    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:8000/api/admin/items", { itemName, itemValue, isCraftable });
        alert("Item added!");
      } else {
        await axios.put(`http://localhost:8000/api/admin/items/${itemId}`, { itemName, itemValue, isCraftable });
        alert("Item updated!");
      }
      setIsModalOpen(false);
      fetchItems(search);
    } catch (err) {
      console.error("Operation failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h2 className="text-3xl font-bold mb-6">Admin - Items</h2>

      <div className="flex mb-6 gap-2">
        <form onSubmit={handleSearch} className="flex flex-1">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-l-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700 transition"
        >
          Add Item
        </button>
      </div>

      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded-lg">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="p-3 border-b border-gray-700">ID</th>
                <th className="p-3 border-b border-gray-700">Name</th>
                <th className="p-3 border-b border-gray-700">Value</th>
                <th className="p-3 border-b border-gray-700">Craftable</th>
                <th className="p-3 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.itemId} className="hover:bg-gray-700">
                  <td className="p-3 border-b border-gray-700">{item.itemId}</td>
                  <td className="p-3 border-b border-gray-700">{item.itemName}</td>
                  <td className="p-3 border-b border-gray-700">{item.itemValue}</td>
                  <td className="p-3 border-b border-gray-700">{item.isCraftable ? "Yes" : "No"}</td>
                  <td className="p-3 border-b border-gray-700 flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-yellow-500 text-gray-900 px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.itemId)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">{modalMode === "add" ? "Add Item" : "Edit Item"}</h3>
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Item Name</label>
                <input
                  type="text"
                  value={currentItem.itemName}
                  onChange={(e) => setCurrentItem({ ...currentItem, itemName: e.target.value })}
                  className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Item Value</label>
                <input
                  type="number"
                  value={currentItem.itemValue}
                  onChange={(e) => setCurrentItem({ ...currentItem, itemValue: e.target.value })}
                  className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={currentItem.isCraftable}
                  onChange={(e) => setCurrentItem({ ...currentItem, isCraftable: e.target.checked })}
                  className="accent-blue-500"
                />
                <label>Craftable</label>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  {modalMode === "add" ? "Add" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItems;