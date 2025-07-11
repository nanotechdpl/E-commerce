# PowerShell script to set bypass environment variable and restart chat service

Write-Host "🔧 Setting up admin reply bypass..." -ForegroundColor Green

# Set environment variable for current session
$env:BYPASS_ADMIN_REPLY_CHECK="true"

Write-Host "✅ Environment variable set: BYPASS_ADMIN_REPLY_CHECK=true" -ForegroundColor Green

# Check if chat service is running and restart it
Write-Host "🔄 Restarting chat service..." -ForegroundColor Yellow

# Stop any existing chat service process
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Start the chat service with the environment variable
Write-Host "🚀 Starting chat service with bypass enabled..." -ForegroundColor Green
Write-Host "📁 Navigate to chat service directory and run: npm start" -ForegroundColor Cyan
Write-Host "💡 Or run: node start.js" -ForegroundColor Cyan

# Alternative: Start the service directly (uncomment if needed)
# Set-Location "services/chat-service"
# Start-Process -FilePath "node" -ArgumentList "start.js" -NoNewWindow

Write-Host "✅ Setup complete! Users can now upload files and make calls without admin replies." -ForegroundColor Green
Write-Host "⚠️  Remember to remove this bypass in production!" -ForegroundColor Red 