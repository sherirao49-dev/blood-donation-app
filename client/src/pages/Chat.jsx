import { useEffect, useState, useContext, useRef } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link
import AuthContext from "../context/AuthContext";
import io from "socket.io-client";
import { Send, ArrowLeft, Check, CheckCheck, MoreVertical, Phone } from "lucide-react";
import Navbar from "../components/Navbar";

// Initialize Socket
const socket = io("http://localhost:5000");

export default function Chat() {
  const { requestId } = useParams();
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;

    // Join the Chat Room
    socket.emit("join_chat", requestId);
    socket.emit("user_connected", user._id);

    // Fetch previous messages
    fetch(`http://localhost:5000/api/chat/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        scrollToBottom();
      });

    // Listen for incoming messages
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    // Typing Indicators
    socket.on("display_typing", () => setPartnerTyping(true));
    socket.on("hide_typing", () => setPartnerTyping(false));
    
    // Online Status
    socket.on("update_online_users", (users) => setOnlineUsers(users));

    return () => {
      socket.off("receive_message");
      socket.off("display_typing");
      socket.off("hide_typing");
      socket.off("update_online_users");
    };
  }, [requestId, user, token]);

  // Handle Sending
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgData = {
      requestId,
      senderId: user._id,
      text: newMessage,
      createdAt: new Date(),
    };

    // Emit to Socket
    socket.emit("send_message", msgData);
    socket.emit("stop_typing", requestId);

    // Save to Database (Optional if you want persistence logic here or relying on backend)
    await fetch("http://localhost:5000/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(msgData),
    });

    setMessages((prev) => [...prev, msgData]);
    setNewMessage("");
    scrollToBottom();
  };

  // Handle Typing Input
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", requestId);
    }
    
    // Stop typing indicator after 2 seconds of inactivity
    setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop_typing", requestId);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Main Chat Container - Adjusted top padding to clear floating navbar */}
      <div className="pt-28 pb-4 px-4 flex-1 flex flex-col max-w-4xl mx-auto w-full h-[calc(100vh-20px)]">
        
        {/* Chat Header */}
        <div className="bg-white p-4 rounded-t-3xl shadow-sm border-b border-gray-100 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-50 rounded-full transition text-gray-500">
              <ArrowLeft size={20} />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                {/* Initial of Chat Partner would go here, using 'U' for User generic */}
                U
              </div>
              {/* Green Dot for Online Status */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h2 className="font-bold text-gray-800">Donor / Requester</h2>
              <p className="text-xs text-green-600 font-medium">
                {partnerTyping ? "Typing..." : "Online"}
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-gray-400">
            <button className="p-2 hover:bg-gray-50 rounded-full transition"><Phone size={20} /></button>
            <button className="p-2 hover:bg-gray-50 rounded-full transition"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/subtle-grey.png')]">
          {messages.map((msg, index) => {
            const isMe = msg.senderId === user._id;
            return (
              <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-sm relative text-sm
                  ${isMe 
                    ? "bg-red-600 text-white rounded-br-none" 
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? "text-red-200" : "text-gray-400"}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <CheckCheck size={14} />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 rounded-b-3xl shadow-lg border-t border-gray-100">
          <form onSubmit={sendMessage} className="flex gap-2 items-center">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 text-gray-800 rounded-full px-6 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}