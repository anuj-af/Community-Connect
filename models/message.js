const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: String,
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    community: { type: Schema.Types.ObjectId, ref: 'Community' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);