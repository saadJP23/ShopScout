const router = require('express').Router()
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')



const categoryCtrl = require('../controllers/categoryControl')

router.route('/category')
.get(categoryCtrl.getCategories)
.post(auth,authAdmin,categoryCtrl.createCategory)


router.route('/category/:id')
.delete(auth, authAdmin, categoryCtrl.deleteCategory)
.put(auth, authAdmin, categoryCtrl.updateCategory)
module.exports = router