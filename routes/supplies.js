// Routes separate from the controllers just to make it cleaner possible
const express = require('express');
const {
  getSupplies,
  getSupply,
  addSupply,
  updateSupply,
  deleteSupply,
} = require('../controllers/supplies');

const router = express.Router();

// call controllers methods
router.route('/').get(getSupplies).post(addSupply);
router.route('/:id').get(getSupply).put(updateSupply).delete(deleteSupply);

module.exports = router;
// all code above is based on Node.js Udemy course.
