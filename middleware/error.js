const ErrorResponse = require('../utils/errorResponse');
// custom error handler middleware
const errorHandler = (err, req, res, next) => {
  // make a copy from the error object with the spred operator
  let error = { ...err };

  error.message = err.message;

  //Log to console for dev
  console.log(err);

  // Mongoose bad objectId
  if (err.name === 'CastError') {
    const message = `Resource not found with the id of ${err.value}`;
    // set the error value and pass in the message and status
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    // get the values using Object.values and use map to get only the message of each value
    const message = Object.values(err.errors).map((val) => val.message);
    // and put that in an output message
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
// Code based on Node.js Udemy course.
