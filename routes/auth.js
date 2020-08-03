// bring in express
const express = require('express');
// we need to bring in any method so use destructuring to bring in register and login from the controllers
const { register, login } = require('../controllers/auth');

const router = express.Router();

// create the router
router.post('/register', register);
router.post('/login', login);

module.exports = router;
// all code above is based on Node.js Udemy course.
