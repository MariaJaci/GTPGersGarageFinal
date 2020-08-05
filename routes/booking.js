const express = require('express');
const {
  getBookings,
  getBooking,
  makeBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/booking');

//Bring in the protect middleware function so certain routes can be protect when required
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getBookings);

router.route('/:id').get(protect, getBooking);
router
  .route('/:id')
  .post(protect, makeBooking)
  .put(protect, updateBooking)
  .delete(deleteBooking);

module.exports = router;
