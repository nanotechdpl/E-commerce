import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from './SocketContext';

interface VoiceRecorderProps {
  roomId: string;
  senderId: string | number;
  senderName: string;
  senderRole: 'user' | 'agency' | 'admin' | 'sub-admin';
  onVoiceUploaded?: (voiceData: any) => void;
  onError?: (error: string) => void;
}

interface VoiceUploadStatus {
  can_upload: boolean;
  permission_status: {
    allowed: boolean;
    error?: string;
  };
  assignment_status: {
    allowed: boolean;
    error?: string;
  };
  block_toggle_status: {
    allowed: boolean;
    error?: string;
  };
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  roomId,
  senderId,
  senderName,
  senderRole,
  onVoiceUploaded,
  onError
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<VoiceUploadStatus | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [maxRecordingTime] = useState(60); // 60 seconds max

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { socket } = useSocket();

  // Check voice upload status on component mount
  useEffect(() => {
    console.log('[VoiceRecorder] useEffect: roomId, senderId, senderRole', roomId, senderId, senderRole);
    checkVoiceUploadStatus();
  }, [roomId, senderId, senderRole]);

  // Cleanup socket listeners on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.off('voice-upload-success');
        socket.off('voice-upload-error');
        socket.off('voice_upload_status');
        socket.off('voice_upload_status_error');
      }
    };
  }, [socket]);

  // Re-check voice upload status when a new message arrives in the current room
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg: any) => {
      if (msg.room_id === roomId) {
        console.log('[VoiceRecorder] New message received, re-checking voice upload status', msg);
        checkVoiceUploadStatus();
      }
    };
    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, roomId]);

  // Ensure user joins the room before any upload
  useEffect(() => {
    if (socket && roomId && senderId && senderRole) {
      const numericSenderId = typeof senderId === 'string' ? parseInt(senderId) : senderId;
      console.log('[VoiceRecorder] Emitting join-room', { room: roomId, user_id: numericSenderId, role: senderRole });
      socket.emit('join-room', { room: roomId, user_id: numericSenderId, role: senderRole });
    }
  }, [socket, roomId, senderId, senderRole]);

  const checkVoiceUploadStatus = async () => {
    if (!socket) {
      console.log('[VoiceRecorder] No socket connection');
      return;
    }
    const numericSenderId = typeof senderId === 'string' ? parseInt(senderId) : senderId;
    console.log('[VoiceRecorder] Emitting check_voice_upload_status', { room_id: roomId, sender_id: numericSenderId, sender_role: senderRole });
    socket.emit('check_voice_upload_status', {
      room_id: roomId,
      sender_id: numericSenderId,
      sender_role: senderRole
    });

    // Listen for status response
    const handleStatusResponse = (status: any) => {
      console.log('[VoiceRecorder] Received voice_upload_status', status);
      setUploadStatus(status);
      socket.off('voice_upload_status', handleStatusResponse);
    };

    const handleStatusError = (error: any) => {
      console.error('[VoiceRecorder] voice_upload_status_error', error);
      setUploadStatus({
        can_upload: false,
        permission_status: { allowed: false, error: error.error },
        assignment_status: { allowed: false, error: error.error },
        block_toggle_status: { allowed: false, error: error.error }
      });
      socket.off('voice_upload_status_error', handleStatusError);
    };

    socket.on('voice_upload_status', handleStatusResponse);
    socket.on('voice_upload_status_error', handleStatusError);
  };

  const startRecording = async () => {
    try {
      console.log('[VoiceRecorder] Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        console.log('[VoiceRecorder] Recording stopped, audioBlob:', audioBlob);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      console.log('[VoiceRecorder] Started recording');

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxRecordingTime) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('[VoiceRecorder] Error starting recording:', error);
      onError?.('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      console.log('[VoiceRecorder] Stopped recording');
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      audioRef.current.play();
      setIsPlaying(true);
      console.log('[VoiceRecorder] Playing recording');
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('[VoiceRecorder] Paused recording');
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    console.log('[VoiceRecorder] Deleted recording');
  };

  const uploadVoice = async () => {
    if (!audioBlob || !uploadStatus?.can_upload || !socket) {
      console.log('[VoiceRecorder] Cannot upload: audioBlob:', audioBlob, 'can_upload:', uploadStatus?.can_upload, 'socket:', !!socket);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    console.log('[VoiceRecorder] Uploading voice message...');

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = (e.target?.result as string).split(',')[1]; // Remove data URL prefix
          setUploadProgress(50);
          const numericSenderId = typeof senderId === 'string' ? parseInt(senderId) : senderId;
          console.log('[VoiceRecorder] Emitting voice_upload', {
            room_id: roomId,
            sender_id: numericSenderId,
            sender_name: senderName,
            sender_role: senderRole,
            file: base64Data.slice(0, 30) + '...',
            file_name: `voice_message_${Date.now()}.webm`,
            file_type: 'audio/webm',
            file_size: audioBlob.size
          });
          // Emit voice upload via socket
          socket.emit('voice_upload', {
            room_id: roomId,
            sender_id: numericSenderId,
            sender_name: senderName,
            sender_role: senderRole,
            file: base64Data,
            file_name: `voice_message_${Date.now()}.webm`,
            file_type: 'audio/webm',
            file_size: audioBlob.size
          });

          // Listen for upload success/error
          const handleUploadSuccess = (data: any) => {
            console.log('[VoiceRecorder] voice-upload-success', data);
            setAudioBlob(null);
            setAudioUrl(null);
            setRecordingTime(0);
            setUploadProgress(100);
            onVoiceUploaded?.(data);
            socket.off('voice-upload-success', handleUploadSuccess);
            socket.off('voice-upload-error', handleUploadError);
            setTimeout(() => setUploadProgress(0), 1000);
          };

          const handleUploadError = (data: any) => {
            console.error('[VoiceRecorder] voice-upload-error', data);
            onError?.(data.error || 'Voice upload failed');
            socket.off('voice-upload-success', handleUploadSuccess);
            socket.off('voice-upload-error', handleUploadError);
            setUploadProgress(0);
          };

          socket.on('voice-upload-success', handleUploadSuccess);
          socket.on('voice-upload-error', handleUploadError);

        } catch (error: any) {
          console.error('[VoiceRecorder] Voice processing error:', error);
          onError?.('Failed to process voice message');
          setUploadProgress(0);
        }
      };

      reader.onerror = () => {
        onError?.('Failed to read voice file');
        setUploadProgress(0);
        console.error('[VoiceRecorder] FileReader error');
      };

      reader.readAsDataURL(audioBlob);

    } catch (error: any) {
      console.error('[VoiceRecorder] Voice upload error:', error);
      onError?.('Voice upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusMessage = () => {
    if (!uploadStatus) return 'Checking voice upload status...';
    if (uploadStatus.can_upload) {
      return '✅ Voice messaging is available';
    } else {
      const errors = [
        uploadStatus.permission_status.error,
        uploadStatus.assignment_status.error,
        uploadStatus.block_toggle_status.error
      ].filter(Boolean);
      return `❌ Voice messaging not allowed: ${errors[0] || 'Unknown error'}`;
    }
  };

  const getStatusColor = () => {
    if (!uploadStatus) return 'text-gray-500';
    return uploadStatus.can_upload ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="voice-recorder-container p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Voice Recorder</h3>
      
      {/* Upload Status */}
      <div className="mb-4">
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusMessage()}
        </div>
      </div>

      {/* Recording Controls */}
      <div className="mb-4 space-y-3">
        {!audioBlob ? (
          <div className="flex items-center gap-3">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!uploadStatus?.can_upload}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } ${!uploadStatus?.can_upload ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                <>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  Stop Recording
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  Start Recording
                </>
              )}
            </button>
            
            {isRecording && (
              <div className="text-sm text-gray-600">
                Recording: {formatTime(recordingTime)} / {formatTime(maxRecordingTime)}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* Audio Player */}
            <div className="flex items-center gap-3">
              <audio
                ref={audioRef}
                src={audioUrl || ''}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />
              
              <button
                onClick={isPlaying ? pauseRecording : playRecording}
                className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
              >
                {isPlaying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-l-transparent rounded-full animate-spin"></div>
                    Pause
                  </>
                ) : (
                  <>
                    <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                    Play
                  </>
                )}
              </button>
              
              <span className="text-sm text-gray-600">
                Duration: {formatTime(recordingTime)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={uploadVoice}
                disabled={isUploading || !uploadStatus?.can_upload}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isUploading ? `Uploading... ${uploadProgress}%` : 'Send Voice Message'}
              </button>
              
              <button
                onClick={deleteRecording}
                disabled={isUploading}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Delete
              </button>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rules Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Voice Message Rules:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Users must send a message first</li>
          <li>• An admin must reply before voice messages are allowed</li>
          <li>• Maximum recording time: 60 seconds</li>
          <li>• Voice messages are delivered in real-time</li>
          <li>• Supported format: WebM (Opus codec)</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecorder; 