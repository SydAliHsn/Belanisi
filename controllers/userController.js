const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const filterObj = (obj, ...properties) => {
  const filteredObj = {};

  Object.keys(obj).forEach(key => {
    if (properties.includes(key)) filteredObj[key] = obj[key];
  });

  return filteredObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ status: 'success', data: { results: users.length, users } });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new AppError(404, 'User not found!'));

  res.status(200).json({ status: 'success', data: { user } });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return next(new AppError(404, 'User not found!'));

  user.active = false;

  await user.save();

  res.status(204).json({ status: 'success', data: null });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        400,
        'This path is not for changing password. If you want to change your password, use "/updatePassword"'
      )
    );
  }

  const updateObj = filterObj(req.body, 'name', 'role'); // Add other changeable properties later

  const user = await User.findByIdAndUpdate(req.user.id, updateObj, {
    new: true,
    runValidators: true,
  });

  if (!user) return next(new AppError(404, 'User not found!'));

  res.status(200).json({ status: 'success', data: { user } });
});
