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
  const campaignData = {
    title: req.body.title,
    description: req.body.description,
    URL: req.body.URL,
    product: req.body.product,
    design: req.body.design,
    colors: req.body.colors,
    baseCost: req.body.baseCost,
    price: req.body.price,
    numOfProducts: req.body.numOfProducts,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };

  const campaign = await Campaign.create(campaignData);

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
