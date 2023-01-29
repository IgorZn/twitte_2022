const User = require('../../models/User.model')
const mongoose = require("mongoose");

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


// @desc        Profile page
// @route       GET /:id/following
// @access      Public
exports.ApiProfileFollowing = async (req, res, next) => {
    console.log('Profile page>>>', req.params)
    await User.findById(req.params.id)
        .populate("following")
        .then(data => {
            res
                .status(200)
                .json({success: true, data});
        })
        .catch(err => next(err))

    // const payload = {
    //     title: 'Express PISIKO',
    //     user: req.session.user,
    //     userLoggedJs: JSON.stringify(req.session.user),
    //     status: true
    // }
    // payload.selectedTab = 'following'

};


// @desc        Profile page
// @route       GET /:id/followers
// @access      Public
exports.ApiProfileFollowers = async (req, res, next) => {
    // console.log('Profile page>>>',user)
    console.log('Profile page>>>', req.params)
    await User.findById(req.params.id)
        .populate("followers")
        .then(data => {
            res
                .status(200)
                .json({success: true, data});
        })
        .catch(err => next(err))


    // const payload = {
    //     title: 'Express PISIKO',
    //     user: req.session.user,
    //     userLoggedJs: JSON.stringify(req.session.user),
    //     status: true
    // }
    // payload.selectedTab = 'followers'
    // res.render('followers_and_following', payload);
};