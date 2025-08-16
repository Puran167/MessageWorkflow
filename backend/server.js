import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import emailTestRoutes from './routes/emailTest.js';
import { testConnection } from './services/emailService.js';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('MONGO_URI:', process.env.MONGO_URI ? 'Found' : 'Not found');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Found' : 'Not found');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Found' : 'Not found');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Found (Hidden)' : 'Not found');
console.log('Environment file loaded:', process.env.NODE_ENV || 'development');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://officialmrpuran167:2237433@cluster0.uampky2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => {
    console.log('MongoDB connected');
    // Test email service connection after DB connection
    testConnection();
  })
  .catch(err => console.error(err));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/email-test', emailTestRoutes);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
