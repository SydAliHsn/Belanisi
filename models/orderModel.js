const { Schema, model } = require('mongoose');

const Product = require('../models/productModel');

const addressSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  addressComplete: { type: String, required: true },
  addressMisc: String,
});

// Use the "id" property as orderNumber
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },

    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        size: String,
        color: String,
      },
    ],

    address: addressSchema,
    contactInfo: String,

    orderDate: { type: Date, default: Date.now },

    paid: { type: Boolean, default: false },

    fulfilled: { type: Boolean, default: false },

    total: { type: Number, required: true },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre(/^find/, function (next) {
  this.select('-__v');

  next();
});

orderSchema.methods.getTotalAmount = async function () {
  let totalAmount = 0;

  for (const item of this.items) {
    const product = await Product.findById(item.product);

    totalAmount += product.price * item.quantity;
  }

  return totalAmount;
};

const Order = model('Order', orderSchema);

module.exports = Order;
