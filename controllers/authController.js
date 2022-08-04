const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const { sendEmail, sendWelcome } = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const User = require('../models/userModel');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    expire: Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('belinasiToken', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({ status: 'success', data: { user, token } });
};

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.belinasiToken;

  if (!token) return next(new AppError(401, 'You are not logged in! Please log in to get access.'));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError(401, 'The user belonging to this token no longer exists.'));

  if (user.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(401, 'The password was changed recently. Please log in again to get access.')
    );
  }

  // Grant access to the protected routes
  req.user = user;

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) return next(new AppError(400, 'Please provide email and password.'));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(400, 'Email or Password incorrect!'));
  }

  createSendToken(user, 200, res);
});

exports.signup = catchAsync(async (req, res, next) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    phone: req.body.phone,
    role: req.body.role,
  };

  const user = await User.create(userData);

  sendWelcome(user);

  createSendToken(user, 201, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  res.status(204).clearCookie('belinasiToken').json({ status: 'success', data: null });
});

exports.restrictTo = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      next(new AppError(403, "You don't have the permission to perform this action!"));
    }

    next();
  };
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currPassword, user.password))) {
    return next(new AppError(400, 'Your current password is wrong!'));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
});
