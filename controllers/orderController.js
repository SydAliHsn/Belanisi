const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');

////////////// Orders /////////////////
exports.createOrder = catchAsync(async (req, res, next) => {
  const orderData = {
    user: req.body.userId,
    repeatRate: req.body.repeatRate,
    items: [...req.body.items],
  };

  const order = await Order.create(orderData);

  // req.user was set from authController.protect \\
  await sendEmail({
    email: req.user.email,
    subject: 'Your Order Placed.',
    message: `Custom order message. Order ID: ${order.id}`,
    // html: CustomEmailHTML
  });

  res.status(201).json({ status: 'success', data: { order } });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  res.status(200).json({ status: 'success', data: { order } });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({ status: 'success', data: { orders } });
});

exports.getFulfilledOrders = catchAsync(async (req, res, next) => {
  const fulfilledOrders = await Order.find({ fulfilled: true });

  res.status(200).json({ status: 'success', data: { fulfilledOrders } });
});

exports.getPendingOrders = catchAsync(async (req, res, next) => {
  const pendingOrders = await Order.find({ fulfilled: false });

  res.status(200).json({ status: 'success', data: { pendingOrders } });
});

////////////// Products /////////////////
// exports.createProduct = catchAsync(async (req, res, next) => {
//   const productData = {
//     name: req.body.name,
//     images: req.body.images,
//     materials: req.body.materials,
//     description: req.body.description,
//     sizes: req.body.sizes,
//     creator: req.body.creator,
//   };

//   const product = await Product.create(productData);

//   res.status(201).json({ status: 'success', data: { product } });
// });

// exports.getAllProducts = catchAsync(async (req, res, next) => {
//   const products = await Product.find();

//   res.status(200).json({ status: 'success', data: { products } });
// });

// exports.getProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) return next('No product found with this ID!', 404);

//   res.status(200).json({ status: 'success', data: { product } });
// });

// exports.updateProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     runValidators: true,
//     new: true,
//   });

//   if (!product) return next('No product found with this ID!', 404);

//   res.status(200).json({ status: 'success', data: { product } });
// });

// exports.deleteProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndDelete(req.params.id);

//   if (!product)
//     return res.status(404).json({ status: 'fail', message: 'No Product found with this ID!' });

//   res.status(204).json({ status: 'success', data: null });
// });
