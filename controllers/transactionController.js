const axios = require('axios');
const crypto = require('crypto');

const snap = require('../utils/midtrans');
const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');

exports.createTransaction = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.body.order);

  if (!order) return next(new AppError(404, 'Order not found!'));

  if (order.paid) return next(new AppError(400, 'Order has already been paid for!'));

  const amount = await order.total;

  const parameter = {
    transaction_details: {
      order_id: order.id,
      gross_amount: amount,
    },
    credit_card: {
      secure: true,
    },
  };

  snap
    .createTransaction(parameter)
    .then(transaction => {
      // transaction redirect_url
      transactionUrl = transaction.redirect_url;
      const transactionToken = transaction.token;

      res.status(201).json({ status: 'success', data: { transactionUrl, transactionToken } });
    })
    .catch(err => {
      console.log(err);
      res
        .status(400)
        .json({ status: 'fail', message: 'Transaction cannot be performed on this order!' });
    });
});

exports.checkNotification = catchAsync(async (req, res, next) => {
  const orderId = req.body.order_id;
  const fraudStatus = req.body.fraud_status;
  const transactionStatus = req.body.transaction_status;

  // If the transaction is fraudulent return
  if (fraudStatus) {
    if (!(fraudStatus === 'accept')) return res.status(200).json({ data: null });
  }

  if (transactionStatus === 'settlement' || transactionStatus === 'capture ') {
    const signatureKeyString =
      orderId + req.body.status_code + req.body.gross_amount + process.env.MIDTRANS_SERVER_KEY;

    const signatureKey = crypto.createHash('sha512').update(signatureKeyString).digest('hex');

    if (!(req.body.signature_key === signatureKey)) return res.status(200).json({ data: null });

    // Set order paid: true if everything is good
    await Order.findByIdAndUpdate(orderId, { paid: true });

    res.status(200).json({ data: null });
  } else {
    res.status(200).json({ data: null });
  }
});
