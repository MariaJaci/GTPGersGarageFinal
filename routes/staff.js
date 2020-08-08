const express = require('express');

//CRUD router
const {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staff');
const { staffLogin } = require('../controllers/auth'); // SHOULDN'T THIS VARIABLE BE IN ROUTES/AUTH???

//Express router
const router = express.Router();

//Attach the methods
router.route('/').get(getAllStaff).post(createStaff);

router.route('/:id').get(getStaff).put(updateStaff).delete(deleteStaff);

router.route('/login').post(staffLogin);

//Export the router
module.exports = router;
// all code above is based on Node.js Udemy course.
