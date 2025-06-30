const mongoose = require('mongoose');

const carousel_images_schema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('carousel_images', carousel_images_schema);
