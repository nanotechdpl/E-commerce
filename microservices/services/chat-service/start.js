#!/usr/bin/env node

// Simple startup script to help with configuration
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Chat Service...');
console.log('📝 Configuration:');
console.log('   - Port: 3006');
console.log('   - MongoDB: mongodb://localhost:27017/eccommerce');
console.log('   - Redis: Optional (will work without Redis)');
console.log('   - Frontend should connect to: http://localhost:3006');
console.log('');

// Set environment variables
process.env.PORT = process.env.PORT || '3006';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eccommerce';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Start the application
const app = spawn('node', ['src/app.js'], {
    stdio: 'inherit',
    env: process.env
});

app.on('close', (code) => {
    console.log(`\n❌ Chat service exited with code ${code}`);
    process.exit(code);
});

app.on('error', (error) => {
    console.error('❌ Failed to start chat service:', error);
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down chat service...');
    app.kill('SIGINT');
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down chat service...');
    app.kill('SIGTERM');
}); 