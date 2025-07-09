import React, { useEffect, useState } from 'react';
import { useSocket } from './SocketContext';

const ADMIN_ID = '2';
const ADMIN_NAME = 'Admin';
const ADMIN_ROLE = 'admin';

const AdminPanel: React.FC = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  // Fetch all messages for the room on mount
  useEffect(() => {
    fetch('http://localhost:3006/api/chat/messages/demo-room')
      .then(res => res.json())
      .then(data => {
        // Handle different response structures
        if (data.success && data.data && Array.isArray(data.data.messages)) {
          setMessages(data.data.messages);
        } else if (Array.isArray(data)) {
          setMessages(data); // fallback for old API
        } else {
          setMessages([]);
        }
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
        setMessages([]);
      });
  }, []);

  // Listen for new messages in real time
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg: any) => {
      setMessages(prev => [...prev, msg]);
    };
    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;
    const msgData = {
      room_id: 'demo-room',
      sender_id: ADMIN_ID,
      sender_name: ADMIN_NAME,
      message: input,
      sender_role: ADMIN_ROLE,
    };
    socket.emit('send-message', msgData);
    setInput('');
  };

  return (
    <div>
      <h2>Admin Panel - All Messages in demo-room</h2>
      <div style={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', marginBottom: 8 }}>
        {(!messages || messages.length === 0) && <div>No messages found.</div>}
        {Array.isArray(messages) && messages.map((msg, idx) => (
          <div key={msg._id || idx}>
            <b>{msg.sender_name}:</b> {msg.message} <span style={{ color: '#888', fontSize: '0.8em' }}>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</span>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') handleSend();
        }}
        placeholder="Type a reply..."
        style={{ width: '80%' }}
      />
      <button onClick={handleSend} style={{ width: '18%' }}>Send</button>
    </div>
  );
};

export default AdminPanel; 