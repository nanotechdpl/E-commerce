#!/bin/bash

# File Upload System Setup Script
# This script helps set up the file upload functionality for the chat service

set -e

echo "🚀 Setting up File Upload System for Chat Service"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 16 ]; then
        print_error "Node.js version 16 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    print_status "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    print_success "npm $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Please run this script from the chat-service directory."
        exit 1
    fi
    
    npm install
    
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Create uploads directory
create_uploads_dir() {
    print_status "Creating uploads directory..."
    
    mkdir -p uploads
    mkdir -p src/uploads
    
    print_success "Uploads directories created"
}

# Create environment file if it doesn't exist
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating template..."
        cat > .env << EOF
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
EOF
        print_success ".env template created. Please update with your configuration."
    else
        print_success ".env file already exists"
    fi
}

# Check database connection
check_database() {
    print_status "Checking database connection..."
    
    # This is a basic check - you might want to implement a more robust check
    if command -v mongosh &> /dev/null; then
        if mongosh --eval "db.runCommand('ping')" &> /dev/null; then
            print_success "MongoDB connection successful"
        else
            print_warning "MongoDB connection failed. Please ensure MongoDB is running."
        fi
    else
        print_warning "mongosh not found. Please ensure MongoDB is installed and running."
    fi
}

# Run database migration
run_migration() {
    print_status "Running database migration..."
    
    # Create a simple migration script
    cat > migrate-sender-role.js << 'EOF'
const mongoose = require('mongoose');
require('dotenv').config();

async function migrateSenderRole() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const db = mongoose.connection.db;
        const result = await db.collection('messages').updateMany(
            { sender_role: { $exists: false } },
            { $set: { sender_role: "user" } }
        );
        
        console.log(`Migration completed. Updated ${result.modifiedCount} messages.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateSenderRole();
EOF

    if node migrate-sender-role.js; then
        print_success "Database migration completed"
        rm migrate-sender-role.js
    else
        print_warning "Database migration failed. You may need to run it manually."
    fi
}

# Test the installation
test_installation() {
    print_status "Testing file upload system..."
    
    # Check if the service can start
    if timeout 10s node -e "
        try {
            require('./src/app.js');
            console.log('✅ App loads successfully');
            process.exit(0);
        } catch (error) {
            console.log('❌ App failed to load:', error.message);
            process.exit(1);
        }
    " > /dev/null 2>&1; then
        print_success "File upload system is properly configured"
    else
        print_warning "Service startup test failed. Please check your configuration."
    fi
}

# Display next steps
show_next_steps() {
    echo ""
    echo "🎉 File Upload System Setup Complete!"
    echo "====================================="
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with your database and configuration settings"
    echo "2. Start the service: npm run dev"
    echo "3. Test the upload functionality: npm run test:upload"
    echo "4. Integrate the FileUpload component in your frontend"
    echo ""
    echo "Documentation:"
    echo "- README_FILE_UPLOAD.md - Complete setup and usage guide"
    echo "- FILE_UPLOAD_RULES.md - Detailed rules and validation logic"
    echo ""
    echo "API Endpoints:"
    echo "- POST /api/file-upload/upload - Upload files"
    echo "- GET /api/file-upload/status/:room_id/:sender_id/:sender_role - Check upload status"
    echo ""
    echo "Socket Events:"
    echo "- file_upload - Upload files via WebSocket"
    echo "- check_file_upload_status - Check upload status via WebSocket"
    echo ""
}

# Main setup function
main() {
    echo "Starting setup process..."
    echo ""
    
    check_node
    check_npm
    install_dependencies
    create_uploads_dir
    setup_environment
    check_database
    run_migration
    test_installation
    show_next_steps
    
    echo ""
    print_success "Setup completed successfully!"
}

# Run main function
main "$@" 