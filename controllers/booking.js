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
const moment = require('moment');
const jwt = require('jsonwebtoken');

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
  // req.body.user = req.params.userId;
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  //This decoded object will have an id property which is the user id. Wherever id has in that token which the user got with logged in with the right credencials will be passed here and will be set to req.user.\
  
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new ErrorResponse(`No user with the id of ${req.params.id}`),
      404
    );
  }

  req.body.userId = user.id;
  // Gets the date coming from front (String) and converts it into js Date CHECK THIS!!!
  // TODO
  let bookingDate = new Date(req.body.bookingDate);
  //TODO: THis will be sent to frontend
  var formatedDate = moment(bookingDate).format('DD/MM/YYYY');

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
  // If user logged in is not staff, they can not update bookings
  const user = await Staff.findById(req.user._id);
  if(!user){
    // The token in cookies does not belong to a staff, so stop their changes as soon as we know
    return next(new ErrorResponse("You have no access to this endpoint", 400));
  }
  // get mechanic 
  const mechanic = await Staff.findById(req.body.staffId);
  // get all bookings from that mechanic
  const bookingWeight = getBookingWeight(req.body.bookingType);
  // verify if mechanic is not too busy
  if(!await canMechanicTakeJob(mechanic._id, bookingWeight)){
    return next(new ErrorResponse("Mechanic is too busy", 400));
  }

  // code came from https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose 
  // Adrian Schneider comment

  // adds booking to mechanic if not too busy
  Staff.update(
    { _id: mechanic._id },
    // Adds  booking id coming from request to mechanic bookings array 
    { $push: { bookings: req.params.id } },
    function(err, doc)  {
      console.log(doc)
    }
  );

  // "The parseFloat() method converts a string into a decimal number. It accepts two arguments. The first argument is the string to convert. The second argument is called the radix. This is the base number used in mathematical systems. In this case it will be 10" - https://gomakethings.com/converting-strings-to-numbers-with-vanilla-javascript/ CHECK WHY IT'S NOT ADDING PRICE AND BOOKING TYPE!!!
  // verifies the minimun cost for booking
  let repairMinimunCost = bookingTypeMinimumCost(req.body.bookingType);
  let total = repairMinimunCost;
  // IT we dont have a price coming from frontend, we create it as 0
  if(isNaN(req.body.price)){
    req.body.price = 0;    
  }

  // if price coming from frontend > 0, we add it to total
  if(req.body.price > 0){
    total = total + parseFloat(req.body.price); 
  }

  // calculates the cost for all parts in update
  const partsCost = await calculatePartsPrice(req.body.supplies);

  // adds all costs together
  req.body.price = total + partsCost;

  // update booking
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
// why we have so many functions: https://en.wikipedia.org/wiki/Single-responsibility_principle
getAllParts = async (partsArray) => {
  // code extracted from https://stackoverflow.com/questions/8303900/mongodb-mongoose-findmany-find-all-documents-with-ids-listed-in-array
  return await Supply.find({
    '_id': { $in: partsArray }
  }, function(err, docs){
      // console.log(docs);
  });
};

calculatePartsPrice = async(parts) => {

  let total = 0;
  const localParts = await getAllParts(parts);
  localParts.forEach(part => {
    total += part.productPrice;
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

function getBookingWeight(bookingsType){
  if(bookingsType == 'Major Repair'){
    return 2;
  }
  return 1;
}

// Logic to limite the number of bookings per mechanic. Each mechanic could carry out AT MOST 4 services/repairs in one day. If the booking is a Major Repair then this would count double. CHECH THIS SH%#$$!!!

canMechanicTakeJob = async (staffId, newBookingWeight) =>{
  //  gets all the bookings for that staff, sums their weight together
  // if their weight > 4, staff is too busy, if not, staff can take job
  let maximumJobsADay = 4;
  let currentJobsNumber = 0;

  const mechanic = await Staff.findOne({ _id : staffId });
  const bookings = await getBookingsById(mechanic.bookings);

  // console.log(bookings)
  /**/
  bookings.forEach(booking => {
    currentJobsNumber += getBookingWeight(booking.bookingType);
  });

  if((currentJobsNumber + newBookingWeight) > maximumJobsADay){
    return false;
  }
  return true;
  /**/
};


getBookingsById = async (bookingsId) => {
  return await Booking.find({
    '_id': { $in: bookingsId }
  }, function(err, docs){
      // console.log(docs);
  });
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
