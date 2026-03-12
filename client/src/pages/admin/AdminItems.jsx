import axios from "axios";
import React, { useState, useEffect } from "react";

const AdminItems = () => {

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const [currentItem, setCurrentItem] = useState({
    $id: null,
    itemName: "",
    itemBaseValue: 1,
    itemAltId: "",
    chanceOfGetting: 0,
    wayToObtain: []
  });

  useEffect(() => {
    axios.get("http://localhost:8000/admin/items", { withCredentials: true }).then((res) => {
      setItems(res.data.items);
      setFilteredItems(res.data.items);
    }).catch((error) => {
      console.log("Error", error)
    })
    // setItems(sampleItems);
    // setFilteredItems(sampleItems);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();

    const filtered = items.filter(item =>
      item.itemName.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredItems(filtered);
  };

  const openAddModal = () => {
    setModalMode("add");

    setCurrentItem({
      $id: null,
      itemName: "",
      itemBaseValue: 1,
      itemAltId: "",
      ChanceOfGetting: 0,
      wayToObtain: []
    });

    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = ($id) => {
    if (!window.confirm("Delete this item?")) return;

    const updated = items.filter(item => item.$id !== $id);

    setItems(updated);
    setFilteredItems(updated);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "add") {

      const newItem = {
        ...currentItem,
        $id: Date.now().toString()
      };

      const updated = [...items, newItem];

      setItems(updated);
      setFilteredItems(updated);

    } else {

      axios.put(`http://localhost:8000/admin/items/${currentItem.$id}`, {
        itemName: currentItem.itemName,
        itemAltId: currentItem.itemAltId,
        itemBaseValue: currentItem.itemBaseValue,
        ChanceOfGetting: currentItem.ChanceOfGetting,
        wayToObtain: currentItem.wayToObtain
      }, { withCredentials: true }).then(() => {
        const updated = items.map(item =>
          item.$id === currentItem.$id ? currentItem : item
        )
        setItems(updated);
        setFilteredItems(updated);
      }).catch((error) => {
        console.log("Update error:", error);
      })



    }

    setIsModalOpen(false);
  };

  const handleWayChange = (e) => {

    const values = [...e.target.selectedOptions].map(o => o.value);

    setCurrentItem({
      ...currentItem,
      wayToObtain: values
    });

  };

  useEffect(() => {
    axios.get("/api/items")
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">

      <h2 className="text-3xl font-bold mb-6">Admin Items</h2>

      {/* SEARCH */}

      <div className="flex mb-6 gap-2">

        <form onSubmit={handleSearch} className="flex flex-1">

          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-l-md"
          />

          <button
            type="submit"
            className="bg-blue-600 px-4 rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>

        </form>

        <button
          onClick={openAddModal}
          className="bg-green-600 px-4 rounded hover:bg-green-700"
        >
          Add Item
        </button>

      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">

        <table className="w-full border-collapse rounded-lg">

          <thead className="bg-gray-800">

            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Alt ID</th>
              <th className="p-3">Base Value</th>
              <th className="p-3">Chance</th>
              <th className="p-3">Way To Obtain</th>
              <th className="p-3">Actions</th>
            </tr>

          </thead>

          <tbody>

            {filteredItems.map(item => (

              <tr key={item.$id} className="hover:bg-gray-700">

                <td className="p-3">{item.$id}</td>

                <td className="p-3">{item.itemName}</td>

                <td className="p-3">{item.itemAltId}</td>

                <td className="p-3">{item.itemBaseValue}</td>

                <td className="p-3">{item.chanceOfGetting}</td>

                <td className="p-3">
                  {item.wayToObtain.join(", ")}
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-yellow-500 text-black px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.$id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {isModalOpen && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">

          <div className="bg-gray-800 p-6 rounded-lg w-96">

            <h3 className="text-xl mb-4 font-bold">
              {modalMode === "add" ? "Add Item" : "Edit Item"}
            </h3>

            <form onSubmit={handleModalSubmit} className="space-y-3">

              <input
                type="text"
                placeholder="Item Name"
                value={currentItem.itemName}
                onChange={(e) => setCurrentItem({ ...currentItem, itemName: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />

              <input
                type="text"
                placeholder="Item Alt ID"
                value={currentItem.itemAltId}
                onChange={(e) => setCurrentItem({ ...currentItem, itemAltId: e.target.value })}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />

              <input
                type="number"
                placeholder="Base Value"
                value={currentItem.itemBaseValue}
                onChange={(e) => setCurrentItem({ ...currentItem, itemBaseValue: Number(e.target.value) })}
                className="w-full p-2 bg-gray-700 rounded"
              />

              <input
                type="number"
                step="0.01"
                placeholder="Chance Of Getting"
                value={currentItem.ChanceOfGetting}
                onChange={(e) => setCurrentItem({ ...currentItem, ChanceOfGetting: Number(e.target.value) })}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />

              <select
                multiple
                value={currentItem.wayToObtain}
                onChange={handleWayChange}
                className="w-full p-2 bg-gray-700 rounded"
              >

                <option value="Mining">Mining</option>
                <option value="Crafting">Crafting</option>
                <option value="Loot">Loot</option>
                <option value="Trading">Trading</option>

              </select>

              <div className="flex justify-end gap-2">

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 px-4 py-2 rounded"
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