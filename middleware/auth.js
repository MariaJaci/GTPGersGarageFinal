const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const Staff = require('../models/Staff');
// Use protect to limite access to booking routes, only logged in user is able to book a service
//Protect (middleware) routes
exports.protect = asyncHandler(async (req, res, next) => {
  //CHECK IF PROTECT IS WORKING!!!
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
    //This decoded object will have an id property which is the user id. Wherever id has in that token which the user got with logged in with the right credencials will be passed here and will be set to req.user.\
    
    const user = await User.findById(decoded.id);
    req.user = user;

    if(!user){
      // User not found, perhaps it is a staff login?
      const staff = await Staff.findById(decoded.id);
      if(!staff){
        return next(new ErrorResponse('Not authorized to access this route', 401));
      }
      req.user = staff
    }
    
    console.log(req.user)

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});
