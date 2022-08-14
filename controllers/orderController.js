const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendEmail } = require('../utils/email');
const { formatAggregateArr } = require('../utils/aggregationUtils');

////////////// Orders /////////////////
exports.createOrder = catchAsync(async (req, res, next) => {
  const orderData = {
    user: req.user.id,
    items: [...req.body.items],
    address: req.body.address,
    contactInfo: req.body.contactInfo,
  };

  // Increase the orderNum of the user
  await User.findByIdAndUpdate(req.user.id, { $inc: { totalOrders: 1 } });

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

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const deletedOrder = await Order.findByIdAndDelete(req.params.id);

  if (!deletedOrder) return next(new AppError(404, 'No order found by this ID!'));

  res.status(204).json({ status: 'success', data: null });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user').populate('items.product');

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
  const orders = await Order.find().sort({ orderDate: -1 });

  res.status(200).json({ status: 'success', data: { orders } });
});

exports.getFulfilledOrders = catchAsync(async (req, res, next) => {
  const fulfilledOrders = await Order.find({ fulfilled: true }).sort({ orderDate: -1 });

  res.status(200).json({ status: 'success', data: { fulfilledOrders } });
});

exports.getPendingOrders = catchAsync(async (req, res, next) => {
  const pendingOrders = await Order.find({ fulfilled: false }).sort({ orderDate: -1 });
  res.status(200).json({ status: 'success', data: { pendingOrders } });
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
  const userId = req.params.userId || req.user.id;

  const userOrders = await Order.find({ user: userId })
    // .populate('user', 'name')
    .sort({ orderDate: -1 });

  res.status(200).json({ status: 'success', data: { orders: userOrders } });
});

exports.getLatestPaidUserOrder = catchAsync(async (req, res, next) => {
  const paidOrders = await Order.find({ user: req.user.id, paid: true }).sort({ orderDate: -1 });

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

exports.getOrdersThisMonth = catchAsync(async (req, res, next) => {
  const limitPrev = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const limit = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const ordersPrev = await Order.find({ orderDate: { $gte: limitPrev, $lt: limit } });
  const orders = await Order.find({ orderDate: { $gte: limit } });

  const totalOrders = orders.length;
  const increment = totalOrders - ordersPrev.length;

  res.status(200).json({ status: 'success', data: { orders: totalOrders, increment } });
});

exports.getSalesThisMonth = catchAsync(async (req, res, next) => {
  const limitPrev = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const limit = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const ordersPrev = await Order.find({ orderDate: { $gte: limitPrev, $lt: limit } });
  const orders = await Order.find({ orderDate: { $gte: limit } });

  const salesPrev = ordersPrev.reduce((total, el) => {
    return total + el.total;
  }, 0);
  const sales = orders.reduce((total, el) => {
    return total + el.total;
  }, 0);

  const increment = sales - salesPrev;

  res.status(200).json({ status: 'success', data: { sales, increment } });
});

exports.getSalesAnalytics = catchAsync(async (req, res, next) => {
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
      $match: {
        orderDate: {
          $gte: limit,
        },
      },
    },
    {
      $group: {
        _id: {
          id: { [groupingType]: '$orderDate' },
          year: { $year: '$orderDate' },
        },
        sales: { $sum: '$total' },
      },
    },
    {
      $project: {
        _id: '$_id.id',
        year: '$_id.year',
        sales: 1,
      },
    },

    {
      $sort: { year: 1, _id: 1 },
    },
  ]);

  const salesFormatted = formatAggregateArr(sales, 'sales', type);

  res.status(200).json({ status: 'success', data: { sales: salesFormatted } });
});

exports.getOrdersAnalytics = catchAsync(async (req, res, next) => {
  const type = req.params.type;

  if (!(type === 'day' || type === 'month' || type === 'week'))
    return next(new AppError(400, 'Invalid duration type!'));

  const limit = new Date(Date.now() - req.params.time * 24 * 60 * 60 * 1000);

  let groupingType;
  if (type === 'month') groupingType = '$month';
  if (type === 'week') groupingType = '$week';
  if (type === 'day') groupingType = '$dayOfYear';

  let orders = await Order.aggregate([
    {
      $match: {
        orderDate: {
          $gte: limit,
        },
      },
    },

    {
      // $group: {
      //   _id: { [groupingType]: '$orderDate' },
      //   orders: { $sum: 1 },
      // },
      $group: {
        _id: {
          id: { [groupingType]: '$orderDate' },
          year: { $year: '$orderDate' },
        },
        orders: { $sum: 1 },
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

  const ordersFormatted = formatAggregateArr(orders, 'orders', type);

  res.status(200).json({ status: 'success', data: { orders: ordersFormatted } });
});

exports.getNewOrders = catchAsync(async (req, res, next) => {
  const fiveDaysAgo = Date.now() - 5 * 24 * 60 * 60 * 1000;

  const orders = await Order.find({ orderDate: { $gte: fiveDaysAgo } }).sort({ orderDate: -1 });

  res.status(200).json({ status: 'success', data: { orders } });
});
