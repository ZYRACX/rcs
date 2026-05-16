import React, { useState } from 'react';
import { 
  Building2, HardHat, Map, Warehouse, Landmark, 
  Hammer, ClipboardList, BarChart3, Users, Bell, 
  Settings, LogOut, ChevronRight, Zap, Droplets, Leaf,
  Star, Award, Calendar, Pickaxe, Compass, Sprout
} from 'lucide-react';
import axios from 'axios';
import Panel from "@/components/game/Panel";
import StatCard from "@/components/game/StatCard";
import { backend_url } from "@/lib/backend_url";
// --- Shared Components ---



const ActionButton = ({ icon: Icon, title, description, color }) => (
  <button className="w-full group flex items-center justify-between p-4 bg-blue-950/20 border border-blue-500/10 rounded-xl hover:bg-blue-900/30 hover:border-blue-400/30 transition-all text-left">
    <div className="flex items-center gap-4">
      <div className={`p-2.5 rounded-lg border bg-blue-500/5 ${color}`}>
        <Icon size={18} />
      </div>
      <div>
        <div className="text-xs font-bold text-slate-200 tracking-wide">{title}</div>
        <div className="text-[10px] text-slate-500 mt-0.5">{description}</div>
      </div>
    </div>
    <ChevronRight size={14} className="text-slate-600 group-hover:text-blue-400 transition-colors" />
  </button>
);

const VentureCard = ({ icon: Icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex-1 flex flex-col items-center gap-3 p-4 bg-blue-950/20 border border-blue-500/10 rounded-xl hover:bg-blue-900/40 hover:border-blue-400/40 transition-all group active:scale-95"
  >
    <div className={`p-4 rounded-full bg-blue-500/5 border border-blue-500/20 ${color} group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 group-hover:text-white transition-colors">{label}</span>
  </button>
);

// --- Main App Component ---

export default function App() {
  const [stats, setStats] = useState({ coins: 0, level: 0, xp: 0 });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isMining, setIsMining] = useState(false);
  const [isExploring, setIsExploring] = useState(false);

  const [activeTab, setActiveTab] = useState('DASHBOARD');

  const menuItems = [
    { id: 'DASHBOARD', icon: Building2 },
    { id: 'ZONING', icon: Map },
    { id: 'CONSTRUCTION', icon: HardHat },
    { id: 'RESOURCES', icon: Warehouse },
    { id: 'ECONOMY', icon: BarChart3 },
    { id: 'PUBLIC WORKS', icon: Hammer },
    { id: 'CITIZEN REQUESTS', icon: ClipboardList },
    { id: 'CITY HALL', icon: Landmark },
    { id: 'POPULATION', icon: Users },
  ];

  const handleVentureClick = (type) => {
    // Logic for mining, exploring, or farming could go here (e.g., triggering a progress bar)
    console.log(`Starting ${type}...`);
  };
  const fetchPlayerInfo = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/game/playerinfo`, { withCredentials: true });
      setStats({ coins: data.balance, level: data.level, xp: data.experience });
    } catch (err) {
      console.error("Failed to fetch player info");
    }
  };
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

  return (
    <div className="flex h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-hidden">
      


      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#020617]">
        {/* Header Bar */}
        <header className="h-20 border-b border-blue-900/20 bg-[#0b1120]/50 backdrop-blur-md px-8 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black tracking-[0.3em] text-blue-400 uppercase">Operational Overview</h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex gap-8">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <span className="text-[10px] font-bold">$</span>
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white leading-none">0</div>
                  <div className="text-[8px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Budget</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Zap size={12} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white leading-none">0%</div>
                  <div className="text-[8px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Power</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Droplets size={12} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white leading-none">0%</div>
                  <div className="text-[8px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">Water</div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 border-l border-blue-900/20 pl-8 text-slate-400">
              <Bell size={18} className="cursor-pointer hover:text-white transition-colors" />
              <Settings size={18} className="cursor-pointer hover:text-white transition-colors" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Grid */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-9">
                <Panel title="City Vitals">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    <StatCard icon={Users} label="Population" value="100" trend="0" colorClass="text-blue-400" />
                    <StatCard icon={Leaf} label="Happiness" value="92%" trend="+ 4%" colorClass="text-emerald-500" />
                    <StatCard icon={Star} label="Level" value="42" trend="Rank: Elite" colorClass="text-amber-500" />
                    <StatCard icon={Award} label="Experience" value="8,450" trend="Next: 10k" colorClass="text-purple-400" />
                  </div>

                  {/* Actions & Ventures Panel */}
                  <div className="mb-6 p-4 bg-blue-500/[0.03] border border-blue-500/10 rounded-xl">
                    <div className="text-[10px] font-bold text-blue-400/50 tracking-[0.2em] uppercase mb-4 px-2">Actions & Ventures</div>
                    <div className="flex gap-4">
                      <VentureCard 
                        icon={Pickaxe} 
                        label="Mining" 
                        color="text-amber-500" 
                        onClick={handleMining}  
                      />
                      <VentureCard 
                        icon={Compass} 
                        label="Exploring"   
                        color="text-blue-400" 
                        onClick={() => handleVentureClick('Exploring')} 
                      />
                      <VentureCard 
                        icon={Sprout} 
                        label="Farming" 
                        color="text-emerald-500" 
                        onClick={() => handleVentureClick('Farming')} 
                      />
                    </div>
                  </div>

                  {/* Dynamic Banner */}
                  <div className="relative group rounded-xl overflow-hidden border border-blue-500/10 h-44">
                    <img 
                      src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=1200" 
                      alt="Modern City" 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-blue-950/40 to-transparent" />
                    <div className="relative p-8 flex flex-col justify-center h-full">
                      <div className="flex items-center gap-2 text-blue-400 mb-2">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black tracking-widest uppercase">Events</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Coming Soon...</h3>
                      <p className="text-xs text-slate-400 mb-4 max-w-sm">New seasonal events and community challenges are being scheduled. Check back shortly for updates.</p>
                      <button className="w-fit px-6 py-2 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-blue-500 transition-all rounded shadow-lg shadow-blue-600/20">
                        Calendar
                      </button>
                    </div>
                  </div>
                </Panel>
              </div>

              {/* Quick Actions */}
              <div className="col-span-12 lg:col-span-3">
                <Panel title="Urban Planning" className="h-full">
                  <div className="space-y-4">
                    <ActionButton icon={Building2} title="ZONE LAND" description="Designate residential or commercial." color="text-blue-400 border-blue-500/20" />
                    <ActionButton icon={Zap} title="UPGRADE GRID" description="Increase power and water efficiency." color="text-amber-400 border-amber-500/20" />
                    <ActionButton icon={Hammer} title="BUILD INFRA" description="Roads, parks, and public services." color="text-emerald-400 border-emerald-500/20" />
                  </div>
                </Panel>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Construction List */}
              <div className="col-span-12 lg:col-span-4">
                <Panel title="Building Projects" actionText="Manage">
                  <table className="w-full">
                    <thead>
                      <tr className="text-[9px] font-bold text-slate-600 uppercase tracking-widest border-b border-blue-500/10">
                        <th className="text-left pb-3">Project</th>
                        <th className="text-center pb-3">Progress</th>
                        <th className="text-right pb-3">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="text-[11px]">
                      {[
                        { name: 'Water Plant', type: 'Utility', progress: 85, cost: '450k', color: 'text-cyan-400' },
                        { name: 'Sky High Apt', type: 'Residential', progress: 42, cost: '1.2M', color: 'text-emerald-400' },
                        { name: 'Main Road', type: 'Infra', progress: 98, cost: '85k', color: 'text-slate-400' },
                        { name: 'Solar Farm', type: 'Energy', progress: 12, cost: '2.4M', color: 'text-amber-400' },
                        { name: 'Public Park', type: 'Leisure', progress: 66, cost: '120k', color: 'text-green-500' },
                      ].map((item, idx) => (
                        <tr key={idx} className="border-b border-white/[0.02] hover:bg-blue-500/[0.03] transition-colors group">
                          <td className="py-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-950/40 border border-blue-500/10 rounded flex items-center justify-center text-xs">
                              🏗️
                            </div>
                            <div>
                              <div className="font-bold text-slate-300 tracking-wide group-hover:text-blue-400">{item.name}</div>
                              <div className={`text-[8px] font-black uppercase tracking-tighter ${item.color}`}>{item.type}</div>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="text-[10px] font-mono text-slate-400">{item.progress}%</div>
                            <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-blue-500" style={{ width: `${item.progress}%` }} />
                            </div>
                          </td>
                          <td className="text-right font-mono text-blue-400">$ {item.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Panel>
              </div>

              {/* Resource Market */}
              <div className="col-span-12 lg:col-span-5">
                <Panel title="Resource Exchange" actionText="Inventory">
                  <div className="flex gap-2 mb-6">
                    {['BUY', 'SELL', 'CONTRACTS'].map((tab, i) => (
                      <button key={tab} className={`px-4 py-1.5 rounded text-[9px] font-bold tracking-widest ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-blue-950/40 text-slate-500 border border-blue-500/10'}`}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {[
                      { res: 'Steel Beams', unit: 'Tons', qty: 500, price: '2,400', status: 'Rising' },
                      { res: 'Concrete', unit: 'Tons', qty: 2500, price: '1,100', status: 'Stable' },
                      { res: 'Electronics', unit: 'Units', qty: 150, price: '8,900', status: 'Falling' },
                      { res: 'Wood Timber', unit: 'Units', qty: 1200, price: '650', status: 'Rising' },
                    ].map((row, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-blue-950/20 border border-blue-500/10 hover:border-blue-400/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-blue-900/40 flex items-center justify-center text-xs">📦</div>
                          <div>
                            <div className="text-xs font-bold text-slate-200">{row.res}</div>
                            <div className="text-[9px] text-blue-500/60 font-bold uppercase tracking-wider italic">{row.status}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-[10px] font-mono text-slate-400">{row.qty}</div>
                            <div className="text-[8px] text-slate-600 font-bold uppercase">{row.unit}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-mono text-emerald-400">$ {row.price}</div>
                            <div className="text-[8px] text-slate-600 font-bold uppercase">Price</div>
                          </div>
                          <button className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/40 text-blue-400 text-[9px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all rounded">
                            Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>

              {/* Citizen Feed */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <Panel title="Citizen Buzz">
                  <div className="space-y-6">
                    {[
                      { user: '@UrbanLover', msg: 'New park in Sector 4 is beautiful! #ParksForAll', time: '5m ago', icon: '🌳' },
                      { user: '@TrafficHater', msg: 'The construction on Main St is taking too long...', time: '22m ago', icon: '🚗' },
                      { user: '@SolarPower', msg: 'Grid efficiency has improved significantly.', time: '1h ago', icon: '☀️' },
                      { user: '@FoodieCity', msg: 'Opening a new bistro near Downtown!', time: '3h ago', icon: '🍕' },
                    ].map((tweet, i) => (
                      <div key={i} className="flex gap-4 group">
                        <div className="w-8 h-8 rounded-full bg-blue-900/30 flex items-center justify-center text-xs shrink-0">{tweet.icon}</div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="text-[11px] font-bold text-blue-400">{tweet.user}</div>
                            <div className="text-[9px] text-slate-600 font-mono italic">{tweet.time}</div>
                          </div>
                          <div className="text-[10px] text-slate-300 mt-1 leading-relaxed italic">"{tweet.msg}"</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>

                <Panel title="Economic Outlook" className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b]">
                  <div className="p-1">
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase">Tax Revenue</span>
                       <span className="text-[10px] font-mono text-emerald-400">+12.5%</span>
                     </div>
                     <div className="h-12 flex items-end gap-1 mb-4">
                       {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
                         <div key={i} className="flex-1 bg-blue-500/30 rounded-t" style={{ height: `${h}%` }}>
                           <div className="w-full bg-blue-500 rounded-t" style={{ height: '30%' }} />
                         </div>
                       ))}
                     </div>
                     <p className="text-[9px] text-slate-500 text-center uppercase tracking-tighter">7-Day Economic Forecast: Strong Growth</p>
                  </div>
                </Panel>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <footer className="h-10 bg-[#0b1120] border-t border-blue-900/20 flex items-center justify-between px-8 text-[10px] font-bold text-slate-600 shrink-0">
          <div className="flex items-center gap-4 uppercase tracking-[0.15em]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]" />
              Simulation: <span className="text-blue-500">Stable</span>
            </div>
          </div>
          <div className="flex gap-8 uppercase tracking-[0.15em]">
            <span>Day 1,245</span>
            <span className="text-slate-700 italic">Civic OS v2.4</span>
          </div>
        </footer>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
}