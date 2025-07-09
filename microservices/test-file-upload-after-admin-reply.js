// Test file upload permission after admin reply
const io = require('socket.io-client');
const fs = require('fs');

const socket = io('http://localhost:3006');

const USER_ID = '101';
const ADMIN_ID = '202';
const TOPIC_ID = '686a421894180d9d6e77a41d';

console.log('🔍 Testing file upload after admin reply...');

let createdRoomId = null;

socket.on('connect', () => {
    console.log('✅ Connected to chat service');
    // Step 1: Create a room by selecting a topic
    socket.emit('select_topic', {
        user_id: USER_ID,
        user_name: 'Test User',
        user_type: 'user',
        topic_id: TOPIC_ID,
        topic_name: 'Test Topic'
    });
});

socket.on('topic_selected', (data) => {
    console.log('✅ Room created:', data);
    createdRoomId = data.room_id;
    // Step 2: User sends a message
    setTimeout(() => {
        console.log('💬 User sending message...');
        socket.emit('send-message', {
            room_id: createdRoomId,
            sender_id: parseInt(USER_ID),
            sender_name: 'Test User',
            message: 'Hello, I need help!',
            sender_role: 'user',
            message_type: 'text'
        });
    }, 1000);
    // Step 3: Admin replies
    setTimeout(() => {
        console.log('👨‍💼 Admin replying...');
        socket.emit('send-message', {
            room_id: createdRoomId,
            sender_id: parseInt(ADMIN_ID),
            sender_name: 'Admin',
            message: 'Hi, how can I help you?',
            sender_role: 'admin',
            message_type: 'text'
        });
    }, 2000);
    // Step 4: User checks file upload permission
    setTimeout(() => {
        console.log('📦 User checking file upload status...');
        socket.emit('check_file_upload_status', {
            room_id: createdRoomId,
            sender_id: parseInt(USER_ID),
            sender_role: 'user'
        });
    }, 3000);
    // Step 5: User uploads a file
    setTimeout(() => {
        console.log('📤 User uploading file...');
        const testFile = Buffer.from('fake file data').toString('base64');
        socket.emit('file_upload', {
            room_id: createdRoomId,
            sender_id: parseInt(USER_ID),
            sender_name: 'Test User',
            sender_role: 'user',
            file: testFile,
            file_name: 'test_file.txt',
            file_type: 'text/plain',
            file_size: testFile.length
        });
    }, 4000);
});

socket.on('file_upload_status', (status) => {
    console.log('📦 File upload status:', status);
});

socket.on('file-upload-success', (data) => {
    console.log('✅ File upload successful:', data);
});

socket.on('file-upload-error', (error) => {
    console.log('❌ File upload error:', error);
});

socket.on('disconnect', () => {
    console.log('🔌 Disconnected from chat service');
});

setTimeout(() => {
    console.log('\n⏰ Test completed');
    if (createdRoomId) {
        console.log(`📝 Created room ID: ${createdRoomId}`);
    }
    socket.disconnect();
    process.exit(0);
}, 10000); 