const ErrorResponse = require('../utils/errorResponse');
// bring in the async handler class
const asyncHandler = require('../middleware/async');

const Booking = require('../models/Booking');
const User = require('../models/User');
const {
  findById
} = require('../models/Booking');

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
    return next(
      new ErrorResponse(`No booking found with the id of`),
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

  if(bookingDate.getDay() === 0){
    return next(
      new ErrorResponse(`You can't book service on Sundays`, 400)
    );
  }

  const booking = await Booking.create(req.body);
  // 201 response data created
  res.status(201).json({
    success: true,
    data: booking,
  });
});

exports.updateBooking = asyncHandler(async (req, res, next) => {
  // TODO add numbers together rather than concatenate them (TIP Javascript type cast from string to number)
  req.body.price = req.body.price + bookingTypeMinimumCost(req.body.bookingType);

  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    //req.body send requests
    new: true, //retuns only the updated staff
    runValidators: true, // run mongoose validators on updates
  });
  //check if staff exists
  
// TODO add price of parts
  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with the id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({ success: true, data: booking });
});

// all code above is based on Node.js Udemy course.i
// Calculates the minimum cost for booking type
function bookingTypeMinimumCost(bookingType) {

  let minimunCost = 0;
  console.log(bookingType)

  switch (bookingType) {
    case "Major Repair":
      minimunCost = 175;
      break;
    case "Annual Service":
      minimunCost = 200;
      break;
    case "Major Service":
      minimunCost = 100;
      break;
    case "Repair / Fault":
      minimunCost = 75;
      break;
    default:
      minimunCost = 50;
      break;
  }
 console.log("minimunCost", minimunCost)
  return minimunCost;
}