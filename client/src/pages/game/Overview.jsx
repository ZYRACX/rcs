import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function TycoonDashboard() {
  const [coins, setCoins] = useState(0);
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  
   function handleMining () {
    axios.get("http://localhost:8000/game/mining", {withCredentials: true}).then((res) => {
      console.log(res.data)
    })
  }
  const handleActivity = () => {
    // setCoins((c) => c + 5);
    // setXp((x) => x + 10);
    // if (xp + 10 >= level * 100) {
    //   setLevel((l) => l + 1);
    //   setXp(0);
    // }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { user: "Player", text: input }]);
    setInput("");
  };

  useEffect(() => {
    // Fetch balance from backend
    axios.get("http://localhost:8000/game/playerinfo",{
      withCredentials: true
    }).then((response) => {
      setCoins(response.data.balance)
      setLevel(response.data.level)
      setXp(response.data.experience)
    })
  }, [])

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Player Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Coins" value={coins} />
        <StatCard label="Level" value={level} />
        <StatCard label="XP" value={xp} />
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>Player is active.</p>
              <Button className="bg-blue-600 hover:bg-blue-500">
                View Full Status
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle>Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ActivityButton label="Mining" onClick={handleMining} />
              <ActivityButton label="Fishing" onClick={handleActivity} />
              <ActivityButton label="Exploring" onClick={handleActivity} />
            </CardContent>
          </Card>
        </div>

        {/* Middle Column */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <TaskItem text="Mine 10 times" />
            <TaskItem text="Explore 10 times" />
            <TaskItem text="Fish 10 times" />
            <TaskItem text="Craft 10 items" />
          </CardContent>
        </Card>

        {/* Right Column */}
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader>
            <CardTitle>Global Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56 overflow-y-auto border border-neutral-700 rounded p-2 mb-3">
              {messages.length === 0 && (
                <p className="text-neutral-500">No messages yet</p>
              )}
              {messages.map((m, i) => (
                <p key={i}>
                  <span className="text-blue-400">{m.user}:</span> {m.text}
                </p>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                className="bg-neutral-900 border-neutral-700"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={sendMessage} className="bg-green-600 hover:bg-green-500">
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */

function StatCard({ label, value }) {
  return (
    <Card className="bg-neutral-800 border-neutral-700 text-center">
      <CardContent className="pt-6">
        <p className="text-sm text-neutral-400">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function ActivityButton({ label, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant="secondary"
      className="w-full bg-neutral-700 hover:bg-neutral-600"
    >
      Start {label}
    </Button>
  );
}

function TaskItem({ text }) {
  return (
    <div className="bg-neutral-700 rounded px-3 py-2 text-sm">
      {text}
    </div>
  );
}
