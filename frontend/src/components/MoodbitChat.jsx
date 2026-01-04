import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MoodbitChat({
  budget,
  totalSpent,
  healthScore,
  mood,
}) {
  const { getToken } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const token = await getToken();

    const res = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: input,
        context: {
          budget,
          totalSpent,
          healthScore,
          mood,
        },
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "ai", text: data.reply },
    ]);

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-xl"
      >
        <MessageCircle />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl border z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h2 className="font-semibold text-blue-600">
                Ask Moodbit 🤖
              </h2>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-56 overflow-y-auto p-3 text-sm space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    m.role === "ai"
                      ? "bg-purple-50 text-blue-700"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <b>{m.role === "ai" ? "Moodbit:" : "You:"}</b>{" "}
                  {m.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-3 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="Ask about your spending..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-3 rounded text-sm"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
