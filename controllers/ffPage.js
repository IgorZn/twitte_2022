const User = require("../models/User.model");

// @desc        Profile page
// @route       GET /:username/following
// @access      Public
exports.profileFollowing = async (req, res, next) => {
    const username = req.params.username
    const loggedInUser = req.session.user
    const payload = await User.getPayload(username, loggedInUser)
    payload.selectedTab = 'following'
    // console.log('Profile page>>>',user)
    res.render('followers_and_following', payload);
};

// @desc        Profile page
// @route       GET /:username/followers
// @access      Public
exports.profileFollowers = async (req, res, next) => {
    const username = req.params.username
    const loggedInUser = req.session.user
    const payload = await User.getPayload(username, loggedInUser)
    payload.selectedTab = 'following'
    // console.log('Profile page>>>',user)
    res.render('followers_and_following', payload);
};