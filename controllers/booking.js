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
});
// @desc  Get single booking
// @route GET/api/v1/booking/:id
// @access Public
// @access Private because only logged in user will be able to book
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new ErrorResponse(`No booking found with the id of`), 404);
  }
  res.status(200).json({
    success: true,
    data: booking,
  });
});

// @desc  Make a booking
// @route POST /api/v1/booking/id
// @access Private because only logged in user will be able to book
exports.makeBooking = asyncHandler(async (req, res, next) => {
  req.body.user = req.params.userId;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`No user with the id of ${req.params.id}`),
      404
    );
  }

  req.body.userId = user.id;
  // Gets the date coming from front (String) and converts it into js Date
  // https://www.w3schools.com/jsref/jsref_getday.asp
  const bookingDate = new Date(req.body.bookingDate);

  if (bookingDate.getDay() === 0) {
    return next(new ErrorResponse(`You can't book a service on Sundays`, 401));
  }

  const booking = await Booking.create(req.body);
  // 201 response data created
  res.status(201).json({
    success: true,
    data: booking,
  });
});
// Ger/staff will be able to add any other cost to the costumer service.
// @desc  Update booking
// @route PUT /api/v1/booking/id
// @access Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  // "The parseFloat() method converts a string into a decimal number. It accepts two arguments. The first argument is the string to convert. The second argument is called the radix. This is the base number used in mathematical systems. In this case it will be 10" - https://gomakethings.com/converting-strings-to-numbers-with-vanilla-javascript/
  req.body.price = req.body.price;
  let string = bookingTypeMinimumCost(req.body.bookingType);
  let float = parseFloat(string, 10);
  let total = (req.body.price = req.body.price) + float;

  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    //req.body send requests
    new: true, //retuns only the updated booking
    runValidators: true, // run mongoose validators on updates
  });

  // TODO add price of parts
  if (!booking) {
    return next(
      new ErrorResponse(
        `Booking not found with the id of ${req.params.id}`,
        400
      )
    );
  }
  res.status(200).json({ success: true, data: booking });
});

// all code above is based on Node.js Udemy course.

// Calculates the minimum cost for booking type
function bookingTypeMinimumCost(bookingType) {
  let minimunCost = 0;
  console.log(bookingType);

  switch (bookingType) {
    case 'Major Repair':
      minimunCost = 175;
      break;
    case 'Annual Service':
      minimunCost = 200;
      break;
    case 'Major Service':
      minimunCost = 100;
      break;
    case 'Repair / Fault':
      minimunCost = 75;
      break;
    default:
      minimunCost = 50;
      break;
  }
  console.log('minimunCost', minimunCost);
  return minimunCost;
}

// @desc  Delete single booking
// @route DELETE /api/v1/booking/:id
// @access Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with the id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: {} }); // if success send back an empty object for the data
});
