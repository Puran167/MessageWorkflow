import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/sendEmail.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG, and GIF files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Create message (Student)
router.post('/', authenticate, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, content } = req.body;
    const sender = req.user;
    if (sender.role !== 'Student') return res.status(403).json({ error: 'Only students can send messages' });
    
    // Find teacher in the same department
    const teacher = await User.findOne({ role: 'Teacher', department: sender.department });
    if (!teacher) return res.status(404).json({ error: 'No teacher found in department' });
    
    // Process uploaded files
    const attachments = req.files ? req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    })) : [];
    
    const message = new Message({
      title,
      content,
      attachments: attachments,
      sender: sender._id,
      department: sender.department,
      currentRole: 'Teacher',
      status: 'Pending',
      historyLog: [{ role: 'Student', status: 'Sent', date: new Date(), comment: 'Message created' }]
    });
    
    await message.save();
    await message.populate('sender');
    
    // Create notification for teacher
    await Notification.create({
      user: teacher._id,
      message: `New message from ${sender.name}: "${title}"`,
      type: 'in-app'
    });
    
    // Send email notification
    try {
      await sendEmail(teacher.email, 'New Message for Approval', 
        `You have received a new message for approval from ${sender.name}.\nTitle: ${title}\nContent: ${content}\nAttachments: ${attachments.length} file(s)`);
    } catch (emailError) {
      console.log('Email notification failed:', emailError.message);
    }
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('messageUpdate', { messageId: message._id, type: 'new', currentRole: 'Teacher' });
    }
    
    res.status(201).json(message);
  } catch (err) {
    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 10MB per file.' });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Too many files. Maximum 5 files allowed.' });
      }
    }
    
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// Get messages for current user (role-based)
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user;
    let query = {};
    
    if (['Teacher','HOD','Principal'].includes(user.role)) {
      query = { department: user.department, currentRole: user.role };
    } else if (['Director','CEO','Chairman'].includes(user.role)) {
      query = { currentRole: user.role };
    } else if (user.role === 'Student') {
      query = { sender: user._id };
    }
    
    const messages = await Message.find(query).populate('sender').sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single message
router.get('/:id', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id).populate('sender');
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Approve/Reject/Forward message
router.post('/:id/action', authenticate, async (req, res) => {
  try {
    const { action, comment } = req.body;
    const user = req.user;
    const message = await Message.findById(req.params.id).populate('sender');
    if (!message) return res.status(404).json({ error: 'Message not found' });
    
    // Check if user is authorized for this message
    if (message.currentRole !== user.role) {
      return res.status(403).json({ error: 'Not authorized for this message' });
    }
    
    // Role-based workflow
    const workflow = {
      'Teacher': 'HOD',
      'HOD': 'Principal', 
      'Principal': 'Director',
      'Director': 'CEO',
      'CEO': 'Chairman',
      'Chairman': null
    };
    
    let nextRole = workflow[user.role];
    let nextUser = null;
    
    if (action === 'Approve') {
      message.historyLog.push({ 
        role: user.role, 
        status: 'Approved', 
        date: new Date(), 
        comment: comment || `Approved by ${user.name}` 
      });
      
      if (nextRole) {
        // Find next user in workflow
        if (['Teacher', 'HOD', 'Principal'].includes(nextRole)) {
          nextUser = await User.findOne({ role: nextRole, department: message.department });
        } else {
          nextUser = await User.findOne({ role: nextRole });
        }
        
        if (nextUser) {
          message.currentRole = nextRole;
          // Create notification for next user
          await Notification.create({
            user: nextUser._id,
            message: `Message "${message.title}" forwarded for your approval`,
            type: 'in-app'
          });
          
          // Send email
          try {
            await sendEmail(nextUser.email, 'Message for Approval', 
              `A message has been forwarded to you for approval.\nTitle: ${message.title}\nFrom: ${message.sender.name}`);
          } catch (emailError) {
            console.log('Email notification failed:', emailError.message);
          }
        }
      } else {
        message.status = 'Approved';
      }
    } else if (action === 'Reject') {
      message.historyLog.push({ 
        role: user.role, 
        status: 'Rejected', 
        date: new Date(), 
        comment: comment || `Rejected by ${user.name}` 
      });
      message.status = 'Rejected';
    } else if (action === 'Forward') {
      if (!nextRole) return res.status(400).json({ error: 'Cannot forward further' });
      
      if (['Teacher', 'HOD', 'Principal'].includes(nextRole)) {
        nextUser = await User.findOne({ role: nextRole, department: message.department });
      } else {
        nextUser = await User.findOne({ role: nextRole });
      }
      
      if (!nextUser) return res.status(404).json({ error: `No ${nextRole} found` });
      
      message.historyLog.push({ 
        role: user.role, 
        status: 'Forwarded', 
        date: new Date(), 
        comment: comment || `Forwarded by ${user.name}` 
      });
      message.currentRole = nextRole;
      
      // Create notification
      await Notification.create({
        user: nextUser._id,
        message: `Message "${message.title}" forwarded to you`,
        type: 'in-app'
      });
      
      // Send email
      try {
        await sendEmail(nextUser.email, 'Message Forwarded', 
          `A message has been forwarded to you.\nTitle: ${message.title}\nFrom: ${message.sender.name}`);
      } catch (emailError) {
        console.log('Email notification failed:', emailError.message);
      }
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }
    
    await message.save();
    
    // Notify sender about status change
    await Notification.create({
      user: message.sender._id,
      message: `Your message "${message.title}" has been ${action.toLowerCase()} by ${user.role}`,
      type: 'in-app'
    });
    
    // Send email to sender
    try {
      await sendEmail(message.sender.email, `Message ${action}`, 
        `Your message "${message.title}" has been ${action.toLowerCase()} by ${user.role}.\nComment: ${comment || 'No comment'}`);
    } catch (emailError) {
      console.log('Email notification failed:', emailError.message);
    }
    
    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('messageUpdate', { messageId: message._id, type: action.toLowerCase(), currentRole: message.currentRole });
    }
    
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

// Serve uploaded files
router.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(process.cwd(), 'uploads', filename);
  res.sendFile(filePath);
});
