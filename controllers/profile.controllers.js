const User = require('../models/User.model')
const colors = require('colors');

// @desc        Profile page
// @route       GET /
// @access      Public
exports.profile = async (req, res, next) => {
    const username = req.params.username || req.session.user.username
    const user = req.session.user
    const userId = req.session.user._id.toString()
    const payload = await User.getPayload(username, user)
    // console.log('Profile page>>>',user)
    payload.userId = userId
    res.render('profilePage', payload);
};

// @desc        Profile page
// @route       GET /:username/replies
// @access      Public
exports.profileReplies = async (req, res, next) => {
    const username = req.params.username
    const loggedInUser = req.session.user
    const payload = await User.getPayload(username, loggedInUser)
    payload.selectedTab = 'replies'
    // console.log('Profile page>>>',user)
    res.render('profilePage', payload);
};