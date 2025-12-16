import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // NOTE: This assumes your backend is running on port 5000
  const API_URL = "http://localhost:5000/api/auth"; 

  useEffect(() => {
    // Check if user is already logged in (Token in storage)
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // REGISTER Function
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/register`, userData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("Registration Successful! 🎉");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
      return false;
    }
  };

  // LOGIN Function
  const login = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/login`, userData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      toast.success("Welcome back! 👋");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
      return false;
    }
  };

  // LOGOUT Function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;