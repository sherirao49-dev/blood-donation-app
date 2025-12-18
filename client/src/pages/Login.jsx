import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password);
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden">
      
      {/* BACKGROUND IMAGE (Matches Dashboard) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1974&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full flex items-center justify-center p-4">
        
        {/* GLASS CARD CONTAINER */}
        <div className="flex w-full max-w-4xl bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
          
          {/* LEFT SIDE - HERO SECTION */}
          <div className="hidden md:flex w-1/2 bg-gradient-to-br from-red-600 to-red-800 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/20 p-2 rounded-full">
                  <Heart className="text-white" size={24} fill="white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-wide">LifeFlow</span>
              </div>
              <h1 className="text-4xl font-black text-white leading-tight mb-4">
                Welcome<br/>Back, Hero.
              </h1>
              <p className="text-red-100 font-medium text-lg">
                Your small act of kindness creates a ripple that saves lives.
              </p>
            </div>

            <div className="relative z-10 text-xs text-red-200 font-bold tracking-widest uppercase">
              © 2025 LifeFlow Inc.
            </div>
          </div>

          {/* RIGHT SIDE - LOGIN FORM */}
          <div className="w-full md:w-1/2 p-10 md:p-12 bg-white/50">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 mb-8 font-medium">Please enter your details to continue.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  required 
                  className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-bold text-gray-700"
                  placeholder="name@example.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  required 
                  className="w-full p-4 bg-white/60 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition font-bold text-gray-700"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black hover:shadow-lg transition transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2">
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-500 font-medium">Don't have an account? <Link to="/register" className="text-red-600 font-bold hover:underline">Create one</Link></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}