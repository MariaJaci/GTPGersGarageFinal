// "Applying some dry... to avoid repeating the try/catch code on each async middleware (runs automatically) is write once in a high order function." - https://www.acuriousanimal.com/blog/2018/03/15/express-async-middleware
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
