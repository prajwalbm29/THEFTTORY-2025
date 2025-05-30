const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')
require('dotenv').config()

// database connection
connectDB()

const app = express();
const PORT = process.env.PORT || 7002

const corsOptions = {
    origin: '*',
    credentials: true
}
app.use(cors(corsOptions))
app.use(express.json({ limit: '5mb' }))

app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/admin', require('./routes/admin'))
app.use('/api/v1/complaint', require('./routes/complaints'))
app.use('/api/v1/police', require('./routes/police'))

app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: "Welcome to the server." })
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server running on port ${PORT}`)
})