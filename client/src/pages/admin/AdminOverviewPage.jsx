import React, { useState, useEffect } from "react";
import axios from "axios";
import { backend_url } from "@/lib/backend_url";

const AdminPage = () => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async (query = "") => {
    try {
      setLoading(true);
      const res = await axios.get(`${backend_url}/api/admin/users?q=${query}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const handleEdit = async (user) => {
    const newName = prompt("Enter new name:", user.name);
    const newEmail = prompt("Enter new email:", user.email);
    if (!newName || !newEmail) return;

    try {
      await axios.put(`${backend_url}/api/admin/users/${user.userId}`, {
        name: newName,
        email: newEmail,
      });
      alert("User updated!");
      fetchUsers(search);
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${backend_url}/api/admin/users/${userId}`);
      alert("User deleted!");
      fetchUsers(search);
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-l-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow rounded-lg">
            <thead className="bg-gray-800 text-gray-300">
              <tr>
                <th className="text-left p-3 border-b border-gray-700">User ID</th>
                <th className="text-left p-3 border-b border-gray-700">Name</th>
                <th className="text-left p-3 border-b border-gray-700">Email</th>
                <th className="text-left p-3 border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-700">
                  <td className="p-3 border-b border-gray-700">{user.userId}</td>
                  <td className="p-3 border-b border-gray-700">{user.name}</td>
                  <td className="p-3 border-b border-gray-700">{user.email}</td>
                  <td className="p-3 border-b border-gray-700 flex gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-yellow-500 text-gray-900 px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;   