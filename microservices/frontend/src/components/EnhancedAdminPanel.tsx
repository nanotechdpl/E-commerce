import React, { useEffect, useState, useRef } from 'react';
import { useSocket, SocketProvider } from './SocketContext';
import FileUpload from './FileUpload';
import VoiceRecorder from './VoiceRecorder';

interface User {
  user_id: number;
  user_name: string;
  user_type: 'user' | 'agency' | 'admin' | 'sub-admin';
  is_authorized: boolean;
  profile_photo?: string;
  agency_logo?: string;
  is_online: boolean;
  last_seen: string;
  assigned_admin?: {
    admin_id: number;
    admin_name: string;
    assigned_at: string;
  };
}

interface PredefinedMessage {
  _id: string;
  title: string;
  message: string;
  category: string;
  usage_count: number;
  last_used?: string;
}

interface ChatRequest {
  room_id: string;
  user_id: number;
  user_name: string;
  user_type: string;
  topic_name: string;
  timestamp: string;
}

const ADMIN_ID = '2';
const ADMIN_NAME = 'Admin';
const ADMIN_ROLE = 'admin';

const USER_ID = '2'; // Use actual user id
const ROLE = 'admin';

const EnhancedAdminPanelContent: React.FC = () => {
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState<'requests' | 'users' | 'messages' | 'topics'>('requests');
  const [users, setUsers] = useState<User[]>([]);
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [predefinedMessages, setPredefinedMessages] = useState<PredefinedMessage[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [callAllowed, setCallAllowed] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [ringing, setRinging] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const [callError, setCallError] = useState('');
  const [incomingOffer, setIncomingOffer] = useState<{ offer: RTCSessionDescriptionInit, from: string } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const localStreamRef = useRef<MediaStream | null>(null);

  const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    if (!socket) return;

    // Socket event listeners
    const handleNewChatRequest = (request: ChatRequest) => {
      setChatRequests(prev => [request, ...prev]);
    };

    const handleUserProfileUpdated = (data: { user_id: number; profile: User }) => {
      setUsers(prev => prev.map(user => 
        user.user_id === data.user_id ? data.profile : user
      ));
    };

    const handleUserAssignedToAdmin = (data: any) => {
      // Update user assignment
      setUsers(prev => prev.map(user => 
        user.user_id === data.user_id 
          ? { ...user, assigned_admin: { admin_id: data.admin_id, admin_name: data.admin_name, assigned_at: data.timestamp } }
          : user
      ));
    };

    const handleNewMessage = (msg: any) => {
      setMessages(prev => [...prev, msg]);
    };

    const handleUserBlocked = (data: any) => {
      console.log('User blocked:', data);
      // Update UI to show blocked status
    };

    const handleUserUnblocked = (data: any) => {
      console.log('User unblocked:', data);
      // Update UI to show unblocked status
    };

    const handlePermissionChanged = (data: any) => {
      console.log('Permission changed:', data);
      // Update UI to show permission changes
    };

    const handleMessageForwarded = (data: any) => {
      console.log('Message forwarded:', data);
      alert('Message forwarded successfully!');
    };

    socket.on('new_chat_request', handleNewChatRequest);
    socket.on('user_profile_updated', handleUserProfileUpdated);
    socket.on('user_assigned_to_admin', handleUserAssignedToAdmin);
    socket.on('new-message', handleNewMessage);
    socket.on('user_blocked', handleUserBlocked);
    socket.on('user_unblocked', handleUserUnblocked);
    socket.on('message_permission_changed', handlePermissionChanged);
    socket.on('call_permission_changed', handlePermissionChanged);
    socket.on('message_forwarded', handleMessageForwarded);

    return () => {
      socket.off('new_chat_request', handleNewChatRequest);
      socket.off('user_profile_updated', handleUserProfileUpdated);
      socket.off('user_assigned_to_admin', handleUserAssignedToAdmin);
      socket.off('new-message', handleNewMessage);
      socket.off('user_blocked', handleUserBlocked);
      socket.off('user_unblocked', handleUserUnblocked);
      socket.off('message_permission_changed', handlePermissionChanged);
      socket.off('call_permission_changed', handlePermissionChanged);
      socket.off('message_forwarded', handleMessageForwarded);
    };
  }, [socket]);

  useEffect(() => {
    fetchUsers();
    fetchPredefinedMessages();
  }, []);

  useEffect(() => {
    if (!socket || !selectedRoom) return;
    socket.emit('join-room', { room: selectedRoom, user_id: USER_ID, role: ROLE });
    socket.on('ready', () => setReady(true));
    socket.on('signal', async (data: any) => {
      if (data.type === 'ready') {
        setReady(true);
      } else if (data.type === 'offer') {
        await setupPeer(false);
        await peerRef.current!.setRemoteDescription(new RTCSessionDescription(data.sdp));
        const answer = await peerRef.current!.createAnswer();
        await peerRef.current!.setLocalDescription(answer);
        socket.emit('signal', { type: 'answer', sdp: answer, room_id: selectedRoom });
        setRinging(false);
        setInCall(true);
      } else if (data.type === 'answer') {
        await peerRef.current!.setRemoteDescription(new RTCSessionDescription(data.sdp));
        setInCall(true);
      } else if (data.type === 'candidate') {
        await peerRef.current!.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else if (data.type === 'error') {
        setCallError(data.reason);
        endCall();
      }
    });
    return () => {
      socket.off('ready');
      socket.off('signal');
    };
  }, [socket, selectedRoom]);

  useEffect(() => {
    if (!selectedRoom) return;
    fetch(`http://localhost:3006/api/chat/messages/${selectedRoom}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && Array.isArray(data.data.messages)) {
          setMessages(data.data.messages);
        } else if (Array.isArray(data)) {
          setMessages(data); // fallback for old API
        } else {
          setMessages([]);
        }
      });
  }, [selectedRoom]);

  // Check if call is allowed (ask backend)
  useEffect(() => {
    if (!socket || !selectedRoom) return;
    console.log('Emitting call-initiate', { room_id: selectedRoom, from: ADMIN_ID, to: null, from_role: 'admin', checkOnly: true });
    socket.emit('call-initiate', { room_id: selectedRoom, from: ADMIN_ID, to: null, from_role: 'admin', checkOnly: true });
    const handleDenied = (data: any) => setCallAllowed(false);
    const handleAllowed = () => setCallAllowed(true);
    socket.on('call-initiate-denied', handleDenied);
    socket.on('call-initiate', handleAllowed);
    return () => {
      socket.off('call-initiate-denied', handleDenied);
      socket.off('call-initiate', handleAllowed);
    };
  }, [socket, selectedRoom, messages]);

  // Start call as caller
  const handleCallClick = async () => {
    if (!socket || !selectedRoom) return;
    console.log('Call button clicked');
    setCallLoading(true);
    setIsCaller(true);
    socket.emit('call-initiate', { room_id: selectedRoom, from: ADMIN_ID, to: null, from_role: 'admin' });
  };

  // Listen for call-initiate (as callee or as confirmation for caller)
  useEffect(() => {
    if (!socket || !selectedRoom) return;
    const handleIncomingCall = (payload: any) => {
      if (!payload || !payload.from) return;
      const { from } = payload;
      if (from !== ADMIN_ID) {
        setRinging(true);
        setIncomingOffer({ offer: { type: 'offer', sdp: '' }, from });
      }
      // Do NOT call startCall() here; only call it when admin clicks Accept
    };
    socket.on('call-initiate', handleIncomingCall);
    return () => {
      socket.off('call-initiate', handleIncomingCall);
    };
  }, [socket, selectedRoom]);

  const startCall = async () => {
    setRinging(true);
    await setupPeer(true);
    const offer = await peerRef.current!.createOffer();
    await peerRef.current!.setLocalDescription(offer);
    socket.emit('signal', { type: 'offer', sdp: offer, room_id: selectedRoom });
  };

  const setupPeer = async (isCaller: boolean) => {
    if (!socket || !localStreamRef.current) return;
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
    peerRef.current = new RTCPeerConnection(rtcConfig);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        if (peerRef.current) {
          peerRef.current.addTrack(track, localStreamRef.current as MediaStream);
        }
      });
    }
    peerRef.current.ontrack = (e) => {
      if (remoteAudioRef.current && e.streams[0]) {
        remoteAudioRef.current.srcObject = e.streams[0];
      }
    };
    peerRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        if (socket) {
          console.log('Emitting signal', { type: 'candidate', candidate: e.candidate, room_id: selectedRoom });
          socket.emit('signal', { type: 'candidate', candidate: e.candidate, room_id: selectedRoom });
        }
      }
    };
    if (isCaller && peerRef.current && localStreamRef.current) {
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      socket.emit('signal', { type: 'offer', sdp: offer, room_id: selectedRoom });
    }
  };

  const endCall = () => {
    if (peerRef.current) peerRef.current.close();
    peerRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    setInCall(false);
    setRinging(false);
    setCallError('');
    setIsMuted(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3006/api/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchPredefinedMessages = async () => {
    try {
      const response = await fetch(`http://localhost:3006/api/predefined-messages/admin/${ADMIN_ID}`);
      const data = await response.json();
      if (data.success) {
        setPredefinedMessages(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch predefined messages:', error);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || !socket || !selectedRoom) return;

    const msgData = {
      room_id: selectedRoom,
      sender_id: parseInt(ADMIN_ID),
      sender_name: ADMIN_NAME,
      message: input,
      sender_role: 'admin',
      message_type: 'text',
      recipient_id: selectedUser?.user_id || null
    };

    socket?.emit('send-message', msgData);
    setInput('');
  };

  const handleUsePredefinedMessage = (message: PredefinedMessage) => {
    if (!socket || !selectedRoom) return;

    socket.emit('use_predefined_message', {
      room_id: selectedRoom,
      admin_id: ADMIN_ID,
      message_id: message._id
    });
  };

  const handleBlockUser = (userId: number, blockType: 'message' | 'call' | 'all') => {
    if (!socket || !selectedRoom) return;

    const reason = prompt('Enter reason for blocking (optional):');
    socket.emit('block_user', {
      room_id: selectedRoom,
      user_id: userId,
      block_type: blockType,
      admin_id: ADMIN_ID,
      reason: reason || 'Admin action'
    });
  };

  const handleUnblockUser = (userId: number) => {
    if (!socket || !selectedRoom) return;

    socket.emit('unblock_user', {
      room_id: selectedRoom,
      user_id: userId
    });
  };

  const handleToggleMessage = (userId: number, isEnabled: boolean) => {
    if (!socket || !selectedRoom) return;

    const reason = prompt(`Enter reason for ${isEnabled ? 'enabling' : 'disabling'} messaging (optional):`);
    socket.emit('toggle_message', {
      room_id: selectedRoom,
      user_id: userId,
      toggled_by: ADMIN_ID,
      is_enabled: isEnabled,
      reason: reason || 'Admin action'
    });
  };

  const handleToggleCall = (userId: number, isEnabled: boolean) => {
    if (!socket || !selectedRoom) return;

    const reason = prompt(`Enter reason for ${isEnabled ? 'enabling' : 'disabling'} calling (optional):`);
    socket.emit('toggle_call', {
      room_id: selectedRoom,
      user_id: userId,
      toggled_by: ADMIN_ID,
      is_enabled: isEnabled,
      reason: reason || 'Admin action'
    });
  };

  const handleAssignToAdmin = (userId: number) => {
    if (!socket) return;

    socket.emit('admin_first_reply', {
      room_id: selectedRoom,
      admin_id: ADMIN_ID,
      admin_name: ADMIN_NAME,
      user_id: userId
    });
  };

  const handleForwardMessage = (messageId: string) => {
    if (!socket) return;

    const toAdminId = prompt('Enter admin ID to forward to:');
    if (!toAdminId) return;

    socket.emit('forward_message', {
      message_id: messageId,
      to_admin_id: toAdminId,
      from_admin_id: ADMIN_ID,
      room_id: selectedRoom
    });
  };

  const handleAuthorizeUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3006/api/users/authorize/${userId}`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to authorize user:', error);
    }
  };

  // Add a helper to join the room via REST API before socket join
  const joinRoomAsAdmin = async (roomId: string) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3006/api/chat/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: ADMIN_ID, user_name: ADMIN_NAME })
      });
    } catch (err) {
      console.error('Failed to join room as admin:', err);
    } finally {
      setLoading(false);
    }
  };

  // Accept incoming call (admin as callee)
  const handleAcceptCall = async () => {
    setRinging(false);
    if (incomingOffer && incomingOffer.offer && peerRef.current) {
      await setupPeer(false);
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(incomingOffer.offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      if (socket && selectedRoom) {
        socket.emit('signal', { type: 'answer', sdp: answer, room_id: selectedRoom });
      }
      setInCall(true);
    } else {
      await startCall(); // fallback for admin-initiated call
    }
  };

  const renderMessageContent = (msg: any) => {
    // Handle voice messages
    if (msg.message_type === 'voice' && msg.file_url) {
      const fullFileUrl = msg.file_url.startsWith('http') ? msg.file_url : `http://localhost:3006${msg.file_url}`;
      return (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </div>
          <audio 
            controls 
            src={fullFileUrl}
            className="flex-1"
            preload="metadata"
          />
          <span className="text-xs text-gray-500">Voice Message</span>
        </div>
      );
    }

    // Handle file messages
    if (msg.message_type === 'file' && msg.file_url) {
      const fileName = msg.file_name || '';
      const fullFileUrl = msg.file_url.startsWith('http') ? msg.file_url : `http://localhost:3006${msg.file_url}`;
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
      const isPdf = /\.pdf$/i.test(fileName);
      const isAudio = /\.(mp3|wav)$/i.test(fileName);
      const isVideo = /\.(mp4|mpeg)$/i.test(fileName);
      const isText = /\.txt$/i.test(fileName);

      if (isImage) {
        return (
          <a href={fullFileUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={fullFileUrl}
              alt={fileName}
              className="max-w-[200px] max-h-[200px] rounded-lg border mt-1"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </a>
        );
      }
      if (isPdf) {
        return (
          <a href={fullFileUrl} target="_blank" rel="noopener noreferrer">
            <embed src={fullFileUrl} type="application/pdf" width="200px" height="200px" />
            <div className="text-blue-600 underline">{fileName}</div>
          </a>
        );
      }
      if (isAudio) {
        return (
          <div>
            <audio controls src={fullFileUrl} />
            <div className="text-blue-600 underline">{fileName}</div>
          </div>
        );
      }
      if (isVideo) {
        return (
          <div>
            <video controls width="200" src={fullFileUrl} />
            <div className="text-blue-600 underline">{fileName}</div>
          </div>
        );
      }
      if (isText) {
        return (
          <a href={fullFileUrl} target="_blank" rel="noopener noreferrer">
            <iframe src={fullFileUrl} width="200" height="100" title={fileName} />
            <div className="text-blue-600 underline">{fileName}</div>
          </a>
        );
      }
      // For office docs and other files, show a download link
      return (
        <a href={fullFileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          <span role="img" aria-label="file">📄</span> {fileName}
        </a>
      );
    }
    return msg.message;
  };

  const renderUserProfile = (user: User) => (
    <div className="flex items-center space-x-3 p-3 border rounded-lg">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
        {user.is_authorized ? (
          user.profile_photo ? (
            <img src={user.profile_photo} alt={user.user_name} className="w-12 h-12 rounded-full" />
          ) : user.agency_logo ? (
            <img src={user.agency_logo} alt={user.user_name} className="w-12 h-12 rounded-full" />
          ) : (
            <span className="text-gray-600 font-semibold">
              {user.user_name.charAt(0).toUpperCase()}
            </span>
          )
        ) : (
          <span className="text-gray-600 font-semibold">?</span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">
            {user.is_authorized ? user.user_name : `Topic: ${user.user_name}`}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            user.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {user.is_online ? 'Online' : 'Offline'}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            user.is_authorized ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {user.is_authorized ? 'Authorized' : 'Unauthorized'}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Type: {user.user_type} • Last seen: {new Date(user.last_seen).toLocaleString()}
        </p>
        {user.assigned_admin && (
          <p className="text-sm text-green-600">
            Assigned to: {user.assigned_admin.admin_name}
          </p>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-2">
          {!user.is_authorized && (
            <button
              onClick={() => handleAuthorizeUser(user.user_id)}
              className="bg-green-500 text-white px-2 py-1 text-xs rounded hover:bg-green-600"
            >
              Authorize
            </button>
          )}
          
          <button
            onClick={() => handleBlockUser(user.user_id, 'message')}
            className="bg-red-500 text-white px-2 py-1 text-xs rounded hover:bg-red-600"
          >
            Block Messages
          </button>
          
          <button
            onClick={() => handleBlockUser(user.user_id, 'call')}
            className="bg-orange-500 text-white px-2 py-1 text-xs rounded hover:bg-orange-600"
          >
            Block Calls
          </button>
          
          <button
            onClick={() => handleToggleMessage(user.user_id, false)}
            className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600"
          >
            Disable Messages
          </button>
          
          <button
            onClick={() => handleToggleCall(user.user_id, false)}
            className="bg-purple-500 text-white px-2 py-1 text-xs rounded hover:bg-purple-600"
          >
            Disable Calls
          </button>
          
          <button
            onClick={() => handleAssignToAdmin(user.user_id)}
            className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600"
          >
            Assign to Me
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col">
          <button
            onClick={() => setActiveTab('requests')}
            className={`p-4 text-left border-b ${
              activeTab === 'requests' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>Chat Requests</span>
              {chatRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {chatRequests.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`p-4 text-left border-b ${
              activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`p-4 text-left border-b ${
              activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            Predefined Messages
          </button>
          <button
            onClick={() => setActiveTab('topics')}
            className={`p-4 text-left border-b ${
              activeTab === 'topics' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
          >
            Topics
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Requests Tab */}
        {activeTab === 'requests' && (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Chat Requests</h2>
            <div className="space-y-4">
              {chatRequests.map((request) => (
                <div key={request.room_id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{request.user_name}</h3>
                      <p className="text-sm text-gray-600">
                        Topic: {request.topic_name} • Type: {request.user_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await joinRoomAsAdmin(request.room_id);
                        setSelectedRoom(request.room_id);
                        setSelectedUser({
                          user_id: request.user_id,
                          user_name: request.user_name,
                          user_type: request.user_type as any,
                          is_authorized: false,
                          is_online: true,
                          last_seen: request.timestamp
                        });
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Join Chat
                    </button>
                  </div>
                </div>
              ))}
              {chatRequests.length === 0 && (
                <p className="text-gray-500 text-center py-8">No pending chat requests</p>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Users</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.user_id} className="bg-white p-4 rounded-lg shadow">
                  {renderUserProfile(user)}
                  <div className="mt-3 flex space-x-2">
                    {!user.is_authorized && (
                      <button
                        onClick={() => handleAuthorizeUser(user.user_id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Authorize
                      </button>
                    )}
                    <button
                      onClick={() => handleBlockUser(user.user_id, 'message')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Block Messages
                    </button>
                    <button
                      onClick={() => handleToggleMessage(user.user_id, false)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                    >
                      Disable Messages
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predefined Messages Tab */}
        {activeTab === 'messages' && (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Predefined Messages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedMessages.map((message) => (
                <div key={message._id} className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-2">{message.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{message.message}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Used: {message.usage_count} times
                    </span>
                    <button
                      onClick={() => handleUsePredefinedMessage(message)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Use
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topics Tab */}
        {activeTab === 'topics' && (
          <div className="flex-1 p-6">
            <h2 className="text-2xl font-bold mb-6">Topics</h2>
            <p className="text-gray-600">Topic management interface will be implemented here.</p>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {selectedRoom && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="w-full max-w-md md:max-w-lg h-[80vh] flex flex-col rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden">
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400 px-6 pt-6 pb-4"> 
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div>
                  <div className="font-bold text-white text-xl">Admin Chat</div>
                  <div className="text-xs text-white/80 mt-1 max-w-xs">Chatting with {selectedUser?.user_name || 'User'}</div>
                </div>
              </div>
              <button onClick={() => setSelectedRoom(null)} className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold focus:outline-none">×</button>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">No messages yet.</div>
              )}
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender_id === ADMIN_ID || msg.sender_name === ADMIN_NAME;
                return (
                  <div key={idx} className={`flex items-end gap-2 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    {!isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base">
                        {msg.sender_name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div className={`flex flex-col items-${isAdmin ? 'end' : 'start'} max-w-[75%]`}>
                      <div className={`text-xs font-semibold mb-1 ${isAdmin ? 'text-blue-500' : 'text-gray-700'}`}>{msg.sender_name}</div>
                      <div className={`px-4 py-2 rounded-2xl shadow text-sm ${isAdmin ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>{renderMessageContent(msg)}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                    </div>
                    {isAdmin && (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base">
                        {ADMIN_NAME.charAt(0)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* File Upload and Voice Recorder */}
            <div className="px-4 py-2 bg-white border-t space-y-2">
              <FileUpload
                roomId={selectedRoom}
                senderId={ADMIN_ID}
                senderName={ADMIN_NAME}
                senderRole={'admin'}
                onFileUploaded={fileData => {
                  // File message will be added via socket 'new-message' event
                  // No need to manually add it here
                }}
              />
              <VoiceRecorder
                roomId={selectedRoom}
                senderId={ADMIN_ID}
                senderName={ADMIN_NAME}
                senderRole={'admin'}
                onVoiceUploaded={voiceData => {
                  // Voice message will be added via socket 'new-message' event
                  // No need to manually add it here
                }}
              />
            </div>
            {/* Call Button */}
            <div className="px-4 py-2 flex items-center gap-2">
              <button
                onClick={handleCallClick}
                disabled={!callAllowed || callLoading}
                className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow ${(!callAllowed || callLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {callLoading ? 'Calling...' : 'Call'}
              </button>
            </div>
            {/* Input Bar */}
            <div className="px-4 py-3 bg-white border-t flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Type a reply..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow text-xl flex items-center justify-center"
              >
                <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* In-call and ringing UI */}
      {inCall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">In Call</h2>
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />
            <button onClick={endCall} className="mt-6 bg-red-500 text-white px-6 py-2 rounded-full font-semibold">End Call</button>
          </div>
        </div>
      )}
      {ringing && !inCall && incomingOffer !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Incoming Call...</h2>
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />
            <button onClick={handleAcceptCall} className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full font-semibold">Accept</button>
            <button onClick={endCall} className="mt-2 bg-red-500 text-white px-6 py-2 rounded-full font-semibold">Reject</button>
          </div>
        </div>
      )}
      {callError && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-red-600">{callError}</h2>
            <button onClick={() => setCallError('')} className="mt-6 bg-gray-500 text-white px-6 py-2 rounded-full font-semibold">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const EnhancedAdminPanel: React.FC = () => (
  <SocketProvider userId={ADMIN_ID} userName={ADMIN_NAME} role={ADMIN_ROLE}>
    <EnhancedAdminPanelContent />
  </SocketProvider>
);

export default EnhancedAdminPanel; 