var router = require('express').Router();

router.use('/users', require('./user/userRoutes'))
router.use('/products', require('./product/productRoutes'))
module.exports = router;