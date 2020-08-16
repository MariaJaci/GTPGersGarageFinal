const ErrorResponse = require('../utils/errorResponse');
// custom error handler middleware
const errorHandler = (err, req, res, next) => {
  // make a copy from the error object with the spred operator
  let error = { ...err };

  error.message = err.message;

  //Log to console for dev
  console.log(err);

  /*"Error Handling Middleware
Middleware execution normally stops the first time a piece of middleware calls next() with an error. However, there is a special kind of post middleware called "error handling middleware" that executes specifically when an error occurs. Error handling middleware is useful for reporting errors and making error messages more readable.
Error handling middleware is defined as middleware that takes one extra parameter: the 'error' that occurred as the first parameter to the function. Error handling middleware can then transform the error however you want." - https://mongoosejs.com/docs/middleware.html */

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
