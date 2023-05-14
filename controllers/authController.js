const { promisify } = require('util');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createToken = (user, statusCode, req, res) => {
   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
   });

   res.cookie('jwt', token, {
      expires: new Date(
         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
   });

   user.password = undefined;
   res.status(statusCode).json({
      status: 'success',
      token: token,
      data: { user },
   });
};

exports.signup = catchAsync(async (req, res, next) => {
   const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
   });
   console.log(newUser);
   if (!newUser) {
      return next(new AppError('Registration failed, Please try again later!', 401));
   }
   createToken(newUser, 201, req, res);
   next();
});

exports.login = catchAsync(async (req, res, next) => {
   const { email, password } = req.body;
   if (!email || !password) {
      return next(new AppError('Email or Password are required!', 401));
   }
   console.log(req.body);

   const user = await User.findOne({ email }).select('+password');
   console.log('user', user);
   if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Email or Password are not matched!', 401));
   }
   createToken(user, 201, req, res);
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
         new AppError(
            'You are not logged in! Please log book Appointment with Doctor!',
            401
         )
      );
   }

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
   if (!decoded) {
      return next(new AppError('User Authentication failed, please login again!', 401));
   }
   console.log(decoded);
   const decodedUser = await User.findById({ _id: decoded.id });
   if (!decodedUser) {
      return next(
         new AppError('User not found with this token, please login again!', 401)
      );
   }
   req.user = decodedUser;
   res.locals.user = decodedUser;
   next();
});

exports.restrictTo = (...roles) => {
   return (req, res, next) => {
      console.log(req.user);
      if (!roles.includes(req.user.role)) {
         return next(new AppError('Restricted Access!', 403));
      }
      next();
   };
};
