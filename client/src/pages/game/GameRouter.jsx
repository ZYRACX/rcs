import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import {
  Building2,
  HardHat,
  Map,
  Warehouse,
  Landmark,
  Hammer,
  ClipboardList,
  BarChart3,
  Users,
  LogOut,
} from "lucide-react";

import { account } from "@/appwrite";

import Overview from "./Overview";
import InventoryPage from "./InventoryPage";
import MarketplacePage from "./MarketplacePage";

/**
 * Sidebar navigation items.
 *
 * @typedef {Object} MenuItem
 * @property {string} id - Display name for the sidebar item.
 * @property {React.ElementType} icon - Lucide React icon component.
 * @property {string} path - Route path for navigation.
 */

/** @type {MenuItem[]} */
const menuItems = [
  {
    id: "DASHBOARD",
    icon: Building2,
    path: "/game/overview",
  },
  {
    id: "Coming Soon", //ZONING
    icon: Map,
    path: "",
  },
  {
    id: "Coming Soon", //CONSTRUCTION
    icon: HardHat,
    path: "/game/construction",
  },
  {
    id: "RESOURCES",
    icon: Warehouse,
    path: "/game/inventory",
  },
  {
    id: "MARKETPLACE",
    icon: BarChart3,
    path: "/game/marketplace",
  },
  {
    id: "Coming Soon", //PUBLIC WORKS
    icon: Hammer,
    path: "/game/public-works",
  },
  {
    id: "Coming Soon", //CITIZEN REQUESTS
    icon: ClipboardList,
    path: "/game/citizen-requests",
  },
  {
    id: "CITY HALL",
    icon: Landmark,
    path: "/game/city-hall",
  },
  {
    id: "coming Soon", //POPULATION
    icon: Users,
    path: "/game/population",
  },
];

/**
 * Main game home layout component.
 *
 * Handles:
 * - Sidebar navigation
 * - Route rendering
 * - Authentication check
 * - Layout structure
 *
 * @returns {JSX.Element}
 */
export default function GameHome() {
  const navigate = useNavigate();
  const location = useLocation();

  const [balance, setBalance] = useState(0);

  /**
   * Checks whether the user is authenticated.
   * Redirects to login page if not authenticated.
   */
  useEffect(() => {
    account
      .get()
      .then((user) => {
        if (!user) {
          navigate("/auth/login");
        }
      })
      .catch(() => {
        navigate("/auth/login");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-blue-900/20 bg-[#0b1120] flex flex-col shrink-0">
        {/* LOGO */}
        <div className="p-8 flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Building2 size={24} className="text-white" />
            </div>
          </div>

          <div>
            <h1 className="font-black text-xl text-white tracking-tighter italic">
              METRO
            </h1>

            <div className="text-[9px] font-bold tracking-[0.3em] text-blue-400 -mt-1 uppercase">
              Management
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            /**
             * Determines whether the current route is active.
             */
            const isActive = location.pathname.includes(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600/10 text-blue-400 shadow-[inset_4px_0_0_0_#2563eb]"
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]"
                }`}
              >
                <item.icon
                  size={18}
                  className={
                    isActive
                      ? "text-blue-400"
                      : "group-hover:text-slate-200"
                  }
                />

                <span className="text-[11px] font-bold tracking-widest">
                  {item.id}
                </span>
              </button>
            );
          })}
        </nav>

        {/* MAYOR CARD */}
        <div className="p-4 border-t border-blue-900/20">
          <div className="bg-blue-950/20 border border-blue-500/10 p-4 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 -mr-8 -mt-8 rounded-full blur-xl group-hover:bg-blue-500/10" />

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-blue-500/20 flex items-center justify-center relative">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mayor"
                  alt="Avatar"
                  className="w-8 h-8 rounded opacity-80"
                />

                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-[#0b1120] rounded-full" />
              </div>

              <div>
                <div className="text-xs font-bold text-white tracking-wide">
                  MAYOR_82
                </div>

                <div className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter italic">
                  Approval: 84%
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-bold text-slate-500">
                <span>CITY RANK: A+</span>
                <span>GROWTH: 12.4%</span>
              </div>

              <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-[84%]" />
              </div>
            </div>
          </div>

          <button className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-[10px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em]">
            <LogOut size={14} />
            Exit Simulation
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER CAN BE ADDED HERE */}

        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="overview" element={<Overview />} />

            <Route
              path="inventory"
              element={<InventoryPage />}
            />

            <Route
              path="marketplace"
              element={<MarketplacePage />}
            />

            {/* FUTURE ROUTES */}
            {/* <Route path="zoning" element={<ZoningPage />} /> */}
            {/* <Route path="economy" element={<EconomyPage />} /> */}
          </Routes>
        </div>
      </main>
    </div>
  );
}