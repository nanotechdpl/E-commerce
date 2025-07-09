# Debug Setup for Admin Reply Detection

## Quick Fix Options

### Option 1: Temporary Bypass (For Testing)
Add this environment variable to bypass admin reply checks temporarily:

```bash
# In your .env file or environment
BYPASS_ADMIN_REPLY_CHECK=true
```

This will allow users to upload files and make calls without requiring admin replies.

### Option 2: Use Debug Endpoints
Use the debug endpoints to manually create admin replies:

```bash
# Check current messages in a room
GET http://localhost:3006/api/chat/debug/room/{room_id}/messages

# Force create an admin reply
POST http://localhost:3006/api/chat/debug/admin-reply/{room_id}
Content-Type: application/json

{
  "message": "Test admin reply"
}
```

### Option 3: Run Test Script
Use the provided test script:

```bash
# Install axios if not already installed
npm install axios

# Run the test script (update room ID first)
node test-admin-reply.js
```

## Debugging Steps

1. **Check Console Logs**: The enhanced logging will show you exactly what's happening
2. **Verify Message Structure**: Ensure admin messages have `sender_role: 'admin'`
3. **Check Database**: Verify messages are saved correctly
4. **Test with Bypass**: Use the bypass to confirm the issue is with admin reply detection

## Production Fix

Once you've identified the issue, remove the bypass and debug endpoints:

1. Remove `BYPASS_ADMIN_REPLY_CHECK` environment variable
2. Remove debug routes from `chatRoutes.js`
3. Remove debug methods from `chatController.js`
4. Clean up logging in `utils.js`

## Common Issues

1. **Admin messages not saving `sender_role`**: Check the message creation logic
2. **Wrong admin ID**: Ensure admin ID matches what the system expects
3. **Message ordering**: Verify messages are being retrieved in correct order
4. **Database connection**: Ensure MongoDB is properly connected 