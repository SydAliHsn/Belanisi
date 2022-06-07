const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: [true, 'An account with this email already exists! Try logging in.'],
  },

  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Please provide a strong password atleast 8 characters long.'],
    select: false,
  },

  passwordConfirm: String,

  passwordChangedAt: { type: Date, default: Date.now() },

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
  if (!this.isModified('password') || this.isNew) next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, password) {
  return await bcrypt.compare(candidatePassword, password);
};

const User = model('User', userSchema);

module.exports = User;
