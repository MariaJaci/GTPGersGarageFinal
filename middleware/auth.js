const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
// use protect to limite access to booking routes, only logged in user is able to book a service
//Protect (middleware) routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  //chech the headers for testing on postman
  
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    //verify token. Extract from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);

    req.user = await User.findById(decoded._id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});