import { useEffect, useState, useContext, useRef } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { 
  LogOut, Settings, Plus, MapPin, MessageCircle, Trash2, X, Heart, Send 
} from "lucide-react";
// ✅ NEW: Import the AI Bot
import AiBot from "../components/aibot";

export default function Home() {
  const { user, logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // MODAL STATES
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState(null);
  
  // CHAT STATE
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  const [formData, setFormData] = useState({
    patientName: "", bloodType: "", location: "", hospital: "", contactNumber: "", urgency: "High"
  });

  // 1. INITIALIZE SOCKET & FETCH REQUESTS
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");
    fetchRequests();

    // Listen for incoming messages
    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  // 2. SCROLL TO BOTTOM ON NEW MESSAGE
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showChatModal]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  // 3. OPEN CHAT FUNCTION
  const openChat = async (request) => {
    setActiveChatRequest(request);
    setShowChatModal(true);
    
    socketRef.current.emit("join_chat", request._id);

    try {
      const res = await fetch(`http://localhost:5000/api/chat/${request._id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  // 4. SEND MESSAGE FUNCTION
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      requestId: activeChatRequest._id,
      senderId: user?.id || user?._id, 
      text: newMessage,
      timestamp: new Date(),
    };

    socketRef.current.emit("send_message", messageData);
    setNewMessage("");
  };

  // CREATE REQUEST
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token") 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowRequestModal(false);
        fetchRequests();
        setFormData({ patientName: "", bloodType: "", location: "", hospital: "", contactNumber: "", urgency: "High" });
      }
    } catch (err) {
      alert("Failed to create request");
    }
  };

  // DELETE REQUEST
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      await fetch(`http://localhost:5000/api/requests/${id}`, { 
        method: "DELETE",
        headers: { "x-auth-token": localStorage.getItem("token") }
      });
      setRequests(requests.filter((req) => req._id !== id));
    } catch (err) {
      alert("Failed to delete request");
    }
  };

  return (
    <div className="min-h-screen relative">
      
      {/* BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1974&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10">
        
        {/* FLOATING NAVBAR */}
        <div className="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
          <nav className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl border border-white/50 rounded-full px-6 py-3 flex items-center justify-between shadow-xl shadow-black/5 ring-1 ring-black/5">
            
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-tr from-red-600 to-red-500 p-2 rounded-full shadow-lg shadow-red-500/30">
                <Heart size={18} fill="white" className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">LifeFlow</span>
            </div>
            
            <div className="flex items-center gap-4">
               {/* User Info Capsule */}
              <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-gray-100/50 rounded-full border border-gray-200/50">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm relative">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                  {/* Small Green Dot on Avatar */}
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-green-400"></span>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">{user?.name || "User"}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide font-bold">Online</p>
                </div>
              </div>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <button 
                onClick={() => navigate("/settings")} 
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition" 
                title="Settings"
              >
                <Settings size={20} />
              </button>
              
              <button onClick={logout} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          </nav>
        </div>

        {/* DASHBOARD CONTENT */}
        <main className="max-w-7xl mx-auto px-6 pt-28 pb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">{user?.name || "Hero"}</span> 👋
              </h1>
              <p className="text-lg text-gray-500 font-medium mt-2">Ready to save a life today?</p>
            </div>

            <button 
              onClick={() => setShowRequestModal(true)}
              className="group bg-gray-900 hover:bg-black text-white px-6 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
            >
              <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
                <Plus size={20} />
              </div>
              Request Blood
            </button>
          </div>

          {/* GRID */}
          {loading ? (
             <div className="text-center py-20 text-gray-500 animate-pulse">Loading amazing things...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((req) => {
                // Check Online Status
                const isUserOnline = onlineUsers.some(u => String(u.userId) === String(req.user_id || req.userId));

                return (
                <div key={req._id} className="bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/60 group relative overflow-hidden">
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>

                  {/* ONLINE BADGE */}
                  {isUserOnline && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-green-100/90 backdrop-blur px-2.5 py-1 rounded-full border border-green-200 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Online</span>
                    </div>
                  )}

                  <button onClick={() => handleDelete(req._id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-600 transition-colors z-10">
                    <Trash2 size={18} />
                  </button>

                  <div className="flex justify-between items-start mb-6 mt-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border border-white ${req.bloodType ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}>
                      {req.bloodType || "?"}
                    </div>
                    <span className="bg-red-100/80 backdrop-blur text-red-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                       {req.urgency || "Urgent"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors relative z-10">
                    {req.patientName || "Blood Request"}
                  </h3>
                  
                  <div className="space-y-3 mt-4 relative z-10">
                    <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                      <div className="bg-gray-100 p-1.5 rounded-lg">
                        <MapPin size={14} className="text-gray-400" />
                      </div>
                      {req.hospital || req.location || "Location not specified"}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-gray-100 relative z-10">
                    <button 
                      onClick={() => openChat(req)}
                      className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-xl font-bold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                    >
                      <MessageCircle size={18} />
                      Contact Donor
                    </button>
                  </div>
                </div>
              )})}
              
              {requests.length === 0 && (
                <div className="col-span-full text-center py-24 text-gray-400">
                  <p className="text-lg">No active blood requests found.</p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* REQUEST MODAL */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up border border-white/20">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-black text-gray-900">New Request</h3>
                <button onClick={() => setShowRequestModal(false)} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900 transition">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Patient Name</label>
                    <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-medium" 
                      onChange={e => setFormData({...formData, patientName: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Type</label>
                    <select required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-medium"
                      onChange={e => setFormData({...formData, bloodType: e.target.value})}
                    >
                      <option value="">Select Type</option>
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hospital / Location</label>
                  <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-medium" 
                    onChange={e => setFormData({...formData, hospital: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Number</label>
                  <input required type="text" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-medium" 
                    onChange={e => setFormData({...formData, contactNumber: e.target.value})} 
                  />
                </div>
                <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-lg shadow-gray-200 mt-2">
                  Post Request
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CHAT MODAL */}
        {showChatModal && activeChatRequest && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md h-[650px] shadow-2xl flex flex-col animate-scale-up overflow-hidden border border-white/20">
              
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                    {activeChatRequest.bloodType}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{activeChatRequest.patientName}</h3>
                    {/* ONLINE STATUS IN CHAT */}
                    {onlineUsers.some(u => String(u.userId) === String(activeChatRequest.user_id || activeChatRequest.userId)) ? (
                        <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <span className="block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500 font-medium">Offline</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setShowChatModal(false)} className="bg-gray-50 p-2 rounded-full text-gray-400 hover:text-gray-900 transition">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50 scrollbar-hide">
                {messages.map((msg, index) => {
                  const isMe = String(msg.senderId) === String(user?.id || user?._id);
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe ? "bg-red-600 text-white rounded-br-none" : "bg-white border border-gray-100 text-gray-700 rounded-bl-none"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-gray-200 focus:ring-0 rounded-2xl px-5 py-3.5 outline-none transition text-sm font-medium"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button className="bg-red-600 text-white p-3.5 rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-200 active:scale-95">
                  <Send size={20} />
                </button>
              </form>

            </div>
          </div>
        )}

        {/* ✅ AI BOT ADDED HERE */}
        <AiBot />

      </div>
    </div>
  );
}