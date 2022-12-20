const Post = require('../../models/Post.model')
const User = require('../../models/User.model')

// @desc        Add post
// @route       POST /api/v1/posts
// @access      Private
exports.addPost = async (req, res, next) => {
    if (!req.body.content) {
        console.log("Content is empty")
        return res
            .status(400)
            .json({success: true, data: "No data in content"});
    }

    const context = {
        content: req.body.content,
        postedBy: req.session.user
    }

    await Post.create(context)
        .then(async data => {
            const populatedData = await User.populate(data, { path: 'postedBy' })
            res
                .status(201)
                .json({success: true, data: populatedData})
        })

};