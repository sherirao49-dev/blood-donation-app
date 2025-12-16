import { useState } from "react";
import axios from "axios";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AiBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I am LifeFlow AI. Ask me about current blood requests or donor eligibility." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Call our Backend AI Route
      const res = await axios.post("http://localhost:5000/api/ai/chat", { userMessage: input });
      setMessages([...newMessages, { role: "bot", text: res.data.botResponse }]);
    } catch (err) {
      setMessages([...newMessages, { role: "bot", text: "Sorry, I am having trouble connecting right now." }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white w-80 h-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 mb-4"
          >
            {/* Header */}
            <div className="bg-red-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={20} /> LifeFlow AI
              </div>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === "user" ? "bg-red-600 text-white" : "bg-white border text-gray-800 shadow-sm"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && <div className="text-gray-400 text-xs animate-pulse">AI is typing...</div>}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t flex gap-2">
              <input 
                className="flex-1 p-2 border rounded-full text-sm outline-none focus:border-red-500 transition"
                placeholder="Ask something..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700">
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition hover:scale-110"
        >
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}