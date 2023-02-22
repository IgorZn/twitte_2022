const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: 'ObjectId',
            ref: 'User'
        }
    ],
    latestMessage: {
        type: 'ObjectId',
        ref: 'Message'
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', ChatSchema);