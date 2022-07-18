const { Schema, model } = require('mongoose');

const productTypes = ['t-shirts']; // Add more later
const availableCategories = [
  'medical',
  'elderly',
  'emergency',
  'child care',
  'natural disaster',
  'disabled',
  'education',
  'orphanage',
  'humanity',
  'animals',
  'community',
  'religious',
  'sports',
  'family',
  'lifestyle',
  'business',
  'environment',
  'others',
];

const campaignSchema = new Schema(
  {
    title: {
      type: String,
      unique: [true, 'A campaign with this title already exists.'],
      required: true,
    },
    description: String, // can be text, image or video (using URL of the image or video)
    URL: String,

    category: {
      type: String,
      required: true,
      enum: {
        values: availableCategories,
        message: `Only these categories allowed: ${availableCategories}`,
      },
    },

    // product: {
    //   type: String,
    //   enum: { values: productTypes, message: `Product cannot be other than: ${productTypes}.` },
    // },

    // design: String, // a URL of the image
    // colors: [String],

    // baseCost: Number,
    // price: Number,
    // profitMargin in virtuals

    // numOfProducts: Number,

    startDate: Date,
    endDate: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Campaign = model('Campaign', campaignSchema);

module.exports = Campaign;
