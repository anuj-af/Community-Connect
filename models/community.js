const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "No Description Available for this community."
    }
})

module.exports = mongoose.model('Community',communitySchema);