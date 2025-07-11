// Test script to debug admin reply detection
const axios = require('axios');

const BASE_URL = 'http://localhost:3006/api/chat';

async function testAdminReplyDetection() {
    try {
        // Replace with your actual room ID
        const roomId = 'room_1_1234567890'; // Update this with your actual room ID
        
        console.log('🔍 Testing admin reply detection...');
        console.log(`Room ID: ${roomId}`);
        
        // 1. Check current messages in room
        console.log('\n📋 Current messages in room:');
        const messagesResponse = await axios.get(`${BASE_URL}/debug/room/${roomId}/messages`);
        console.log(JSON.stringify(messagesResponse.data, null, 2));
        
        // 2. Force create an admin reply for testing
        console.log('\n👨‍💼 Creating test admin reply...');
        const adminReplyResponse = await axios.post(`${BASE_URL}/debug/admin-reply/${roomId}`, {
            message: 'This is a test admin reply to enable file uploads and calls.'
        });
        console.log(JSON.stringify(adminReplyResponse.data, null, 2));
        
        // 3. Check messages again
        console.log('\n📋 Messages after admin reply:');
        const messagesAfterResponse = await axios.get(`${BASE_URL}/debug/room/${roomId}/messages`);
        console.log(JSON.stringify(messagesAfterResponse.data, null, 2));
        
        console.log('\n✅ Test completed! Now try uploading files or making calls.');
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

// Run the test
testAdminReplyDetection(); 