const mongoose = require('mongoose');
const User = require("../models/User.model");

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
    likes: [{type: 'ObjectId', ref: 'User', required: true}], // ПОЛЬЗОВАТЕЛИ, которым нра этот ПОСТ
    retweetUsers: [{type: 'ObjectId', ref: 'User'}], // ПОЛЬЗОВАТЕЛИ, ретвитнули этот пост
    retweetData: {type: 'ObjectId', ref: 'Post'}, // ССЫKКА, на ретвитнутый пост
    replyTo: {type: 'ObjectId', ref: 'Post'},
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

PostSchema.static({
    getPosts: async function (filter) {
        return this.model('Post').find(filter)
            .populate({
                path: 'postedBy',
                select: 'firstName lastName username profilePic'
            })
            .populate('replyTo')
            .sort('field -createdAt') // по возрастания, а без "-" по убыванию
            .exec()
            .then(async data => {
                // To make retweet post display normally as regular post with first and second name and so on...
                data = await User.populate(data, {path: 'replyTo.postedBy'})
                // console.log('getPosts>>', data)
                return  await User.populate(data, {path: 'retweetData.postedBy'})
            })
            .catch(err => console.log(err))

    }
})

module.exports = mongoose.model('Post', PostSchema);
