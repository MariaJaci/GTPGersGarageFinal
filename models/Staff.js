const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create a schema, it takes an object along all the fields needed, validation, etc.
const StaffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter full name'],
    unique: true,
  },
  phone: {
    type: String,
    maxlength: [12, 'Please number cannot be more than 12 characters'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    required: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  role: {
    type: String,
    required: [true, 'Please enter the role'],
    enum: ['Admin', 'Mechanic'] 
  },
  bookings: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 6,
    select: false, // don't return the password
  },
});


StaffSchema.pre('save', async function (next) {
  // generate salt to hash the password. 10 is the numbers of rounds suggested
  const salt = await bcrypt.genSalt(10);
  //hash the password with salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return with mongoose method
StaffSchema.methods.getSignedJwtToken = function () {
  // call the user pass in the id
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed password in the database using bcrypt with the method called compare
StaffSchema.methods.matchPassword = async function (enteredPassword) {
  // takes in the plain password and then check if it matches the encrypted password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Staff', StaffSchema);