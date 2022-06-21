const express = require('express');

const charityController = require('../controllers/charityController');

const router = express.Router();

router.route('/').get(charityController.getAllCharities);

module.exports = router;
