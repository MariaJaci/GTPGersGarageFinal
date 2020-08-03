const express = require('express');
const { getBookings, getBooking } = require('../controllers/booking');

const router = express.Router();

router.route('/').get(getBookings);

router.route('/:id').get(getBooking);

module.exports = router;
