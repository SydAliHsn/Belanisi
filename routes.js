const express = require('express');

const storeController = require('./controllers/storeController');

const router = express.Router();

///////////////// Store Routes //////////////////
router.post('/placeOrder', storeController.placeOrder);

module.exports = router;
