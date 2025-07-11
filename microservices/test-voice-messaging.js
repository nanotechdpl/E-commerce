// Test voice messaging system
const io = require('socket.io-client');

const socket = io('http://localhost:3006');

// Test data
const USER_ID = '1';
const ADMIN_ID = '2';
const TOPIC_ID = '686a421894180d9d6e77a41d';

console.log('🔍 Testing voice messaging system...');
console.log(`User ID: ${USER_ID}`);
console.log(`Admin ID: ${ADMIN_ID}`);
console.log(`Topic ID: ${TOPIC_ID}`);

let createdRoomId = null;

socket.on('connect', () => {
    console.log('✅ Connected to chat service');
    
    // Step 1: Create a room by selecting a topic
    console.log('\n📋 Step 1: Creating room by selecting topic...');
    socket.emit('select_topic', {
        user_id: USER_ID,
        user_name: 'Demo User',
        user_type: 'user',
        topic_id: TOPIC_ID,
        topic_name: 'Test Topic'
    });
});

// Listen for room creation
socket.on('topic_selected', (data) => {
    console.log('✅ Room created:', data);
    createdRoomId = data.room_id;
    
    // Step 2: Send user message first
    setTimeout(() => {
        console.log('\n💬 Step 2: Sending user message...');
        socket.emit('send-message', {
            room_id: createdRoomId,
            sender_id: parseInt(USER_ID),
            sender_name: 'Demo User',
            message: 'Hello, I need help!',
            sender_role: 'user',
            message_type: 'text'
        });
    }, 1000);
    
    // Step 3: Send admin reply
    setTimeout(() => {
        console.log('\n👨‍💼 Step 3: Sending admin reply...');
        socket.emit('send-message', {
            room_id: createdRoomId,
            sender_id: parseInt(ADMIN_ID),
            sender_name: 'Admin',
            message: 'Hello! How can I help you?',
            sender_role: 'admin',
            message_type: 'text'
        });
    }, 2000);
    
    // Step 4: Test voice upload permission
    setTimeout(() => {
        console.log('\n🎤 Step 4: Testing voice upload permission...');
        socket.emit('check_voice_upload_status', {
            room_id: createdRoomId,
            sender_id: parseInt(USER_ID),
            sender_role: 'user'
        });
    }, 3000);
    
    // Step 5: Test voice upload
    setTimeout(() => {
        console.log('\n🎤 Step 5: Testing voice upload...');
        const testVoice = Buffer.from('fake voice data').toString('base64');
        socket.emit('voice_upload', {
            room_id: createdRoomId,
            sender_id: parseInt(USER_ID),
            sender_name: 'Demo User',
            sender_role: 'user',
            file: testVoice,
            file_name: 'test_voice.webm',
            file_type: 'audio/webm',
            file_size: testVoice.length
        });
    }, 4000);
});

// Listen for responses
socket.on('new-message', (msg) => {
    console.log('📨 New message received:', {
        sender_id: msg.sender_id,
        sender_name: msg.sender_name,
        sender_role: msg.sender_role,
        message_type: msg.message_type,
        message: msg.message.substring(0, 50) + '...'
    });
});

socket.on('voice_upload_status', (status) => {
    console.log('🎤 Voice upload status:', status);
});

socket.on('voice-upload-success', (data) => {
    console.log('✅ Voice upload successful:', data);
});

socket.on('voice-upload-error', (error) => {
    console.log('❌ Voice upload error:', error);
});

socket.on('disconnect', () => {
    console.log('🔌 Disconnected from chat service');
});

// Timeout after 10 seconds
setTimeout(() => {
    console.log('\n⏰ Test completed');
    if (createdRoomId) {
        console.log(`📝 Created room ID: ${createdRoomId}`);
    }
    socket.disconnect();
    process.exit(0);
}, 10000); 