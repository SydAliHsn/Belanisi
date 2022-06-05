const Order = require('../models/orderModel');

exports.placeOrder = async (req, res, next) => {
  const orderData = {
    user: req.body.userId,
    repeatRate: req.body.repeatRate,
    items: [...req.body.items],
  };

  const order = await Order.create(orderData);

  res.status(201).json({ status: 'success', data: order });
};
