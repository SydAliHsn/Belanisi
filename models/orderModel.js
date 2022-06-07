const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  // user: { type: Schema.Types.ObjectId, ref: 'User' }, commented for testing, un-comment later
  user: String,

  // We will use the "id" property as orderNumber

  repeatRate: Number,

  items: [
    {
      // product: { type: Schema.Types.ObjectId, ref: 'Product' }, commented for testing, un-comment later
      product: String,
      quanitity: Number,
      size: String,
      color: String,
    },
  ],
});

const Order = model('Order', orderSchema);

module.exports = Order;
