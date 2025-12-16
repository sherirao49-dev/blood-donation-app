import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar"; 
import AiBot from "./components/AiBot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat"; // IMPORT CHAT

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" />
        
        <Navbar /> 
        <AiBot /> 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat/:roomId" element={<Chat />} /> {/* NEW ROUTE */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;