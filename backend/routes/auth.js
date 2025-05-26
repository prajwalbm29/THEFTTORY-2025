const { fetchDetailsController, generateOTPController, verifyOTPController, AdminRegisterController, AdminLoginController } = require('../controllers/auth')
const router = require('express').Router()

router.get('/get-details/:aadhaarNo', fetchDetailsController)
router.get('/generate-otp/:aadhaarNo', generateOTPController)
router.post('/verify-otp', verifyOTPController)

// Admin login and registration
router.post('/register', AdminRegisterController)
router.post('/login', AdminLoginController)

module.exports = router