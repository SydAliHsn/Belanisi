const Charity = require('../models/charityModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllCharities = catchAsync(async (req, res, next) => {
  const charitites = await Charity.find();

  res.status(200).json({ status: 'success', data: { total: charitites.length, charitites } });
});
