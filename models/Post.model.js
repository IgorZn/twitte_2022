const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        trim: true
    },
    postedBy: {
        type: 'ObjectId',
        ref: 'User',
        required: true
    },
    pinned: Boolean
}, {timestamps: true});


module.exports = mongoose.model('Post', PostSchema);
