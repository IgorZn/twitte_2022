const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    content: {
        type: String,
        maxlength: 140,
        trim: true
    },
    postedBy: {
        type: 'ObjectId',
        ref: 'User',
        required: true
    },
    pinned: Boolean,
    likes: [{ type: 'ObjectId', ref: 'User', required: true }], // ПОЛЬЗОВАТЕЛИ, которым нра этот ПОСТ
    retweetUsers: [{ type: 'ObjectId', ref: 'User' }], // ПОЛЬЗОВАТЕЛИ, ретвитнули этот пост
    retweetData: { type: 'ObjectId', ref: 'Post'}, // ССЫKКА, на ретвитнутый пост
}, {timestamps: true});

// PostSchema.pre('save', async function (next) {
//     console.log(this.content.length)
//     if(this.content.length > 140){
//         console.log(140)
//     }
// })

PostSchema.pre('find', async function (next) {
    this.populate('retweetData')
})

module.exports = mongoose.model('Post', PostSchema);
