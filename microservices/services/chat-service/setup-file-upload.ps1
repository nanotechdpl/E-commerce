# File Upload System Setup Script for Windows
# This script helps set up the file upload functionality for the chat service

param(
    [switch]$SkipDependencies,
    [switch]$SkipMigration
)

# Function to write colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Host "🚀 Setting up File Upload System for Chat Service" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
function Test-NodeInstallation {
    Write-Status "Checking Node.js installation..."
    
    try {
        $nodeVersion = node --version
        if ($LASTEXITCODE -eq 0) {
            $version = $nodeVersion.TrimStart('v').Split('.')[0]
            if ([int]$version -ge 16) {
                Write-Success "Node.js $nodeVersion is installed"
                return $true
            } else {
                Write-Error "Node.js version 16 or higher is required. Current version: $nodeVersion"
                return $false
            }
        } else {
            Write-Error "Node.js is not installed. Please install Node.js 16 or higher."
            return $false
        }
    } catch {
        Write-Error "Node.js is not installed. Please install Node.js 16 or higher."
        return $false
    }
}

# Check if npm is installed
function Test-NpmInstallation {
    Write-Status "Checking npm installation..."
    
    try {
        $npmVersion = npm --version
        if ($LASTEXITCODE -eq 0) {
            Write-Success "npm $npmVersion is installed"
            return $true
        } else {
            Write-Error "npm is not installed. Please install npm."
            return $false
        }
    } catch {
        Write-Error "npm is not installed. Please install npm."
        return $false
    }
}

# Install dependencies
function Install-Dependencies {
    if ($SkipDependencies) {
        Write-Warning "Skipping dependency installation"
        return $true
    }
    
    Write-Status "Installing dependencies..."
    
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json not found. Please run this script from the chat-service directory."
        return $false
    }
    
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Dependencies installed successfully"
            return $true
        } else {
            Write-Error "Failed to install dependencies"
            return $false
        }
    } catch {
        Write-Error "Failed to install dependencies"
        return $false
    }
}

# Create uploads directory
function New-UploadsDirectory {
    Write-Status "Creating uploads directory..."
    
    try {
        New-Item -ItemType Directory -Path "uploads" -Force | Out-Null
        New-Item -ItemType Directory -Path "src\uploads" -Force | Out-Null
        Write-Success "Uploads directories created"
        return $true
    } catch {
        Write-Error "Failed to create uploads directories"
        return $false
    }
}

# Setup environment file
function Set-EnvironmentFile {
    Write-Status "Setting up environment configuration..."
    
    if (-not (Test-Path ".env")) {
        Write-Warning ".env file not found. Creating template..."
        
        $envContent = @"
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/chat_service

# Server Configuration
PORT=3005
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=52428800
UPLOAD_DIR=./uploads

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Google Cloud Storage (for production)
# GOOGLE_CLOUD_PROJECT_ID=your-project-id
# GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
# GCS_BUCKET_NAME=your-bucket-name
"@
        
        try {
            $envContent | Out-File -FilePath ".env" -Encoding UTF8
            Write-Success ".env template created. Please update with your configuration."
            return $true
        } catch {
            Write-Error "Failed to create .env file"
            return $false
        }
    } else {
        Write-Success ".env file already exists"
        return $true
    }
}

# Check database connection
function Test-DatabaseConnection {
    Write-Status "Checking database connection..."
    
    try {
        # Try to connect to MongoDB using Node.js
        $testScript = @"
const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_service');
        console.log('MongoDB connection successful');
        process.exit(0);
    } catch (error) {
        console.log('MongoDB connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
"@
        
        $testScript | Out-File -FilePath "test-db.js" -Encoding UTF8
        
        try {
            node test-db.js 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Success "MongoDB connection successful"
                Remove-Item "test-db.js" -Force
                return $true
            } else {
                Write-Warning "MongoDB connection failed. Please ensure MongoDB is running."
                Remove-Item "test-db.js" -Force
                return $false
            }
        } catch {
            Write-Warning "MongoDB connection test failed. Please ensure MongoDB is running."
            if (Test-Path "test-db.js") {
                Remove-Item "test-db.js" -Force
            }
            return $false
        }
    } catch {
        Write-Warning "Could not test database connection"
        return $false
    }
}

# Run database migration
function Invoke-DatabaseMigration {
    if ($SkipMigration) {
        Write-Warning "Skipping database migration"
        return $true
    }
    
    Write-Status "Running database migration..."
    
    $migrationScript = @"
const mongoose = require('mongoose');
require('dotenv').config();

async function migrateSenderRole() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat_service');
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const result = await db.collection('messages').updateMany(
            { sender_role: { `$exists: false } },
            { `$set: { sender_role: "user" } }
        );
        
        console.log('Migration completed. Updated ' + result.modifiedCount + ' messages.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateSenderRole();
"@
    
    try {
        $migrationScript | Out-File -FilePath "migrate-sender-role.js" -Encoding UTF8
        
        node migrate-sender-role.js
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Database migration completed"
            Remove-Item "migrate-sender-role.js" -Force
            return $true
        } else {
            Write-Warning "Database migration failed. You may need to run it manually."
            Remove-Item "migrate-sender-role.js" -Force
            return $false
        }
    } catch {
        Write-Warning "Database migration failed. You may need to run it manually."
        if (Test-Path "migrate-sender-role.js") {
            Remove-Item "migrate-sender-role.js" -Force
        }
        return $false
    }
}

# Test the installation
function Test-Installation {
    Write-Status "Testing file upload system..."
    
    $testScript = @"
try {
    require('./src/app.js');
    console.log('✅ App loads successfully');
    process.exit(0);
} catch (error) {
    console.log('❌ App failed to load:', error.message);
    process.exit(1);
}
"@
    
    try {
        $testScript | Out-File -FilePath "test-app.js" -Encoding UTF8
        
        $job = Start-Job -ScriptBlock { 
            Set-Location $using:PWD
            node test-app.js 
        }
        
        $result = Wait-Job $job -Timeout 10
        if ($result) {
            $output = Receive-Job $job
            if ($LASTEXITCODE -eq 0) {
                Write-Success "File upload system is properly configured"
                Remove-Item "test-app.js" -Force
                Remove-Job $job
                return $true
            } else {
                Write-Warning "Service startup test failed. Please check your configuration."
                Remove-Item "test-app.js" -Force
                Remove-Job $job
                return $false
            }
        } else {
            Write-Warning "Service startup test timed out. Please check your configuration."
            Remove-Item "test-app.js" -Force
            Remove-Job $job -Force
            return $false
        }
    } catch {
        Write-Warning "Service startup test failed. Please check your configuration."
        if (Test-Path "test-app.js") {
            Remove-Item "test-app.js" -Force
        }
        return $false
    }
}

# Display next steps
function Show-NextSteps {
    Write-Host ""
    Write-Host "🎉 File Upload System Setup Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Update your .env file with your database and configuration settings" -ForegroundColor Yellow
    Write-Host "2. Start the service: npm run dev" -ForegroundColor Yellow
    Write-Host "3. Test the upload functionality: npm run test:upload" -ForegroundColor Yellow
    Write-Host "4. Integrate the FileUpload component in your frontend" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Documentation:" -ForegroundColor White
    Write-Host "- README_FILE_UPLOAD.md - Complete setup and usage guide" -ForegroundColor Cyan
    Write-Host "- FILE_UPLOAD_RULES.md - Detailed rules and validation logic" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "API Endpoints:" -ForegroundColor White
    Write-Host "- POST /api/file-upload/upload - Upload files" -ForegroundColor Cyan
    Write-Host "- GET /api/file-upload/status/:room_id/:sender_id/:sender_role - Check upload status" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Socket Events:" -ForegroundColor White
    Write-Host "- file_upload - Upload files via WebSocket" -ForegroundColor Cyan
    Write-Host "- check_file_upload_status - Check upload status via WebSocket" -ForegroundColor Cyan
    Write-Host ""
}

# Main setup function
function Start-Setup {
    Write-Host "Starting setup process..." -ForegroundColor White
    Write-Host ""
    
    $success = $true
    
    if (-not (Test-NodeInstallation)) { $success = $false }
    if (-not (Test-NpmInstallation)) { $success = $false }
    if (-not (Install-Dependencies)) { $success = $false }
    if (-not (New-UploadsDirectory)) { $success = $false }
    if (-not (Set-EnvironmentFile)) { $success = $false }
    if (-not (Test-DatabaseConnection)) { $success = $false }
    if (-not (Invoke-DatabaseMigration)) { $success = $false }
    if (-not (Test-Installation)) { $success = $false }
    
    Show-NextSteps
    
    Write-Host ""
    if ($success) {
        Write-Success "Setup completed successfully!"
    } else {
        Write-Warning "Setup completed with some issues. Please review the warnings above."
    }
}

# Run main setup function
Start-Setup 