const mongoose = require('mongoose');

const SupplySchema = new mongoose.Schema({
  productName: {
    type: String,
    trim: true, // removes whitespace from both sides
    required: [true, 'Please, enter the product name'],
    unique: true,
  },
  productPrice: {
    type: Number,
    required: [true, 'Please, enter a price for the product'],
  },
});

module.exports = mongoose.model('Supply', SupplySchema);
