const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);