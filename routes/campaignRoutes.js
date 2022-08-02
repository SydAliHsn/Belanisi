const express = require('express');

const authController = require('../controllers/authController');
const campaignController = require('../controllers/campaignController');

const router = express.Router();

router
  .route('/')
  .get(campaignController.getAllCampaigns)
  .post(
    authController.protect,
    authController.restrictTo(
      'yayasan',
      'campaign-maker',
      'company',
      'public-figure',
      'admin',
      'super-admin'
    ),
    campaignController.createCampaign
  );

router
  .route('/:id')
  .get(campaignController.getCampaign)
  .patch(authController.protect, campaignController.updateCampaign);

// router.get('/popular', productController.getPopular);
// router.get('/newlyAdded', productController.getnewlyAdded);

module.exports = router;
