const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
   {
      user: {
         userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
         fullName: String,
         gender: String,
         age: Number,
      },
      doctor: {
         doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
         },
         FirstName: String,
         gender: String,
         age: Number,
      },
      date: {
         type: Date,
         required: [true, 'Appointment date is required!'],
         validate: {
            validator: function (date) {
               return date.getTime() > Date.now();
            },
            message: 'Invalid Date!',
         },
      },
      dayShift: {
         type: String,
         enum: ['Morning', 'Evening'],
         required: [true, 'DayShift Morning or Evening is required!'],
      },
      resion: {
         type: String,
         required: [true, 'Illness description is required!'],
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
      updatedAt: {
         type: Date,
      },
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

appointmentSchema.pre(/^findById/, function (next) {
   this.find({ status: { $ne: 'canceled' } });
   next();
});

// virtual populate user and doctor when find query runs
appointmentSchema.pre(/^findById/, function (next) {
   this.populate({ path: 'userId', select: '_id name email phone gender' }).populate({
      path: 'doctorId',
      select: '_id firstName lastName email',
   });

   next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);
