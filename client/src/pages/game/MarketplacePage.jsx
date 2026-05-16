"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Search,
  Store,
  Coins,
  Package,
  ShoppingCart,
  Loader2,
  Boxes,
  TrendingUp,
  ChevronDown,
  Filter,
  Star,
  Gem,
  Shield,
  FlaskConical,
  Sword,
  Box,
} from "lucide-react";

import { backend_url }
from "@/lib/backend_url";

import Panel
from "@/components/game/Panel";

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

    text:
      "text-emerald-400",

    glow:
      "shadow-[0_0_20px_rgba(16,185,129,0.08)]",
  },

  Rare: {
    border:
      "border-blue-500/40",

    text:
      "text-blue-400",

    glow:
      "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
  },

  Epic: {
    border:
      "border-purple-500/40",

    text:
      "text-purple-400",

    glow:
      "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
  },

  Legendary: {
    border:
      "border-amber-500/40",

    text:
      "text-amber-400",

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

function getItemIcon(name) {
  const lower =
    name.toLowerCase();

  if (
    lower.includes("sword") ||
    lower.includes("pickaxe")
  ) {
    return Sword;
  }

  if (
    lower.includes("armor") ||
    lower.includes("shield")
  ) {
    return Shield;
  }

  if (
    lower.includes("potion") ||
    lower.includes("flask")
  ) {
    return FlaskConical;
  }

  if (
    lower.includes("gem") ||
    lower.includes("crystal")
  ) {
    return Gem;
  }

  if (
    lower.includes("artifact") ||
    lower.includes("relic")
  ) {
    return Star;
  }

  return Box;
}

/* ------------------------------------------------ */
/* MAIN PAGE */
/* ------------------------------------------------ */

export default function MarketplacePage() {
  const [listings,
    setListings] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [buyingId,
    setBuyingId] =
    useState(null);

  const [sortType,
    setSortType] =
    useState(
      "highest_total_value"
    );

  useEffect(() => {
    fetchListings();
  }, []);

  /**
   * Fetch listings
   */

  async function fetchListings() {
    try {
      setLoading(true);

      const response =
        await axios.get(
          `${backend_url}/game/market/listings`,
          {
            withCredentials: true,
          }
        );
      setListings(
        response.data.listings
      );
    } catch (error) {
      console.error(
        "Marketplace fetch error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /**
   * Buy item
   */

  async function handleBuy(
    listingId
  ) {
    try {
      setBuyingId(listingId);

      const response =
        await axios.post(
          `${backend_url}/game/market/buy/${listingId}`,

          {},

          {
            withCredentials: true,
          }
        );

      alert(
        response.data.message ||
          "Purchase successful"
      );

      fetchListings();
    } catch (error) {
      alert(
        error.response?.data
          ?.error ||
          "Failed to buy item"
      );
    } finally {
      setBuyingId(null);
    }
  }

  /* ------------------------------------------------ */
  /* FILTER + SORT */
  /* ------------------------------------------------ */

  const filteredListings =
    useMemo(() => {
      const filtered =
        listings.filter(
          (listing) =>
            listing.itemId
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );

      filtered.sort((a, b) => {
        const aTotal =
          a.sell_as_all_together
            ? a.price
            : a.price *
              a.quantity;

        const bTotal =
          b.sell_as_all_together
            ? b.price
            : b.price *
              b.quantity;

        switch (sortType) {
          case "highest_price":
            return (
              b.price -
              a.price
            );

          case "highest_quantity":
            return (
              b.quantity -
              a.quantity
            );

          case "highest_total_value":
            return (
              bTotal - aTotal
            );

          default:
            return 0;
        }
      });

      return filtered;
    }, [
      listings,
      search,
      sortType,
    ]);

  /* ------------------------------------------------ */
  /* TOTALS */
  /* ------------------------------------------------ */

  const marketStats =
    useMemo(() => {
      return listings.reduce(
        (acc, item) => {
          const total =
            item.sell_as_all_together
              ? item.price
              : item.price *
                item.quantity;

          acc.volume += total;

          return acc;
        },

        {
          volume: 0,
        }
      );
    }, [listings]);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <Store
              size={26}
              className="text-emerald-400"
            />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              MARKETPLACE
            </h1>

            <p className="text-xs text-slate-500 uppercase tracking-[0.2em] mt-1">
              Global Trading Network
            </p>
          </div>
        </div>

        {/* STATS */}

        <div className="flex flex-wrap gap-4">
          <TopStat
            icon={Boxes}
            label="Listings"
            value={listings.length}
            color="text-blue-400"
          />

          <TopStat
            icon={TrendingUp}
            label="Market Volume"
            value={`$${marketStats.volume.toLocaleString()}`}
            color="text-emerald-400"
          />
        </div>
      </div>

      {/* FILTERS */}

      <Panel title="Marketplace Controls">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* SEARCH */}

          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search listings..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-[#020617] border border-blue-500/10 focus:border-emerald-500/40 outline-none text-sm text-white placeholder:text-slate-600"
            />
          </div>

          {/* SORT */}

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
              value={sortType}
              onChange={(e) =>
                setSortType(
                  e.target.value
                )
              }
              className="appearance-none h-12 min-w-[260px] pl-11 pr-10 rounded-xl bg-[#020617] border border-blue-500/10 focus:border-emerald-500/40 outline-none text-sm text-white"
            >
              <option
                value="highest_total_value"
                className="bg-[#020617]"
              >
                Highest Total Value
              </option>

              <option
                value="highest_price"
                className="bg-[#020617]"
              >
                Highest Item Price
              </option>

              <option
                value="highest_quantity"
                className="bg-[#020617]"
              >
                Highest Quantity
              </option>
            </select>
          </div>
        </div>
      </Panel>

      {/* MARKET GRID */}

      <Panel title="Available Listings">
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
        ) : filteredListings.length ===
          0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <Store
              size={42}
              className="text-slate-700 mb-5"
            />

            <h3 className="text-lg font-bold text-slate-400 mb-2">
              No Listings Found
            </h3>

            <p className="text-sm text-slate-600">
              No marketplace listings
              matched your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredListings.map(
              (listing) => (
                <MarketCard
                  key={listing.$id}
                  listing={listing}
                  loading={
                    buyingId ===
                    listing.$id
                  }
                  onBuy={
                    handleBuy
                  }
                />
              )
            )}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------------------------ */
/* MARKET CARD */
/* ------------------------------------------------ */

function MarketCard({
  listing,
  loading,
  onBuy,
}) {
  const totalPrice =
    listing.sell_as_all_together
      ? listing.price
      : listing.price *
        listing.quantity;

  const rarity =
    getRarity(totalPrice);

  const rarityStyle =
    rarityStyles[rarity];

  const Icon = getItemIcon(
    listing.itemId
  );

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-blue-950/10 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-900/20 ${rarityStyle.border} ${rarityStyle.glow}`}
    >
      {/* GLOW */}

      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl" />

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

          <div className="bg-[#020617] border border-blue-500/10 px-3 py-1 rounded-lg text-[10px] font-black text-emerald-400">
            x{listing.quantity}
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div>
        <h3 className="text-lg font-black text-white tracking-tight">
          {listing.itemId}
        </h3>

        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-2">
          Seller:
          {" "}
          {listing.sellerId.slice(
            0,
            8
          )}
        </div>
      </div>

      {/* STATS */}

      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="bg-[#020617] border border-blue-500/10 rounded-xl p-3">
          <div className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-1">
            Unit Price
          </div>

          <div className="text-sm font-black text-emerald-400">
            $
            {listing.price.toLocaleString()}
          </div>
        </div>

        <div className="bg-[#020617] border border-blue-500/10 rounded-xl p-3">
          <div className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-1">
            Total Cost
          </div>

          <div className="text-sm font-black text-white">
            $
            {totalPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* MODE */}

      <div className="mt-4">
        <div className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] uppercase tracking-widest text-blue-400 font-black">
          {listing.sell_as_all_together
            ? "Whole Stack"
            : "Per Item"}
        </div>
      </div>

      {/* BUY BUTTON */}

      <button
        onClick={() =>
          onBuy(listing.$id)
        }
        disabled={loading}
        className="w-full mt-6 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-[11px] font-black tracking-[0.2em] uppercase text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />

            Processing
          </>
        ) : (
          <>
            <ShoppingCart
              size={16}
            />

            Buy Item
          </>
        )}
      </button>
    </div>
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