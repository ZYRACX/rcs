import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminNavbar = () => {
  const location = useLocation(); // to highlight active link

  const navItems = [
    { name: "Users", path: "/admin/users" },
    { name: "Items", path: "/admin/items" },
  ];

  return (
    <nav className="bg-gray-900 text-gray-200 shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-2xl font-bold text-white">
            Admin Panel
          </div>
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition
                  ${location.pathname === item.path
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
