const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const snap = require('../utils/midtrans');

////////////// Orders /////////////////
exports.createOrder = catchAsync(async (req, res, next) => {
  const orderData = {
    user: req.user.id,
    items: [...req.body.items],
    address: req.body.address,
    contactInfo: req.body.contactInfo,
  };

  let totalAmount = 0;
  for (const item of orderData.items) {
    const product = await Product.findById(item.product).select('+sales');

    product.sales += item.quantity;
    await product.save();

    totalAmount += product.price * item.quantity;
  }
  orderData.total = totalAmount;

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
  const order = await Order.findById(req.params.id).populate('user');

  if (
    order.user.id === req.user.id ||
    req.user.role === 'admin' ||
    req.user.rol === 'super-admin'
  ) {
    return res.status(200).json({ status: 'success', data: { order } });
  }

  return next(new AppError(403, "You don't have the permission to perform this action"));
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

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;

  const userOrders = await Order.find({ user: userId })
    .populate('user', 'name')
    .sort({ orderDate: -1 });

  res.status(200).json({ status: 'success', data: { orders: userOrders } });
});

exports.getLatestPaidUserOrder = catchAsync(async (req, res, next) => {
  const paidOrders = await Order.find({ user: req.user.id, paid: true }).sort({ orderDate: -1 });

  console.log(paidOrders);

  if (!paidOrders.length) return next(new AppError(404, 'No order found!'));

  const latestPaidOrder = paidOrders[0];

  res.status(200).json({ status: 'success', data: { order: latestPaidOrder } });
});

// exports.createTransaction = catchAsync(async (req, res, next) => {
//   const order = await Order.findById(req.body.order);

//   if (!order) return next(new AppError(404, 'Order not found!'));

//   if (order.paid) return;

//   const amount = await order.total;

//   const parameter = {
//     transaction_details: {
//       order_id: order.id,
//       gross_amount: amount,
//     },
//     credit_card: {
//       secure: true,
//     },
//   };

//   snap.createTransaction(parameter).then(transaction => {
//     // transaction redirect_url
//     transactionUrl = transaction.redirect_url;
//     const transactionToken = transaction.token;

//     res.status(201).json({ status: 'success', data: { transactionUrl, transactionToken } });
//   });
// });
