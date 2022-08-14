const express = require('express');

const authController = require('../controllers/authController');
const campaignController = require('../controllers/campaignController');

const router = express.Router();

router.route('/').get(campaignController.getAllCampaigns).post(
  authController.protect,
  campaignController.uploadContent,
  // campaignController.uploadVideo,
  campaignController.createCampaign
);

router
  .route('/:id')
  .get(campaignController.getCampaign)
  .patch(authController.protect, campaignController.updateCampaign);

module.exports = router;
