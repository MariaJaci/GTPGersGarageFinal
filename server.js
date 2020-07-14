// Web framework server to create routes req and res
const express = require('express');
// Dotenv create environment variable
const dotenv = require('dotenv');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
//package to display msg in different colors
const colors = require('colors');

const errorHandler = require('./middleware/error');

const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

// Route files
const staff = require('./routes/staff');
const supplies = require('./routes/supplies');

const app = express();

// in order to use res.body we need to add a piece of middleware body parser which is already included on express
app.use(express.json());

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/staff', staff);
app.use('/api/v1/supplies', supplies);

app.use(errorHandler);

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
