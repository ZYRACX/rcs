import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GlobalChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((m) => [
      ...m,
      {
        user: "Player",
        text: input,
      },
    ]);

    setInput("");
  };

  return (
    <div
      className="
        bg-neutral-800
        border
        border-neutral-700
        rounded-lg
        p-6
      "
    >
      <h2 className="text-lg font-semibold mb-4">
        Global Chat
      </h2>

      <div
        className="
          h-56
          overflow-y-auto
          border
          border-neutral-700
          rounded
          p-2
          mb-3
        "
      >
        {messages.length === 0 && (
          <p className="text-neutral-500">
            No messages yet
          </p>
        )}

        {messages.map((m, i) => (
          <p key={i}>
            <span className="text-blue-400">
              {m.user}:
            </span>{" "}
            {m.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          className="
            bg-neutral-900
            border-neutral-700
          "
          placeholder="Type a message"
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
        />

        <Button
          onClick={sendMessage}
          className="
            bg-green-600
            hover:bg-green-500
          "
        >
          Send
        </Button>
      </div>
    </div>
  );
}