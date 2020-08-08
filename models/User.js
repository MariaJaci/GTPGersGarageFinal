const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    maxlength: [
      12,
      'Please phone number cannot be more than 12 characters long',
    ],
    required: [true, 'Please enter your phone number'],
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
});

// Encrypt password using bcrypt. Create some middleware to run before save
UserSchema.pre('save', async function (next) {
  // generate salt to hash the password. 10 is the numbers of rounds suggested by the documentation.
  const salt = await bcrypt.genSalt(10);
  //hash the password with salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return with mongoose method
UserSchema.methods.getSignedJwtToken = function () {
  // call the user pass in the id
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in the database using bcrypt with the method called compare
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // takes in the plain password and then check if it matches the encrypted password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
// all code above is based on Node.js Udemy course.
