import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Test email connection
const testConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Email service connection failed:', error.message);
    return false;
  }
};

// Welcome email template
const getWelcomeEmailTemplate = (userName, userRole) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Message Workflow System</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .welcome-message {
                font-size: 18px;
                color: #2d3748;
                margin-bottom: 20px;
            }
            .user-info {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
            }
            .role-badge {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 14px;
            }
            .features {
                margin: 30px 0;
            }
            .feature-item {
                display: flex;
                align-items: center;
                margin: 15px 0;
                padding: 10px;
                background: #f7fafc;
                border-radius: 6px;
            }
            .feature-icon {
                width: 24px;
                height: 24px;
                margin-right: 15px;
                color: #667eea;
            }
            .footer {
                background: #f7fafc;
                padding: 20px;
                text-align: center;
                color: #718096;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to Message Workflow System</h1>
                <p>Your account has been successfully created!</p>
            </div>
            
            <div class="content">
                <div class="welcome-message">
                    Hello <strong>${userName}</strong>,
                </div>
                
                <p>We're excited to have you join our Message Workflow System! Your account has been successfully created and you can now start managing your messages efficiently.</p>
                
                <div class="user-info">
                    <h3 style="margin-top: 0;">👤 Your Account Details</h3>
                    <p><strong>Name:</strong> ${userName}</p>
                    <p><strong>Role:</strong> <span class="role-badge">${userRole}</span></p>
                </div>
                
                <div class="features">
                    <h3>🚀 What you can do now:</h3>
                    
                    ${userRole === 'Student' ? `
                    <div class="feature-item">
                        <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                        </svg>
                        <div>
                            <strong>Send Messages</strong><br>
                            <span style="color: #718096;">Create and send messages for approval</span>
                        </div>
                    </div>
                    <div class="feature-item">
                        <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                            <strong>Track Status</strong><br>
                            <span style="color: #718096;">Monitor your message approval progress</span>
                        </div>
                    </div>
                    ` : `
                    <div class="feature-item">
                        <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                            <strong>Review Messages</strong><br>
                            <span style="color: #718096;">Approve or reject messages in your workflow</span>
                        </div>
                    </div>
                    <div class="feature-item">
                        <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <div>
                            <strong>Manage Workflow</strong><br>
                            <span style="color: #718096;">Oversee the message approval process</span>
                        </div>
                    </div>
                    `}
                    
                    <div class="feature-item">
                        <svg class="feature-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                            <strong>Manage Profile</strong><br>
                            <span style="color: #718096;">Update your personal information and settings</span>
                        </div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000/login" class="button">Login to Your Account</a>
                </div>
                
                <p style="color: #718096; font-size: 14px;">
                    If you have any questions or need assistance, please don't hesitate to contact our support team.
                </p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Message Workflow System. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Login alert email template
const getLoginAlertTemplate = (userName, loginDate, loginTime, ipAddress) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Alert</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 40px 30px;
            }
            .alert-info {
                background: #f0fff4;
                border: 1px solid #9ae6b4;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
            }
            .info-row:last-child {
                border-bottom: none;
            }
            .info-label {
                font-weight: 600;
                color: #2d3748;
            }
            .info-value {
                color: #4a5568;
            }
            .security-notice {
                background: #fffaf0;
                border: 1px solid #fbd38d;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
            }
            .footer {
                background: #f7fafc;
                padding: 20px;
                text-align: center;
                color: #718096;
                font-size: 14px;
            }
            .icon {
                width: 24px;
                height: 24px;
                margin-right: 10px;
                vertical-align: middle;
            }
            .success-icon {
                color: #48bb78;
            }
            .warning-icon {
                color: #ed8936;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Login Alert</h1>
                <p>Security notification for your account</p>
            </div>
            
            <div class="content">
                <p>Hello <strong>${userName}</strong>,</p>
                
                <p>
                    <svg class="icon success-icon" fill="currentColor" viewBox="0 0 20 20" style="display: inline-block;">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                    </svg>
                    Your account was successfully accessed. Here are the login details:
                </p>
                
                <div class="alert-info">
                    <h3 style="margin-top: 0; color: #2d3748;">📊 Login Information</h3>
                    
                    <div class="info-row">
                        <span class="info-label">📅 Date:</span>
                        <span class="info-value">${loginDate}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">🕒 Time:</span>
                        <span class="info-value">${loginTime}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">🌐 IP Address:</span>
                        <span class="info-value">${ipAddress}</span>
                    </div>
                    
                    <div class="info-row">
                        <span class="info-label">🖥️ Platform:</span>
                        <span class="info-value">Message Workflow System</span>
                    </div>
                </div>
                
                <div class="security-notice">
                    <h3 style="margin-top: 0; color: #d69e2e;">
                        <svg class="icon warning-icon" fill="currentColor" viewBox="0 0 20 20" style="display: inline-block;">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        Security Notice
                    </h3>
                    <p style="margin-bottom: 0;">
                        If this login was not performed by you, please immediately:
                    </p>
                    <ul style="margin: 10px 0;">
                        <li>Change your password</li>
                        <li>Contact system administrator</li>
                        <li>Review your recent account activity</li>
                    </ul>
                </div>
                
                <p style="color: #718096; font-size: 14px;">
                    This is an automated security notification to keep your account safe.
                </p>
            </div>
            
            <div class="footer">
                <p>&copy; 2025 Message Workflow System. All rights reserved.</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Send welcome email
const sendWelcomeEmail = async (userEmail, userName, userRole) => {
  try {
    const mailOptions = {
      from: {
        name: 'Message Workflow System',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: 'Welcome to Message Workflow System',
      html: getWelcomeEmailTemplate(userName, userRole)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send login alert email
const sendLoginAlert = async (userEmail, userName, ipAddress) => {
  try {
    const now = new Date();
    const loginDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const loginTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    const mailOptions = {
      from: {
        name: 'Message Workflow System Security',
        address: process.env.EMAIL_USER
      },
      to: userEmail,
      subject: 'Login Alert - Message Workflow System',
      html: getLoginAlertTemplate(userName, loginDate, loginTime, ipAddress || 'Unknown')
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Login alert email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending login alert email:', error);
    return { success: false, error: error.message };
  }
};

// Send email asynchronously without blocking
const sendEmailAsync = (emailFunction, ...args) => {
  // Send email in background without blocking the response
  setImmediate(async () => {
    try {
      await emailFunction(...args);
    } catch (error) {
      console.error('❌ Background email sending failed:', error);
    }
  });
};

export {
  testConnection,
  sendWelcomeEmail,
  sendLoginAlert,
  sendEmailAsync
};
