// Simple test to verify admin reply bypass is working
const io = require('socket.io-client');

const socket = io('http://localhost:3006');

socket.on('connect', () => {
    console.log('✅ Connected to chat service');
    
    // Test file upload permission
    socket.emit('check_file_upload_status', {
        room_id: 'test-room',
        sender_id: 1,
        sender_role: 'user'
    });
});

socket.on('file_upload_status', (data) => {
    console.log('📁 File upload status:', data);
    if (data.can_upload) {
        console.log('✅ File upload is allowed!');
    } else {
        console.log('❌ File upload is still blocked');
    }
    socket.disconnect();
});

socket.on('file_upload_status_error', (error) => {
    console.log('❌ File upload status error:', error);
    socket.disconnect();
});

socket.on('disconnect', () => {
    console.log('🔌 Disconnected from chat service');
});

// Timeout after 5 seconds
setTimeout(() => {
    console.log('⏰ Test timeout');
    socket.disconnect();
    process.exit(0);
}, 5000); 