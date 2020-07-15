// bring in express
const express = require('express');
// we need to bring in any method so use destructuring so bring in register from the controllers
const { register } = require('../controllers/auth');

const router = express.Router();
// create the router
router.post('/register', register);

module.exports = router;
