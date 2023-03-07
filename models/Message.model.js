const mongoose = require('mongoose');

const chatMessage = new mongoose.Schema({
    sender: {
        type: 'ObjectId',
        ref: 'User'
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: 'ObjectId',
        ref: 'Chat'
    },
    readBy: [{
        type: 'ObjectId',
        ref: 'User'
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('Message', chatMessage);