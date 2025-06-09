const { resolveComplaintController, changeComplaintStatusController, allotedComplaintsController, getResolvedComplaints, getUpdatesController } = require('../controllers/police')
const { requireSignIn } = require('../middlewares/auth')

const router = require('express').Router()

router.put('/resolved-complaint', requireSignIn, resolveComplaintController)
router.put('/change-complaint-status', requireSignIn, changeComplaintStatusController)
router.get('/', (req, res) => {
    res.status(200).send('hello')
})
router.get('/alloted-complaints/:policeId', requireSignIn, allotedComplaintsController)

router.get('/resolved-complaints/:policeId', requireSignIn, getResolvedComplaints);

router.get('/get-updateTips', requireSignIn, getUpdatesController)

module.exports = router