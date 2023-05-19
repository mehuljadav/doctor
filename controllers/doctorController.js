const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const APIFeatures = require('../utils/APIFeatures');

exports.getDoctors = catchAsync(async (req, res, next) => {
   const features = new APIFeatures(Doctor.find({ active: true }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

   const doctors = await features.query;
   if (!doctors) {
      return next(new AppError('Doctors not found!', 404));
   }
   res.status(200).json({
      status: 'success',
      length: doctors.length,
      data: { doctors },
   });
});

exports.updateDoctor = catchAsync(async (req, res, next) => {
   const doctor = await Doctor.findByIdAndUpdate({ _id: req.doctor.id }, req.body, {
      new: true,
      runValidators: true,
   });
   if (!doctor) {
      return next(new AppError('Doctor not found!', 404));
   }

   res.status(201).json({
      status: 'success',
      data: { doctor },
   });
});

// Admin URLs

exports.getRequestToApprovedDoctors = catchAsync(async (req, res, next) => {
   const doctors = await Doctor.find({ active: { $eq: false } });
   if (!doctors) {
      return next(new AppError('No Doctor(s) found to Approve!', 404));
   }

   res.status(201).json({
      status: 'success',
      totalDoctors: doctors.length,
      data: { doctors },
   });
});

exports.approveDoctor = catchAsync(async (req, res, next) => {
   // const doctor = await Doctor;
   const doctor = await Doctor.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { active: true } },
      {
         new: true,
         runValidators: true,
      }
   );
   if (!doctor) {
      return next(
         new AppError('Doctor not found or not Approved, try again later!', 404)
      );
   }
   res.status(201).json({
      status: 'success',
      data: { doctor },
   });
});
