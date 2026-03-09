import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import GameNavbar from "@/components/GameNavbar";
import Overview from "./Overview";
import InventoryPage from "./inventory";
import axios from "axios";
import { account } from "@/appwrite";

export default function GameHome() {
  const navigate = useNavigate();
const [balance, setBalance] = useState(0);
  useEffect(() => {
    account.get().then((user) => {
      // console.log(user)
      if(!user) navigate('/auth/login');
    }).catch((error) => {
      console.log(error)
      navigate('/auth/login');
    })
    
  },[navigate])

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
