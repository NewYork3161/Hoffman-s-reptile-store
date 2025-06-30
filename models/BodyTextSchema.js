const mongoose = require('mongoose');

const BodyTextSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true
  },
  subtext: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    default: 1 // Optional if needed for sorting
  }
});

module.exports = mongoose.model('BodyText', BodyTextSchema);
