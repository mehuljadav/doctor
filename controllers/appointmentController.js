const Appointment = require('../models/appointmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');

exports.bookAppointment = catchAsync(async (req, res, next) => {
   const doctor = await Doctor.findById({ _id: req.body.doctorId });
   console.log(doctor);
   if (!doctor) {
      return next(new AppError('Doctor not found!', 404));
   }

   const newAppointment = await Appointment.create({
      userId: req.user._id,
      doctorId: req.body.doctorId,
      date: req.body.date,
      dayShift: req.body.dayShift,
   });
   if (!newAppointment) {
      return next(new AppError('Cant create Appointment, Please try again later!', 401));
   }

   await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $push: { appointments: newAppointment._id } },
      {
         new: true,
      }
   );

   await Doctor.findByIdAndUpdate(
      { _id: newAppointment.doctorId },
      { $push: { appointments: newAppointment._id } },
      {
         new: true,
      }
   );

   console.log(newAppointment._id);
   res.status(200).json({
      status: 'success',
      data: newAppointment,
   });
});

exports.getAppointments = catchAsync(async (req, res, next) => {
   const appointments = await Appointment.find();
   if (!appointments) {
      return next(new AppError('Appointments not found!', 404));
   }
   res.status(200).json({
      status: 'success',
      data: { appointments },
   });
});

exports.deleteAppo = catchAsync(async (req, res, next) => {
   res.status(200).json({
      status: success,
      message: 'Deleted successfully',
   });
});
