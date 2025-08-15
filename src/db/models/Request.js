const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  requestId: { type: String, index: true, unique: true },
  status: { type: String, enum: ['RECEIVED','VALIDATING','QUEUED','PROCESSING','PARTIAL_SUCCESS','COMPLETED','FAILED'], default: 'RECEIVED' },
  totalItems: { type: Number, default: 0 },
  processedItems: { type: Number, default: 0 },
  failedItems: { type: Number, default: 0 },
  webhookUrl: { type: String },
  outputCsvUrl: { type: String },
  error: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Request', RequestSchema);
