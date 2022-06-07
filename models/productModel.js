const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: String,
  images: [String],
  material: String,
  description: String,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Product = model('Product', productSchema);

module.exports = Product;
