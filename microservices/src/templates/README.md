# Email Templates

This directory contains professional email templates for the Agency Service platform.

## OTP Email Template

A comprehensive, responsive email template for sending One-Time Password (OTP) codes to users.

### Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Professional Styling**: Clean, modern design with security-focused messaging
- **Security Warnings**: Built-in security notices and best practices
- **Customizable**: Easy to customize branding, colors, and content
- **Accessibility**: Proper contrast ratios and readable fonts
- **Cross-Client Compatible**: Tested with major email clients

### Files

- `otpEmailTemplate.html` - The main HTML template
- `otpEmailTemplate.js` - JavaScript module for programmatic usage
- `README.md` - This documentation file

### Usage

#### Method 1: Using the JavaScript Module (Recommended)

```javascript
const { generateOTPEmail, generateOTPEmailText } = require('./templates/otpEmailTemplate');

// Generate HTML email
const htmlContent = await generateOTPEmail('123456', {
    userName: 'John Doe',
    companyName: 'Your Company',
    expiryMinutes: 10
});

// Generate plain text version
const textContent = generateOTPEmailText('123456', {
    userName: 'John Doe',
    companyName: 'Your Company',
    expiryMinutes: 10
});

// Send email using your email service
await sendEmail({
    to: 'user@example.com',
    subject: '2FA Verification Code',
    html: htmlContent,
    text: textContent
});
```

#### Method 2: Direct HTML Template Usage

```javascript
const fs = require('fs');
const path = require('path');

// Read template
let template = fs.readFileSync(
    path.join(__dirname, 'templates/otpEmailTemplate.html'), 
    'utf8'
);

// Replace placeholder
template = template.replace('{{OTP_CODE}}', '123456');

// Send email
await sendEmail({
    to: 'user@example.com',
    subject: '2FA Verification Code',
    html: template
});
```

### Integration with Existing Code

To integrate with your existing `userController.js`:

```javascript
// At the top of userController.js
const { generateOTPEmail } = require('../templates/otpEmailTemplate');

// In your OTP sending function
try {
    const otpCode = '123456'; // Your generated OTP
    
    // Generate professional email content
    const emailContent = await generateOTPEmail(otpCode, {
        userName: user.name, // if available
        expiryMinutes: 10
    });
    
    // Send email
    await sendEmail(
        email,
        "2FA Verification Code",
        emailContent, // Use the generated HTML content
        emailContent  // You can also generate plain text version
    );
    
} catch (error) {
    console.error('Error sending OTP email:', error);
}
```

### Customization

#### Colors and Branding

Edit the CSS in `otpEmailTemplate.html` to match your brand:

```css
.header {
    background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

#### Company Information

Update the footer section in the HTML template or use the JavaScript module options:

```javascript
const emailContent = await generateOTPEmail(otpCode, {
    companyName: 'Your Company Name',
    // other options...
});
```

#### OTP Code Styling

Modify the `.otp-code` class in the CSS to change the appearance of the OTP code.

### Security Best Practices

The template includes several security features:

1. **Clear Expiration Notice**: Shows when the code expires
2. **Security Warnings**: Warns users not to share the code
3. **Phishing Protection**: Reminds users that support will never ask for the code
4. **Action Guidance**: Clear instructions on what to do if they didn't request the code

### Testing

Test the template with different email clients:

- Gmail (Web, Mobile)
- Outlook (Web, Desktop, Mobile)
- Apple Mail
- Yahoo Mail
- Thunderbird

### Accessibility

The template follows accessibility best practices:

- High contrast ratios
- Readable font sizes
- Semantic HTML structure
- Alt text for images (if any)
- Screen reader friendly

### Performance

- Inline CSS for better email client compatibility
- Optimized for fast loading
- Minimal external dependencies
- Compressed HTML structure

### Browser Support

The template is tested and works with:

- All modern email clients
- Mobile email apps
- Webmail interfaces
- Legacy email clients (with graceful degradation)

### Troubleshooting

#### Common Issues

1. **Template not loading**: Check file paths and permissions
2. **Styling issues**: Some email clients strip CSS - the template uses inline styles to prevent this
3. **Character encoding**: Ensure UTF-8 encoding for special characters

#### Debug Mode

Enable debug logging in the JavaScript module:

```javascript
const template = new OTPEmailTemplate();
template.debug = true; // Enable debug logging
```

### Contributing

When updating the template:

1. Test with multiple email clients
2. Validate HTML markup
3. Check accessibility compliance
4. Update this documentation
5. Test the JavaScript module functions

### License

This template is part of the Agency Service platform and follows the same licensing terms.