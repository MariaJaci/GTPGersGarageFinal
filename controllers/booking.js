/*Guided Technology Project
Higher Diploma in Computing in Science
CCT College - Dublin
Student: Maria Jaciara Lagares
ID: 2019431 */

const ErrorResponse = require('../utils/errorResponse');
// bring in the async handler class
const asyncHandler = require('../middleware/async');

const Booking = require('../models/Booking');
const User = require('../models/User');
const { findById } = require('../models/Booking');
const Staff = require('../models/Staff');
const Supply = require('../models/Supply');

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
  // Gets the date coming from front (String) and converts it into js Date CHECK THIS!!!

  let bookingDate = new Date(req.body.bookingDate);
  let readableDate = bookingDate.toString();

  //"The getDay() method returns the day of the week (from 0 to 6) for the specified date, Sunday being = 0."
  // https://www.w3schools.com/jsref/jsref_getday.asp
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
  // "The parseFloat() method converts a string into a decimal number. It accepts two arguments. The first argument is the string to convert. The second argument is called the radix. This is the base number used in mathematical systems. In this case it will be 10" - https://gomakethings.com/converting-strings-to-numbers-with-vanilla-javascript/ CHECK WHY IT'S NOT ADDING PRICE AND BOOKING TYPE!!!
  let repairMinimunCost = bookingTypeMinimumCost(req.body.bookingType);
  let total = repairMinimunCost;

  if(isNaN(req.body.price)){
    req.body.price = 0;    
  }

  if(req.body.price > 0){
    total = total + parseFloat(req.body.price); 
  }

  const partsCost = await calculatePartsPrice(req.body.supplies);

  req.body.price = total + partsCost;

  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    //req.body send requests
    new: true, //retuns only the updated booking
    runValidators: true, // run mongoose validators on updates
  });

  // TODO add price of parts CHECK THIS!!!
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

getAllParts = async (partsArray) => {
  // code extracted from https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
  return await Supply.find({
    '_id': { $in: partsArray }
  }, function(err, docs){
      console.log(docs);
  });
};

calculatePartsPrice = async(parts) => {

  let total = 0;
  // console.log("getAllParts");
  const localParts = await getAllParts(parts);
  // console.log(localParts)
  await localParts.forEach(part => {
    total += part.productPrice;
    console.log(part);
  });
  return total;
}
// Calculates the minimum cost for booking type
function bookingTypeMinimumCost(bookingType) {
  let minimunCost = 0;

  switch (bookingType) {
    case 'Major Repair':
      minimunCost = 300;
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
  return minimunCost;
}

// Logic to limite the number of bookings per mechanic. Each mechanic could carry out AT MOST 4 services/repairs in one day. If the booking is a Major Repair then this would count double. CHECH THIS SH%#$$!!!

const mechanic = function (staffId) {
  let tasksPerDay = 0;
  for (tasksPerDay = 0; tasksPerDay < 4; tasksPerDay++) {
    if (tasksPerDay < 4) {
      console.log(`${mechanic} Mechanic can take the tast`);
    } else if (tasksPerDay >= 4) {
      console.log(`${mechanic} Mechanic cannot take the tast`);
    }
  }
};

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
