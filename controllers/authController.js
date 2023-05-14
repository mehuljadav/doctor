const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createToken = catchAsync(async (user, statusCode, req, res) => {
   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SECRET_EXPIRESIN,
      httpOnly: true,
   });
});

exports.signup = catchAsync(async (req, res, next) => {
   const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfim: req.body.passwordConfim,
   });

   if (!newUser) {
      return next(new AppError('Registration failed, Please try again later!', 401));
   }
   createToken(newUser, 201, req, res);
});

// exports.login = catchAsync(async (req, res, next) => {});

// exports.protect = catchAsync(async (req, res, next) => {});

// exports.restrictTo = catchAsync(async (req, res, next) => {});
