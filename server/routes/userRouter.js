const { model } = require('mongoose')

const userController = require('../controllers/userControl')

const router = require('express').Router()
const auth = require('../middleware/auth')


router.post('/register', userController.register)
router.post('/refresh_token', userController.refreshtoken)
router.post('/login', userController.login)
router.get('/logout', userController.logout)
router.get('/infor', auth,userController.getUser)
router.post('/history', auth, userController.addHistory)
router.get('/history', auth, userController.getHistory)
router.patch("/addcart", auth, userController.addCart);
router.post('/forget_password', userController.forgotPassword);
router.post('/reset_password', userController.resetPassword);

module.exports = router