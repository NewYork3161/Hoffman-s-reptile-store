const mongoose = require('mongoose');

const gridImageSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GridImageSection', gridImageSchema);
