const mongoose = require('mongoose');

const safetyTipsSchema = new mongoose.Schema({
    tips: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('safetytips', safetyTipsSchema);