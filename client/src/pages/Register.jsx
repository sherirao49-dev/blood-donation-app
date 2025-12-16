import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", blood_type: "A+" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) navigate("/");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Side */}
      <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="hidden md:flex w-1/2 bg-gradient-to-br from-red-600 to-red-800 text-white flex-col justify-center items-center p-10"
      >
        <h1 className="text-5xl font-bold mb-4">Join the Movement</h1>
        <p className="text-lg text-red-100 text-center max-w-md">Create an account to start your journey as a LifeFlow donor or requester.</p>
      </motion.div>
      {/* Right Side */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="w-full md:w-1/2 flex items-center justify-center bg-white p-8"
      >
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          </div>
          <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Email" type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" placeholder="Password" type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none" onChange={(e) => setFormData({...formData, blood_type: e.target.value})}>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(type => <option key={type} value={type}>{type}</option>)}
          </select>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg">Sign Up</motion.button>
          <p className="text-center text-sm text-gray-600">Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Login</Link></p>
        </form>
      </motion.div>
    </div>
  );
}