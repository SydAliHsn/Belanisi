const express = require('express');

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo(
      'yayasan',
      'campaign-maker',
      'company',
      'public-figure',
      'admin',
      'super-admin'
    ),
    productController.createProduct
  );

router.get('/newlyAdded', productController.getNewlyAdded);

router.get(
  '/analytics/:productId/:type/:time',
  authController.protect,
  authController.restrictTo('super-admin', 'admin'),
  productController.getProductAnalytics
);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('creator', 'admin'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo(
      'yayasan',
      'campaign-maker',
      'company',
      'public-figure',
      'admin',
      'super-admin'
    ),
    productController.deleteProduct
  );

module.exports = router;
