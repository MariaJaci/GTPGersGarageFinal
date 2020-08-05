const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
// Use protect to limite access to booking routes, only logged in user is able to book a service
//Protect (middleware) routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

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
    //This decoded object will have an id property which is the user id. Wherever id has in that token which the user got with logged in with the right credencials will be passed here and will be set to req.user.
    req.user = await User.findById(decoded._id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});
