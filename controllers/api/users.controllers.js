const User = require('../../models/User.model')

// @desc        Retweet post
// @route       POST /api/v1/users/:id/follow
// @access      Private
exports.follow = async (req, res, next) => {
    const userID = req.params.id

    await User.findById(userID)
        .exec()
        .then(result => {
            const isFollowing = result.following.includes(userID)
            return res
                .status(201)
                .json({status: true, data: isFollowing})
        })


};