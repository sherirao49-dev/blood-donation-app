import { Link } from "react-router-dom";
import { Heart, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        
        {/* Left Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2"
        >
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Save a Life, <br />
            <span className="text-red-600">Be a Hero.</span>
          </h1>
          <p className="mt-6 text-gray-600 text-lg">
            LifeFlow connects generous donors with patients in urgent need. 
            Join our community and make a difference today.
          </p>
          <div className="mt-8 flex gap-4">
            <Link to="/register" className="bg-red-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition transform hover:scale-105">
              Get Started
            </Link>
            <Link to="/login" className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-red-50 transition">
              Login
            </Link>
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mt-12 md:mt-0 flex justify-center"
        >
          <div className="relative w-96 h-96 bg-red-100 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <Heart size={150} className="text-red-600 drop-shadow-md" fill="currentColor" />
            <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg flex items-center gap-2">
              <Activity className="text-green-500" />
              <span className="font-bold text-gray-700">Urgent Requests</span>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-lg flex items-center gap-2">
              <ShieldCheck className="text-blue-500" />
              <span className="font-bold text-gray-700">Verified Donors</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}