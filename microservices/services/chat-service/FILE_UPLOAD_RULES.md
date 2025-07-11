# File Upload Rules Documentation

## Overview

This document describes the comprehensive file upload rules implemented in the chat system. The rules ensure that users and agencies can only upload files under specific conditions, maintaining control and security in the chat environment.

## File Upload Rules

### 1. Basic Requirements

Users or agencies can upload files only after:
1. **They have sent a message** - The user/agency must have sent at least one text message in the chat room
2. **An admin or sub-admin has replied** - An admin or sub-admin must have responded to the user's message

If the admin does not reply, the user/agency cannot upload files.

### 2. Role-Based Permissions

#### Admin and Sub-Admin
- **Can always upload files** - No restrictions apply
- **Can upload to any room** - Not limited to assigned chats
- **Bypass all validation rules** - Full upload privileges

#### User and Agency
- **Must follow all validation rules** - Subject to message and reply requirements
- **Must be assigned to the chat** - Can only upload to rooms they're assigned to
- **Subject to block/toggle restrictions** - Can be blocked or have uploads disabled

### 3. Validation Checks

The system performs the following validations in order:

#### 3.1 Permission Validation
- Checks if user/agency has sent a message
- Verifies that an admin has replied after the user's first message
- Returns specific error messages for each failure case

#### 3.2 Assignment Validation
- Ensures the chat room has an active admin assignment
- Verifies the user is assigned to the chat (for users/agencies)
- Admins can upload to any room

#### 3.3 Block/Toggle Validation
- Checks if user is blocked from file uploads
- Verifies if file upload is toggled off for the user
- Supports both 'file' and 'all' block types

#### 3.4 File Validation
- Validates file type against allowed types
- Checks file size (max 50MB)
- Ensures file integrity

## Implementation Details

### API Endpoints

#### 1. File Upload
```
POST /api/file-upload/upload
Content-Type: multipart/form-data

Body:
- file: The file to upload
- room_id: Chat room ID
- sender_id: User ID
- sender_name: User name
- sender_role: User role (user/agency/admin/sub-admin)
```

#### 2. Upload Status Check
```
GET /api/file-upload/status/:room_id/:sender_id/:sender_role
```

### Socket Events

#### 1. File Upload
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

// Server responds
socket.on('file-upload-success', (data) => {
    console.log('File uploaded:', data);
});

socket.on('file-upload-error', (error) => {
    console.error('Upload failed:', error);
});
```

#### 2. Upload Status Check
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

### Database Schema Updates

#### Message Model
```javascript
{
    // ... existing fields
    sender_role: {
        type: String,
        enum: ['user', 'agency', 'admin', 'sub-admin'],
        required: true,
        default: 'user'
    },
    file_name: String,
    file_size: Number,
    file_type: String
}
```

### File Storage

#### Local Storage (Development)
- Files are saved to `uploads/{room_id}/` directory
- Unique filenames with timestamps and UUIDs
- File URLs: `/uploads/{room_id}/{filename}`

#### Cloud Storage (Production)
- Integration with Google Cloud Storage
- Automatic file processing and optimization
- CDN-ready URLs

## Error Messages

### Permission Errors
- `"You must send a message before uploading files."`
- `"An admin must reply before you can upload files."`
- `"Invalid user role for file upload."`

### Assignment Errors
- `"No admin assigned to this chat yet."`
- `"You are not assigned to this chat room."`

### Block/Toggle Errors
- `"File upload is blocked for you in this chat."`
- `"File upload is disabled for you in this chat."`

### File Validation Errors
- `"File type {type} is not allowed."`
- `"File size exceeds maximum limit of 50MB."`

## Allowed File Types

### Images
- JPEG, PNG, GIF, WebP

### Documents
- PDF, TXT, DOC, DOCX, XLS, XLSX

### Media
- MP4, MPEG, MP3, WAV

## Configuration

### File Size Limits
- Maximum file size: 50MB
- Configurable via environment variables

### Allowed File Types
- Defined in `FileUploadController.validateFile()`
- Easily extensible for new file types

### Storage Configuration
- Local storage for development
- Cloud storage for production
- Configurable via environment variables

## Security Considerations

### File Validation
- MIME type validation
- File size limits
- File extension checking
- Malware scanning (recommended for production)

### Access Control
- Role-based permissions
- Room assignment validation
- Block/toggle system
- Audit logging

### Data Protection
- Secure file storage
- Access token validation
- Rate limiting (recommended)
- File encryption (recommended for sensitive files)

## Testing

### Unit Tests
- Permission validation tests
- File validation tests
- Assignment validation tests
- Block/toggle validation tests

### Integration Tests
- End-to-end upload flow
- Socket event handling
- Error handling scenarios
- Performance testing

### Manual Testing
- Test with different user roles
- Test with various file types
- Test error scenarios
- Test concurrent uploads

## Monitoring and Logging

### Upload Metrics
- Upload success/failure rates
- File type distribution
- File size distribution
- User role distribution

### Error Tracking
- Validation failure reasons
- File processing errors
- Storage errors
- Network errors

### Performance Monitoring
- Upload response times
- File processing times
- Storage operation times
- Memory usage

## Future Enhancements

### Planned Features
- File preview generation
- Automatic file compression
- Virus scanning integration
- File versioning
- Bulk file uploads

### Scalability Improvements
- CDN integration
- File streaming
- Background processing
- Distributed storage

### Security Enhancements
- File encryption
- Access token rotation
- Advanced malware detection
- Compliance reporting 