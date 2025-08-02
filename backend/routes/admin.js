const { 
    fetchPhoneComplaintsController, 
    fetchLaptopComplaintsController, 
    fetchBikeComplaintsController, 
    fetchCarComplaintsController, 
    fetchGoldComplaintsController, 
    updatePhoneStatusController, 
    updateLaptopStatusController, 
    updateBikeStatusController, 
    updateCarStatusController, 
    updateGoldStatusController, 
    goldAllocateController,
    cellAllocateController,
    laptopAllocateController,
    bikeAllocateController,
    carpAllocateController,
    policeAccessController,
    fetchPoliceController,
    totalComplaintsController,
    activeOfficersController,
    totalResolvedComplaintsController,
    recentComplaintsController,
    getPhoneComplaintAllocations,
    getSafetyTipsController,
    getUpdatesController,
    updateSafetyTipsController,
    updateUpdateTipsController,
    deleteUpdateTipsController,
    deleteSafetyTipsController,
    addSafetyTipsController,
    addUpdateTipsController,
    resolvedComplaintCountController,
    resolvedPhoneComplaintController,
    resolvedLaptopComplaintController,
    resolvedBikeComplaintController,
    resolvedCarComplaintController,
    resolvedGoldComplaintController,
    getLaptopComplaintAllocations,
    getBikeComplaintAllocations,
    getCarComplaintAllocations,
    getGoldComplaintAllocations,
    sendNotificationMailController
} = require('../controllers/admin')
const { requireSignIn, isAdmin } = require('../middlewares/auth')

const router = require('express').Router()

router.get('/fetch-phone-complaints', requireSignIn, isAdmin, fetchPhoneComplaintsController)
router.get('/fetch-laptop-complaints', requireSignIn, isAdmin, fetchLaptopComplaintsController)
router.get('/fetch-bike-complaints', requireSignIn, isAdmin, fetchBikeComplaintsController)
router.get('/fetch-car-complaints', requireSignIn, isAdmin, fetchCarComplaintsController)
router.get('/fetch-gold-complaints', requireSignIn, isAdmin, fetchGoldComplaintsController)

router.patch('/update-phone-status/:id', requireSignIn, isAdmin, updatePhoneStatusController)
router.patch('/update-laptop-status/:id', requireSignIn, isAdmin, updateLaptopStatusController)
router.patch('/update-bike-status/:id', requireSignIn, isAdmin, updateBikeStatusController)
router.patch('/update-car-status/:id', requireSignIn, isAdmin, updateCarStatusController)
router.patch('/update-gold-status/:id', requireSignIn, isAdmin, updateGoldStatusController)

router.patch('/update-gold-allocation', requireSignIn, isAdmin, goldAllocateController)
router.patch('/update-phone-allocation', requireSignIn, isAdmin, cellAllocateController)
router.patch('/update-laptop-allocation', requireSignIn, isAdmin, laptopAllocateController)
router.patch('/update-bike-allocation', requireSignIn, isAdmin, bikeAllocateController)
router.patch('/update-car-allocation', requireSignIn, isAdmin, carpAllocateController)


router.get('/fetch-polices', requireSignIn, isAdmin, fetchPoliceController)
router.patch('/update-police-access/:id', requireSignIn, isAdmin, policeAccessController)

// for home page
router.get('/total-complaints', totalComplaintsController)
router.get('/active-officers', activeOfficersController)
router.get('/resolved-cases', totalResolvedComplaintsController)
router.get('/recent-complaints', recentComplaintsController)

// complaint allocation
router.get('/get-phone-complaint-allocation', requireSignIn, isAdmin, getPhoneComplaintAllocations)
router.get('/get-laptop-complaint-allocation', requireSignIn, isAdmin, getLaptopComplaintAllocations)
router.get('/get-bike-complaint-allocation', requireSignIn, isAdmin, getBikeComplaintAllocations)
router.get('/get-car-complaint-allocation', requireSignIn, isAdmin, getCarComplaintAllocations)
router.get('/get-gold-complaint-allocation', requireSignIn, isAdmin, getGoldComplaintAllocations)

// Updates and safety tips
router.post('/add-safetyTips', requireSignIn, isAdmin, addSafetyTipsController)
router.put('/update-safetyTips/:id', requireSignIn, isAdmin, updateSafetyTipsController)
router.delete('/delete-safetyTips/:id', requireSignIn, isAdmin, deleteSafetyTipsController)

router.post('/add-updateTips', requireSignIn, isAdmin, addUpdateTipsController)
router.put('/update-updateTips/:id', requireSignIn, isAdmin, updateUpdateTipsController)
router.delete('/delete-updateTips/:id', requireSignIn, isAdmin, deleteUpdateTipsController)

// resolved complaints
router.get('/resolved-complaints-count', requireSignIn, isAdmin, resolvedComplaintCountController)
router.get('/resolved-phone-complaints', requireSignIn, isAdmin, resolvedPhoneComplaintController)
router.get('/resolved-laptop-complaints', requireSignIn, isAdmin, resolvedLaptopComplaintController)
router.get('/resolved-bike-complaints', requireSignIn, isAdmin, resolvedBikeComplaintController)
router.get('/resolved-car-complaints', requireSignIn, isAdmin, resolvedCarComplaintController)
router.get('/resolved-gold-complaints', requireSignIn, isAdmin, resolvedGoldComplaintController)

// send notification mail
router.post('/send-notification-mail', requireSignIn, isAdmin, sendNotificationMailController)

module.exports = router