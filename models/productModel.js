const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: { type: String, required: [true, 'A product must have a name.'], trim: true },

  images: {
    type: [String],
    validate: {
      validator: val => val.length >= 1,
      message: 'Product must have at least one image.',
    },
  },

  materials: String,

  description: String,

  sizes: {
    type: [String],
    required: [true, 'Please specify the available styles for this product.'],
    validate: {
      validator: val => val.length >= 1,
      message: 'Product must have at least one style.',
    },
  },

  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true,'A product must belong to a creator/seller.'],
  },
});

const Product = model('Product', productSchema);

module.exports = Product;
