const mongoose = require('mongoose');
const { mongoUri } = require('../config/env');

module.exports = async () => {
  if (!mongoUri) throw new Error('MONGO_URI missing in env');
  await mongoose.connect(mongoUri, { autoIndex: true });
  console.log('MongoDB connected');
};
