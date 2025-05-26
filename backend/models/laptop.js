const mongoose = require('mongoose')

const laptopSchema = new mongoose.Schema({
    aadhaarNo: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    serialNo: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    lostDate: { type: Date, required: true },
    lostLocation: { type: String, required: true },
    lostDescription: { type: String, required: true },
    invoice: {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        uri: {
            type: String,
            required: true,
        },
        base64: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now(),
        },
    },
    complaintDate: { type: Date, default: Date.now() },
    isVerified: {type: Boolean, default: false}
}, { timestamps: true })

const laptopModel = mongoose.model('laptopComplaints', laptopSchema)

module.exports = laptopModel