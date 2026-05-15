"use client";

import React, { useEffect, useState } from "react";
import { backend_url } from "@/lib/backend_url";
import axios from "axios";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Search,
  Store,
  Coins,
  Package,
  ShoppingCart,
  Loader2
} from "lucide-react";

export default function MarketPage() {

  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {

    fetchListings();

  }, []);

  async function fetchListings() {

    try {

      setLoading(true);

      const response = await axios.get(
        `${backend_url}/market/listings`,
        {
          withCredentials: true
        }
      );

      setListings(response.data.listings);

    } catch (error) {

      console.error(
        "Market fetch error:",
        error
      );

    } finally {

      setLoading(false);

    }

  }

  async function handleBuy(listingId) {

    try {

      setBuyingId(listingId);

      const response = await axios.post(
        `${backend_url}/market/buy/${listingId}`,
        {},
        {
          withCredentials: true
        }
      );

      alert(
        response.data.message ||
        "Item purchased"
      );

      fetchListings();

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Purchase failed"
      );

    } finally {

      setBuyingId(null);

    }

  }

  const filteredListings = listings.filter(
    (listing) =>
      listing.itemName
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  return (

    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">

          <div>

            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">

              <Store
                className="text-emerald-500"
                size={32}
              />

              MARKETPLACE

            </h1>

            <p className="text-zinc-500 text-sm mt-1">

              Buy items listed by other players.

            </p>

          </div>

          <div className="relative w-full md:w-80">

            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-zinc-500
              "
              size={18}
            />

            <Input
              placeholder="Search listings..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                pl-10
                bg-zinc-900
                border-zinc-800
                focus:ring-emerald-500
              "
            />

          </div>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <QuickStat
            label="Listings"
            value={listings.length}
            icon={<Package size={16} />}
          />

          <QuickStat
            label="Market Value"
            value={`$${listings.reduce(
              (acc, item) =>
                acc + item.totalPrice,
              0
            )}`}
            icon={<Coins size={16} />}
          />

        </div>

        {/* Main Grid */}

        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 backdrop-blur-sm">

          {loading ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {[...Array(6)].map((_, i) => (

                <div
                  key={i}
                  className="
                    h-48
                    bg-zinc-800/50
                    animate-pulse
                    rounded-xl
                  "
                />

              ))}

            </div>

          ) : filteredListings.length === 0 ? (

            <div className="text-center py-20">

              <Store
                className="
                  mx-auto
                  text-zinc-800
                  mb-4
                "
                size={48}
              />

              <p className="text-zinc-500 font-medium">

                No listings available.

              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {filteredListings.map((listing) => (

                <MarketCard
                  key={listing.$id}
                  listing={listing}
                  onBuy={handleBuy}
                  loading={
                    buyingId === listing.$id
                  }
                />

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

/* ---------- Sub Components ---------- */

function MarketCard({
  listing,
  onBuy,
  loading
}) {

  const isExpensive =
    listing.totalPrice > 1000;

  return (

    <div className={`group relative bg-zinc-900 border ${isExpensive ? 'border-emerald-500/30' : 'border-zinc-800'} rounded-xl p-5 transition-all hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]`}>

      {/* Glow Effect */}

      {isExpensive && (

        <div className="absolute inset-0 bg-emerald-500/5 rounded-xl pointer-events-none" />

      )}

      <div className="flex justify-between items-start mb-4">

        <div>

          <h2 className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">

            {listing.itemName}

          </h2>

          <Badge
            variant="secondary"
            className="bg-zinc-800 text-zinc-400 text-[10px] uppercase tracking-widest mt-1"
          >

            ID: {listing.itemId}

          </Badge>

        </div>

        <div className="bg-zinc-800 px-2 py-1 rounded text-xs font-mono font-bold text-emerald-400">

          x{listing.quantity}

        </div>

      </div>

      <div className="space-y-3 mb-6">

        <div className="flex items-center gap-2 text-zinc-500 text-sm">

          <Coins
            size={14}
            className="text-yellow-500"
          />

          <span>

            Price Per Unit:

            <span className="text-zinc-200 font-semibold ml-1">

              ${listing.pricePerUnit}

            </span>

          </span>

        </div>

        <div className="flex items-center gap-2 text-zinc-500 text-sm">

          <Package
            size={14}
            className="text-blue-500"
          />

          <span>

            Total Price:

            <span className="text-zinc-200 font-semibold ml-1">

              ${listing.totalPrice}

            </span>

          </span>

        </div>

      </div>

      <Button
        onClick={() =>
          onBuy(listing.$id)
        }
        disabled={loading}
        className="
          w-full
          bg-emerald-600
          hover:bg-emerald-500
          text-white
          font-semibold
          gap-2
        "
      >

        {loading ? (

          <Loader2
            size={16}
            className="animate-spin"
          />

        ) : (

          <>

            <ShoppingCart size={16} />

            Buy Item

          </>

        )}

      </Button>

    </div>

  );

}

function QuickStat({
  label,
  value,
  icon
}) {

  return (

    <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">

      <div className="text-emerald-500">

        {icon}

      </div>

      <div>

        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">

          {label}

        </p>

        <p className="text-lg font-bold">

          {value}

        </p>

      </div>

    </div>

  );

}