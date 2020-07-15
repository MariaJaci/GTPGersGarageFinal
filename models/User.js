const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 6,
    select: false, // don't return the password
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  phone: {
    type: String,
    maxlength: [12, 'Please number cannot be more than 12 characters long'],
    required: [true, 'Please enter your phone number'],
    unique: true,
  },
  vehicleMake: {
    type: String,
  },
  vehicleEngine: {
    type: String,
  },
  vehicleLicense: {
    type: String,
  },
  /*booking: {
    type: String,
  },*/
});

// Encrypt password using bcrypt. Create some middleware to run before save
UserSchema.pre('save', async function (next) {
  // generate salt to hash the password. 10 is the numbers of rounds suggested
  const salt = await bcrypt.genSalt(10);
  //hash the password with salt
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', UserSchema);
