const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, commented for testing
  user: String,

  // We will use the "id" property as orderNumber

  repeatRate: Number,

  items: [
    {
      // product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, commented for testing
      product: String,
      quanitity: Number,
      size: String,
      color: String,
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
