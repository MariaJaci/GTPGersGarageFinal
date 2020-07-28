// connecting to the database with mongoose
const mongoose = require('mongoose');

//Function to export and call within server.js.
const connectDB = async () => {
  //mongoose method return a promise so use async await
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    // to avoid warnings from happening in the console
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(
    `MongoDB Connected: ${connection.connection.host}`.cyan.underline.bold
  );
};

module.exports = connectDB;
