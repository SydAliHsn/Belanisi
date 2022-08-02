const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  date: Date,
  visits: Number,
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
