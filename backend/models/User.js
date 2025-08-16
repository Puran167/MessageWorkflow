import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Teacher', 'HOD', 'Principal', 'Director', 'CEO', 'Chairman'], required: true },
  department: { type: String, enum: ['Computer Science', 'Information Technology', 'MBA', 'Hotel Management', 'BBA'], required: function() { return ['Student','Teacher','HOD','Principal'].includes(this.role); } },
  rollNumber: { type: String },
  yearSemester: { type: String },
  phoneNumber: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
