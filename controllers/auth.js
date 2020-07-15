// Hoock the route to the controllers
// bring in the error response class
const ErrorResponse = require('../utils/errorResponse');
// bring in the async handler class
const asyncHandler = require('../middleware/async');
// bring in the model
// User object can call methods, create, find, etc
const User = require('../models/User');

// @desc  Register user
// @route GET/api/v1/auth/register
// @access Public (don not need a token)
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

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    vehicleMake,
    vehicleEngine,
    vehicleLicense,
  });
  res.status(200).json({ success: true });
});
