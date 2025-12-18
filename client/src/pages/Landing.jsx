import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: Text & Buttons */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 relative">
        {/* Logo */}
        <div className="absolute top-8 left-12 flex items-center gap-2">
          <div className="bg-red-600 text-white p-2 rounded-full">
            <Heart size={20} fill="white" />
          </div>
          <span className="text-2xl font-bold text-gray-800">LifeFlow</span>
        </div>

        <div className="max-w-lg">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Give Blood, <br />
            <span className="text-red-600">Share Life.</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Become a donor and be a hero in someone's story. 
            Join our community today and help save lives with just one click.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-red-600 text-white text-lg font-bold rounded-full hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center justify-center gap-2"
            >
              Login <ArrowRight size={20} />
            </Link>
            
            <Link 
              to="/register" 
              className="px-8 py-4 bg-white text-red-600 border-2 border-red-100 text-lg font-bold rounded-full hover:bg-red-50 transition flex items-center justify-center"
            >
              Register
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <p className="absolute bottom-8 left-12 text-sm text-gray-400">
          © 2025 LifeFlow Inc.
        </p>
      </div>

      {/* RIGHT SIDE: High Quality "Hope" Image */}
      <div className="hidden md:block w-1/2 bg-red-50 relative overflow-hidden">
        <img 
          // ✅ This image shows hands holding a heart (Unity & Hope)
          src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2670&auto=format&fit=crop" 
          alt="Community giving hope" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Soft overlay to blend it nicely */}
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 to-transparent"></div>
      </div>

    </div>
  );
}