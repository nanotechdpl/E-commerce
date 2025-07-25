import { Circle, Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useChatContext } from "../hooks/useChatContext";
import { useSelector } from "react-redux";
import { ChatAction } from "./actions/ChatAction";
import { CallAction } from "./actions/CallAction";
import { RootState } from "@/redux/store/store";
import { TMessage, TBackendMessage } from "../types";

const SOCKET_URL = "http://localhost:7000";

export const MainChatArea = () => {
  const { selectedUser } = useChatContext();
  console.log("🚀 ~ MainChatArea ~ selectedUser:", selectedUser);
  const authStore = useSelector((state: RootState) => state.auth.user);
  console.log("🚀 ~ MainChatArea ~ authStore:", authStore);
  
  // Try to get userId from multiple sources
  const userId = authStore?.id || localStorage.getItem("userId") || "";
  console.log("🚀 ~ MainChatArea ~ userId:", userId);

  const [page, setPage] = useState(1);

  const socket = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [input, setInput] = useState("");

  // Auto scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const fetchMessage = useCallback(async () => {
    if (!userId || !selectedUser?.senderId) {
      console.log("Missing userId or selectedUser.senderId:", { userId, senderId: selectedUser?.senderId });
      return;
    }
    
    // Additional check to ensure userId is not empty string
    if (userId.trim() === "") {
      console.log("userId is empty string, skipping API call");
      return;
    }
    try {
      const response = await fetch(
        `${SOCKET_URL}/api/v1/messages/get?sender=${userId}&receiver=${selectedUser.senderId}`
      );
      const data = await response.json();
      console.log("Messages response:", data);
      
      // The backend returns { success: true, messages: [...] }
      // We need to extract the messages array and transform the data structure
      const backendMessages: TBackendMessage[] = data.messages || [];
      
      // Transform backend message format to frontend format
      const transformedMessages: TMessage[] = backendMessages.map((msg: TBackendMessage) => ({
        senderId: msg.sender || msg.visitorId || 'unknown',
        senderName: msg.sender ? 'User' : 'Visitor', // We'll need to fetch actual user names
        receiverId: msg.receiver,
        receiverName: 'Admin', // We'll need to fetch actual receiver names
        content: msg.message,
        conversationId: `conv_${msg.sender || msg.visitorId}_${msg.receiver}`,
        serviceType: 'live-chat',
        file: msg.file ? { document: msg.file } : undefined,
        createdAt: msg.createdAt,
        updatedAt: msg.createdAt
      }));
      
      setMessages(transformedMessages);
    } catch (error) {
      console.error("Error fetching messages:", (error as Error).message);
    }
  }, [
    userId,
    selectedUser?.senderId,
    selectedUser?.serviceType,
    selectedUser?.conversationId,
  ]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  useEffect(() => {
    socket.current = io(SOCKET_URL);

    socket.current.emit("register", userId);

    socket.current.on("private_message", (msg: TMessage) => {
      setMessages((prev) => [...prev, { ...msg, createdAt: new Date() }]);
    });

    // socket.current.on("presence", (users: string[]) => setOnlineUsers(users));

    return () => {
      socket.current?.disconnect();
    };
  }, [userId]);

  const sendMessage = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || !selectedUser) return;

    const msg: TMessage = {
      senderId: userId,
      receiverId: selectedUser.senderId!,
      content: input,
      createdAt: new Date(),
      senderName: authStore?.name || "",
      conversationId: selectedUser.conversationId!,
      serviceType: selectedUser.serviceType!,
    };
    console.log("🚀 ~ sendMessage ~ msg:", msg);

    try {
      // Send message to backend API
      const response = await fetch(`${SOCKET_URL}/api/v1/messages/send/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: userId,
          receiver: selectedUser.senderId,
          message: input
        }),
      });

      if (response.ok) {
        // Also emit via socket for real-time updates
        socket.current?.emit("private_message", msg);
        setMessages((prev) => [...prev, msg]);
        setInput("");
      } else {
        console.error("Failed to send message to backend");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
            U{selectedUser?.senderName}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {selectedUser?.senderName}
            </h2>
            <p className="text-sm text-green-600 flex items-center">
              <Circle className="w-2 h-2 fill-current mr-1" />
              Online
            </p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
          <CallAction />
          <ChatAction />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId == userId;
          return (
            <div
              key={index}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-0.5 rounded-md ${
                  isOwnMessage
                    ? "bg-blue-100  rounded-br-md text-right"
                    : "bg-white text-gray-800 text-start rounded-bl-md shadow-sm border border-gray-100"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    isOwnMessage ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {message.createdAt ? formatTime(message.createdAt) : "Now"}
                </p>
              </div>
            </div>
          );
        })}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input || ""}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage(e)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// import { Circle, Send } from "lucide-react";
// import React, { useCallback, useEffect, useRef, useState } from "react";
// import io, { Socket } from "socket.io-client";
// import { useChatContext } from "../hooks/useChatContext";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../../../redux/store";

// const SOCKET_URL = "http://localhost:8000";

// export type Message = {
//   id?: number;
//   sender_id: number;
//   receiver_id: number;
//   content: string;
//   timestamp: Date;
// };

// export const MainChatArea = () => {
//   const { receiverId } = useChatContext();
//   const { id: userId } = useSelector((state: RootState) => state.auth);

//   const socket = useRef<Socket | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");

//   const fetchMessage = useCallback(async () => {
//     if (!userId || !receiverId) return;
//     const response = await fetch(
//       `${SOCKET_URL}/api/messages?senderId=${userId}&receiverId=${receiverId}`
//     );
//     const data = await response.json();

//     setMessages(data);
//   }, [userId, receiverId]);

//   useEffect(() => {
//     fetchMessage();
//   }, [userId, receiverId, fetchMessage]);

//   useEffect(() => {
//     socket.current = io(SOCKET_URL);

//     socket.current.emit("register", userId);

//     socket.current.on("private_message", (msg: Message) => {
//       setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
//     });

//     // socket.current.on("presence", (users: string[]) => setOnlineUsers(users));

//     return () => {
//       socket.current?.disconnect();
//     };
//   }, [userId]);

//   const sendMessage = (e: React.FormEvent) => {
//     if (e) e.preventDefault();
//     if (!input.trim()) return;

//     const msg: Message = {
//       sender_id: Number(userId),
//       receiver_id: receiverId!,
//       content: input,
//       timestamp: new Date(),
//     };

//     socket.current?.emit("private_message", msg);
//     setMessages((prev) => [...prev, msg]);
//     setInput("");
//   };

//   const formatTime = (timestamp: Date) => {
//     return new Date(timestamp).toLocaleTimeString([], {
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="flex-1 flex flex-col">
//       {/* Chat Header */}
//       <div className="bg-white border-b border-gray-200 p-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
//             U{receiverId}
//           </div>
//           <div>
//             <h2 className="font-semibold text-gray-900">User {receiverId}</h2>
//             <p className="text-sm text-green-600 flex items-center">
//               <Circle className="w-2 h-2 fill-current mr-1" />
//               Online
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Messages Area */}
//       <div className="flex-1 max-h-[90vh] overflow-y-auto p-4 space-y-4 bg-gray-50">
//         {messages.map((message, index) => {
//           const isOwnMessage = message.sender_id == userId;
//           // const isReciverMessage = message.receiver_id == receiverId;

//           return (
//             <div
//               key={index}
//               className={`flex ${
//                 isOwnMessage ? "justify-end" : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-md ${
//                   isOwnMessage
//                     ? "bg-blue-100  rounded-br-md text-right"
//                     : "bg-white text-gray-800 text-start rounded-bl-md shadow-sm border border-gray-100"
//                 }`}
//               >
//                 <p className="text-sm leading-relaxed">{message.content}</p>
//                 <p
//                   className={`text-xs mt-1 ${
//                     isOwnMessage ? "text-blue-100" : "text-gray-500"
//                   }`}
//                 >
//                   {message.timestamp ? formatTime(message.timestamp) : "Now"}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Message Input */}
//       <div className="bg-white border-t border-gray-200 p-4">
//         <div className="flex space-x-3">
//           <div className="flex-1 relative">
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && sendMessage(e)}
//               placeholder="Type your message..."
//               className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//             />
//           </div>
//           <button
//             onClick={sendMessage}
//             disabled={!input.trim()}
//             className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             <Send className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
