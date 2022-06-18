const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');

exports.createProduct = catchAsync(async (req, res, next) => {
  const productData = {
    name: req.body.name,
    images: req.body.images,
    materials: req.body.materials,
    description: req.body.description,
    sizes: req.body.sizes,
    creator: req.body.creator,
  };

  const product = await Product.create(productData);

  res.status(201).json({ status: 'success', data: { product } });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({ status: 'success', data: { products } });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) return next('No product found with this ID!', 404);

  res.status(200).json({ status: 'success', data: { product } });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!product) return next('No product found with this ID!', 404);

  res.status(200).json({ status: 'success', data: { product } });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product)
    return res.status(404).json({ status: 'fail', message: 'No Product found with this ID!' });

  res.status(204).json({ status: 'success', data: null });
});
