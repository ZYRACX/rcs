import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Coins, 
  Trophy, 
  Zap, 
  Pickaxe, 
  Waves, 
  Map, 
  Send, 
  CheckCircle2 
} from "lucide-react";
import axios from "axios";
import { backend_url } from "@/lib/backend_url";

export default function TycoonDashboard() {
  const [stats, setStats] = useState({ coins: 0, level: 0, xp: 0 });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [isExploring, setIsExploring] = useState(false);

  const scrollRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchPlayerInfo = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/game/playerinfo`, { withCredentials: true });
      setStats({ coins: data.balance, level: data.level, xp: data.experience });
    } catch (err) {
      console.error("Failed to fetch player info");
    }
  };

  useEffect(() => { fetchPlayerInfo(); }, []);

  const handleMining = async () => {
    setIsMining(true);
    try {
      await axios.get(`${backend_url}/game/mining`, { withCredentials: true });
      fetchPlayerInfo(); // Refresh stats after action
    } catch (error) {
      alert(`${error.response?.data?.error}. Retry in ${error.response?.data?.retry_after_ms}ms`);
    } finally {
      setIsMining(false);
    }
  };
  
  const handleExploring = async () => {
  setIsExploring(true);
  try {

    await axios.get(
      `${backend_url}/game/exploring`,
      {
        withCredentials: true,
      }
    );
    fetchPlayerInfo();
  } catch (error) {
    alert(
      `${error.response?.data?.error}. Retry in ${error.response?.data?.retry_after_ms}ms`
    );
  } finally {
    setIsExploring(false);
  }

};

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { user: "Player", text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header / Stats */}
        <header className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard label="Available Coins" value={stats.coins} icon={<Coins className="text-amber-400" />} color="border-amber-500/20" />
          <StatCard label="Current Level" value={stats.level} icon={<Trophy className="text-blue-400" />} color="border-blue-500/20" />
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">XP Progress</span>
              <span className="text-sm font-bold text-zinc-200">{stats.xp} / 1000</span>
            </div>
            <Progress value={(stats.xp / 1000) * 100} className="h-2 bg-zinc-800" />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Actions */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" /> Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <ActivityButton 
                  label="Mining" 
                  icon={<Pickaxe size={18}/>} 
                  onClick={handleMining} 
                  loading={isMining} 
                  variant="emerald"
                />
                <ActivityButton label="Fishing" icon={<Waves size={18}/>} onClick={() => {}} variant="blue" />
                <ActivityButton label="Exploring" icon={<Map size={18}/>} onClick={handleExploring} loading={isExploring} variant="purple" />
              </CardContent>
            </Card>
          </div>

          {/* Middle: Quests/Tasks */}
          <div className="lg:col-span-4">
            <Card className="bg-zinc-900 border-zinc-800 h-full shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg">Active Tasks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <TaskItem text="Mine 10 times" progress={40} />
                <TaskItem text="Explore the dark caves" progress={100} completed />
                <TaskItem text="Catch a rare fish" progress={0} />
              </CardContent>
            </Card>
          </div>

          {/* Right: Social */}
          <div className="lg:col-span-4">
            <Card className="bg-zinc-900 border-zinc-800 h-full flex flex-col shadow-xl">
              <CardHeader className="border-b border-zinc-800">
                <CardTitle className="text-lg flex items-center justify-between">
                  Global Chat
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/5">Online</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[350px]">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-zinc-500 text-sm italic">
                      No transmissions yet...
                    </div>
                  ) : (
                    messages.map((m, i) => (
                      <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-blue-400">{m.user}</span>
                          <span className="text-[10px] text-zinc-500">{m.time}</span>
                        </div>
                        <p className="text-sm bg-zinc-800/50 p-2 rounded-lg border border-zinc-800 w-fit">{m.text}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-zinc-800 flex gap-2">
                  <Input
                    className="bg-zinc-950 border-zinc-800 focus-visible:ring-blue-500"
                    placeholder="Send a message..."
                    value={input}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button size="icon" onClick={sendMessage} className="bg-blue-600 hover:bg-blue-500 shrink-0">
                    <Send size={18} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- UI Sub-Components ---------- */

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-zinc-900 border ${color} p-5 rounded-xl flex items-center gap-4 transition-transform hover:scale-[1.02]`}>
      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
        {icon}
      </div>
      <div>
        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">{label}</p>
        <p className="text-2xl font-black text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  );
}

function ActivityButton({ label, onClick, icon, loading, variant }) {
  const colors = {
    emerald: "hover:bg-emerald-600/10 hover:border-emerald-500/50 text-emerald-400",
    blue: "hover:bg-blue-600/10 hover:border-blue-500/50 text-blue-400",
    purple: "hover:bg-purple-600/10 hover:border-purple-500/50 text-purple-400"
  };

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      variant="outline"
      className={`w-full h-12 justify-start gap-3 border-zinc-800 bg-zinc-950 transition-all ${colors[variant]}`}
    >
      {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : icon}
      {loading ? "Processing..." : `Start ${label}`}
    </Button>
  );
}

function TaskItem({ text, progress, completed }) {
  return (
    <div className={`group p-3 rounded-lg border transition-all ${completed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-950 border-zinc-800'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${completed ? 'text-emerald-400' : 'text-zinc-300'}`}>{text}</span>
        {completed && <CheckCircle2 size={16} className="text-emerald-500" />}
      </div>
      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${completed ? 'bg-emerald-500' : 'bg-zinc-600'}`} 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}