import { Gem, LogOut, User, LayoutDashboard, Briefcase, ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { account } from "@/appwrite";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function GameNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab based on current URL path
  const currentPath = location.pathname.split("/").pop() || "overview";

  const handleLogout = async () => {
    try {
      await account.deleteSession({ sessionId: "current" });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-indigo-600 p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
              <Gem className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              RCS <span className="text-indigo-500 text-xs not-italic font-mono">v1.0</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 gap-2 px-3"
            >
              <User size={18} />
              <span className="hidden sm:inline">Commander</span>
            </Button>
            
            <div className="h-6 w-[1px] bg-zinc-800 mx-1" />

            <Button 
              variant="destructive" 
              size="icon"
              className="bg-red-950/20 text-red-500 border border-red-900/50 hover:bg-red-600 hover:text-white transition-all"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </Button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <Tabs value={currentPath} className="w-full">
          <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 h-auto flex flex-wrap sm:inline-flex">
            <NavTab value="overview" to="/game/overview" icon={<LayoutDashboard size={16} />} label="Overview" />
            <NavTab value="inventory" to="/game/inventory" icon={<Briefcase size={16} />} label="Inventory" />
            <NavTab value="marketplace" to="/game/marketplace" icon={<ShoppingCart size={16} />} label="Market" />
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

/* Helper Component to keep code clean and fix Link nesting */
function NavTab({ value, to, icon, label }) {
  return (
    <TabsTrigger 
      value={value} 
      asChild
      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white px-6 py-2 transition-all"
    >
      <Link to={to} className="flex items-center gap-2">
        {icon}
        <span className="font-bold tracking-tight">{label}</span>
      </Link>
    </TabsTrigger>
  );
}