const otpTemplate = ({ otpCode, companyName }) => {
  return `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Two-Factor Authentication Code</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #555555;
            margin-bottom: 30px;
        }
        .otp-container {
            background-color: #f8f9fa;
            border: 2px dashed #dee2e6;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-label {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #495057;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        .otp-validity {
            font-size: 12px;
            color: #dc3545;
            margin-top: 10px;
        }
        .security-notice {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px 20px;
            margin: 30px 0;
            border-radius: 4px;
        }
        .security-notice h3 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 16px;
        }
        .security-notice p {
            margin: 0;
            color: #856404;
            font-size: 14px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #dee2e6;
        }
        .footer p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
        }
        .company-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
        }
        .company-info p {
            margin: 5px 0;
            font-size: 12px;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
            }
            .header, .content, .footer {
                padding: 20px !important;
            }
            .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Security Verification</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello,
            </div>
            
            <div class="message">
                We received a request to access your account. To ensure your security, please use the verification code below to complete your sign-in process.
            </div>
            
            <div class="otp-container">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otpCode}</div>
                <div class="otp-validity">⏰ This code expires in 10 minutes</div>
            </div>
            
            <div class="security-notice">
                <h3>🛡️ Security Notice</h3>
                <p>
                    • Never share this code with anyone<br>
                    • Our team will never ask for this code<br>
                    • If you didn't request this code, please ignore this email and consider changing your password
                </p>
            </div>
            
            <div class="message">
                If you're having trouble accessing your account, please contact our support team for assistance.
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            
            <div class="company-info">
                <p><strong>Agency Service Platform</strong></p>
                <p>Secure • Reliable • Professional</p>
                <p>© 2024 Agency Service. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = {
  otpTemplate,
};
