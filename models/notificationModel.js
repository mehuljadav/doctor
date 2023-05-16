const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
   },
   message: {
      type: String,
      required: [true, 'Notification message is required!'],
   },
   createAt: {
      type: Date,
      default: date.now,
   },
});

module.exports = mongoose.model('Notification', notificationSchema);
