const express = require('express');

//CRUD router
const {
  getAllStaff,
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staff');

//Express router
const router = express.Router();

//Attach the methods
router.route('/').get(getAllStaff).post(createStaff);

router.route('/:id').get(getStaff).put(updateStaff).delete(deleteStaff);

//Export the router
module.exports = router;
