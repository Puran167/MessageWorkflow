import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail, sendLoginAlert, sendEmailAsync } from '../services/emailService.js';

const router = express.Router();

// Student Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, rollNumber, department, yearSemester, phoneNumber } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role: 'Student', 
      department, 
      rollNumber, 
      yearSemester, 
      phoneNumber 
    });
    
    await user.save();
    
    // Send welcome email asynchronously (non-blocking)
    sendEmailAsync(sendWelcomeEmail, email, name, 'Student');
    
    res.status(201).json({ 
      message: 'Registration successful',
      emailSent: 'Welcome email will be sent to your registered email address'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login (All roles)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'puranApprovalApp@123', 
      { expiresIn: '1d' }
    );
    
    // Get client IP address
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
                     req.ip ||
                     'Unknown';
    
    // Send login alert email asynchronously (non-blocking)
    sendEmailAsync(sendLoginAlert, user.email, user.name, ipAddress);
    
    // Return success response immediately
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role, 
        department: user.department,
        rollNumber: user.rollNumber,
        yearSemester: user.yearSemester,
        phoneNumber: user.phoneNumber
      },
      loginAlert: 'A login alert has been sent to your email address'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
