const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:3005';
const TEST_ROOM_ID = 'test_room_123';
const TEST_USER_ID = 123;
const TEST_ADMIN_ID = 456;

// Test data
const testUsers = {
    user: {
        id: TEST_USER_ID,
        name: 'Test User',
        role: 'user'
    },
    admin: {
        id: TEST_ADMIN_ID,
        name: 'Test Admin',
        role: 'admin'
    }
};

// Create a test file
function createTestFile() {
    const testContent = 'This is a test file for upload validation.';
    const testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, testContent);
    return testFilePath;
}

// Test file upload
async function testFileUpload(user, roomId, expectedSuccess = true) {
    try {
        const testFilePath = createTestFile();
        const formData = new FormData();
        
        formData.append('file', fs.createReadStream(testFilePath));
        formData.append('room_id', roomId);
        formData.append('sender_id', user.id);
        formData.append('sender_name', user.name);
        formData.append('sender_role', user.role);

        console.log(`\n🧪 Testing file upload for ${user.role} (${user.name})...`);
        
        const response = await axios.post(`${BASE_URL}/api/file-upload/upload`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 10000
        });

        if (expectedSuccess) {
            console.log('✅ Upload successful:', response.data.message);
            console.log('📁 File URL:', response.data.data.file_url);
        } else {
            console.log('❌ Expected failure but got success');
        }

        // Clean up test file
        fs.unlinkSync(testFilePath);
        return response.data;

    } catch (error) {
        if (expectedSuccess) {
            console.log('❌ Upload failed unexpectedly:', error.response?.data?.error || error.message);
        } else {
            console.log('✅ Expected failure:', error.response?.data?.error || error.message);
        }
        return null;
    }
}

// Test upload status
async function testUploadStatus(user, roomId) {
    try {
        console.log(`\n🔍 Checking upload status for ${user.role} (${user.name})...`);
        
        const response = await axios.get(
            `${BASE_URL}/api/file-upload/status/${roomId}/${user.id}/${user.role}`
        );

        const status = response.data.data;
        console.log('📊 Upload Status:');
        console.log('  - Can upload:', status.can_upload);
        console.log('  - Permission status:', status.permission_status);
        console.log('  - Assignment status:', status.assignment_status);
        console.log('  - Block/Toggle status:', status.block_toggle_status);

        return status;

    } catch (error) {
        console.log('❌ Status check failed:', error.response?.data?.error || error.message);
        return null;
    }
}

// Main test function
async function runTests() {
    console.log('🚀 Starting File Upload Rules Tests\n');
    console.log('=' .repeat(50));

    // Test 1: Admin should always be able to upload
    console.log('\n📋 Test 1: Admin Upload (Should Always Work)');
    await testFileUpload(testUsers.admin, TEST_ROOM_ID, true);

    // Test 2: User upload without sending message (Should Fail)
    console.log('\n📋 Test 2: User Upload Without Message (Should Fail)');
    await testFileUpload(testUsers.user, TEST_ROOM_ID, false);

    // Test 3: Check upload status for user
    console.log('\n📋 Test 3: Check User Upload Status');
    await testUploadStatus(testUsers.user, TEST_ROOM_ID);

    // Test 4: Check upload status for admin
    console.log('\n📋 Test 4: Check Admin Upload Status');
    await testUploadStatus(testUsers.admin, TEST_ROOM_ID);

    console.log('\n' + '=' .repeat(50));
    console.log('✅ File Upload Rules Tests Completed');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testFileUpload,
    testUploadStatus,
    runTests
}; 