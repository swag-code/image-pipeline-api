const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  requestId: { type: String, index: true },
  serialNo: Number,
  productName: String
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
