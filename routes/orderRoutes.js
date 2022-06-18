const express = require('express');

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, orderController.createOrder)
  .get(authController.protect, authController.restrict('admin'), orderController.getAllOrders);

router.get(
  '/fulfilled',
  authController.protect,
  authController.restrict('admin'),
  orderController.getFulfilledOrders
);
router.get(
  '/pending',
  authController.protect,
  authController.restrict('admin'),
  orderController.getPendingOrders
);

router.route('/:id').get(authController.protect, orderController.getOrder);

// // Product
// router
//   .route('/products')
//   .get(storeController.getAllProducts)
//   .post(authController.protect, authController.restrict('creator'), storeController.createProduct);

// router
//   .route('/products/:id')
//   .get(storeController.getProduct)
//   .patch(authController.protect, authController.restrict('creator'), storeController.updateProduct)
//   .delete(
//     authController.protect,
//     authController.restrict('creator'),
//     storeController.deleteProduct
//   );

module.exports = router;
