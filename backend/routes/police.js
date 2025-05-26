const { resolveComplaintController, changeComplaintStatusController } = require('../controllers/police')
const { requireSignIn } = require('../middlewares/auth')

const router = require('express').Router()

router.put('/resolved-complaint', requireSignIn, resolveComplaintController)
router.put('/change-complaint-status', requireSignIn, changeComplaintStatusController)
router.get('/', (req, res) => {
    res.status(200).send('hello')
})

module.exports = router