import { backend_url } from "@/lib/backend_url";
import axios from "axios";
import React, { useState, useEffect } from "react";

const WAY_OPTIONS = [
  "mineable",
  "craftable",
  "fishery",
  "explorable",
  "harvestable",
];

const AdminItems = () => {

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("add");

  const [currentItem, setCurrentItem] =
    useState({
      $id: null,
      itemName: "",
      itemBaseValue: 1,
      itemAltId: "",
      chanceOfGetting: 0,
      wayToObtain: [],
    });

  useEffect(() => {

    axios
      .get(
        `${backend_url}/admin/items`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {

        setItems(res.data.items);
        setFilteredItems(res.data.items);

      })
      .catch((error) => {
        console.log("Error", error);
      });

  }, []);

  const handleSearch = (e) => {

    e.preventDefault();

    const filtered = items.filter(
      (item) =>
        item.itemName
          .toLowerCase()
          .includes(search.toLowerCase())
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
      chanceOfGetting: 0,
      wayToObtain: [],
    });

    setIsModalOpen(true);

  };

  const openEditModal = (item) => {

    setModalMode("edit");
    setCurrentItem(item);
    setIsModalOpen(true);

  };

  const handleDelete = (
    $id,
    itemName
  ) => {

    if (
      !window.confirm(
        `Delete item: ${itemName}?`
      )
    ) {
      return;
    }

    if (!$id) {
      alert("Invalid item ID");
      return;
    }

    axios
      .delete(
        `${backend_url}/admin/items/delete/${$id}`,
        {
          withCredentials: true,
        }
      )
      .then(() => {

        const updated = items.filter(
          (item) => item.$id !== $id
        );

        setItems(updated);
        setFilteredItems(updated);

      })
      .catch((error) => {

        console.error(
          "Delete error:",
          error
        );

        alert(
          "Error during deleting item!"
        );

      });

  };

  const handleModalSubmit = (e) => {

    e.preventDefault();

    const payload = {
      itemName:
        currentItem.itemName,
      itemAltId:
        currentItem.itemAltId,
      itemBaseValue:
        currentItem.itemBaseValue,
      chanceOfGetting:
        currentItem.chanceOfGetting,
      wayToObtain:
        currentItem.wayToObtain,
    };

    if (modalMode === "add") {

      axios
        .post(
          `${backend_url}/admin/items/item/add`,
          payload,
          {
            withCredentials: true,
          }
        )
        .then((res) => {

          alert(res.data.message);

          const newItem =
            res.data.item;

          const updated = [
            ...items,
            newItem,
          ];

          setItems(updated);
          setFilteredItems(updated);

        })
        .catch((error) => {

          console.log(
            "Add item error:",
            error
          );

        });

    } else {

      axios
        .put(
          `${backend_url}/admin/items/${currentItem.$id}`,
          payload,
          {
            withCredentials: true,
          }
        )
        .then(() => {

          const updated = items.map(
            (item) =>
              item.$id === currentItem.$id
                ? currentItem
                : item
          );

          setItems(updated);
          setFilteredItems(updated);

        })
        .catch((error) => {

          console.log(
            "Update error:",
            error
          );

        });

    }

    setIsModalOpen(false);

  };

  const handleWayChange = (e) => {

    const value = e.target.value;
    const checked = e.target.checked;

    setCurrentItem((prev) => {

      if (checked) {

        return {
          ...prev,
          wayToObtain: [
            ...prev.wayToObtain,
            value,
          ],
        };

      }

      return {
        ...prev,
        wayToObtain:
          prev.wayToObtain.filter(
            (v) => v !== value
          ),
      };

    });

  };

  return (

    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>

          <h2 className="text-3xl font-bold">
            Admin Items
          </h2>

          <p className="text-gray-400 mt-1">
            Create, edit, and manage game items.
          </p>

        </div>

        <button
          onClick={openAddModal}
          className="
            bg-green-600
            px-4
            py-2
            rounded-lg
            hover:bg-green-500
            transition
            font-medium
          "
        >
          Add Item
        </button>

      </div>

      {/* SEARCH */}

      <form
        onSubmit={handleSearch}
        className="flex mb-6 gap-2"
      >

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            flex-1
            p-3
            bg-gray-800
            border
            border-gray-700
            rounded-lg
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <button
          type="submit"
          className="
            bg-blue-600
            px-5
            rounded-lg
            hover:bg-blue-500
            transition
          "
        >
          Search
        </button>

      </form>

      {/* TABLE */}

      <div className="overflow-x-auto rounded-xl border border-gray-800">

        <table className="w-full border-collapse">

          <thead className="bg-gray-800">

            <tr className="text-left">

              <th className="p-4">
                Name
              </th>

              <th className="p-4">
                Alt ID
              </th>

              <th className="p-4">
                Base Value
              </th>

              <th className="p-4">
                Chance
              </th>

              <th className="p-4">
                Obtain Methods
              </th>

              <th className="p-4">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredItems.map((item) => (

              <tr
                key={item.$id}
                className="
                  border-t
                  border-gray-800
                  hover:bg-gray-800/60
                  transition
                "
              >

                <td className="p-4 font-medium">
                  {item.itemName}
                </td>

                <td className="p-4 text-gray-400">
                  {item.itemAltId}
                </td>

                <td className="p-4">
                  {item.itemBaseValue}
                </td>

                <td className="p-4">
                  {item.chanceOfGetting}
                </td>

                <td className="p-4">

                  <div className="flex flex-wrap gap-2">

                    {item.wayToObtain.map(
                      (way) => (

                        <span
                          key={way}
                          className="
                            px-2
                            py-1
                            rounded-md
                            text-xs
                            bg-gray-700
                            text-gray-300
                            capitalize
                          "
                        >
                          {way}
                        </span>

                      )
                    )}

                  </div>

                </td>

                <td className="p-4">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        openEditModal(item)
                      }
                      className="
                        bg-yellow-500
                        text-black
                        px-3
                        py-1
                        rounded-lg
                        hover:bg-yellow-400
                        transition
                      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          item.$id,
                          item.itemName
                        )
                      }
                      className="
                        bg-red-600
                        px-3
                        py-1
                        rounded-lg
                        hover:bg-red-500
                        transition
                      "
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {isModalOpen && (

        <div
  className="
    fixed
    inset-0
    z-50
    overflow-y-auto
    bg-black/70
    backdrop-blur-sm
    p-4
  "
>

          <div
  className="
    bg-gray-800
    border
    border-gray-700
    p-5
    md:p-6
    rounded-xl
    w-full
    max-w-md
    shadow-2xl
    my-6
    mx-auto
    max-h-[90vh]
    overflow-y-auto
  "
>

            <h3 className="text-2xl font-bold mb-1">

              {modalMode === "add"
                ? "Create Item"
                : "Edit Item"}

            </h3>

            <p className="text-sm text-gray-400 mb-6">
              Configure item properties and obtain methods.
            </p>

            <form
              onSubmit={handleModalSubmit}
              className="space-y-5"
            >

              {/* ITEM NAME */}

              <div className="space-y-2">

                <label className="text-sm font-medium text-gray-300">
                  Item Name
                </label>

                <input
                  type="text"
                  placeholder="Iron Ore"
                  value={currentItem.itemName}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      itemName:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    p-3
                    bg-gray-700
                    border
                    border-gray-600
                    rounded-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-green-500
                  "
                  required
                />

                <p className="text-xs text-gray-400">
                  Display name shown to players.
                </p>

              </div>

              {/* ALT ID */}

              <div className="space-y-2">

                <label className="text-sm font-medium text-gray-300">
                  Item Alt ID
                </label>

                <input
                  type="text"
                  placeholder="iron_ore"
                  value={currentItem.itemAltId}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      itemAltId:
                        e.target.value,
                    })
                  }
                  className="
                    w-full
                    p-3
                    bg-gray-700
                    border
                    border-gray-600
                    rounded-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-green-500
                  "
                  required
                />

                <p className="text-xs text-gray-400">
                  Unique internal identifier.
                </p>

              </div>

              {/* BASE VALUE */}

              <div className="space-y-2">

                <label className="text-sm font-medium text-gray-300">
                  Base Value
                </label>

                <input
                  type="number"
                  placeholder="100"
                  value={currentItem.itemBaseValue}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      itemBaseValue:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                  className="
                    w-full
                    p-3
                    bg-gray-700
                    border
                    border-gray-600
                    rounded-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-green-500
                  "
                />

                <p className="text-xs text-gray-400">
                  Default market value of the item.
                </p>

              </div>

              {/* CHANCE */}

              <div className="space-y-2">

                <label className="text-sm font-medium text-gray-300">
                  Chance Of Getting
                </label>

                <input
                  type="number"
                  step="0.01"
                  placeholder="0.25"
                  value={currentItem.chanceOfGetting}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      chanceOfGetting:
                        Number(
                          e.target.value
                        ),
                    })
                  }
                  className="
                    w-full
                    p-3
                    bg-gray-700
                    border
                    border-gray-600
                    rounded-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-green-500
                  "
                  required
                />

                <p className="text-xs text-gray-400">
                  Higher values increase drop probability.
                </p>

              </div>

              {/* WAYS TO OBTAIN */}

              <div className="space-y-3">

                <div>

                  <label className="text-sm font-medium text-gray-300">
                    Ways To Obtain
                  </label>

                  <p className="text-xs text-gray-400 mt-1">
                    Select all gameplay systems that can generate this item.
                  </p>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {WAY_OPTIONS.map(
                    (option) => (

                      <label
                        key={option}
                        className="
                          flex
                          items-center
                          gap-3
                          p-3
                          rounded-lg
                          border
                          border-gray-700
                          bg-gray-750
                          hover:bg-gray-700
                          cursor-pointer
                          transition
                        "
                      >

                        <input
                          type="checkbox"
                          value={option}
                          checked={currentItem.wayToObtain.includes(
                            option
                          )}
                          onChange={
                            handleWayChange
                          }
                          className="accent-green-500"
                        />

                        <span className="capitalize text-sm">
                          {option}
                        </span>

                      </label>

                    )
                  )}

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() =>
                    setIsModalOpen(false)
                  }
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-gray-600
                    hover:bg-gray-500
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    px-4
                    py-2
                    rounded-lg
                    bg-green-600
                    hover:bg-green-500
                    transition
                    font-medium
                  "
                >

                  {modalMode === "add"
                    ? "Create Item"
                    : "Update Item"}

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