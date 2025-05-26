const mongoose = require('mongoose')

const bikeSchema = new mongoose.Schema({
    aadhaarNo: { type: String, required: true },
    registrationNo: { type: String, required: true, unique: true },
    chasisNo: { type: String, required: true, unique: true },
    engineNo: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    color: { type: String, required: true },
    description: { type: String, required: true },
    lostDate: { type: Date, required: true },
    lostLocation: { type: String, required: true },
    lostDescription: { type: String, required: true },
    complaintDate: { type: Date, default: Date.now() },
    isVerified: {type: Boolean, default: false},
})

const bikeModel = mongoose.model('bikecomplaints', bikeSchema)

module.exports = bikeModel