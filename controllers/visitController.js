const Visit = require('../models/visitsModel');
const catchAsync = require('../utils/catchAsync');
// const padAggregateArr = require('../utils/padAggregateArr');
const { formatAggregateArr } = require('../utils/aggregationUtils');

exports.createVisit = catchAsync(async (req, res, next) => {
  if (
    req.path.includes('/static/') ||
    req.path.includes('/assets/') ||
    req.path.includes('/new-designer-assets/')
  )
    return next();

  const date = new Date().setUTCHours(0, 0, 0, 0);

  const visit = await Visit.findOneAndUpdate({ date }, { $inc: { visits: 1 } }, { new: true });

  if (!visit) await Visit.create({ date, visits: 1 });

  next();
});

exports.getAnalytics = catchAsync(async (req, res, next) => {
  const type = req.params.type;

  if (!(type === 'day' || type === 'month' || type === 'week'))
    return next(new AppError(400, 'Invalid duration type!'));

  const limit = new Date(Date.now() - req.params.time * 24 * 60 * 60 * 1000);

  let groupingType;
  if (type === 'month') groupingType = '$month';
  if (type === 'week') groupingType = '$week';
  if (type === 'day') groupingType = '$dayOfYear';

  let visits = await Visit.aggregate([
    {
      $match: {
        date: {
          $gte: limit,
        },
      },
    },
    {
      // $group: {
      //   _id: { [groupingType]: '$date' },
      //   visits: { $sum: '$visits' },
      // },
      $group: {
        _id: {
          id: { [groupingType]: '$date' },
          year: { $year: '$date' },
        },
        visits: { $sum: '$visits' },
      },
    },
    {
      $project: {
        _id: '$_id.id',
        year: '$_id.year',
        visits: 1,
      },
    },

    {
      $sort: { year: 1, _id: 1 },
    },
  ]);

  const visitsFormatted = formatAggregateArr(visits, 'visits', type);

  res.status(200).json({ status: 'success', data: { visits: visitsFormatted } });
});

exports.getVisitsToday = catchAsync(async (req, res, next) => {
  const today = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const yesterday = new Date(today - 24 * 60 * 60 * 1000);

  const visitPrev = await Visit.findOne({ date: yesterday });
  const visit = await Visit.findOne({ date: today });

  const totalVisits = visit ? visit.visits : 0;
  const increment = totalVisits - (visitPrev ? visitPrev.visits : 0);

  res.status(200).json({ status: 'success', data: { visits: totalVisits, increment } });
});
