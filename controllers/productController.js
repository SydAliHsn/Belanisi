const mongoose = require('mongoose');

const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');
const Campaign = require('../models/campaignModel');
const Order = require('../models/orderModel');
const padAggregateArr = require('../utils/padAggregateArr');
const { formatAggregateArr } = require('../utils/aggregationUtils');
const AppError = require('../utils/AppError');

exports.createProduct = catchAsync(async (req, res, next) => {
  if (!req.body.creator) req.body.creator = req.user.id;

  const productData = {
    name: req.body.name,
    images: req.body.images,
    materials: req.body.materials,
    message: req.body.message,
    styles: req.body.styles,
    sizes: req.body.sizes,
    availableColors: req.body.availableColors,
    type: req.body.type,
    price: req.body.price,
    creator: req.body.creator,
    campaign: req.body.campaign,
  };

  const { category } = await Campaign.findById(req.body.campaign);
  productData.category = category;

  const product = await Product.create(productData);

  res.status(201).json({ status: 'success', data: { product } });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Product.find(), req.query);

  let { query } = apiFeatures.filter().querySearch().limitFields();

  const total = await Product.countDocuments(query);

  query = apiFeatures.paginate().sort().query;

  const products = await query;

  res.status(200).json({ status: 'success', data: { total, results: products.length, products } });

  for (const prod of products) {
    await Product.findByIdAndUpdate(prod.id, { $inc: { views: 1 } });
  }
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next('No product found with this ID!', 404);

  res.status(200).json({ status: 'success', data: { product } });

  // Increase product clicks
  await Product.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const oldProduct = await Product.findById(req.params.id);
  if (!oldProduct) return next('No product found with this ID!', 404);

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({ status: 'success', data: { product } });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return res.status(404).json({ status: 'fail', message: 'No Product found with this ID!' });

  res.status(204).json({ status: 'success', data: null });
});

exports.getNewlyAdded = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(15);

  res.status(200).json({ status: 'success', data: { products } });
});

exports.getProductAnalytics = catchAsync(async (req, res, next) => {
  const type = req.params.type;

  if (!(type === 'day' || type === 'month' || type === 'week'))
    return next(new AppError(400, 'Invalid duration type!'));

  const limit = new Date(Date.now() - req.params.time * 24 * 60 * 60 * 1000);

  let groupingType;
  if (type === 'month') groupingType = '$month';
  if (type === 'week') groupingType = '$week';
  if (type === 'day') groupingType = '$dayOfYear';

  let sales = await Order.aggregate([
    {
      $unwind: '$items',
    },
    {
      $match: {
        $and: [
          {
            'items.product': mongoose.Types.ObjectId(req.params.productId),
          },
          {
            orderDate: {
              $gte: limit,
            },
          },
        ],
      },
    },
    {
      // $group: {
      //   _id: {
      //     [groupingType]: '$orderDate',
      //   },
      //   sold: { $sum: '$items.quantity' },
      // },

      $group: {
        _id: {
          id: { [groupingType]: '$orderDate' },
          year: { $year: '$orderDate' },
        },
        sold: { $sum: '$items.quantity' },
      },
    },
    {
      $project: {
        _id: '$_id.id',
        year: '$_id.year',
        orders: 1,
      },
    },

    {
      $sort: { year: 1, _id: 1 },
    },
  ]);

  const salesFormatted = formatAggregateArr(sales, 'sold', type);

  res.status(200).json({ status: 'success', data: { sales: salesFormatted } });
});
