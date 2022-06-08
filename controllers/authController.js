const jwt = require('jsonwebtoken');

const User = require('../models/userModel');

const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    httpOnly: true,
    expire: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  };
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({ status: 'success', user, token });
};

exports.login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password)
      return res
        .status(400)
        .json({ status: 'fail', message: 'PLease provide email and password.' });

    const user = await User.findOne({ email }).select('+password');

    const correctPassword = await user.correctPassword(password, user.password);

    if (!correctPassword)
      return res
        .status(400)
        .json({ status: 'fail', message: 'Email or Password incorrect!' });

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.signup = async (req, res, next) => {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      role: req.body.role,
    };

    const user = await User.create(userData);

    createSendToken(user, 201, res);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
