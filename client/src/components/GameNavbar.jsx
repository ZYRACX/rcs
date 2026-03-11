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
    // <div className="p-4 dark">
    
    //   {/* Header */}
    //   <header className="flex flex-wrap justify-between items-center gap-2 mb-4">
    //     <div className="flex items-center space-x-2 text-2xl font-bold text-blue-900">
    //       <Gem className="text-blue-500" />
    //       <span>RCS</span>
    //     </div>
    //     <div className="flex flex-wrap gap-2">
    //       <Button variant="secondary" className="bg-purple-500 text-white" onClick={() => {
    //         localStorage.removeItem("userId");
    //         window.location.href = '/auth/login'; // Redirect to login page
    //       }}>
    //         <LucideLogOut className="mr-1" size={16} /> Logout
    //       </Button>
    //       <Button variant="secondary">Profile</Button>
    //     </div>
    //   </header>

    //   {/* Stats */}
    //   <div className="grid gap-4 mb-4">
    //     <Card className="w-full sm:w-64 mx-auto text-center">
    //       <CardContent className="p-4 text-lg font-semibold flex flex-col items-center gap-2">
    //         <div>💰 ${props.balance}</div>
    //         <div>⭐ Level: 1</div>
    //         <div>📈 XP: 0</div>
    //       </CardContent>
    //     </Card>
    //   </div>
    <div className="p-4 dark">
    {/* // Top Bar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tycoon Game</h1>
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
