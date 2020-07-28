// Hoock the route to the controllers
// bring in the error response class
const ErrorResponse = require('../utils/errorResponse');
// bring in the async handler class
const asyncHandler = require('../middleware/async');
// bring in the model
// User object can call methods, register, etc
const User = require('../models/User');

// @desc  Register user
// @route POST/api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  // add register functionality to the controller method and send data in the body when make the post request
  const {
    name,
    email,
    password,
    phone,
    vehicleMake,
    vehicleEngine,
    vehicleLicense,
  } = req.body;

  // Create user. already have validation in the model
  const user = await User.create({
    name,
    email,
    password,
    phone,
    vehicleMake,
    vehicleEngine,
    vehicleLicense,
  });
  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

// @desc  Login user
// @route POST/api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body);
  console.log(email);
  console.log(password);
  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter your email and password', 400));
  }
  // Check for user email comes from the body and check if it matches in the database and also checks for the password
  const user = await User.findOne({ email }).select('+password');
  // make sure user exists
  if (!user) {
    return next(new ErrorResponse('Invalid credentials ', 401)); //401 unauthorized
  }
  //Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials ', 401)); //401 unauthorized
  }
  // Create token and keep going if everything matches
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});
// all code above is based on Node.js Udemy course.
