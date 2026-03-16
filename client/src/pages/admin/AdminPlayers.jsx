import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { backend_url } from "@/lib/backend_url";

export default function AdminPlayers() {

  const [userId, setUserId] = useState("");
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setError("");
      const res = await axios.get(
        `${backend_url}/admin/player/${userId}`,
        { withCredentials: true }
      );
      console.log(res.data);
      setPlayer(res.data);
    } catch (err) {
      setPlayer(null);
      setError("Player not found");
      console.error(err);
    }
  };

  const inspectInventory = () => {
    navigate(`/admin/player/${player.userId}/inventory`);
  };

  return (
    <div className="p-8 text-white">

      <h1 className="text-3xl font-semibold mb-8">Player Inspector</h1>

      {/* Search Box */}
      <div className="flex items-center gap-3 mb-8">

        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-md px-4 py-2 w-96 focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-md font-medium"
        >
          Search
        </button>

      </div>

      {error && <p className="text-red-400 mb-6">{error}</p>}

      {player && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-lg max-w-3xl">

          <h2 className="text-xl font-semibold mb-4 text-blue-400">
            Player Profile
          </h2>

          <div className="grid grid-cols-2 gap-y-3 gap-x-10">

            <p className="text-gray-400">User ID</p>
            <p className="font-mono">{player.$id}</p>

            <p className="text-gray-400">Username</p>
            <p>{player.username}</p>

            <p className="text-gray-400">Balance</p>
            <p className="text-green-400 font-medium">{player.balance}</p>

            <p className="text-gray-400">Level</p>
            <p>{player.level}</p>

            <p className="text-gray-400">Experience</p>
            <p>{player.experience}</p>

          </div>

          {/* Inventory Inspect Button */}
          <div className="mt-6">
            <button
              onClick={inspectInventory}
              className="bg-purple-600 hover:bg-purple-700 transition px-5 py-2 rounded-md font-medium"
            >
              Inspect Inventory
            </button>
          </div>

        </div>
      )}

    </div>
  );
}