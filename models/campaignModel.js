const { Schema, model } = require('mongoose');

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
    images: [String],
    description: { type: String, required: [true, 'Please write a description for the campaign.'] },
    video: String,

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

    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A product must have a creator.'],
    },

    startDate: Date,
    endDate: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

campaignSchema.pre(/^find/, function (next) {
  this.populate('creator', 'name');

  next();
});

const Campaign = model('Campaign', campaignSchema);

module.exports = Campaign;
