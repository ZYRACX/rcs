import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import GameNavbar from "@/components/GameNavbar";
import Overview from "./Overview";
import InventoryPage from "./inventory";
import axios from "axios";

export default function GameHome() {
const [balance, setBalance] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("No user is logged in");
      window.location.href = '/auth/login'; // Redirect to login page
    }
    
    axios.get(`http://localhost:8000/api/game/${userId}/balance`).then(response => {
      // return response.data.balance
      setBalance(response.data.balance);
      localStorage.setItem("balance", balance);
      console.log(response)
    }).catch(error => {
      console.error("Error fetching balance:", error);
      return null;
    });
    
  },[balance])

  return (
    <div >
      <GameNavbar balance={balance}/>
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
