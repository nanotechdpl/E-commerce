@echo off
echo 🔧 Setting up admin reply bypass...

REM Set environment variable
set BYPASS_ADMIN_REPLY_CHECK=true

echo ✅ Environment variable set: BYPASS_ADMIN_REPLY_CHECK=true

echo 🔄 Please restart your chat service for changes to take effect.
echo 📁 Navigate to services/chat-service and run: npm start
echo 💡 Or run: node start.js

echo ✅ Setup complete! Users can now upload files and make calls without admin replies.
echo ⚠️  Remember to remove this bypass in production!

pause 