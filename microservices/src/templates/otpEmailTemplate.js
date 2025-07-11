const fs = require('fs');
const path = require('path');

/**
 * Professional OTP Email Template Generator
 * 
 * This module provides a clean, professional email template for sending
 * One-Time Password (OTP) codes to users for two-factor authentication.
 * 
 * Features:
 * - Responsive design that works on all devices
 * - Professional styling with security-focused messaging
 * - Clear OTP code display with expiration notice
 * - Security warnings and best practices
 * - Customizable branding and content
 */

class OTPEmailTemplate {
    constructor() {
        this.templatePath = path.join(__dirname, 'otpEmailTemplate.html');
    }

    /**
     * Generate OTP email HTML content
     * @param {Object} options - Template options
     * @param {string} options.otpCode - The OTP code to include
     * @param {string} options.userName - User's name (optional)
     * @param {string} options.companyName - Company name (optional)
     * @param {number} options.expiryMinutes - OTP expiry time in minutes (default: 10)
     * @returns {string} HTML email content
     */
    async generateHTML(options = {}) {
        try {
            const {
                otpCode,
                userName = '',
                companyName = 'Agency Service Platform',
                expiryMinutes = 10
            } = options;

            if (!otpCode) {
                throw new Error('OTP code is required');
            }

            // Read the HTML template
            let htmlTemplate = await fs.promises.readFile(this.templatePath, 'utf8');

            // Replace placeholders
            htmlTemplate = htmlTemplate
                .replace(/{{OTP_CODE}}/g, otpCode)
                .replace(/{{USER_NAME}}/g, userName)
                .replace(/{{COMPANY_NAME}}/g, companyName)
                .replace(/{{EXPIRY_MINUTES}}/g, expiryMinutes)
                .replace(/⏰ This code expires in 10 minutes/g, `⏰ This code expires in ${expiryMinutes} minutes`);

            // Add personalized greeting if userName is provided
            if (userName) {
                htmlTemplate = htmlTemplate.replace(
                    '<div class="greeting">\n                Hello,\n            </div>',
                    `<div class="greeting">\n                Hello ${userName},\n            </div>`
                );
            }

            return htmlTemplate;
        } catch (error) {
            console.error('Error generating OTP email template:', error);
            throw error;
        }
    }

    /**
     * Generate plain text version of the OTP email
     * @param {Object} options - Template options
     * @param {string} options.otpCode - The OTP code to include
     * @param {string} options.userName - User's name (optional)
     * @param {string} options.companyName - Company name (optional)
     * @param {number} options.expiryMinutes - OTP expiry time in minutes (default: 10)
     * @returns {string} Plain text email content
     */
    generatePlainText(options = {}) {
        const {
            otpCode,
            userName = '',
            companyName = 'Agency Service Platform',
            expiryMinutes = 10
        } = options;

        if (!otpCode) {
            throw new Error('OTP code is required');
        }

        const greeting = userName ? `Hello ${userName},` : 'Hello,';

        return `
${greeting}

SECURITY VERIFICATION

We received a request to access your account. To ensure your security, please use the verification code below to complete your sign-in process.

Your Verification Code: ${otpCode}

⏰ This code expires in ${expiryMinutes} minutes

SECURITY NOTICE:
• Never share this code with anyone
• Our team will never ask for this code
• If you didn't request this code, please ignore this email and consider changing your password

If you're having trouble accessing your account, please contact our support team for assistance.

This is an automated message. Please do not reply to this email.

${companyName}
Secure • Reliable • Professional
© 2024 ${companyName}. All rights reserved.
        `.trim();
    }

    /**
     * Validate OTP code format
     * @param {string} otpCode - The OTP code to validate
     * @returns {boolean} True if valid, false otherwise
     */
    static validateOTPFormat(otpCode) {
        // Check if OTP is a string of 4-8 digits
        return /^\d{4,8}$/.test(otpCode);
    }

    /**
     * Generate a random OTP code
     * @param {number} length - Length of the OTP (default: 6)
     * @returns {string} Generated OTP code
     */
    static generateOTP(length = 6) {
        if (length < 4 || length > 8) {
            throw new Error('OTP length must be between 4 and 8 digits');
        }

        let otp = '';
        for (let i = 0; i < length; i++) {
            otp += Math.floor(Math.random() * 10);
        }
        return otp;
    }
}

// Export both the class and a convenience function
module.exports = {
    OTPEmailTemplate,
    
    /**
     * Quick function to generate OTP email HTML
     * @param {string} otpCode - The OTP code
     * @param {Object} options - Additional options
     * @returns {Promise<string>} HTML email content
     */
    async generateOTPEmail(otpCode, options = {}) {
        const template = new OTPEmailTemplate();
        return await template.generateHTML({ otpCode, ...options });
    },

    /**
     * Quick function to generate OTP email plain text
     * @param {string} otpCode - The OTP code
     * @param {Object} options - Additional options
     * @returns {string} Plain text email content
     */
    generateOTPEmailText(otpCode, options = {}) {
        const template = new OTPEmailTemplate();
        return template.generatePlainText({ otpCode, ...options });
    }
};

// Example usage:
/*
const { generateOTPEmail, generateOTPEmailText } = require('./otpEmailTemplate');

// Generate HTML email
const htmlEmail = await generateOTPEmail('123456', {
    userName: 'John Doe',
    expiryMinutes: 15
});

// Generate plain text email
const textEmail = generateOTPEmailText('123456', {
    userName: 'John Doe',
    expiryMinutes: 15
});
*/