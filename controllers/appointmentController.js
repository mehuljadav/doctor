const Appointment = require('../models/appointmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Doctor = require('../models/doctorModel');
const User = require('../models/userModel');
const APIFeatures = require('../utils/APIFeatures');

exports.bookAppointment = catchAsync(async (req, res, next) => {
   const bookedAppo = await Appointment.findOne({
      $and: [
         { 'doctor.doctorId': req.body.doctorId },
         { 'user.userId': req.user._id },
         { status: { $ne: 'completed' } },
      ],
   });
   console.log('Booked AppointMent is : ', bookedAppo);
   if (bookedAppo) {
      return next(new AppError('Appointment already booked!', 401));
   }

   const doctor = await Doctor.findById({ _id: req.body.doctorId });
   if (!doctor) {
      return next(new AppError('Doctor not found!', 404));
   }

   const newAppointment = await Appointment.create({
      user: {
         userId: req.user._id,
         fullName: `${req.user.firstName} ${req.user.lastName}`,
         age: req.user.age,
         gender: req.user.gender,
      },
      doctor: {
         doctorId: doctor._id,
         fullName: `${doctor.firstName} ${doctor.lastName}`,
         age: doctor.age,
         gender: doctor.gender,
      },
      date: req.body.date,
      dayShift: req.body.dayShift,
      resion: req.body.resion,
   });
   if (!newAppointment) {
      return next(
         new AppError('Cant create new Appointment, Please try again later!', 401)
      );
   }

   await User.findByIdAndUpdate(
      { _id: req.user._id },
      { $push: { appointments: newAppointment._id } },
      {
         new: true,
      }
   );

   await Doctor.findByIdAndUpdate(
      { _id: newAppointment.doctor.doctorId },
      { $push: { appointments: newAppointment._id } },
      {
         new: true,
      }
   );

   res.status(200).json({
      status: 'success',
      data: newAppointment,
   });
});
exports.getAppointments = catchAsync(async (req, res, next) => {
   console.log(req.query);
   const feature = new APIFeatures(Appointment.find(), req.query).filter();
   const appointments = await feature.query;
   if (!appointments) {
      return next(new AppError('Appointments not found!', 404));
   }
   res.status(200).json({
      status: 'success',
      length: appointments.length,
      data: { appointments },
   });
});

exports.getAppointment = catchAsync(async (req, res, next) => {
   const appointment = await Appointment.findById({ _id: req.params.id });
   if (!appointment) {
      return next(new AppError('Appointment not found!', 404));
   }
   res.status(200).json({
      status: 'success',
      data: { appointment },
   });
});

exports.cancelAppointment = catchAsync(async (req, res, next) => {
   console.log('you are here', req.params.id);
   const appointment = await Appointment.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status: 'canceled' } },
      { new: true }
   );
   if (!appointment) {
      return next(
         new AppError('Error while canceling you Appointment, please try later!', 401)
      );
   }
   res.status(200).json({
      status: 'success',
      message: 'your Appointment canceled!',
   });
});

exports.updateAppointment = catchAsync(async (req, res, next) => {
   req.body.updatedAt = Date.now();
   const appointment = await Appointment.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      {
         new: true,
         runValidators: true,
      }
   );
   if (!appointment) {
      return next(
         new AppError('Error while updating you Appointment, please try later!', 401)
      );
   }

   res.status(200).json({
      status: 'success',
      data: { appointment },
   });
});

exports.deleteAppointment = catchAsync(async (req, res, next) => {
   const appointment = await Appointment.findByIdAndDelete({ _id: req.params.id });
   if (!appointment) {
      return next(new AppError('Appointment not found!', 404));
   }
   res.status(200).json({
      status: 'success',
      data: { appointment },
   });
});
