const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: { type: String, required: [true, 'A product must have a name.'], trim: true },
  images: {
    type: [String],
    validate: {
      validator: value => value.length >= 1,
      message: 'Product must have at least one image.',
    },
  },
  material: String,
  description: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: 'A product must have a creator/seller.',
  },
});

const Product = model('Product', productSchema);

module.exports = Product;
