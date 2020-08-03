const mongoose = require('mongoose');

// Create a schema, it takes an object along all the fields needed, validation, etc.
const BookingSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: [true, 'Please, enter a price for the service'],
  },

  userId: {
    type: mongoose.Schema.ObjectId, //special mongoose type
    ref: 'User', //tell which model to reference
    required: true,
  },

  /*staffId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Staff',
    required: true,
  },

  supplies: [
    {
      type: mongoose.Schema.ObjectId,
    },
  ],

  bookingType: {
    type: String,
    enum: ['Major Repair', 'Annual Service', 'Major Service', 'Repair / Fault'],
    required: true,
    message: 'Please inform a valid booking type',
  },
  */

  bookingDate: {
    type: Date,
    default: Date.now,
  },

  costumerComments: {
    type: String,
  },

  bookingStatus: {
    type: String,
    enum: [
      'Booked',
      //this is the default status when a booking is made
      'In Service', // when the vehicle arrives at the garage
      'Fixed / Completed', //when the vehicle is ready for collection
      'Collected', //When the customer has taken the vehicle away and paid their bill
      'Unrepairable / Scrapped', // when the fault cannot be fixed.
    ],
  },
});

module.exports = mongoose.model('Booking', BookingSchema);
