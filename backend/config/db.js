const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING)
        console.log(`database connected successfully`)
    } catch (error) {
        console.error(`Failed to connect database ${error}`)
    }
}

module.exports = connectDB