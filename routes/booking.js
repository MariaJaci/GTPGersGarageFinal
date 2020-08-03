const express = require('express');
const { getBookings, getBooking, makeBooking } = require('../controllers/booking');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getBookings);

// router.route('/:id').get(getStaff);

router.route('/:id').get(protect, getBooking);
router.route('/:id').post(protect, makeBooking);

module.exports = router;
