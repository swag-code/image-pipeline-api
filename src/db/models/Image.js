const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  requestId: { type: String, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  inputUrl: String,
  outputUrl: String,
  position: Number,
  status: { type: String, enum: ['PENDING','DONE','FAILED'], default: 'PENDING' },
  error: String
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);
