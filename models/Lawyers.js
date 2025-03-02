const mongoose = require('mongoose');

const LawyerSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  verificationData: { type: Object },
  verifiedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lawyer', LawyerSchema);
