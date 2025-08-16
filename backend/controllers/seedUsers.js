import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const departments = ['Computer Science', 'Information Technology', 'MBA', 'Hotel Management', 'BBA'];

const users = [
  // Create users for each department
  ...departments.flatMap(dept => [
    { name: `${dept} HOD`, role: 'HOD', department: dept, email: `hod.${dept.toLowerCase().replace(' ', '')}@example.com`, password: 'password123' },
    { name: `${dept} Principal`, role: 'Principal', department: dept, email: `principal.${dept.toLowerCase().replace(' ', '')}@example.com`, password: 'password123' },
    { name: `${dept} Teacher`, role: 'Teacher', department: dept, email: `teacher.${dept.toLowerCase().replace(' ', '')}@example.com`, password: 'password123' }
  ]),
  // Global roles
  { name: 'Director', role: 'Director', email: 'director@example.com', password: 'password123' },
  { name: 'CEO', role: 'CEO', email: 'ceo@example.com', password: 'password123' },
  { name: 'Chairman', role: 'Chairman', email: 'chairman@example.com', password: 'password123' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        u.password = await bcrypt.hash(u.password, 10);
        await User.create(u);
        console.log('Created:', u.email);
      } else {
        console.log('Already exists:', u.email);
      }
    }
    console.log('Seeding complete');
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.disconnect();
  }
}

seed();
