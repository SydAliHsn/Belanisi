const { Schema, model } = require('mongoose');

const greaterThanOneValidate = type => {
  return {
    validator: val => val.length >= 1,
    message: `Product must have at least one ${type}.`,
  };
};

// const productTypes = ['t-shirt', 'hoodie', 'tank-top']; // Add more later

const productSchema = new Schema(
  {
    name: { type: String, required: [true, 'A product must have a name.'], trim: true },

    images: {
      type: [String],
      required: [true, 'Please provide the image(s) for the product.'],
      validate: greaterThanOneValidate('image'),
    },

    materials: String,

    description: String,

    sizes: {
      type: [String],
      required: [true, 'Please specify the available sizes for this product.'],
      validate: greaterThanOneValidate('size'),
    },

    availableColors: {
      type: [String],
      required: [true, 'Please specify the available colors for this product.'],
      validate: greaterThanOneValidate('available color'),
    },

    type: { type: String, required: [true, 'Please specify the type of the product.'] },

    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A product must belong to a creator/seller.'],
    },

    category: String,

    status: { type: String, default: 'active' },

    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'A product must belong to a campaign.'],
    },

    price: { type: Number, required: [true, 'A product must have a price.'] },

    // for Click-Through-Rate (ctr)
    clicks: { type: Number, default: 0, select: false },
    views: { type: Number, default: 0, select: false },
    // for Conversion Rate
    sales: { type: Number, default: 0, select: false },

    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.pre(/^find/, function (next) {
  this.populate('campaign', 'title').populate('creator', 'name');

  next();
});

productSchema.virtual('ctr').get(function () {
  return this.views && this.clicks ? this.views / this.clicks || 1 : null;
});

productSchema.virtual('conversionRate').get(function () {
  return this.sales && this.clicks ? this.sales / this.clicks : null;
});

const Product = model('Product', productSchema);

module.exports = Product;
