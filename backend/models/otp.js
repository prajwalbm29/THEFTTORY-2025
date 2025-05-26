const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    aadhaarNo: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 60 * 1000) },
});

module.exports = mongoose.model('OtpVerification', OtpSchema);
