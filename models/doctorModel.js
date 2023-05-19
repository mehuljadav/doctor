const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: [true, 'FirstName is required!'],
         trim: true,
      },
      lastName: {
         type: String,
         required: [true, 'LastName is required!'],
         trim: true,
      },
      email: {
         type: String,
         required: [true, 'Email address is required!'],
         unique: true,
         lowercase: true,
         validate: [validator.isEmail, 'Email address is not valid!'],
      },
      password: {
         type: String,
         required: [true, 'Please provide a password'],
         minlength: 6,
         select: false,
      },
      passwordConfirm: {
         type: String,
         required: [true, 'Please confirm your password'],
         validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
               return el === this.password;
            },
            message: 'Passwords are not the same!',
         },
      },
      photo: String,
      gender: {
         type: String,
         enum: ['male', 'female', 'other'],
         required: [true, 'Doctor gender is required!'],
      },
      age: {
         type: Number,
         required: [true, 'Doctor age is required! '],
         min: [21, 'Doctor age cannot be less then 21 years!'],
         max: [100, 'Doctor age cannot be more then 100 years!'],
      },
      languages: [
         {
            type: String,
            required: [true, 'Language(s) is required!'],
         },
      ],
      description: {
         type: String,
         required: [true, 'Short description about doctor is required!'],
      },
      address: {
         street: {
            type: String,
            required: [true, 'Street Address is required!'],
         },
         city: {
            type: String,
            required: [true, 'City is required!'],
         },
         pincode: {
            type: Number,
            required: [true, 'service area pincode is required!'],
         },
         state: {
            type: String,
            default: 'Gujarat',
         },
      },
      degrees: [
         {
            type: String,
            required: [true, 'Doctor degree(s) is required!'],
         },
      ],
      experience: {
         type: String,
         enum: [
            'fresher',
            '0 to 2 years',
            '2 to 4 years',
            '4 to 10 years',
            'more then 10 years',
         ],
         required: [true, 'Doctor experience is required!'],
      },
      timeAvailability: [
         {
            day: { type: String },
            morningStart: { type: String },
            morningEnd: { type: String },
            eveningStart: { type: String },
            eveningEnd: { type: String },
            isAvailable: { type: Boolean, default: true },
         },
      ],
      role: {
         type: String,
         default: 'doctor',
      },
      appointments: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
         },
      ],
      active: {
         type: Boolean,
         default: false,
         select: false,
      },
      createdAt: {
         type: Date,
         default: Date.now,
      },
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   }
);

doctorSchema.pre(/^find/, function (next) {
   this.find({ active: { $eq: true } });
   next();
});

doctorSchema.virtual('fullName').get(function () {
   return `${this.firstName} ${this.lastName}`;
});
doctorSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();

   this.password = await bcrypt.hash(this.password, 12);
   console.log(this.password);
   this.passwordConfirm = undefined;
   next();
});

doctorSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
   return bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('Doctor', doctorSchema);
