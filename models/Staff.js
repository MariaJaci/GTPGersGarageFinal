const mongoose = require('mongoose');

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
  },
  address: {
    type: String,
    required: [true, 'Please add an address'],
  },
  role: {
    type: String,
    required: [true, 'Please enter the role'],
    enum: ['admin', 'mechanic'] 
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: 6,
    select: false, // don't return the password
  },
});

module.exports = mongoose.model('Staff', StaffSchema);