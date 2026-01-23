import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdminOverviewPage from "./AdminOverviewPage";
import AdminItems from "./AdminItems";
import AdminNavbar from "@/components/AdminNavbar"
// import axios from "axios";

export default function AdminPage() {

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.log("No user is logged in");
      window.location.href = '/auth/login'; // Redirect to login page
    }
    
    
  },[])

  return (
    <div >
        <AdminNavbar />
      <Routes>
        {/* Relative paths (no /admin prefix) */}
        <Route path="users" element={<AdminOverviewPage />} />
        <Route path="items" element={<AdminItems />} />"
      </Routes>
    </div>
  );
}
