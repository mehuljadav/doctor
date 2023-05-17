const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

exports.getDoctors = catchAsync(async (req, res, next) => {
   const doctors = await Doctor.find();
   if (!doctors) {
      return next(new AppError('Doctors not found!', 404));
   }
   res.status(200).json({
      status: 'success',
      length: doctors.length,
      data: { doctors },
   });
});
