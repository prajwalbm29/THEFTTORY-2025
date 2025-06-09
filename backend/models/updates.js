const mongoose = require('mongoose')

const updateSchema = new mongoose.Schema({
    update: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('updatetips', updateSchema)