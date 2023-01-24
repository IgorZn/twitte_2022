const User = require('../../models/User.model')

// @desc        Retweet post
// @route       POST /api/v1/users/:id/follow
// @access      Private
exports.follow = async (req, res, next) => {
    const userID = req.params.id
    const sessionUserId = req.session.user._id
    console.log('userID, sessionUserId >>>',userID, sessionUserId)

    await User.findById(userID)
        .exec()
        .then(async result => {
            // console.log('result>>>', result)
            const isFollowing = result.followers.includes(sessionUserId)
            /*
            If isFollowing remove ($pull)
            from "following" or add ($addToSet)
            to an array
            */
            const option = isFollowing ? "$pull" : "$addToSet"
            console.log('isFollowing>>>', isFollowing)
            console.log('option>>>', option)

            // Insert/remove user into following
            // Current user start following with "userID"
            await User
                .findByIdAndUpdate(sessionUserId, {[option]: {following: userID}}, {new: true})
                .exec()
                .then(async user => {

                    // Add CURRENT user as follower for "userID"
                    await User
                        .findByIdAndUpdate(userID, {[option]: {followers: sessionUserId}}, {new: true})
                        .exec()
                        .then(followers => {
                            console.log('Followers updated')
                            console.log(followers.followers)
                        })
                        .catch(e => console.log('Add CURRENT user as follower on following user [error]', e))

                    // console.log('following>>>', user)
                    req.session.user = user
                    const data = req.session.user
                    return res
                        .status(201)
                        .json({status: true, data, isFollowing})
                })
                .catch(e => console.log('Current user start following with -userID- [error]', e))

        })

};