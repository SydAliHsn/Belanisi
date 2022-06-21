const express = require('express');

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrict('creator', 'admin'),
    productController.createProduct
  );

router.get('/popular', productController.getPopular);
router.get('/newlyAdded', productController.getnewlyAdded);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrict('creator', 'admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrict('creator', 'admin'),
    productController.deleteProduct
  );

module.exports = router;
