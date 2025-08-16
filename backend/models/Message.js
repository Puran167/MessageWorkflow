import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  role: String,
  status: String,
  date: Date,
  comment: String
}, { _id: false });

const attachmentSchema = new mongoose.Schema({
  filename: String,
  path: String,
  mimetype: String,
  size: Number
}, { _id: false });

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [attachmentSchema],
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: String, required: true },
  currentRole: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  historyLog: [historySchema]
}, { timestamps: true });

export default mongoose.model('Message', messageSchema);
