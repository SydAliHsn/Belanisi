const { Schema, model } = require('mongoose');

// Use the "id" property as orderNumber
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },

  repeatRate: Number,

  items: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product' },
      quanitity: Number,
      size: String,
      color: String,
    },
  ],

  orderDate: { type: Date, default: Date.now },

  fulfilled: { type: Boolean, default: false },
});

const Order = model('Order', orderSchema);

module.exports = Order;
