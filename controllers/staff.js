// bring in the error response class
const ErrorResponse = require('../utils/errorResponse');
// bring in the async handler class
const asyncHandler = require('../middleware/async');
// bring in the model
// Staff object can call methods, create, find, etc
const Staff = require('../models/Staff');

//Controller methods separate from the routes so it can be neater, using Express Middleware

// @desc  Fetch all staff
// @route GET/api/v1/staff
// @access Public (don not need a token)
exports.getAllStaff = asyncHandler(async (req, res, next) => {
  const allStaff = await Staff.find();
  res
    .status(200)
    .json({ success: true, count: allStaff.length, data: allStaff });
});

// @desc  fetch single staff
// @route GET /api/v1/staff/:id
// @access Public
exports.getStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findById(req.params.id);
  // returns this message if this is a formatted object id but it is not in the database.
  if (!staff) {
    return next(
      new ErrorResponse(`Staff not found with the id ${req.params.id}`, 400)
    );
  }

  res.status(200).json({ success: true, data: staff });
});

// @desc  Create new staff
// @route POST /api/v1/staff
// @access Private
exports.createStaff = asyncHandler(async (req, res, next) => {
  //insert data into the database

  const staff = await Staff.create(req.body);
  // 201 response data created
  res.status(201).json({
    success: true,
    data: staff,
  });
});

// @desc  Update single staff
// @route PUT /api/v1/staff/:id
// @access Private
exports.updateStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    //req.body send requests
    new: true, //retuns only the updated staff
    runValidators: true, // run mongoose validators on updates
  });
  //check if staff exists
  if (!staff) {
    return next(
      new ErrorResponse(`Staff not found with the id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: staff });
});

// @desc  Delete single staff
// @route DELETE /api/v1/staff/:id
// @access Private
exports.deleteStaff = asyncHandler(async (req, res, next) => {
  const staff = await Staff.findByIdAndDelete(req.params.id);

  if (!staff) {
    return next(
      new ErrorResponse(`Staff not found with the id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: {} }); // if success send back an empty object for the data
});
