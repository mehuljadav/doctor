const { promisify } = require('util');
const Doctor = require('../models/doctorModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createToken = (doctor, statusCode, req, res) => {
   const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
   });

   res.cookie('jwt', token, {
      expires: new Date(
         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
   });

   doctor.password = undefined;
   res.status(statusCode).json({
      status: 'success',
      token: token,
      data: { doctor },
   });
};

exports.signup = catchAsync(async (req, res, next) => {
   const newDoctor = await Doctor.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      photo: req.body.photo,
      gender: req.body.gender,
      age: req.body.age,
      language: req.body.language,
      description: req.body.description,
      address: {
         street: req.body.address.street,
         city: req.body.address.city,
         pincode: req.body.address.pincode,
      },

      degrees: req.body.degrees,
      experience: req.body.experience,
      timeAvailability: req.body.timeAvailability,
   });
   console.log(newDoctor);
   if (!newDoctor) {
      return next(new AppError('Registration failed, Please try again later!', 401));
   }
   createToken(newDoctor, 201, req, res);
   next();
});

exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return next(new AppError('Email or Password are required!', 401));
   }
   console.log(req.body);

   const doctor = await Doctor.findOne({ email }).select('+password');
   console.log('doctor', doctor);
   if (!doctor || !(await doctor.comparePassword(password, doctor.password))) {
      return next(new AppError('Email or Password are not matched!', 401));
   }
   createToken(doctor, 201, req, res);
   next();
});

exports.protect = catchAsync(async (req, res, next) => {
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   } else {
      token = req.cookies.jwt;
   }
   if (!token) {
      return next(
         new AppError('You are not logged in! Please login to get access!', 401)
      );
   }

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
   if (!decoded) {
      return next(new AppError('Doctor Authentication failed, please login again!', 401));
   }
   console.log(decoded);
   const decodedDoctor = await Doctor.findById({ _id: decoded.id });
   if (!decodedDoctor) {
      return next(
         new AppError('Doctor not found with this token, please login again!', 401)
      );
   }
   req.doctor = decodedDoctor;
   res.locals.doctor = decodedDoctor;
   next();
});

exports.logout = async (req, res) => {
   res.cookie('jwt', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
   });

   res.status(200).json({
      status: 'success',
      message: 'logout successfull',
   });
};

exports.restrictTo = (...roles) => {
   return (req, res, next) => {
      console.log(req.doctor);
      if (!roles.includes(req.doctor.role)) {
         return next(new AppError('Restricted Access!', 403));
      }
      next();
   };
};
