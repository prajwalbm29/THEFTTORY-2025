const { fetchDetailsController, generateOTPController, verifyOTPController, AdminRegisterController, AdminLoginController, policeDetailsController, verifyPoliceOTPController } = require('../controllers/auth')
const router = require('express').Router()

// police get details
router.get('/police-details/:policeId', policeDetailsController)

router.get('/get-details/:aadhaarNo', fetchDetailsController)
router.get('/generate-otp/:aadhaarNo', generateOTPController)
router.post('/verify-otp', verifyOTPController)
router.post('/verify-police-otp', verifyPoliceOTPController)

// Admin login and registration
router.post('/register', AdminRegisterController)
router.post('/login', AdminLoginController)

module.exports = router