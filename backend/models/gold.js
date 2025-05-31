const mongoose = require('mongoose')

const goldSchema = new mongoose.Schema({
    aadhaarNo: { type: String, required: true },
    lostLocation: { type: String, required: true },
    lostDescription: { type: String, required: true },
    lostDate: { type: String, required: true },
    weight: { type: Number, required: true },
    uniqueFeature: { type: String, required: true },
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
    witness: { type: String },
    complaintDate: { type: Date, default: Date.now() },
    isVerified: {type: Boolean, default: false}
}, { timestamps: true })

const goldModel = mongoose.model('goldComplaints', goldSchema)

module.exports = goldModel