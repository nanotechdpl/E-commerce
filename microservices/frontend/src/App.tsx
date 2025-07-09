import React, { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ChatWindow from './components/ChatWindow'
import { SocketProvider } from './components/SocketContext'
import AdminPanel from './components/AdminPanel'
import EnhancedAdminPanel from './components/EnhancedAdminPanel'
import TopicSelection from './components/TopicSelection'

// Mock user data for demo/testing
const mockUser = {
  id: '1',
  name: 'Demo User',
  role: 'user',
}

function App() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const handleTopicSelected = (roomId: string, topicName: string) => {
    setSelectedRoom(roomId);
    setSelectedTopic(topicName);
  };

  return (
    <SocketProvider userId={mockUser.id} userName={mockUser.name} role={mockUser.role}>
      <nav className="bg-gray-800 text-white p-4">
        <div className="max-w-6xl mx-auto flex space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/chat" className="hover:text-gray-300">Chat</Link>
          <Link to="/admin" className="hover:text-gray-300">Admin Panel</Link>
          <Link to="/enhanced-admin" className="hover:text-gray-300">Enhanced Admin</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={
          selectedRoom ? (
            <ChatWindow roomId={selectedRoom} topicName={selectedTopic} />
          ) : (
            <TopicSelection 
              onTopicSelected={handleTopicSelected}
              userId={mockUser.id}
              userName={mockUser.name}
              userType="user"
            />
          )
        } />
        <Route path="/chat" element={<ChatWindow />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/enhanced-admin" element={<EnhancedAdminPanel />} />
        <Route path="*" element={<div>Welcome! Choose Chat or Admin Panel.</div>} />
      </Routes>
    </SocketProvider>
  )
}

export default App
