const { Schema, model } = require('mongoose');

const greaterThanOneValidate = type => {
  return {
    validator: val => val.length >= 1,
    message: `Product must have at least one ${type}.`,
  };
};

const designSchema = new Schema({
  front: { type: String, required: true },
  back: String,
});

// const productTypes = ['t-shirt', 'hoodie', 'tank-top']; // Add more later

const productSchema = new Schema(
  {
    name: { type: String, required: [true, 'A product must have a name.'], trim: true },

    // images: {
    //   type: [String],
    //   required: [true, 'Please provide the image(s) for the product.'],
    //   validate: greaterThanOneValidate('image'),
    // },

    designs: designSchema,

    materials: String,

    message: String,

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

    // status: { type: String, default: 'active', enum: ['active', 'inactive'] },
    active: { type: Boolean, default: true },

    campaign: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'A product must belong to a campaign.'],
    },

    price: { type: Number, required: [true, 'A product must have a price.'] },

    clicks: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create indexes for search
productSchema.index(
  {
    name: 'text',
    message: 'text',
    campaign: 'text',
    materials: 'text',
    category: 'text',
    creator: 'text',
    availableColors: 'text',
  },
  {
    name: 'text_search_index',
    weights: {
      name: 9,
      message: 5,
      campaign: 7,
      materials: 2,
      category: 4,
      creator: 6,
      availableColors: 1,
    },
  }
);

productSchema.pre(/^find/, function (next) {
  this.select('-__v');

  next();
});

productSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate('campaign', 'title').populate('creator', 'name');

  next();
});

const Product = model('Product', productSchema);

module.exports = Product;
