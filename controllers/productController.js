const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const ApiFeatures = require('../utils/ApiFeatures');
const Campaign = require('../models/campaignModel');

exports.createProduct = catchAsync(async (req, res, next) => {
  if (!req.body.creator) req.body.creator = req.user.id;

  const productData = {
    name: req.body.name,
    images: req.body.images,
    materials: req.body.materials,
    description: req.body.description,
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
  const apiFeatures = new ApiFeatures(Product.find().select('-description +views'), req.query);

  let { query } = apiFeatures.filter().limitFields();

  const total = await Product.countDocuments(query);

  query = apiFeatures.paginate().sort().query;

  const products = await query;

  query = res
    .status(200)
    .json({ status: 'success', data: { total, results: products.length, products } });

  for (const prod of products) {
    prod.views++;

    await prod.save();
  }
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).select('+clicks -__v');

  if (!product) return next('No product found with this ID!', 404);

  res.status(200).json({ status: 'success', data: { product } });

  // Increase product clicks
  product.clicks++;
  await product.save();
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

exports.getTrending = catchAsync(async (req, res, next) => {
  // const products = await Product.find().sort('ctr').limit(15);
  const products = await Product.find().sort('createdAt').limit(15);

  res.status(200).json({ status: 'success', data: { products } });
});

exports.getNewlyAdded = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort('createdAt').limit(15);

  res.status(200).json({ status: 'success', data: { products } });
});

exports.getFeatured = catchAsync(async (req, res, next) => {
  const products = await Product.find().sort('createdAt').limit(15);

  res.status(200).json({ status: 'success', data: { products } });
});
