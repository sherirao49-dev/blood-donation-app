import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";

export default function AiBot() { // Renamed to match your file concept
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hi! I'm the LifeFlow Assistant. Ask me how to donate or request blood!", isBot: true }
  ]);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Add User Message
    const userText = input;
    setMessages((prev) => [...prev, { text: userText, isBot: false }]);
    setInput("");

    // 2. Bot Logic (Simple Rules - No Server Needed)
    setTimeout(() => {
      let response = "I'm not sure. Try asking about 'donation', 'requesting', or 'safety'.";
      const lowerInput = userText.toLowerCase();

      if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
        response = "Hello! 👋 How can I help you today?";
      } else if (lowerInput.includes("donate") || lowerInput.includes("give")) {
        response = "To donate, look for a Request Card on the dashboard and click 'Contact Donor' to message them!";
      } else if (lowerInput.includes("request") || lowerInput.includes("need")) {
        response = "Need blood? Click the big black 'Request Blood' button at the top of the dashboard.";
      } else if (lowerInput.includes("safe") || lowerInput.includes("verify")) {
        response = "Safety first! 🛡️ Always meet donors at a hospital or public medical center. Never go to private locations.";
      } else if (lowerInput.includes("contact") || lowerInput.includes("message")) {
        response = "You can chat with donors by clicking the 'Message' icon on their request card.";
      } else if (lowerInput.includes("who are you")) {
        response = "I am the LifeFlow Assistant, here to help you navigate the app!";
      }

      setMessages((prev) => [...prev, { text: response, isBot: true }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-scale-up">
          {/* Header */}
          <div className="bg-red-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <Bot size={20} />
              </div>
              <span className="font-bold">LifeFlow Helper</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-1 rounded-full transition">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] p-3 rounded-xl text-sm shadow-sm ${
                  msg.isBot 
                    ? "bg-white text-gray-700 border border-gray-200 rounded-tl-none" 
                    : "bg-red-600 text-white rounded-tr-none"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="bg-red-600 text-white p-2 rounded-xl hover:bg-red-700 transition">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition-all shadow-red-500/30"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}