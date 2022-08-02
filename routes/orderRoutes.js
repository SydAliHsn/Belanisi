const express = require('express');

const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const { route } = require('./userRoutes');

const router = express.Router();

router
  .route('/')
  .post(authController.protect, orderController.createOrder)
  .get(
    authController.protect,
    authController.restrictTo('admin', 'super-admin'),
    orderController.getAllOrders
  );

router.get('/latestPaidUserOrder', authController.protect, orderController.getLatestPaidUserOrder);

router.get(
  '/new',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getNewOrders
);

// // For user
// router.get('/userOrders', authController.protect, orderController.getUserOrders);

// // For admin
// router.get(
//   '/user/:userId',
//   authController.protect,
//   authController.restrictTo('admin', 'super-admin'),
//   orderController.getUserOrders
// );

router.get(
  '/fulfilled',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getFulfilledOrders
);
router.get(
  '/pending',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getPendingOrders
);

router.get(
  '/salesAnalytics/:type/:time',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getSalesAnalytics
);
router.get(
  '/ordersAnalytics/:type/:time',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getOrdersAnalytics
);
router.get(
  '/salesThisMonth',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getSalesThisMonth
);
router.get(
  '/ordersThisMonth',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  orderController.getOrdersThisMonth
);

router.route('/:id').get(authController.protect, orderController.getOrder);
// router.post('/createTransaction', authController.protect, orderController.createTransaction);

module.exports = router;
