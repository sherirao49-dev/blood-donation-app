import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; // ✅ Import Socket.io

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]); // ✅ New: Track who is online
  const [socket, setSocket] = useState(null); // ✅ New: Store the socket connection
  
  const navigate = useNavigate();

  // 1. Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/user", {
            headers: { "x-auth-token": token },
          });
          const data = await res.json();
          if (res.ok) setUser(data);
          else localStorage.removeItem("token");
        } catch (err) {
          console.error("Auth check failed", err);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // ✅ NEW: Socket.io Connection Logic
  useEffect(() => {
    if (user) {
      // Connect to server when user logs in
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

      // Tell server: "I am here!"
      newSocket.emit("add_user", user.id);

      // Listen for list of online users
      newSocket.on("get_users", (users) => {
        setOnlineUsers(users);
      });

      // Cleanup when user logs out
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]); // Runs whenever 'user' changes (login/logout)

  // 2. Login Function
  const login = async (email, password) => {
    try {
      console.log("Attempting login...");
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/"); 
    } catch (err) {
      console.error("Login Error:", err);
      alert("Cannot connect to server. Is the backend running?");
    }
  };

  const register = async (name, email, password, bloodType) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, bloodType }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        alert(data.msg || "Registration failed");
        return;
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      console.error("Register Error:", err);
      alert("Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    // ✅ Share 'onlineUsers' and 'socket' with the rest of the app
    <AuthContext.Provider value={{ user, login, register, logout, loading, onlineUsers, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;