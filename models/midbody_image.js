const mongoose = require('mongoose');

const midbodyImageSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('MidbodyImage', midbodyImageSchema);
