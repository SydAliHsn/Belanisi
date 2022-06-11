const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: [true, 'An account with this email already exists! Try logging in.'],
  },

  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Please provide a strong password atleast 8 characters long.'],
    select: false,
  },

  passwordConfirm: {
    type: String,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Passwords are not the same!',
    },
  },

  passwordChangedAt: Date,

  role: {
    type: String,
    enum: {
      values: ['customer', 'creator'],
      message: 'The role can either be customer or creator.',
    },
    default: 'customer',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.select('-__v');

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, password) {
  return await bcrypt.compare(candidatePassword, password);
};

userSchema.methods.passwordChangedAfter = function (jwtDate) {
  if (this.passwordChangedAt) return false;

  const passwordChangeTime = this.passwordChangedAt / 1000;

  return passwordChangeTime > jwtDate;
};

const User = model('User', userSchema);

module.exports = User;
