# File Upload System Implementation

## 🚀 Quick Start

This implementation provides comprehensive file upload rules for the chat system, ensuring users and agencies can only upload files under specific conditions.

### Installation

1. Install dependencies:
```bash
cd services/chat-service
npm install
```

2. Start the service:
```bash
npm run dev
```

3. Run tests:
```bash
npm run test:upload
```

## 📋 File Upload Rules

### Core Requirements
- **Users/Agencies must send a message first** before uploading files
- **An admin must reply** to the user's message before file upload is allowed
- **Admins and sub-admins** can always upload files without restrictions

### Validation Flow
1. **Permission Check** - Verify user has sent message and admin has replied
2. **Assignment Check** - Ensure user is assigned to the chat room
3. **Block/Toggle Check** - Verify user is not blocked and uploads are enabled
4. **File Validation** - Check file type and size limits

## 🔧 API Endpoints

### 1. Upload File
```http
POST /api/file-upload/upload
Content-Type: multipart/form-data

Body:
- file: The file to upload
- room_id: Chat room ID
- sender_id: User ID
- sender_name: User name
- sender_role: User role (user/agency/admin/sub-admin)
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully.",
  "data": {
    "message_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "file_url": "/uploads/room_123/1698765432123_uuid_document.pdf",
    "file_name": "document.pdf",
    "file_size": 1024000,
    "file_type": "application/pdf",
    "uploaded_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Check Upload Status
```http
GET /api/file-upload/status/:room_id/:sender_id/:sender_role
```

**Response:**
```json
{
  "success": true,
  "data": {
    "can_upload": false,
    "permission_status": {
      "allowed": false,
      "error": "You must send a message before uploading files."
    },
    "assignment_status": {
      "allowed": true
    },
    "block_toggle_status": {
      "allowed": true
    }
  }
}
```

## 🔌 Socket Events

### File Upload
```javascript
// Client emits
socket.emit('file_upload', {
    room_id: 'room_123',
    sender_id: 456,
    sender_name: 'John Doe',
    sender_role: 'user',
    file: base64FileData,
    file_name: 'document.pdf',
    file_type: 'application/pdf',
    file_size: 1024000
});

// Success response
socket.on('file-upload-success', (data) => {
    console.log('File uploaded:', data);
});

// Error response
socket.on('file-upload-error', (error) => {
    console.error('Upload failed:', error);
});
```

### Check Upload Status
```javascript
// Client emits
socket.emit('check_file_upload_status', {
    room_id: 'room_123',
    sender_id: 456,
    sender_role: 'user'
});

// Server responds
socket.on('file_upload_status', (status) => {
    console.log('Can upload:', status.can_upload);
    console.log('Permission status:', status.permission_status);
});
```

## 🎨 Frontend Integration

### React Component
```jsx
import FileUpload from './components/FileUpload';

function ChatRoom() {
    return (
        <FileUpload
            roomId="room_123"
            senderId={456}
            senderName="John Doe"
            senderRole="user"
            onFileUploaded={(fileData) => {
                console.log('File uploaded:', fileData);
            }}
            onError={(error) => {
                console.error('Upload error:', error);
            }}
        />
    );
}
```

## 📁 File Storage

### Local Storage (Development)
- Files saved to: `uploads/{room_id}/`
- Unique filenames with timestamps and UUIDs
- Accessible via: `/uploads/{room_id}/{filename}`

### Cloud Storage (Production)
- Google Cloud Storage integration
- Automatic file processing
- CDN-ready URLs

## 🔒 Security Features

### File Validation
- **MIME type checking** - Only allowed file types
- **File size limits** - Maximum 50MB per file
- **File extension validation** - Prevents malicious uploads

### Access Control
- **Role-based permissions** - Different rules for different user types
- **Room assignment validation** - Users can only upload to assigned chats
- **Block/toggle system** - Admins can disable uploads for specific users

### Allowed File Types
- **Images**: JPEG, PNG, GIF, WebP
- **Documents**: PDF, TXT, DOC, DOCX, XLS, XLSX
- **Media**: MP4, MPEG, MP3, WAV

## 🧪 Testing

### Run Tests
```bash
npm run test:upload
```

### Test Scenarios
1. **Admin Upload** - Should always work
2. **User Upload Without Message** - Should fail
3. **User Upload After Message** - Should work if admin replied
4. **Blocked User Upload** - Should fail
5. **Invalid File Type** - Should fail
6. **File Too Large** - Should fail

### Manual Testing
```bash
# Test admin upload
curl -X POST http://localhost:3005/api/file-upload/upload \
  -F "file=@test.pdf" \
  -F "room_id=room_123" \
  -F "sender_id=456" \
  -F "sender_name=Admin" \
  -F "sender_role=admin"

# Check upload status
curl http://localhost:3005/api/file-upload/status/room_123/789/user
```

## 🔧 Configuration

### Environment Variables
```env
# File upload settings
MAX_FILE_SIZE=52428800  # 50MB in bytes
UPLOAD_DIR=./uploads    # Local upload directory

# Cloud storage (for production)
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
GCS_BUCKET_NAME=your-bucket-name
```

### Database Schema Updates
The Message model has been updated with new fields:
- `sender_role` - User role for validation
- `file_name` - Original filename
- `file_size` - File size in bytes
- `file_type` - MIME type

## 📊 Monitoring

### Logs
- Upload attempts (success/failure)
- Validation failures with reasons
- File processing errors
- Performance metrics

### Metrics
- Upload success rate by user role
- File type distribution
- File size distribution
- Error rate by validation type

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3005
CMD ["npm", "start"]
```

## 🔄 Migration

### Database Migration
If you have existing messages without `sender_role`, run:
```javascript
// Add default sender_role to existing messages
db.messages.updateMany(
    { sender_role: { $exists: false } },
    { $set: { sender_role: "user" } }
);
```

## 🐛 Troubleshooting

### Common Issues

1. **"You must send a message before uploading files"**
   - User needs to send a text message first
   - Check if message was saved correctly

2. **"An admin must reply before you can upload files"**
   - Admin needs to respond to user's message
   - Verify admin message has correct `sender_role`

3. **"File type is not allowed"**
   - Check if file type is in allowed list
   - Verify MIME type detection

4. **"File size exceeds maximum limit"**
   - File is larger than 50MB
   - Consider compressing or splitting file

### Debug Mode
Enable debug logging:
```javascript
// In your app.js
process.env.DEBUG = 'file-upload:*';
```

## 📚 Additional Resources

- [File Upload Rules Documentation](./FILE_UPLOAD_RULES.md)
- [API Documentation](./API_DOCS.md)
- [Security Guidelines](./SECURITY.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. 