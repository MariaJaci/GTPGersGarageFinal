const express = require('express');
const { getSupplies } = require('../controllers/supplies');

const router = express.Router();

router.route('/').get(getSupplies);

module.exports = router;
