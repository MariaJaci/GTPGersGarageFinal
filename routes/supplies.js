// Routes separate from the controllers just to make it cleaner possible
const express = require('express');
const { getSupplies, getSupply } = require('../controllers/supplies');

const router = express.Router();

router.route('/').get(getSupplies);
router.route('/:id').get(getSupply);

module.exports = router;
