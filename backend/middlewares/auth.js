const jwt = require('jsonwebtoken')
const adminModel = require('../models/admin')

const requireSignIn = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error('failed to decode jwt', error);
        return res.status(401).json({ success: false, message: error.message });
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const admin = adminModel.findOne({ aadhaarNo: req.user._id })
        if (!admin) {
            return res.status(401).json({ success: false, message: "Your not an admin." });
        }
        next();
    } catch (error) {
        console.error('failed to verify admin', error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    requireSignIn,
    isAdmin
}