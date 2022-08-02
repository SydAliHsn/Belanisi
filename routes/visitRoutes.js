const express = require('express');

const visitController = require('../controllers/visitController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/visitsAnalytics/:type/:time',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  visitController.getAnalytics
);

router.get(
  '/visitsToday',
  authController.protect,
  authController.restrictTo('admin', 'super-admin'),
  visitController.getVisitsToday
);

module.exports = router;
