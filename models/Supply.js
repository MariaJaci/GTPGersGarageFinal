const mongoose = require('mongoose');

const SuppliesSchema = new mongoose.Shema({
  productName: {
    type: String,
    trim: true, // removes whitespace from both sides
    required: [true, 'Please, enter the product name'],
  },
  productPrice: {
    type: Number,
    required: [true, 'Please, enter a price for the product'],
  },
});

module.exports = mongoose.model('Supplies', SuppliesSchema);
