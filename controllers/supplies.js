const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Supply = require('../models/Supply');

// @desc  Fetch all supplies
// @route GET/api/v1/supplies
// @access Public
exports.getSupplies = asyncHandler(async (req, res, next) => {
  const supplies = await Supply.find();
  res
    .status(200)
    .json({ success: true, count: supplies.length, data: supplies });
});

// @desc  Fetch single supply
// @route GET/api/v1/supplies/:id
// @access Public
exports.getSupply = asyncHandler(async (req, res, next) => {
  const supply = await Supply.findById(req.params.id);

  if (!supply) {
    return next(
      new ErrorResponse(`No supply found with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: supply,
  });
});

// @desc  Add new supply
// @route POST /api/v1/supplies
// @access Private
exports.addSupply = asyncHandler(async (req, res, next) => {
  //insert data into the database

  const supply = await Supply.create(req.body);
  // 201 response data created
  res.status(201).json({
    success: true,
    data: supply,
  });
});

// @desc  Update supply
// @route PUT /api/v1/supplies/:id
// @access Private
exports.updateSupply = asyncHandler(async (req, res, next) => {
  let supply = await Supply.findById(req.params.id);

  if (!supply) {
    return next(
      new ErrorResponse(`No supply found with the id of ${req.params.id}`),
      404
    );
  }
  supply = await Supply.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: supply,
  });
});

// @desc  Delete supply
// @route DELETE /api/v1/supplies/:id
// @access Private
exports.deleteSupply = asyncHandler(async (req, res, next) => {
  const supply = await Supply.findById(req.params.id);

  if (!supply) {
    return next(
      new ErrorResponse(`No supply found with the id of ${req.params.id}`),
      404
    );
  }
  await supply.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
// all code above is based on Node.js Udemy course.
