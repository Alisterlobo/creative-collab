const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tag: { type: String, default: '' }
});

const collabRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
  tasks: [taskSchema],
  isOpen: { type: Boolean, default: true },
  lookingFor: {
    type: String,
    enum: ['Developer', 'Designer', 'Both', 'Other'],
    default: 'Both'
  },
  compensation: {
    type: String,
    enum: ['Credit Exchange', 'Revenue Share', 'Equity', 'Paid'],
    default: 'Credit Exchange'
  },
}, { timestamps: true });

module.exports = mongoose.model('CollabRoom', collabRoomSchema);