import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from './SocketContext';
import { HiOutlinePaperAirplane, HiOutlineFaceSmile, HiOutlineMicrophone } from 'react-icons/hi2';
import FileUpload from './FileUpload';
import VoiceRecorder from './VoiceRecorder';

declare global {
  interface Window {
    socket?: any;
  }
}

interface ChatWindowProps {
  roomId?: string;
  topicName?: string | null;
}

const USER_ID = '1';
const USER_NAME = 'You';
const ASSISTANT_NAME = 'Assistant';
const APP_NAME = 'ChatFlow';
const APP_DESC = 'A live chat interface that allows for seamless, natural communication and connection.';

const gradient = 'bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-400';

const getAvatar = (name: string, url?: string) =>
  url ? (
    <img src={url} alt={name} className="w-8 h-8 rounded-full object-cover" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base">
      {name.charAt(0)}
    </div>
  );

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

const ChatWindow: React.FC<ChatWindowProps> = ({ roomId, topicName }) => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket || !roomId) return;
    const handleNewMessage = (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!roomId) return;
    fetch(`http://localhost:3006/api/chat/messages/${roomId}`)
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
  }, [roomId]);

  // Add a helper to join the room via REST API before socket join
  const joinRoomAsUser = async (roomId: string) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3006/api/chat/rooms/${roomId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: USER_ID, user_name: USER_NAME })
      });
    } catch (err) {
      console.error('Failed to join room as user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update the effect for joining the room:
  useEffect(() => {
    if (!socket || !roomId) return;
    let joined = false;
    joinRoomAsUser(roomId).then(() => {
      socket.emit('join-room', { room: roomId, user_id: USER_ID, role: 'user' });
      joined = true;
    });
    return () => {
      if (joined) {
        socket.emit('leave-room', { room_id: roomId, user_id: USER_ID });
      }
    };
  }, [socket, roomId]);

  // Check if call is allowed (ask backend)
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.emit('call-initiate', { room_id: roomId, from: USER_ID, to: null, from_role: 'user', checkOnly: true });
    const handleDenied = (data: any) => setCallAllowed(false);
    const handleAllowed = () => setCallAllowed(true);
    socket.on('call-initiate-denied', handleDenied);
    socket.on('call-initiate', handleAllowed);
    return () => {
      socket.off('call-initiate-denied', handleDenied);
      socket.off('call-initiate', handleAllowed);
    };
  }, [socket, roomId, messages]);

  // WebRTC config
  const rtcConfig = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  // Handle signaling events
  useEffect(() => {
    if (!socket || !roomId) return;
    socket.on('ready', () => {
      setReady(true);
    });
    socket.on('signal', async (data) => {
      try {
        if (data.type === 'ready') {
          setReady(true);
        } else if (data.type === 'offer') {
          await setupPeer(false);
          await peerRef.current?.setRemoteDescription(new RTCSessionDescription(data.sdp));
          const answer = await peerRef.current?.createAnswer();
          await peerRef.current?.setLocalDescription(answer);
          socket.emit('signal', { type: 'answer', sdp: answer, room_id: roomId });
          setRinging(false);
          setInCall(true);
        } else if (data.type === 'answer') {
          await peerRef.current?.setRemoteDescription(new RTCSessionDescription(data.sdp));
          setInCall(true);
        } else if (data.type === 'candidate') {
          await peerRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
        } else if (data.type === 'error') {
          setCallError(data.reason);
          endCall();
        }
      } catch (err) {
        setCallError('Signaling error: ' + (err instanceof Error ? err.message : String(err)));
      }
    });
    return () => {
      socket.off('ready');
      socket.off('signal');
    };
  }, [socket, roomId]);

  // Start call as caller
  const handleCallClick = async () => {
    if (!socket || !roomId) {
      return;
    }
    setCallLoading(true);
    setIsCaller(true);
    try {
      socket.emit('call-initiate', { room_id: roomId, from: USER_ID, to: null, from_role: 'user' });
      await startCall();
    } catch (err) {
      setCallError('Failed to start call: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  // Listen for call-initiate (as callee only)
  useEffect(() => {
    if (!socket || !roomId) return;
    const handleIncomingCall = (payload: { from: string }) => {
      const { from } = payload || {};
      if (from && from !== USER_ID) {
        setRinging(true);
        setIncomingOffer({ offer: { type: 'offer', sdp: '' } as RTCSessionDescriptionInit, from });
      }
      // If from === USER_ID, do nothing (caller already started call)
    };
    socket.on('call-initiate', handleIncomingCall);
    return () => {
      socket.off('call-initiate', handleIncomingCall);
    };
  }, [socket, roomId]);

  const startCall = async () => {
    setRinging(true);
    try {
      await setupPeer(true);
      if (!peerRef.current) {
        setCallError('Peer connection not created');
        return;
      }
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      socket.emit('signal', { type: 'offer', sdp: offer, room_id: roomId });
    } catch (err) {
      setCallError('Failed to start call: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const setupPeer = async (isCaller: boolean) => {
    if (!socket) {
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localStreamRef.current = stream;
      if (!peerRef.current) {
        peerRef.current = new RTCPeerConnection(rtcConfig);
      }
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
        if (e.candidate && socket) {
          socket.emit('signal', { type: 'candidate', candidate: e.candidate, room_id: roomId });
        }
      };
      peerRef.current.oniceconnectionstatechange = () => {
      };
      peerRef.current.onconnectionstatechange = () => {
      };
    } catch (err) {
      setCallError('Failed to setup peer: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const endCall = () => {
    if (peerRef.current) peerRef.current.close();
    peerRef.current = null;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (remoteAudioRef.current && remoteAudioRef.current.srcObject) {
      remoteAudioRef.current.srcObject = null;
    }
    setInCall(false);
    setRinging(false);
    setCallError('');
    setIsMuted(false);
  };

  const handleAcceptCall = async () => {
    setRinging(false);
    if (incomingOffer && incomingOffer.offer && peerRef.current) {
      await setupPeer(false);
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(incomingOffer.offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      if (socket && roomId) {
        socket.emit('signal', { type: 'answer', sdp: answer, room_id: roomId });
      }
      setInCall(true);
    } else {
      await startCall(); // fallback for user-initiated call
    }
  };

  const handleEndCall = () => {
    if (!socket || !roomId) return;
    socket.emit('call-end', { room_id: roomId, from: USER_ID, to: null });
    endCall();
  };

  const handleSend = () => {
    if (!input.trim() || !socket || !roomId) return;
    const msgData = {
      room_id: roomId,
      sender_id: parseInt(USER_ID),
      sender_name: USER_NAME,
      message: input,
      sender_role: 'user',
      message_type: 'text',
      recipient_id: null // Will be determined by backend based on room participants
    };
    socket?.emit('send-message', msgData);
    setInput('');
  };

  // Add a function to refresh messages
  const refreshMessages = () => {
    if (!roomId) return;
    setLoading(true);
    fetch(`http://localhost:3006/api/chat/messages/${roomId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data && Array.isArray(data.data.messages)) {
          setMessages(data.data.messages);
        } else if (Array.isArray(data)) {
          setMessages(data); // fallback for old API
        } else {
          setMessages([]);
        }
      })
      .finally(() => setLoading(false));
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  // Expose socket for manual inspection
  if (typeof window !== 'undefined' && socket) {
    window.socket = socket;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8fc]">
        <div className="text-lg text-gray-500">Joining chat...</div>
      </div>
    );
  }

  if (!roomId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f6f8fc]">
        <div className="text-lg text-gray-500">Please select a topic to start chatting.</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f6f8fc]">
      <div className="w-full max-w-md md:max-w-lg h-[80vh] flex flex-col rounded-2xl shadow-2xl bg-white border border-gray-100 overflow-hidden relative">
        <button
          onClick={refreshMessages}
          className="absolute top-2 right-2 z-10 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-xs shadow"
          style={{marginTop: '8px', marginRight: '8px'}}
        >
          Refresh Chat
        </button>
        {/* Gradient Header */}
        <div className={`relative ${gradient} px-6 pt-6 pb-4`}> 
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <div>
              <div className="font-bold text-white text-xl">{APP_NAME}</div>
              <div className="text-xs text-white/80 mt-1 max-w-xs">{APP_DESC}</div>
            </div>
          </div>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl font-bold focus:outline-none">×</button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-white">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">No messages yet. Say hello!</div>
          )}
          {messages.map((msg, idx) => {
            const isUser = msg.sender_id === USER_ID || msg.sender_name === USER_NAME;
            return (
              <div key={idx} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && getAvatar(msg.sender_name)}
                <div className={`flex flex-col items-${isUser ? 'end' : 'start'} max-w-[75%]`}>
                  <div className={`text-xs font-semibold mb-1 ${isUser ? 'text-blue-500' : 'text-gray-700'}`}>{msg.sender_name}</div>
                  <div className={`px-4 py-2 rounded-2xl shadow text-sm ${isUser ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>{renderMessageContent(msg)}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                </div>
                {isUser && getAvatar(USER_NAME)}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {/* File Upload and Voice Recorder */}
        <div className="px-4 py-2 bg-white border-t space-y-2">
          <FileUpload
            roomId={roomId || ''}
            senderId={USER_ID}
            senderName={USER_NAME}
            senderRole={'user'}
            onFileUploaded={fileData => {
              // File message will be added via socket 'new-message' event
              // No need to manually add it here
            }}
          />
          <VoiceRecorder
            roomId={roomId || ''}
            senderId={USER_ID}
            senderName={USER_NAME}
            senderRole={'user'}
            onVoiceUploaded={voiceData => {
              // Voice message will be added via socket 'new-message' event
              // No need to manually add it here
            }}
          />
        </div>
        {/* Input Bar */}
        <div className="px-4 py-3 bg-white border-t flex items-center gap-2">
          <button className="text-gray-400 hover:text-blue-500 text-2xl"><HiOutlineFaceSmile /></button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Reply ..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow text-xl flex items-center justify-center"
          >
            <HiOutlinePaperAirplane className="-rotate-45" />
          </button>
        </div>
        <div className="px-4 py-2 flex items-center gap-2">
          <button
            onClick={handleCallClick}
            disabled={!callAllowed || callLoading || inCall || ringing}
            className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow ${(!callAllowed || callLoading || inCall || ringing) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {callLoading ? 'Calling...' : 'Call'}
          </button>
        </div>
        <div className="px-4 py-2 flex items-center gap-2">
          <button
            onClick={handleEndCall}
            disabled={!inCall && !ringing}
            className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow ${(!inCall && !ringing) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            End Call
          </button>
        </div>
        <div className="px-4 py-2 flex items-center gap-2">
          <button
            onClick={toggleMute}
            disabled={!inCall && !ringing}
            className={`bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-full font-semibold shadow ${(!inCall && !ringing) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>
      {ringing && !inCall && incomingOffer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">Incoming Call...</h2>
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />
            <button onClick={handleAcceptCall} className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full font-semibold">Accept</button>
            <button onClick={handleEndCall} className="mt-2 bg-red-500 text-white px-6 py-2 rounded-full font-semibold">Reject</button>
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

export default ChatWindow;