import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import AuthContext from "../context/AuthContext";
import { Send, User, Check, CheckCheck } from "lucide-react"; // Import Check Icons

const socket = io.connect("http://localhost:5000");

export default function Chat() {
  const { user } = useContext(AuthContext);
  const { roomId } = useParams();
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineCount, setOnlineCount] = useState(1);

  useEffect(() => {
    socket.emit("join_room", roomId);

    // 1. Receive Message
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
      
      // If I receive a message, implies I saw it (since I'm on the page)
      // So, I send a "Seen" signal back to the sender
      socket.emit("message_seen", { room: roomId });
    });

    // 2. Mark Messages as Seen (Blue Ticks)
    socket.on("message_marked_seen", () => {
      setMessageList((list) => 
        list.map((msg) => ({ ...msg, status: "seen" }))
      );
    });

    socket.on("display_typing", () => setIsTyping(true));
    socket.on("hide_typing", () => setIsTyping(false));
    socket.on("room_users", (count) => setOnlineCount(count));

    return () => {
      socket.off("receive_message");
      socket.off("message_marked_seen");
      socket.off("display_typing");
      socket.off("hide_typing");
      socket.off("room_users");
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: roomId,
        author: user.name,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent", // Default status
      };

      await socket.emit("send_message", messageData);
      socket.emit("stop_typing", roomId);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
    if (e.target.value.length > 0) socket.emit("typing", roomId);
    else socket.emit("stop_typing", roomId);
  };

  return (
    <div className="flex flex-col h-[90vh] max-w-2xl mx-auto bg-gray-100 p-4">
      <div className="bg-white p-4 rounded-t-xl shadow-sm border-b flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-full relative">
          <User className="text-red-600" />
          {onlineCount > 1 && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400"></span>}
        </div>
        <div>
          <h2 className="font-bold text-gray-800">Live Chat</h2>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            {onlineCount > 1 ? <span className="text-green-600 font-bold">Online</span> : "Waiting for user..."}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white p-4 space-y-4 shadow-inner">
        {messageList.map((msg, index) => (
            <div key={index} className={`flex ${msg.author === user.name ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] p-3 rounded-xl text-sm ${msg.author === user.name ? "bg-red-600 text-white rounded-tr-none" : "bg-gray-200 text-gray-800 rounded-tl-none"}`}>
                    <p className="font-bold text-xs mb-1 opacity-70">{msg.author}</p>
                    <p>{msg.message}</p>
                    <div className="text-[10px] text-right mt-1 opacity-70 flex justify-end items-center gap-1">
                      {msg.time}
                      {/* LOGIC: Show Status Icons */}
                      {msg.author === user.name && (
                        msg.status === "seen" ? 
                          <CheckCheck size={14} className="text-blue-300" /> : // Seen (Blue Double Tick)
                          <Check size={14} className="text-white" />           // Sent (White Single Tick)
                      )}
                    </div>
                </div>
            </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none text-gray-500 text-xs italic flex items-center gap-1">
              <span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span> typing...
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-3 rounded-b-xl shadow-md flex gap-2 border-t">
        <input type="text" value={currentMessage} placeholder="Type a message..." className="flex-1 border p-2 rounded-full focus:outline-none focus:border-red-500 transition px-4" onChange={handleInputChange} onKeyPress={(e) => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition"><Send size={20} /></button>
      </div>
    </div>
  );
}