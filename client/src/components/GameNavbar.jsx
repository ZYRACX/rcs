import { Gem, LogOut as LucideLogOut } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { account } from "@/appwrite"
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "./ui/tabs"
import { Link } from "react-router-dom"

export default function GameNavbar(props) {
  return (
    <div className="p-4 dark">
    {/* // Top Bar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">RCS</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-neutral-700">Profile</button>
          <button className="px-4 py-2 rounded bg-red-600" onClick={() => {account.deleteSession({sessionId: "current"}) }}>Logout</button>
        </div>
      </header>

      {/* Navigation */}
      <Tabs defaultValue="Overview" className="w-full">
        <TabsList className="flex flex-wrap gap-2 rounded-lg shadow-sm">
          <TabsTrigger value="Overview">
            <Link to="/game/overview">Overview</Link>
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <Link to="/game/inventory">Inventory</Link>
          </TabsTrigger>
          <TabsTrigger value="marketplace">
            <Link to="/game/marketplace">Marketplace</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
