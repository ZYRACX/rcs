import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdminOverviewPage from "./AdminOverviewPage";
import AdminItems from "./AdminItems";
import AdminNavbar from "@/components/AdminNavbar"
import AdminPlayers from "./AdminPlayers"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminInventoryInpector from "./AdminInventoryInpector"


export default function AdminPage() {
  const navigate = useNavigate()
  useEffect(() => {
    axios.get("http://localhost:8000/admin/", { withCredentials: true }).then((res) => {
      if(res.status === 401) navigate("/")
    }).catch((error) =>{
      console.log("Admin page error:", error);
      if(error) navigate("/")
    })
  },[navigate])

  return (
    <div >
        <AdminNavbar />
      <Routes>
        {/* Relative paths (no /admin prefix) */}
        <Route path="users" element={<AdminOverviewPage />} />
        <Route path="items" element={<AdminItems />} />"
        <Route path="players" element={<AdminPlayers />} />
        <Route path="player/:userId/inventory" element={<AdminInventoryInpector />} />
      </Routes>
    </div>
  );
}
