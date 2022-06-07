const express = require('express');

const storeController = require('../controllers/storeController');

const router = express.Router();

router.post('/placeOrder', storeController.placeOrder);

module.exports = router;
