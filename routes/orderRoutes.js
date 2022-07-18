const express = require('express');

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const { route } = require('./userRoutes');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, orderController.createOrder)
  .get(authController.protect, authController.restrictTo('admin'), orderController.getAllOrders);

router.get('/latestPaidUserOrder', authController.protect, orderController.getLatestPaidUserOrder);

// For user
router.get('/userOrders', authController.protect, orderController.getUserOrders);

// For admin
router.get(
  '/user/:userId',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getUserOrders
);

router.route('/:id').get(authController.protect, orderController.getOrder);

router.get(
  '/fulfilled',
  authController.protect,
  authController.restrictTo('admin'),
  orderController.getFulfilledOrders
);
router.get(
  '/pending',
  authController.protect,
  authController.restrictTo('admin'),
  orderController.getPendingOrders
);

// router.post('/createTransaction', authController.protect, orderController.createTransaction);

module.exports = router;
