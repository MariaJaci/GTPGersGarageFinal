// costum errorResponse class
class ErrorResponse extends Error {
  // constructor is a method that runs when we stantiate an object from the class
  constructor(message, statusCode) {
    super(message); // call the superclass constructor
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
