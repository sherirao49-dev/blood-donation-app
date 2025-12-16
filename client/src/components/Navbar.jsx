import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Heart } from "lucide-react"; // Icon

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-red-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <Heart fill="white" /> LifeFlow
        </Link>

        {/* Links */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="font-semibold">Hi, {user.name}</span>
              <button 
                onClick={logout} 
                className="bg-white text-red-600 px-4 py-1 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-white text-red-600 px-4 py-1 rounded hover:bg-gray-100 transition">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}