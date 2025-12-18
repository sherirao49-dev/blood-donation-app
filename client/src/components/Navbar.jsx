import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Droplet, LogOut, User, Settings, MessageCircle } from "lucide-react"; // Added Settings Icon

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-4xl z-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-lg rounded-full px-8 py-4 flex justify-between items-center border border-white/20">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-red-500 p-2 rounded-full group-hover:scale-110 transition-transform">
            <Droplet className="text-white fill-current" size={20} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">
            LifeFlow
          </span>
        </Link>

        {/* Links Section */}
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/" className="text-gray-600 hover:text-red-500 font-medium transition">Dashboard</Link>
              
              {/* Settings Icon */}
              <Link to="/settings" className="p-2 hover:bg-gray-100 rounded-full transition text-gray-600" title="Settings">
                <Settings size={20} />
              </Link>

              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800">{user.name}</p>
                  <p className="text-xs text-red-500 font-semibold">{user.bloodType}</p>
                </div>
                <button onClick={handleLogout} className="bg-red-100 p-2 rounded-full hover:bg-red-200 text-red-600 transition">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="text-gray-600 hover:text-red-600 font-semibold transition">Login</Link>
              <Link to="/register" className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5">
                Donate Now
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}