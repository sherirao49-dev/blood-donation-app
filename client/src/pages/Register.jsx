import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Droplet, ArrowRight, Heart } from "lucide-react";

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodType: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bloodType) {
      setError("Please select your Blood Type");
      return;
    }
    try {
      await register(formData.name, formData.email, formData.password, formData.bloodType);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gray-900">
      
      {/* 1. BACKGROUND IMAGE (Matches Login Page) */}
      <img 
        src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1974&auto=format&fit=crop" 
        alt="Blood donation background" 
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      
      {/* 2. THE MAIN CARD */}
      <div className="relative z-10 w-full max-w-5xl h-auto flex rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] m-4 animate-fade-in-up">
        
        {/* LEFT SIDE: Glass Effect (Transparent) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-red-900/40 to-black/60 backdrop-blur-sm flex-col justify-between p-12 text-white relative border-r border-white/10">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20">
                    <Heart size={24} fill="white" className="text-white" />
                </div>
                <span className="text-2xl font-bold tracking-wide drop-shadow-md">LifeFlow</span>
            </div>

            {/* Headline */}
            <div className="mb-8">
                <h2 className="text-5xl font-extrabold leading-tight mb-4 tracking-tight drop-shadow-xl">
                    Join the <br/>
                    <span className="text-red-300">Movement.</span>
                </h2>
                <p className="text-lg text-gray-100 font-medium max-w-sm leading-relaxed drop-shadow-md">
                    Create an account today and become a hero in someone's story.
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 text-xs font-medium text-white/70">
                <span>© 2025 LifeFlow Inc.</span>
            </div>
        </div>

        {/* RIGHT SIDE: White Registration Form */}
        <div className="w-full md:w-1/2 bg-white p-10 md:p-12 flex flex-col justify-center">
            
            <div className="mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Create Account</h3>
                <p className="text-gray-500 mt-2">Sign up to start saving lives.</p>
            </div>

            {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-semibold border-l-4 border-red-500 flex items-center gap-2">
                ⚠️ {error}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name Input */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative group">
                        <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                            placeholder="John Doe"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input 
                            type="email" 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                            placeholder="name@example.com"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <input 
                            type="password" 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900"
                            placeholder="••••••••"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                {/* Blood Group Select */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Type</label>
                    <div className="relative group">
                        <Droplet className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-red-500 transition-colors" size={20} />
                        <select 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all font-medium text-gray-900 appearance-none"
                            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                            defaultValue=""
                        >
                            <option value="" disabled>Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                        <div className="absolute right-4 top-4 pointer-events-none text-gray-400">▼</div>
                    </div>
                </div>

                {/* Sign Up Button */}
                <button className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-[0.98] mt-2">
                    Create Account <ArrowRight size={20} />
                </button>
            </form>

            <p className="text-center mt-6 text-gray-500 text-sm">
                Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline hover:text-red-700 transition">Sign in</Link>
            </p>
        </div>

      </div>
    </div>
  );
}