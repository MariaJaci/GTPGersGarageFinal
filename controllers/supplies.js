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
  const supply = await Supply.findById(req, res, next);

  if (!supply) {
    return next(
      new ErrorResponse(`No supply found with the id of ${req.params.id}`),
      400
    );
  }
  res.status(200).json({
    success: true,
    data: supply,
  });
});
