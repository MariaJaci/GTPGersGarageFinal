// Hoock the route to the controllers
// bring in the error response class
const ErrorResponse = require('../utils/errorResponse');
// bring in the async handler class
const asyncHandler = require('../middleware/async');
// bring in the model
// User object can call methods, register, etc
const User = require('../models/User');
const Staff = require('../models/Staff');

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
  // send a cookie with a token in it
  sendTokenResponse(user, 200, res);
});

// @desc  Login user
// @route POST/api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

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
  sendTokenResponse(user, 200, res);
});

exports.staffLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter your email and password', 400));
  }
  // Check for user email comes from the body and check if it matches in the database and also checks for the password
  const staff = await Staff.findOne({ email }).select('+password');
  // make sure user exists
  if (!staff) {
    return next(new ErrorResponse('Invalid credentials ', 401)); //401 unauthorized
  }
  //Check if password matches
  const isMatch = await staff.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials ', 401)); //401 unauthorized
  }
  sendTokenResponse(staff, 200, res);
});
// 01/08 Create costum function that will get token from model, create cookie, send response and store in the browser. Pass in 3 parameters: user, status code and response object, to access them
const sendTokenResponse = (user, statusCode, res) => {
  //create the token
  const token = user.getSignedJwtToken();
  // create the cookie set the experation for 30 days
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //the cookie will only be accessd throught the client side script
    httpOnly: true,
  };
  // sending the token back in a response and also setting a cookie, it's up the the client side how it will be handled.
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

// all code above is based on Node.js Udemy course.
