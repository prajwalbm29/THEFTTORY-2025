const mongoose = require('mongoose')

const aadhaarSchema = new mongoose.Schema({
    aadhaarNo: { type: String, unique: true, required: true, match: /^\d{12}$/ },
    name: { type: String, required: true },
    phoneNo: { type: String, required: true, match: /^\d{10}$/ },
    email: { type: String, required: true, match: /^\S+@\S+\.\S+$/ },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
})

const aadhaarDetails = mongoose.model('aadhaardetails', aadhaarSchema);

module.exports = aadhaarDetails
