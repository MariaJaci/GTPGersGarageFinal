// Web framework server to create routes req and res
const express = require('express');
// Dotenv create environment variable
const dotenv = require('dotenv');
// HTTP request logger middleware for node.js
const morgan = require('morgan');

//package to display msg in different colors
const colors = require('colors');

// path to link both frontend and api
const path = require('path');

const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

// Route files
const staff = require('./routes/staff');
const supplies = require('./routes/supplies');
const auth = require('./routes/auth');

const app = express();

// path to link both frontend and api
app.use(express.static(path.join(__dirname, 'frontend')));

// in order to use res.body we need to add a piece of middleware body parser which is already included on express
app.use(express.json());

// Dev loggin middleware to show in the console
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.post('/post/json', function (req, res) {
  console.log('Error ' + JSON.stringify(req.body));
});

//Mount routers
app.use('/api/v1/staff', staff);
app.use('/api/v1/supplies', supplies);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

app.get('/', function (req, res) {
  res.render('index');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

// Global handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server and exit process with failure
  server.close(() => process.exit(1));
});
// all code above is based on node.js Udemy course.
