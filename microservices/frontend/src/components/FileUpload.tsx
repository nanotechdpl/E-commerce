import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from './SocketContext';

interface FileUploadProps {
    roomId: string;
    senderId: number;
    senderName: string;
    senderRole: 'user' | 'agency' | 'admin' | 'sub-admin';
    onFileUploaded?: (fileData: any) => void;
    onError?: (error: string) => void;
}

interface UploadStatus {
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

const FileUpload: React.FC<FileUploadProps> = ({
    roomId,
    senderId,
    senderName,
    senderRole,
    onFileUploaded,
    onError
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { socket } = useSocket();

    const API_BASE_URL = 'http://localhost:3006/api';

    // Check upload status on component mount
    useEffect(() => {
        checkUploadStatus();
    }, [roomId, senderId, senderRole]);

    // Listen for new messages to re-check status (in case admin replied)
    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (msg: any) => {
            if (msg.room_id === roomId) {
                console.log('[FileUpload] New message received, re-checking file upload status', msg);
                checkUploadStatus();
            }
        };
        socket.on('new-message', handleNewMessage);
        return () => {
            socket.off('new-message', handleNewMessage);
        };
    }, [socket, roomId]);

    // Cleanup socket listeners on unmount
    useEffect(() => {
        return () => {
            if (socket) {
                socket.off('file-upload-success');
                socket.off('file-upload-error');
            }
        };
    }, [socket]);

    const checkUploadStatus = async () => {
        if (!socket) {
            console.log('[FileUpload] No socket connection');
            return;
        }
        console.log('[FileUpload] Emitting check_file_upload_status', { room_id: roomId, sender_id: senderId, sender_role: senderRole });
        socket.emit('check_file_upload_status', {
            room_id: roomId,
            sender_id: senderId,
            sender_role: senderRole
        });
        const handleStatus = (status: UploadStatus) => {
            console.log('[FileUpload] Received file_upload_status', status);
            setUploadStatus(status);
            socket.off('file_upload_status', handleStatus);
        };
        const handleStatusError = (error: any) => {
            console.error('[FileUpload] file_upload_status_error', error);
            setUploadStatus({
                can_upload: false,
                permission_status: { allowed: false, error: error.error },
                assignment_status: { allowed: false, error: error.error },
                block_toggle_status: { allowed: false, error: error.error }
            });
            socket.off('file_upload_status_error', handleStatusError);
        };
        socket.on('file_upload_status', handleStatus);
        socket.on('file_upload_status_error', handleStatusError);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadStatus?.can_upload || !socket) {
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Convert file to base64 for socket transmission
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const base64Data = (e.target?.result as string).split(',')[1]; // Remove data URL prefix
                    
                    // Simulate progress
                    setUploadProgress(50);
                    
                    // Emit file upload via socket
                    socket.emit('file_upload', {
                        room_id: roomId,
                        sender_id: senderId,
                        sender_name: senderName,
                        sender_role: senderRole,
                        file: base64Data,
                        file_name: selectedFile.name,
                        file_type: selectedFile.type,
                        file_size: selectedFile.size
                    });

                    // Listen for upload success/error
                    const handleUploadSuccess = (data: any) => {
                        setSelectedFile(null);
                        setUploadProgress(100);
                        onFileUploaded?.(data);
                        socket.off('file-upload-success', handleUploadSuccess);
                        socket.off('file-upload-error', handleUploadError);
                        setTimeout(() => setUploadProgress(0), 1000);
                    };

                    const handleUploadError = (data: any) => {
                        console.error('Socket upload error:', data);
                        onError?.(data.error || 'Upload failed');
                        socket.off('file-upload-success', handleUploadSuccess);
                        socket.off('file-upload-error', handleUploadError);
                        setUploadProgress(0);
                    };

                    socket.on('file-upload-success', handleUploadSuccess);
                    socket.on('file-upload-error', handleUploadError);

                } catch (error: any) {
                    console.error('File processing error:', error);
                    onError?.('Failed to process file');
                    setUploadProgress(0);
                }
            };

            reader.onerror = () => {
                onError?.('Failed to read file');
                setUploadProgress(0);
            };

            reader.readAsDataURL(selectedFile);

        } catch (error: any) {
            console.error('Upload error:', error);
            onError?.('Upload failed');
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    const getStatusMessage = () => {
        if (!uploadStatus) return 'Checking upload status...';
        if (uploadStatus.can_upload) {
            return '✅ File upload is available';
        } else {
            const errors = [
                uploadStatus.permission_status.error,
                uploadStatus.assignment_status.error,
                uploadStatus.block_toggle_status.error
            ].filter(Boolean);
            return `❌ Upload not allowed: ${errors[0] || 'Unknown error'}`;
        }
    };

    const getStatusColor = () => {
        if (!uploadStatus) return 'text-gray-500';
        return uploadStatus.can_upload ? 'text-green-600' : 'text-red-600';
    };

    // When rendering the upload button
    const isDisabled = isUploading || !uploadStatus?.can_upload;
    console.log('[FileUpload] Render: isUploading:', isUploading, 'can_upload:', uploadStatus?.can_upload, 'uploadStatus:', uploadStatus);

    return (
        <div className="file-upload-container p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">File Upload</h3>
            
            {/* Upload Status */}
            <div className="mb-4">
                <div className={`text-sm font-medium ${getStatusColor()}`}>
                    {getStatusMessage()}
                </div>
            </div>

            {/* File Selection */}
            <div className="mb-4">
                <input
                    type="file"
                    onChange={handleFileSelect}
                    disabled={isDisabled}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.doc,.docx,.xls,.xlsx,.mp4,.mpeg,.mp3,.wav"
                />
            </div>

            {/* Upload Progress */}
            {isUploading && (
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                        Uploading... {uploadProgress}%
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={isDisabled}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
                {isUploading ? 'Uploading...' : 'Upload File'}
            </button>

            {/* File Info */}
            {selectedFile && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-700">
                        <div><strong>Name:</strong> {selectedFile.name}</div>
                        <div><strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                        <div><strong>Type:</strong> {selectedFile.type}</div>
                    </div>
                </div>
            )}

            {/* Rules Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Upload Rules:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Users must send a message first</li>
                    <li>• An admin must reply before file uploads are allowed</li>
                    <li>• Maximum file size: 50MB</li>
                    <li>• Supported formats: Images, Documents, Media files</li>
                    <li>• Files are delivered in real-time</li>
                </ul>
            </div>
        </div>
    );
};

export default FileUpload; 