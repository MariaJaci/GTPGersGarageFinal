const ErrorResponse = require('../utils/errorResponse');
// bring in the async handler class
const asyncHandler = require('../middleware/async');

const Booking = require('../models/Booking');
const User = require('../models/User');
const { findById } = require('../models/Booking');

// @desc  Get Bookings
// @route GET/api/v1/booking
// @access Public
exports.getBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find();

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });

  // @desc  Get single booking
  // @route GET/api/v1/booking/:id
  // @access Public
  exports.getBooking = asyncHandler(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(
        new ErrorResponse(`No booking found with the id of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  });

  // @desc  Make a booking
  // @route POST /api/v1/booking
  // @access Private because only logged in user will be able to book
  exports.makeBooking = asyncHandler(async (req, res, next) => {
    req.body.user = req.params.userId;

    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(
        new ErrorResponse(`No user with the id of ${req.params.userId}`),
        404
      );
    }

    const booking = await Booking.create(req.body);
    // 201 response data created
    res.status(201).json({
      success: true,
      data: booking,
    });
  });

  // all code above is based on Node.js Udemy course.
});
