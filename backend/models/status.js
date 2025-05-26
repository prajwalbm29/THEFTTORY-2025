const mongoose = require('mongoose')

const statusSchema = new mongoose.Schema({
    complaintId: { type: String, required: true, unique: true },
    status: { type: [String], default: ['Registration'] },
    description: { type: [String], default: ['Complaint registered successfully.'] }
})

const statusModel = mongoose.model('status', statusSchema)

module.exports = statusModel