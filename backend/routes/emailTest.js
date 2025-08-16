import express from 'express';
import { sendWelcomeEmail, sendLoginAlert } from '../services/emailService.js';

const router = express.Router();

// Test welcome email
router.post('/test-welcome', async (req, res) => {
  try {
    const { email, name, role } = req.body;
    
    if (!email || !name || !role) {
      return res.status(400).json({ error: 'Email, name, and role are required' });
    }
    
    const result = await sendWelcomeEmail(email, name, role);
    
    if (result.success) {
      res.json({ 
        message: 'Welcome email sent successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send welcome email',
        details: result.error 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test login alert email
router.post('/test-login-alert', async (req, res) => {
  try {
    const { email, name, ip } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }
    
    const ipAddress = ip || req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                     req.ip ||
                     'Unknown';
    
    const result = await sendLoginAlert(email, name, ipAddress);
    
    if (result.success) {
      res.json({ 
        message: 'Login alert email sent successfully',
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        error: 'Failed to send login alert email',
        details: result.error 
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
