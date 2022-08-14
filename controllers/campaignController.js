const multer = require('multer');
const multerS3 = require('multer-s3');

const Campaign = require('../models/campaignModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');
const s3 = require('../utils/S3');

const multerFilter = function (req, file, cb) {
  const field = file.fieldname;

  if (field === 'video') {
    if (file.mimetype.startsWith('video')) {
      cb(null, true);
    } else {
      cb(new AppError(404, 'Not a video! Please only upload a video for video field.'), false);
    }
  }

  if (field === 'images') {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError(404, 'Not an image! Please only upload images for images field.'), false);
    }
  }
};
const multerConfig = {
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now() + '.' + file.fieldname + '.' + file.mimetype.split('/')[1]);
    },
  }),
  fileFilter: multerFilter,

  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB (in bytes)
  },
};

exports.uploadContent = multer(multerConfig).fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 },
]);

exports.createCampaign = catchAsync(async (req, res, next) => {
  const creator = req.body.creator || req.user.id;

  if (!req.files.images || !req.files.images[0])
    return next(
      new AppError(
        400,
        'Please also specify the images for the campaign. A campaign must have atleast one image!'
      )
    );

  const images = req.files.images.map(file => file.location);
  const video = req.files.video ? req.files.video[0].location : undefined;

  const campaignData = {
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    images,
    video,
    creator,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };

  const campaign = await Campaign.create(campaignData);

  res.status(200).json({ status: 'success', data: { campaign } });
});

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
