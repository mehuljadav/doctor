const mongoose = require('mongoose');
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
   address: {
      type: String,
      required: [true, 'Please provide your address!'],
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
      minlength: 8,
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

module.exports = mongoose.model('User', userSchema);
