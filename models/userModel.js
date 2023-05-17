const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please tell us your name!'],
   },
   email: {
      type: String,
      required: [true, 'Please provide your email!'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
   },
   phone: {
      type: Number,
      required: [true, 'Please provide phone number!'],
   },
   gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'User gender is required!'],
   },
   address: {
      type: String,
      maxLength: [100, 'Address cannot be more than 100 character!'],
   },
   photo: String,
   role: {
      type: String,
      enum: ['user', 'Patient'],
      default: 'user',
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
   appointments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Appointment',
      },
   ],
   illnessHistory: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'illnessHistory',
      },
   ],

   active: {
      type: Boolean,
      default: true,
      select: false,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   updatedAt: Date,
});

userSchema.pre('save', async function (next) {
   if (!this.isModified('password')) return next();

   this.password = await bcrypt.hash(this.password, 12);
   console.log(this.password);
   this.passwordConfirm = undefined;
   next();
});

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
   return bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);
