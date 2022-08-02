const Campaign = require('../models/campaignModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');

exports.getAllCampaigns = catchAsync(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Campaign.find(), req.query);

  let { query } = apiFeatures.filter().limitFields();

  const total = await Campaign.count(query);

  // Paginating after getting total
  query = apiFeatures.paginate().sort().query;

  const campaigns = await query;
  res.status(200).json({ status: 'success', data: { total, campaigns } });
});

exports.getCampaign = catchAsync(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) next(new AppError(404, 'No campaign found with this ID!'));

  res.status(200).json({ status: 'success', data: { campaign } });
});

exports.createCampaign = catchAsync(async (req, res, next) => {
  const creator = req.body.creator || req.user.id;

  const campaignData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    images: req.body.images,
    video: req.body.video,
    creator,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };

  const campaign = await Campaign.create(campaignData);

  res.status(200).json({ status: 'success', data: { campaign } });
});

exports.updateCampaign = catchAsync(async (req, res, next) => {
  const oldCampaign = await Campaign.findById(req.params.id);
  if (!oldCampaign) return next('No campaign found with this ID!', 404);

  if (
    oldCampaign.creator.id !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.role !== 'super-admin'
  )
    return next('You do not have the permission to perform this action!', 401);

  const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ status: 'success', data: { campaign } });
});

exports.getPopular = catchAsync(async (req, res, next) => {
  const campaigns = await Campaign.find().sort('ctr').limit(25);

  res.status(200).json({ status: 'success', data: { campaigns } });
});

exports.getnewlyAdded = catchAsync(async (req, res, next) => {
  const campaigns = await Campaign.find().sort('createdAt').limit(25);

  res.status(200).json({ status: 'success', data: { campaigns } });
});
