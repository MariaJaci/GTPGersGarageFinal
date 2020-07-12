const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Supply = require('../models/Supply');

const { query } = require('express');

// @desc  Fetch supplies
// @route GET/api/v1/supplies
// @access Public
exports.getSupplies = asyncHandler(async (req, res, next) => {
  let query;
  query = Supplies.find();
  const supplies = await query;

  res.status(200).json({
    success: true,
    count: supplies.length,
    data: supplies,
  });
});
