"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Package,
  Search,
  Coins,
  Box,
  X,
  DollarSign,
  Hammer,
  Info,
  TrendingUp,
  ChevronDown,
  Filter,
  Star,
  Gem,
  Shield,
  FlaskConical,
  Sword,
} from "lucide-react";

import { backend_url } from "@/lib/backend_url";

import Panel from "@/components/game/Panel";

/* ------------------------------------------------ */
/* RARITY SYSTEM */
/* ------------------------------------------------ */

const rarityStyles = {
  Common: {
    border: "border-slate-700",
    text: "text-slate-400",
    glow: "",
  },

  Uncommon: {
    border:
      "border-emerald-500/40",

    text: "text-emerald-400",

    glow:
      "shadow-[0_0_20px_rgba(16,185,129,0.08)]",
  },

  Rare: {
    border:
      "border-blue-500/40",

    text: "text-blue-400",

    glow:
      "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
  },

  Epic: {
    border:
      "border-purple-500/40",

    text: "text-purple-400",

    glow:
      "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },

  Legendary: {
    border:
      "border-amber-500/40",

    text: "text-amber-400",

    glow:
      "shadow-[0_0_25px_rgba(245,158,11,0.18)]",
  },
};

/* ------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------ */

function getRarity(value) {
  if (value >= 10000)
    return "Legendary";

  if (value >= 5000)
    return "Epic";

  if (value >= 1000)
    return "Rare";

  if (value >= 300)
    return "Uncommon";

  return "Common";
}

function getItemIcon(item) {
  const name =
    item.name.toLowerCase();

  if (
    name.includes("sword") ||
    name.includes("pickaxe")
  ) {
    return Sword;
  }

  if (
    name.includes("armor") ||
    name.includes("shield")
  ) {
    return Shield;
  }

  if (
    name.includes("potion") ||
    name.includes("flask")
  ) {
    return FlaskConical;
  }

  if (
    name.includes("gem") ||
    name.includes("crystal")
  ) {
    return Gem;
  }

  if (
    name.includes("artifact") ||
    name.includes("relic")
  ) {
    return Star;
  }

  return Box;
}

/* ------------------------------------------------ */
/* MAIN PAGE */
/* ------------------------------------------------ */

export default function InventoryPage() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedCategory,
    setSelectedCategory] =
    useState("ALL");

  const [sortType,
    setSortType] =
    useState(
      "highest_single_value"
    );

  const [sellModalOpen,
    setSellModalOpen] =
    useState(false);

  const [selectedItem,
    setSelectedItem] =
    useState(null);

  const [sellQuantity,
    setSellQuantity] =
    useState(1);

  const [sellMode,
    setSellMode] =
    useState("per_item");

  const [price, setPrice] =
    useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      setLoading(true);

      const response =
        await axios.get(
          `${backend_url}/game/inventory`,
          {
            withCredentials: true,
          }
        );

      setItems(
        response.data.inventory
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function openSellModal(item) {
    setSelectedItem(item);

    setSellQuantity(1);

    setSellMode("per_item");

    setPrice("");

    setSellModalOpen(true);
  }

  async function handleSell() {
    if (!selectedItem) return;

    try {
      await axios.post(
        `${backend_url}/game/market/list`,
        {
          itemId:
            selectedItem.itemId,

          quantity:
            Number(sellQuantity),

          price:
            Number(price),

          sell_as_all_together:
            sellMode === "whole",
        },

        {
          withCredentials: true,
        }
      );

      alert(
        "Item listed successfully"
      );

      setSellModalOpen(false);

      fetchInventory();
    } catch (error) {
      alert(
        error.response?.data
          ?.error ||
          "Failed to list item"
      );
    }
  }

  /* ------------------------------------------------ */
  /* CATEGORIES */
  /* ------------------------------------------------ */

  const categories = useMemo(() => {
    const allCategories =
      items.map((item) => {
        if (
          item.wayToObtain?.includes(
            "craftable"
          )
        ) {
          return "Craftable";
        }

        return "Resources";
      });

    return [
      "ALL",
      ...new Set(allCategories),
    ];
  }, [items]);

  /* ------------------------------------------------ */
  /* FILTER + SORT */
  /* ------------------------------------------------ */

  const filteredItems =
    useMemo(() => {
      const filtered =
        items.filter((item) => {
          const matchesSearch =
            item.name
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const category =
            item.wayToObtain?.includes(
              "craftable"
            )
              ? "Craftable"
              : "Resources";

          const matchesCategory =
            selectedCategory ===
              "ALL" ||
            category ===
              selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        });

      filtered.sort((a, b) => {
        switch (sortType) {
          case "highest_single_value":
            return (
              b.itemBaseValue -
              a.itemBaseValue
            );

          case "highest_quantity":
            return (
              b.quantity -
              a.quantity
            );

          case "highest_total_value":
            return (
              b.itemBaseValue *
                b.quantity -
              a.itemBaseValue *
                a.quantity
            );

          default:
            return 0;
        }
      });

      return filtered;
    }, [
      items,
      search,
      selectedCategory,
      sortType,
    ]);

  /* ------------------------------------------------ */
  /* TOTALS */
  /* ------------------------------------------------ */

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.items +=
          item.quantity;

        acc.value +=
          item.itemBaseValue *
          item.quantity;

        return acc;
      },

      {
        items: 0,
        value: 0,
      }
    );
  }, [items]);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <Package
              size={26}
              className="text-blue-400"
            />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              INVENTORY
            </h1>

            <p className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-1">
              Resource &
              Equipment Storage
            </p>
          </div>
        </div>

        {/* TOP STATS */}

        <div className="flex flex-wrap gap-4">
          <TopStat
            icon={Box}
            label="Items"
            value={totals.items}
            color="text-blue-400"
          />

          <TopStat
            icon={TrendingUp}
            label="Net Worth"
            value={`$${totals.value.toLocaleString()}`}
            color="text-emerald-400"
          />
        </div>
      </div>

      {/* FILTERS */}

      <Panel title="Inventory Controls">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* SEARCH */}

          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#020617] border border-blue-500/10 focus:border-blue-500/40 outline-none text-sm text-white placeholder:text-slate-600"
            />
          </div>

          {/* CATEGORY */}

          <div className="relative">
            <Filter
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />

            <select
              value={
                selectedCategory
              }
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="appearance-none h-12 min-w-[220px] pl-11 pr-10 rounded-xl bg-[#020617] border border-blue-500/10 focus:border-blue-500/40 outline-none text-sm text-white"
            >
              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-[#020617]"
                  >
                    {category}
                  </option>
                )
              )}
            </select>
          </div>

          {/* SORT */}

          <div className="relative">
            <TrendingUp
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
            />

            <select
              value={sortType}
              onChange={(e) =>
                setSortType(
                  e.target.value
                )
              }
              className="appearance-none h-12 min-w-[240px] pl-11 pr-10 rounded-xl bg-[#020617] border border-blue-500/10 focus:border-blue-500/40 outline-none text-sm text-white"
            >
              <option
                value="highest_single_value"
                className="bg-[#020617]"
              >
                Most Valuable
              </option>

              <option
                value="highest_quantity"
                className="bg-[#020617]"
              >
                Most Quantity
              </option>

              <option
                value="highest_total_value"
                className="bg-[#020617]"
              >
                Most Total Value
              </option>
            </select>
          </div>
        </div>
      </Panel>

      {/* INVENTORY GRID */}

      <Panel title="Stored Resources">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[...Array(6)].map(
              (_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl bg-blue-950/20 border border-blue-500/10 animate-pulse"
                />
              )
            )}
          </div>
        ) : filteredItems.length ===
          0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Package
              size={42}
              className="text-slate-700 mb-5"
            />

            <h3 className="text-lg font-bold text-slate-400 mb-2">
              No Items Found
            </h3>

            <p className="text-sm text-slate-600">
              No inventory items
              matched your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map(
              (item) => (
                <InventoryCard
                  key={item.itemId}
                  item={item}
                  openSellModal={
                    openSellModal
                  }
                />
              )
            )}
          </div>
        )}
      </Panel>

      {/* SELL MODAL */}

      {sellModalOpen &&
        selectedItem && (
          <SellModal
            selectedItem={
              selectedItem
            }
            sellQuantity={
              sellQuantity
            }
            setSellQuantity={
              setSellQuantity
            }
            sellMode={sellMode}
            setSellMode={
              setSellMode
            }
            price={price}
            setPrice={setPrice}
            handleSell={
              handleSell
            }
            close={() =>
              setSellModalOpen(
                false
              )
            }
          />
        )}
    </div>
  );
}

/* ------------------------------------------------ */
/* INVENTORY CARD */
/* ------------------------------------------------ */

function InventoryCard({
  item,
  openSellModal,
}) {
  const rarity = getRarity(
    item.itemBaseValue
  );

  const rarityStyle =
    rarityStyles[rarity];

  const Icon = getItemIcon(item);

  const isCraftable =
    item.wayToObtain?.includes(
      "craftable"
    );

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-blue-950/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-900/20 ${rarityStyle.border} ${rarityStyle.glow}`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl" />

      {/* TOP */}

      <div className="flex items-start justify-between mb-5">
        <div
          className={`p-4 rounded-2xl bg-blue-500/5 border ${rarityStyle.border}`}
        >
          <Icon
            size={24}
            className={
              rarityStyle.text
            }
          />
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${rarityStyle.border} ${rarityStyle.text}`}
          >
            {rarity}
          </div>

          <div className="bg-[#020617] border border-blue-500/10 px-3 py-1 rounded-lg text-[10px] font-black text-blue-400">
            x{item.quantity}
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div>
        <h3 className="text-lg font-black text-white tracking-tight">
          {item.name}
        </h3>

        <div className="flex items-center gap-2 mt-2">

          {isCraftable && (
            <div className="px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[9px] uppercase tracking-widest text-purple-400 font-black">
              Craftable
            </div>
          )}
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="bg-[#020617] border border-blue-500/10 rounded-xl p-3">
          <div className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-1">
            Base Value
          </div>

          <div className="text-sm font-black text-emerald-400">
            $
            {item.itemBaseValue.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#020617] border border-blue-500/10 rounded-xl p-3">
          <div className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-1">
            Total Value
          </div>

          <div className="text-sm font-black text-white">
            $
            {(
              item.itemBaseValue *
              item.quantity
            ).toLocaleString()}
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div
        className={`grid gap-3 mt-6 ${
          isCraftable
            ? "grid-cols-3"
            : "grid-cols-2"
        }`}
      >
        <InventoryButton
          icon={Info}
          label="Info"
        />

        {isCraftable && (
          <InventoryButton
            icon={Hammer}
            label="Craft"
            highlight
          />
        )}

        <InventoryButton
          icon={DollarSign}
          label="Sell"
          danger
          onClick={() =>
            openSellModal(item)
          }
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* BUTTON */
/* ------------------------------------------------ */

function InventoryButton({
  icon: Icon,
  label,
  highlight,
  danger,
  onClick,
}) {
  let styles =
    "bg-blue-950/30 border border-blue-500/10 text-slate-300 hover:bg-blue-900/30";

  if (highlight) {
    styles =
      "bg-purple-600 text-white hover:bg-purple-500";
  }

  if (danger) {
    styles =
      "bg-red-950/20 border border-red-500/20 text-red-400 hover:bg-red-900/30";
  }

  return (
    <button
      onClick={onClick}
      className={`h-12 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-widest transition-all ${styles}`}
    >
      <Icon size={14} />

      {label}
    </button>
  );
}

/* ------------------------------------------------ */
/* TOP STAT */
/* ------------------------------------------------ */

function TopStat({
  icon: Icon,
  label,
  value,
  color,
}) {
  return (
    <div className="bg-blue-950/20 border border-blue-500/10 rounded-xl px-5 py-4 min-w-[150px]">
      <div className="flex items-center gap-2 mb-1">
        <Icon
          size={14}
          className={color}
        />

        <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
          {label}
        </span>
      </div>

      <div className="text-xl font-black text-white">
        {value}
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* SELL MODAL */
/* ------------------------------------------------ */

function SellModal({
  selectedItem,
  sellQuantity,
  setSellQuantity,
  sellMode,
  setSellMode,
  price,
  setPrice,
  handleSell,
  close,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto p-4">
      <div className="max-w-md mx-auto my-10 bg-[#0b1120] border border-blue-500/10 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Sell Item
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              Create a market
              listing.
            </p>
          </div>

          <button
            onClick={close}
            className="text-slate-500 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-blue-950/20 border border-blue-500/10 rounded-xl p-4 mb-5">
          <p className="text-xs uppercase text-slate-500 mb-2">
            Selected Item
          </p>

          <h3 className="text-lg font-bold text-white">
            {selectedItem.name}
          </h3>

          <p className="text-slate-500 text-sm mt-1">
            Available Quantity:

            <span className="text-white ml-1">
              {
                selectedItem.quantity
              }
            </span>
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-slate-400 block mb-2">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              max={
                selectedItem.quantity
              }
              value={sellQuantity}
              onChange={(e) =>
                setSellQuantity(
                  e.target.value
                )
              }
              className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-blue-500/10 focus:border-blue-500/40 outline-none text-white"
            />
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-2">
              Sell Mode
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() =>
                  setSellMode(
                    "per_item"
                  )
                }
                className={`h-12 rounded-xl border transition-all ${
                  sellMode ===
                  "per_item"
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-blue-500/10 bg-[#020617] text-slate-400"
                }`}
              >
                Per Item
              </button>

              <button
                onClick={() =>
                  setSellMode(
                    "whole"
                  )
                }
                className={`h-12 rounded-xl border transition-all ${
                  sellMode ===
                  "whole"
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-blue-500/10 bg-[#020617] text-slate-400"
                }`}
              >
                Whole Stack
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400 block mb-2">
              {sellMode ===
              "per_item"
                ? "Price Per Item"
                : "Total Stack Price"}
            </label>

            <input
              type="number"
              min="1"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-blue-500/10 focus:border-blue-500/40 outline-none text-white"
            />
          </div>

          <button
            onClick={handleSell}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors text-[11px] font-black tracking-[0.2em] uppercase text-white shadow-lg shadow-blue-600/20"
          >
            Create Listing
          </button>
        </div>
      </div>
    </div>
  );
}