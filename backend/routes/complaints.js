const { cellComplaintController, laptopComplaintController, bikeComplaintController, carComplaintController, goldComplaintController, getCountController, getResolvedComplaints, phoneDetailsController, complaintStatusController, laptopDetailsController, bikeDetailsController, carDetailsController, goldDetailsController, phoneInvoiceController, laptopInvoiceController, goldPhotoController, sendUpdateMailController, getAllComplaintsController } = require('../controllers/complaints')
const { requireSignIn, isAdmin } = require('../middlewares/auth')

const router = require('express').Router()

router.post('/cell-complaint', requireSignIn, cellComplaintController)
router.post('/laptop-complaint', requireSignIn, laptopComplaintController)
router.post('/bike-complaint', requireSignIn, bikeComplaintController)
router.post('/car-complaint', requireSignIn, carComplaintController)
router.post('/gold-complaint', requireSignIn, goldComplaintController)

router.get('/complaint-count/:type', requireSignIn, isAdmin, getCountController)
router.get('/resolved-complaints', requireSignIn, getResolvedComplaints)

router.get('/phone-details/:id', requireSignIn, phoneDetailsController)
router.get('/laptop-details/:id', requireSignIn, laptopDetailsController)
router.get('/bike-details/:id', requireSignIn, bikeDetailsController)
router.get('/car-details/:id', requireSignIn, carDetailsController)
router.get('/gold-details/:id', requireSignIn, goldDetailsController)

router.get('/complaint-status/:complaintId', requireSignIn, complaintStatusController)

// fetch image
router.get('/phone-invoice/:id', requireSignIn, phoneInvoiceController)
router.get('/laptop-invoice/:id', requireSignIn, laptopInvoiceController)
router.get('/gold-photo/:id', requireSignIn, goldPhotoController)

// send update mail
router.post('/update-mail', sendUpdateMailController)

// get all complaints by aadhaar number
router.get('/get-all-complaints/:aadhaarNo', requireSignIn, getAllComplaintsController)

module.exports = router