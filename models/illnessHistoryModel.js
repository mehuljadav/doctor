const mongoose = require('mongoose');

const illnessHistorySchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User required to create new illness recored!'],
   },
   doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
   },
   illnessName: {
      type: String,
      required: [true, 'Illness name is must!'],
   },
   description: {
      type: String,
   },
   diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required for history!'],
   },
   prescribedMedication: {
      type: String,
      required: [true, 'Prescribe Medication is required!'],
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model('IllnessHistory', illnessHistorySchema);
