const { Schema, model } = require('mongoose');

const productTypes = ['t-shirts', 'mugs']; // Add more later

const campaignSchema = new Schema(
  {
    title: String,
    description: String, // can be text, image or video (using URL of the image or video)
    URL: String,

    product: {
      type: String,
      enum: { values: productTypes, message: `Product cannot be other than: ${productTypes}.` },
    },

    design: String, // a URL of the image
    colors: [String],

    baseCost: Number,
    price: Number,
    // profitMargin in virtuals

    numOfProducts: Number,

    startDate: Date,
    endDate: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

campaignSchema.virtual('profitMargin').get(function () {
  return this.price - this.baseCost;
});

const Campaign = model('Campaign', campaignSchema);

module.exports = Campaign;
