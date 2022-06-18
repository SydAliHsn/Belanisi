const express = require('express');

const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrict('creator'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrict('creator'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrict('creator'),
    productController.deleteProduct
  );

module.exports = router;
