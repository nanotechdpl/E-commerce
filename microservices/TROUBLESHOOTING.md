# Troubleshooting Guide

## Connection Issues

### Frontend Can't Connect to Backend

**Problem**: `ERR_CONNECTION_REFUSED` errors when frontend tries to connect to backend

**Solution**: 
1. Make sure the chat service is running on port 3006
2. Check that all frontend components are using port 3006
3. Restart both frontend and backend services

### Redis Connection Errors

**Problem**: Multiple Redis connection errors in console

**Solution**: 
- Redis is optional for this system
- The system will work without Redis (using in-memory fallback)
- If you want Redis, install and start it:
  ```bash
  # Install Redis (Windows)
  # Download from https://redis.io/download
  
  # Install Redis (Mac)
  brew install redis
  brew services start redis
  
  # Install Redis (Linux)
  sudo apt-get install redis-server
  sudo systemctl start redis
  ```

### Port Configuration

**Backend**: Running on port 3006
**Frontend**: Should connect to port 3006

**To change ports**:
1. Update `services/chat-service/start.js` (PORT variable)
2. Update all frontend components to use the new port
3. Restart both services

### MongoDB Connection

**Problem**: MongoDB connection errors

**Solution**:
1. Make sure MongoDB is running
2. Check connection string in `start.js`
3. Default: `mongodb://localhost:27017/eccommerce`

## Quick Fix Commands

```bash
# Stop all services
# (Ctrl+C in each terminal)

# Start backend
cd services/chat-service
npm install
npm run seed
npm start

# Start frontend (in new terminal)
cd frontend
npm install
npm run dev
```

## Verification Steps

1. **Backend Health Check**:
   ```bash
   curl http://localhost:3006/health
   ```

2. **Topics API**:
   ```bash
   curl http://localhost:3006/api/topics
   ```

3. **Frontend**: Visit `http://localhost:5173`

## Common Issues

### Issue: "Module not found" errors
**Solution**: Run `npm install` in both frontend and backend directories

### Issue: Database seeding fails
**Solution**: Make sure MongoDB is running and accessible

### Issue: Socket connection fails
**Solution**: Check that both frontend and backend are using the same port (3006)

### Issue: CORS errors
**Solution**: Backend is configured to accept connections from common frontend ports

## Environment Variables

Create a `.env` file in `services/chat-service/`:

```env
PORT=3006
MONGODB_URI=mongodb://localhost:27017/eccommerce
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

## Support

If you continue to have issues:
1. Check the console logs for specific error messages
2. Verify all services are running on correct ports
3. Ensure MongoDB is accessible
4. Redis is optional and not required for basic functionality 