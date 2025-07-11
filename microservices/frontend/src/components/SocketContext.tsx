import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

// Use ReturnType<typeof io> for the socket type
export type SocketType = ReturnType<typeof io>;

// Define the context type
interface SocketContextType {
  socket: SocketType | null;
}

const SocketContext = createContext<SocketContextType>({ socket: null });

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
  userId: string;
  role: string;
  userName: string;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children, userId, role, userName }) => {
  const socketRef = useRef<SocketType | null>(null);
  const [currentSocket, setCurrentSocket] = useState<SocketType | null>(null);

  useEffect(() => {
    console.log('Connecting socket with', { userId, role, userName });
    socketRef.current = io('http://localhost:3006', {
      transports: ['polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      query: { user_id: userId, role },
    });
    setCurrentSocket(socketRef.current);
    socketRef.current.on("connect_error", (err: any) => {
      console.log("Connection error:", err.message);
    });
    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });
    socketRef.current.on("connect_timeout", () => {
      console.log("Connection timeout");
    });
    // Emit user-online event
    socketRef.current.emit('user-online', { user_id: userId, user_name: userName, role });
    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, role, userName]);

  // Expose socket for manual inspection
  if (typeof window !== 'undefined' && currentSocket) {
    window.socket = currentSocket;
  }

  return (
    <SocketContext.Provider value={{ socket: currentSocket }}>
      {children}
    </SocketContext.Provider>
  );
}; 