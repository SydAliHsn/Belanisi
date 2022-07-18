const express = require('express');

const transactionController = require('../controllers/transactionController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').post(authController.protect, transactionController.createTransaction);

router.route('/notifications').post(transactionController.checkNotification);

module.exports = router;
