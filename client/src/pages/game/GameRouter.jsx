import GameNavbar from "@/components/GameNavbar";
import { Routes, Route } from "react-router-dom";
import Overview from "./Overview";
import InventoryPage from "./inventory";
import { useEffect } from "react";
export default function GameHome() {

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("No user is logged in");
      window.location.href = '/auth/login'; // Redirect to login page
    }
  },[])

  return (
    <div >
      <GameNavbar />
      <Routes>
        {/* Relative paths (no /game prefix) */}
        <Route path="overview" element={<Overview />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="quests" element={<div>Quests Page</div>} />
        <Route path="marketplace" element={<div>Market Place Page</div>} />
      </Routes>
    </div>
  );
}
