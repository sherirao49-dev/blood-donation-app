import { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Landing from "./Landing"; 

export default function Home() {
  // 1. CALL ALL HOOKS FIRST (The Rules of React)
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "", blood_type: "O+", hospital_name: "", city: "", urgency_level: "High",
  });

  useEffect(() => {
    // Only fetch if user exists to avoid errors
    if (user) {
        fetchRequests();
    }
  }, [user]);

  // 2. HELPER FUNCTIONS
  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/requests");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/requests", formData, {
        headers: { "x-auth-token": token },
      });
      toast.success("Request Posted! 🩸");
      setShowForm(false);
      fetchRequests();
    } catch (err) {
      toast.error("Failed to post request");
    }
  };

  // 3. NOW WE CAN SAFELY CHECK FOR USER
  // If not logged in, show Landing Page
  if (!user) {
    return <Landing />;
  }

  // 4. MAIN DASHBOARD RENDER
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blood Requests</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition shadow-lg">
            <Plus size={20} /> Request Blood
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-xl shadow-md mb-8 overflow-hidden" onSubmit={handleSubmit}
            >
              <h3 className="font-bold text-lg mb-4">Create New Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input placeholder="Patient Name" className="border p-2 rounded" required onChange={e => setFormData({...formData, patient_name: e.target.value})} />
                <input placeholder="Hospital Name" className="border p-2 rounded" required onChange={e => setFormData({...formData, hospital_name: e.target.value})} />
                <input placeholder="City" className="border p-2 rounded" required onChange={e => setFormData({...formData, city: e.target.value})} />
                <select className="border p-2 rounded" onChange={e => setFormData({...formData, blood_type: e.target.value})}>
                  {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <button className="mt-4 bg-gray-900 text-white px-6 py-2 rounded hover:bg-black">Post Request</button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid gap-4">
          {requests.map((req) => (
            <motion.div 
              key={req.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-sm">{req.blood_type}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${req.urgency_level === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{req.urgency_level} Priority</span>
                </div>
                <h3 className="font-bold text-lg">{req.patient_name}</h3>
                <p className="text-gray-500 flex items-center gap-1 text-sm"><MapPin size={14} /> {req.hospital_name}, {req.city}</p>
                <p className="text-xs text-gray-400 mt-1">Posted by {req.requester_name}</p>
              </div>
              {user.email !== req.requester_email && (
                <button onClick={() => navigate(`/chat/${req.id}`)} className="bg-blue-50 text-blue-600 p-3 rounded-full hover:bg-blue-100 transition"><MessageCircle size={24} /></button>
              )}
            </motion.div>
          ))}
          {requests.length === 0 && <p className="text-center text-gray-400 mt-10">No active blood requests. That's a good thing! ❤️</p>}
        </div>
      </div>
    </div>
  );
}