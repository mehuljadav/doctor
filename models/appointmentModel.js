const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
   },
   date: {
      type: Date,
      required: [true, 'Appointment date is required!'],
   },
   dayShift: {
      type: String,
      enum: ['Morning', 'Evening'],
      required: [true, 'DayShift Morning or Evening is required!'],
   },
   status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'canceled'],
      default: 'pending',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model('Appointment', appointmentSchema);
